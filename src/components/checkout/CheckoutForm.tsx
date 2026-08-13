'use client';

import { useState, useEffect } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/store/cartStore';
import { submitOrder, validatePromoCode } from '@/app/actions/order';
import { useRouter } from 'next/navigation';
import { Loader2, Tag, CheckCircle2, X } from 'lucide-react';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  customerPhone: z.string().min(9, 'Please enter a valid phone number (e.g. 07... or 01...)'),
  deliveryCountyId: z.string().uuid('Please select a county'),
  deliveryAddress: z.string().min(5, 'Please provide specific delivery details (e.g. Town, Street, Building)'),
  orderNotes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  counties: { id: string; county: string; fee: number }[];
}

export function CheckoutForm({ counties }: CheckoutFormProps) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Promo code states
  const [promoInput, setPromoInput] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<{id: string, code: string, discountType: string, discountValue: number} | null>(null);
  
  const items = useCartStore((state) => state.items);
  const getCartTotal = useCartStore((state) => state.getCartTotal);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useHookForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryCountyId: '',
    },
  });

  const selectedCountyId = watch('deliveryCountyId');
  const selectedCounty = counties.find(c => c.id === selectedCountyId);
  const deliveryFee = selectedCounty ? Number(selectedCounty.fee) : 0;
  const subtotal = getCartTotal();
  
  // Calculate discount
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'percentage') {
      discountAmount = subtotal * (appliedPromo.discountValue / 100);
    } else {
      discountAmount = appliedPromo.discountValue;
    }
    discountAmount = Math.min(discountAmount, subtotal);
  }
  
  const total = (subtotal - discountAmount) + deliveryFee;

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setIsApplyingPromo(true);
    setPromoError(null);
    
    const result = await validatePromoCode(promoInput);
    if (result.valid && result.promo) {
      setAppliedPromo(result.promo);
      setPromoInput('');
    } else {
      setPromoError(result.error || 'Invalid promo code');
    }
    setIsApplyingPromo(false);
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  useEffect(() => {
    setMounted(true);
    // Redirect if cart is empty
    if (items.length === 0) {
      router.push('/products');
    }
  }, [items, router]);

  if (!mounted || items.length === 0) return null;

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('customerName', data.customerName);
    formData.append('customerEmail', data.customerEmail || '');
    formData.append('customerPhone', data.customerPhone);
    formData.append('deliveryCountyId', data.deliveryCountyId);
    formData.append('deliveryAddress', data.deliveryAddress);
    formData.append('orderNotes', data.orderNotes || '');
    if (appliedPromo) {
      formData.append('promoCodeId', appliedPromo.id);
    }

    const result = await submitOrder(formData, items);

    if (result.success) {
      // Redirect to success page with query params for the order details, pass clear=true to clear the cart
      router.push(`/checkout/success?orderNumber=${result.orderNumber}&total=${result.totalAmount}&phone=${result.customerPhone}&name=${encodeURIComponent(result.customerName || '')}&clear=true`);
    } else {
      setError(result.error || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Checkout Form */}
      <div className="w-full lg:w-2/3">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          {/* Contact Details */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <input 
                  type="text" 
                  className={`input-field ${errors.customerName ? 'border-red-500 ring-red-100' : ''}`}
                  placeholder="e.g. Jane Doe"
                  {...register('customerName')}
                />
                {errors.customerName && <p className="error-text">{errors.customerName.message}</p>}
              </div>
              
              <div>
                <label className="label">Phone Number *</label>
                <input 
                  type="tel" 
                  className={`input-field ${errors.customerPhone ? 'border-red-500 ring-red-100' : ''}`}
                  placeholder="e.g. 0712345678"
                  {...register('customerPhone')}
                />
                {errors.customerPhone && <p className="error-text">{errors.customerPhone.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="label">Email Address (Optional)</label>
                <input 
                  type="email" 
                  className={`input-field ${errors.customerEmail ? 'border-red-500 ring-red-100' : ''}`}
                  placeholder="For order receipts"
                  {...register('customerEmail')}
                />
                {errors.customerEmail && <p className="error-text">{errors.customerEmail.message}</p>}
              </div>
            </div>
          </section>

          {/* Delivery Details */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Delivery Details (G4S)</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Select County *</label>
                <select 
                  className={`input-field bg-white ${errors.deliveryCountyId ? 'border-red-500 ring-red-100' : ''}`}
                  {...register('deliveryCountyId')}
                >
                  <option value="" disabled>-- Select your county --</option>
                  {counties.map(county => (
                    <option key={county.id} value={county.id}>
                      {county.county} (Delivery: KSh {Number(county.fee).toLocaleString()})
                    </option>
                  ))}
                </select>
                {errors.deliveryCountyId && <p className="error-text">{errors.deliveryCountyId.message}</p>}
              </div>

              <div>
                <label className="label">Specific Delivery Address / G4S Office *</label>
                <textarea 
                  className={`input-field resize-none h-24 ${errors.deliveryAddress ? 'border-red-500 ring-red-100' : ''}`}
                  placeholder="e.g. Next to Naivas Supermarket, Town Center"
                  {...register('deliveryAddress')}
                />
                {errors.deliveryAddress && <p className="error-text">{errors.deliveryAddress.message}</p>}
                <p className="text-xs text-slate-500 mt-1">If you prefer picking it up from a specific G4S office, specify it here.</p>
              </div>

              <div>
                <label className="label">Order Notes (Optional)</label>
                <textarea 
                  className="input-field resize-none h-20"
                  placeholder="Any special instructions for delivery..."
                  {...register('orderNotes')}
                />
              </div>
            </div>
          </section>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary w-full h-14 text-lg mt-8 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Order...
              </>
            ) : (
              'Complete Order'
            )}
          </button>
          
          <p className="text-center text-xs text-slate-500 mt-4 flex flex-col gap-1">
            <span>By placing your order, you agree to our Terms & Conditions.</span>
            <span>You will pay via M-Pesa on the next step.</span>
          </p>
        </form>
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-1/3">
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 sticky top-24">
          <h2 className="text-lg font-bold text-slate-900 mb-4 pb-4 border-b border-slate-200">Order Summary</h2>
          
          <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="w-16 h-16 bg-white rounded-md border border-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply p-1" />
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-medium text-slate-900 line-clamp-2 leading-tight">{item.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                </div>
                <div className="font-semibold text-sm text-slate-900 text-right whitespace-nowrap">
                  KSh {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Promo Code Section */}
          <div className="mb-6 pt-4 border-t border-slate-200">
            {appliedPromo ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex justify-between items-center">
                <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Code <strong>{appliedPromo.code}</strong> applied!</span>
                </div>
                <button 
                  onClick={removePromo}
                  type="button"
                  className="text-green-600 hover:text-green-800 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary-500" /> Have a promo code?
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-grow input-field bg-white py-2"
                  />
                  <button 
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={isApplyingPromo || !promoInput.trim()}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
                  >
                    {isApplyingPromo ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                  </button>
                </div>
                {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">KSh {subtotal.toLocaleString()}</span>
            </div>
            
            {appliedPromo && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount ({appliedPromo.code})</span>
                <span>-KSh {discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Delivery (G4S)</span>
              <span className="font-medium text-slate-900">
                {selectedCounty ? `KSh ${deliveryFee.toLocaleString()}` : 'Select County'}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
            <span className="text-base font-bold text-slate-900">Total</span>
            <span className="text-2xl font-bold text-primary-600">
              KSh {total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
