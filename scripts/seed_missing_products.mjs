import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const newCategories = [
  { name: 'Bone & Cartilage', slug: 'bone-cartilage' },
  { name: 'Digestive Health', slug: 'digestive-health' }
];

const newProducts = [
  {
    name: 'Refined Yunzhi Essence',
    slug: 'refined-yunzhi-essence',
    category_slug: 'immune-booster',
    price: 4500,
    sale_price: null,
    short_description: 'Potent immune-boosting mushroom extract that enhances natural defenses and supports respiratory health.',
    full_description: 'Refined Yunzhi Essence is extracted from the premium Turkey Tail mushroom, renowned for its high concentration of polysaccharide-K (PSK). This powerful supplement is designed to significantly enhance the immune system and protect against cellular damage.\n\n### Key Benefits:\n- **Immune Support:** Bolsters the body\'s natural defenses against pathogens.\n- **Respiratory Health:** Traditionally used to clear phlegm and support lung function.\n- **Antioxidant Properties:** Protects cells from oxidative stress and premature aging.\n\n### How to Use:\nTake 2 capsules twice daily with warm water.'
  },
  {
    name: 'Vitamin C Chewable Tablets',
    slug: 'vitamin-c-chewable-tablets',
    category_slug: 'immune-booster',
    price: 1500,
    sale_price: 1200,
    short_description: 'Delicious daily Vitamin C supplement to prevent colds, boost immunity, and promote radiant skin.',
    full_description: 'BF Suma Vitamin C Chewable Tablets provide a tasty and convenient way to meet your daily vitamin C requirements. Essential for immune function, collagen production, and antioxidant defense, these tablets are a daily necessity for the whole family.\n\n### Key Benefits:\n- **Immunity Boost:** Strengthens the immune system to fight off common colds and flu.\n- **Skin Health:** Promotes collagen synthesis for firm, youthful skin.\n- **Iron Absorption:** Enhances the body\'s ability to absorb iron from plant-based foods.\n\n### How to Use:\nChew 1-2 tablets daily.'
  },
  {
    name: 'ZaminoCal Plus',
    slug: 'zaminocal-plus',
    category_slug: 'bone-cartilage',
    price: 3200,
    sale_price: null,
    short_description: 'Advanced calcium supplement fortified with Zinc, Magnesium, and Amino Acids for optimal bone density.',
    full_description: 'ZaminoCal Plus is a scientifically formulated bone health supplement. Unlike standard calcium pills that are poorly absorbed, ZaminoCal Plus uses amino acid chelation technology to ensure maximum absorption into the bone matrix.\n\n### Key Benefits:\n- **High Absorption:** Chelated calcium ensures over 90% absorption rate.\n- **Bone Density:** Fortifies bones and prevents osteoporosis.\n- **Joint Support:** Magnesium and Zinc support joint flexibility and muscle function.\n\n### How to Use:\nTake 2 capsules daily, preferably after meals.'
  },
  {
    name: 'Micro2 Cycle Tablets',
    slug: 'micro2-cycle-tablets',
    category_slug: 'heart-blood-fit',
    price: 3800,
    sale_price: 3500,
    short_description: 'Cardiovascular health supplement that improves blood circulation, prevents clots, and protects the heart.',
    full_description: 'Micro2 Cycle Tablets contain powerful herbal extracts like Radix Salviae Miltiorrhizae, scientifically proven to improve microcirculation and protect the cardiovascular system. It acts as a natural blood thinner and heart protector.\n\n### Key Benefits:\n- **Improved Circulation:** Enhances blood flow through the smallest capillaries.\n- **Heart Protection:** Reduces the risk of coronary heart disease and angina.\n- **Anti-Clotting:** Helps prevent the formation of dangerous blood clots.\n\n### How to Use:\nTake 3 tablets, 3 times a day.'
  },
  {
    name: 'ConstiRelax',
    slug: 'constirelax',
    category_slug: 'digestive-health',
    price: 2800,
    sale_price: null,
    short_description: 'Natural herbal formula to gently and effectively relieve constipation and restore healthy bowel movements.',
    full_description: 'ConstiRelax is a gentle yet highly effective natural solution for chronic or occasional constipation. Formulated with traditional herbs, it stimulates natural bowel movements without the harsh cramping associated with chemical laxatives.\n\n### Key Benefits:\n- **Gentle Relief:** Promotes smooth and regular bowel movements overnight.\n- **Gut Detox:** Helps flush out accumulated toxins from the colon.\n- **Non-Habit Forming:** Safe for regular use without causing dependency.\n\n### How to Use:\nTake 1-2 capsules before bedtime with plenty of water.'
  },
  {
    name: 'ProstatRelax',
    slug: 'prostatrelax',
    category_slug: 'mens-power',
    price: 4200,
    sale_price: 3800,
    short_description: 'Comprehensive prostate health supplement designed to relieve urinary issues and maintain a healthy prostate gland.',
    full_description: 'ProstatRelax is formulated specifically for men to combat the symptoms of Benign Prostatic Hyperplasia (BPH) and maintain overall prostate health. It utilizes Epimedium extract and other natural ingredients to reduce prostate swelling.\n\n### Key Benefits:\n- **Urinary Flow:** Improves urine flow and reduces the frequency of nighttime urination.\n- **Prostate Health:** Reduces inflammation and swelling of the prostate gland.\n- **Male Vitality:** Supports overall male reproductive health.\n\n### How to Use:\nTake 2 capsules twice daily.'
  },
  {
    name: 'Feminergy Capsules',
    slug: 'feminergy-capsules',
    category_slug: 'womens-beauty',
    price: 3500,
    sale_price: null,
    short_description: 'Potent anti-aging and beauty supplement featuring Grape Seed Extract to protect collagen and promote radiant skin.',
    full_description: 'Feminergy Capsules harness the incredible antioxidant power of Grape Seed Extract (OPC). Known as an "oral cosmetic," it works from the inside out to protect the skin from aging, reduce pigmentation, and maintain youthful elasticity.\n\n### Key Benefits:\n- **Skin Radiance:** Reduces dark spots and brightens the complexion.\n- **Anti-Aging:** Protects collagen and elastin from breakdown, reducing wrinkles.\n- **Powerful Antioxidant:** 50 times more potent than Vitamin E in neutralizing free radicals.\n\n### How to Use:\nTake 1 capsule twice daily.'
  },
  {
    name: 'Anatic Herbal Essence Soap',
    slug: 'anatic-herbal-essence-soap',
    category_slug: 'womens-beauty',
    price: 900,
    sale_price: 750,
    short_description: 'Luxurious herbal soap infused with wild honey and green tea to deeply cleanse, moisturize, and protect the skin.',
    full_description: 'Anatic Herbal Essence Soap is a premium cleansing bar made from natural plant extracts. It combines wild honey, green tea extract, and grapefruit extract to provide a deep, refreshing cleanse without stripping the skin of its natural moisture.\n\n### Key Benefits:\n- **Deep Cleansing:** Removes dirt, oil, and impurities from deep within the pores.\n- **Moisturizing:** Wild honey locks in moisture, leaving skin soft and supple.\n- **Antibacterial:** Green tea extract naturally fights acne-causing bacteria.\n\n### How to Use:\nUse daily on face and body during bathing.'
  },
  {
    name: 'Dr. Cow Smart Kids Calcium',
    slug: 'dr-cow-smart-kids-calcium',
    category_slug: 'smart-kids',
    price: 1800,
    sale_price: null,
    short_description: 'Delicious, bone-building calcium supplement specifically formulated for growing children.',
    full_description: 'Dr. Cow Smart Kids Calcium provides the essential building blocks for your child\'s growing bones and teeth. Sourced from high-quality, pure milk calcium, these chewable tablets are highly absorbable and stomach-friendly for children.\n\n### Key Benefits:\n- **Bone Growth:** Ensures optimal bone development and height growth in children.\n- **Strong Teeth:** Promotes healthy tooth enamel and prevents cavities.\n- **Kid-Friendly:** Delicious milky taste that kids love.\n\n### How to Use:\nChildren chew 1-2 tablets daily.'
  },
  {
    name: '4 in 1 Reishi Coffee',
    slug: '4-in-1-reishi-coffee',
    category_slug: 'suma-living',
    price: 1600,
    sale_price: null,
    short_description: 'Premium coffee blended with Ganoderma (Reishi) extract for a delicious, immune-boosting morning brew.',
    full_description: '4 in 1 Reishi Coffee offers the perfect start to your day by combining high-quality Colombian coffee beans with the medicinal power of Ganoderma Lucidum (Reishi) extract. Enjoy your daily caffeine fix while actively boosting your health.\n\n### Key Benefits:\n- **Immune Boosting:** Reishi extract strengthens the body\'s natural defenses.\n- **Sustained Energy:** Provides a smooth energy lift without the typical caffeine crash.\n- **Antioxidant Rich:** Protects cells from daily environmental stress.\n\n### How to Use:\nDissolve 1 sachet in a cup of hot water. Add milk or sugar to taste if desired.'
  },
  {
    name: '4 in 1 Ginseng Coffee',
    slug: '4-in-1-ginseng-coffee',
    category_slug: 'suma-living',
    price: 1600,
    sale_price: null,
    short_description: 'Invigorating coffee infused with premium Ginseng extract to combat fatigue and enhance mental clarity.',
    full_description: '4 in 1 Ginseng Coffee is designed for those who need an extra edge. By blending rich coffee with the legendary revitalizing properties of Panax Ginseng, this beverage fights physical fatigue and sharpens the mind.\n\n### Key Benefits:\n- **Fights Fatigue:** Ginseng acts as a powerful adaptogen, increasing physical stamina.\n- **Mental Alertness:** Enhances focus, memory, and cognitive performance.\n- **Stress Relief:** Helps the body adapt to and manage daily stress.\n\n### How to Use:\nDissolve 1 sachet in a cup of hot water and enjoy.'
  },
  {
    name: 'Relivin Tea',
    slug: 'relivin-tea',
    category_slug: 'suma-living',
    price: 1400,
    sale_price: null,
    short_description: 'A soothing herbal tea blend designed to regulate blood pressure and promote cardiovascular wellness.',
    full_description: 'Relivin Tea is a therapeutic herbal infusion formulated with Luobuma (Apocynum venetum) and Green Tea. It is specifically designed to naturally support healthy blood pressure levels and provide a calming effect on the nervous system.\n\n### Key Benefits:\n- **Blood Pressure Support:** Naturally helps dilate blood vessels and regulate blood pressure.\n- **Heart Health:** Reduces the workload on the heart and improves circulation.\n- **Calming Effect:** Relieves stress, anxiety, and helps improve sleep quality.\n\n### How to Use:\nSteep 1 tea bag in boiling water for 3-5 minutes. Drink 2-3 times daily.'
  },
  {
    name: 'GymEffect',
    slug: 'gymeffect',
    category_slug: 'sport-fit',
    price: 5500,
    sale_price: 4900,
    short_description: 'The ultimate pre-workout and sports performance enhancer to boost energy, stamina, and muscle recovery.',
    full_description: 'GymEffect is formulated for athletes and fitness enthusiasts who demand the most from their bodies. It provides a surge of natural energy, increases endurance during intense workouts, and accelerates post-workout muscle recovery.\n\n### Key Benefits:\n- **Explosive Energy:** Enhances physical performance and stamina.\n- **Muscle Recovery:** Reduces muscle soreness and speeds up tissue repair.\n- **Focus:** Sharpens mental focus for intense training sessions.\n\n### How to Use:\nMix 1 scoop with water and consume 30 minutes before your workout.'
  },
  {
    name: 'YouthEssence Cleanser',
    slug: 'youthessence-cleanser',
    category_slug: 'womens-beauty',
    price: 2200,
    sale_price: null,
    short_description: 'Gentle, anti-aging facial cleanser that removes impurities while hydrating the skin.',
    full_description: 'The YouthEssence Cleanser is the first step in your anti-aging skincare routine. Formulated with natural botanical extracts, it deeply cleanses pores without stripping the skin of its natural moisture barrier, leaving your face fresh and hydrated.\n\n### Key Benefits:\n- **Deep Cleanse:** Removes makeup, dirt, and excess oil.\n- **Hydrating:** Maintains skin moisture and pH balance.\n- **Anti-Aging Prep:** Primes the skin to absorb serums and lotions effectively.\n\n### How to Use:\nMassage onto damp face in circular motions, then rinse thoroughly with water.'
  },
  {
    name: 'YouthEssence Lotion',
    slug: 'youthessence-lotion',
    category_slug: 'womens-beauty',
    price: 2800,
    sale_price: null,
    short_description: 'Lightweight, deeply hydrating lotion that restores skin elasticity and youthful glow.',
    full_description: 'YouthEssence Lotion delivers an intense burst of hydration to thirsty skin. Its lightweight formula penetrates deeply, delivering essential nutrients that plump the skin, reduce fine lines, and restore a radiant, youthful complexion.\n\n### Key Benefits:\n- **Deep Hydration:** Locks in moisture for 24-hour hydration.\n- **Improves Elasticity:** Firms the skin and reduces the appearance of wrinkles.\n- **Brightening:** Evens out skin tone and enhances natural glow.\n\n### How to Use:\nApply evenly to face and neck after cleansing and toning.'
  }
];

async function seed() {
  console.log('Fetching existing categories...');
  const { data: categories } = await supabase.from('categories').select('*');
  let categoryMap = {};
  categories.forEach(c => categoryMap[c.slug] = c.id);

  console.log('Creating missing categories...');
  for (const cat of newCategories) {
    if (!categoryMap[cat.slug]) {
      const { data, error } = await supabase.from('categories').insert([cat]).select();
      if (error) {
        console.error('Error inserting category:', error);
      } else {
        categoryMap[cat.slug] = data[0].id;
        console.log(`Created category: ${cat.name}`);
      }
    }
  }

  console.log('Inserting new products...');
  for (const prod of newProducts) {
    // Check if exists
    const { data: existing } = await supabase.from('products').select('id').eq('slug', prod.slug).single();
    
    if (existing) {
      console.log(`Product ${prod.name} already exists, skipping.`);
      continue;
    }

    const categoryId = categoryMap[prod.category_slug];
    if (!categoryId) {
      console.error(`Could not find category for ${prod.category_slug}`);
      continue;
    }

    const { data: newProd, error } = await supabase.from('products').insert([{
      name: prod.name,
      slug: prod.slug,
      sku: `BFS-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      category_id: categoryId,
      price: prod.price,
      sale_price: prod.sale_price,
      short_description: prod.short_description,
      full_description: prod.full_description,
      active: true,
      status: 'published',
      featured: false
    }]).select();

    if (error) {
      console.error(`Error inserting product ${prod.name}:`, error);
    } else {
      console.log(`Inserted product: ${prod.name}`);
      
      // Insert placeholder image
      await supabase.from('product_images').insert([{
        product_id: newProd[0].id,
        url: '/placeholder.jpg',
        is_primary: true,
        display_order: 1
      }]);
    }
  }
  console.log('Done seeding missing products!');
}

seed();
