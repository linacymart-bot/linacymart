'use server';

import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const orderSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  customerPhone: z.string().min(9, 'Valid phone number is required'),
  deliveryCountyId: z.string().uuid('Invalid county selection'),
  deliveryAddress: z.string().min(5, 'Delivery address/instructions are required'),
  orderNotes: z.string().optional(),
  items: z.array(z.object({
    id: z.string().uuid(),
    price: z.number().min(0),
    quantity: z.number().min(1),
  })).min(1, 'Cart cannot be empty')
    .refine(
      (items) => new Set(items.map((i) => i.id)).size === items.length, 
      { message: "Duplicate items found in cart" }
    ),
});

export async function submitOrder(formData: FormData, cartItems: any[]) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Validate Input
    const payload = {
      customerName: formData.get('customerName') as string,
      customerEmail: formData.get('customerEmail') as string,
      customerPhone: formData.get('customerPhone') as string,
      deliveryCountyId: formData.get('deliveryCountyId') as string,
      deliveryAddress: formData.get('deliveryAddress') as string,
      orderNotes: formData.get('orderNotes') as string,
      promoCodeId: formData.get('promoCodeId') as string || undefined,
      items: cartItems,
    };

    // Update order schema dynamically here or assume promoCodeId is validated manually below.
    // We'll validate it manually since it's an optional UUID.
    const validatedData = orderSchema.parse(payload);
    const promoCodeId = payload.promoCodeId;

    // 2. Fetch the delivery fee for the selected county to ensure it hasn't been tampered with
    const { data: county, error: countyError } = await supabase
      .from('delivery_zones')
      .select('fee, county')
      .eq('id', validatedData.deliveryCountyId)
      .single();

    if (countyError || !county) {
      throw new Error('Invalid delivery zone selected.');
    }

    // 3. Fetch real prices from database to prevent price tampering
    const productIds = validatedData.items.map(item => item.id);
    const { data: realProducts, error: productsError } = await supabase
      .from('products')
      .select('id, price, sale_price')
      .in('id', productIds);

    if (productsError || !realProducts || realProducts.length === 0) {
      throw new Error('Failed to verify product prices.');
    }

    // 4. Calculate true subtotal and create validated items array
    let subtotal = 0;
    const secureOrderItems = validatedData.items.map(clientItem => {
      const realProduct = realProducts.find(p => p.id === clientItem.id);
      if (!realProduct) throw new Error(`Product ${clientItem.id} not found.`);
      
      const actualPrice = realProduct.sale_price ? Number(realProduct.sale_price) : Number(realProduct.price);
      subtotal += (actualPrice * clientItem.quantity);
      
      return {
        product_id: realProduct.id,
        quantity: clientItem.quantity,
        price: actualPrice,
      };
    });

    let discountAmount = 0;
    if (promoCodeId) {
      const { data: promo } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('id', promoCodeId)
        .single();
        
      if (promo && promo.active) {
        if (promo.discount_type === 'percentage') {
          discountAmount = subtotal * (Number(promo.discount_value) / 100);
        } else {
          discountAmount = Number(promo.discount_value);
        }
        
        // Ensure discount doesn't exceed subtotal
        discountAmount = Math.min(discountAmount, subtotal);
        
        // Increment promo uses
        await supabase.rpc('increment_promo_uses', { p_id: promoCodeId }).catch(() => {
          // Fallback if RPC doesn't exist
          supabase.from('promo_codes').update({ uses: promo.uses + 1 }).eq('id', promoCodeId);
        });
      }
    }

    const deliveryFee = Number(county.fee);
    const totalAmount = (subtotal - discountAmount) + deliveryFee;

    // 5. Create or Update Customer Record
    let customerId;
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', validatedData.customerPhone)
      .maybeSingle();

    if (existingCustomer) {
      customerId = existingCustomer.id;
      // Update existing customer info with latest details
      await supabase.from('customers').update({
        full_name: validatedData.customerName,
        email: validatedData.customerEmail || null,
        county: county.county,
        delivery_location: validatedData.deliveryAddress,
      }).eq('id', customerId);
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          full_name: validatedData.customerName,
          email: validatedData.customerEmail || null,
          phone: validatedData.customerPhone,
          county: county.county,
          town: 'N/A',
          delivery_location: validatedData.deliveryAddress,
        })
        .select('id')
        .single();

      if (customerError || !newCustomer) {
        console.error("Customer creation error:", customerError);
        throw new Error('Failed to create customer record.');
      }
      customerId = newCustomer.id;
    }

    // 6. Create Order Record
    const orderNumber = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_id: customerId,
        subtotal: subtotal,
        delivery_fee: deliveryFee,
        total: totalAmount,
        status: 'New',
        notes: validatedData.orderNotes || null,
        promo_code_id: promoCodeId || null,
        discount_amount: discountAmount,
      })
      .select('id, order_number')
      .single();

    if (orderError || !order) {
      throw new Error('Failed to create order.');
    }

    // 7. Create Order Items
    const orderItemsToInsert = secureOrderItems.map(item => ({
      order_id: order.id,
      ...item
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) {
      throw new Error('Failed to save order items.');
    }

    // 8. Send Order Confirmation Email to Admin
    try {
      const { Resend } = await import('resend');
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const itemsListHtml = cartItems.map((item: any) => 
          `<li>${item.quantity}x ${item.name || 'Product'} (KSh ${(item.price * item.quantity).toLocaleString()})</li>`
        ).join('');

        const result = await resend.emails.send({
          from: 'Orders <onboarding@resend.dev>',
          to: 'linacymart@gmail.com',
          subject: `New Order Received: ${orderNumber}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #0284c7; padding: 20px; color: white;">
                <h1 style="margin: 0; font-size: 24px;">New Order Alert! 🎉</h1>
              </div>
              <div style="padding: 20px;">
                <h2 style="margin-top: 0;">Order #${orderNumber}</h2>
                <p><strong>Customer:</strong> ${validatedData.customerName}</p>
                <p><strong>Phone:</strong> ${validatedData.customerPhone}</p>
                ${validatedData.customerEmail ? `<p><strong>Email:</strong> ${validatedData.customerEmail}</p>` : ''}
                <p><strong>Delivery County:</strong> ${county.county}</p>
                <p><strong>Delivery Address:</strong> ${validatedData.deliveryAddress}</p>
                ${validatedData.orderNotes ? `<p><strong>Notes:</strong> ${validatedData.orderNotes}</p>` : ''}
                
                <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                
                <h3 style="margin-top: 0;">Order Items:</h3>
                <ul>
                  ${itemsListHtml}
                </ul>
                
                <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 4px 0; color: #666;">Subtotal:</td>
                    <td style="padding: 4px 0; text-align: right; font-weight: bold;">KSh ${subtotal.toLocaleString()}</td>
                  </tr>
                  ${discountAmount > 0 ? `
                  <tr>
                    <td style="padding: 4px 0; color: #16a34a;">Discount:</td>
                    <td style="padding: 4px 0; text-align: right; font-weight: bold; color: #16a34a;">-KSh ${discountAmount.toLocaleString()}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 4px 0; color: #666;">Delivery Fee:</td>
                    <td style="padding: 4px 0; text-align: right; font-weight: bold;">KSh ${deliveryFee.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0 0 0; color: #000; font-size: 18px; font-weight: bold; border-top: 2px solid #eaeaea; margin-top: 8px; display: inline-block; width: 100%;">Total:</td>
                    <td style="padding: 12px 0 0 0; text-align: right; font-size: 18px; font-weight: bold; color: #0284c7; border-top: 2px solid #eaeaea; margin-top: 8px;">KSh ${totalAmount.toLocaleString()}</td>
                  </tr>
                </table>
              </div>
            </div>
          `
        });
        console.log("Resend email result:", result);
      } else {
        console.warn("RESEND_API_KEY is not set. Skipping email notification.");
      }
    } catch (emailError) {
      console.error('Failed to send admin email notification:', emailError);
      // We don't throw here so the order still completes even if email fails
    }

    return { 
      success: true, 
      orderId: order.id, 
      orderNumber: order.order_number,
      totalAmount,
      customerName: validatedData.customerName,
      customerPhone: validatedData.customerPhone
    };

  } catch (error: any) {
    console.error('Order submission error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}

export async function validatePromoCode(code: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: promo, error } = await supabase
      .from('promo_codes')
      .select('id, code, discount_type, discount_value, max_uses, uses, active, expires_at')
      .eq('code', code.toUpperCase())
      .single();

    if (error || !promo) {
      return { valid: false, error: 'Invalid promo code.' };
    }

    if (!promo.active) {
      return { valid: false, error: 'This promo code is no longer active.' };
    }

    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
      return { valid: false, error: 'This promo code has expired.' };
    }

    if (promo.max_uses && promo.uses >= promo.max_uses) {
      return { valid: false, error: 'This promo code has reached its usage limit.' };
    }

    return { 
      valid: true, 
      promo: {
        id: promo.id,
        code: promo.code,
        discountType: promo.discount_type,
        discountValue: Number(promo.discount_value)
      } 
    };

  } catch (error: any) {
    console.error('Promo validation error:', error);
    return { valid: false, error: 'Failed to validate promo code.' };
  }
}
