import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const descriptions = {
  'refined-yunzhi-essence': 'Refined Yunzhi Essence is a potent immune-boosting mushroom extract made from top-grade wild Yunzhi (Turkey Tail mushroom). It contains high concentrations of polysaccharides and peptides which have been scientifically shown to enhance natural defenses, support healthy cellular function, and improve overall vitality. Ideal for individuals with weakened immunity or those recovering from illness.',
  'vitamin-c-chewable-tablets': 'BF Suma Vitamin C Chewable Tablets provide a delicious, daily dose of essential Vitamin C to fortify your immune system. Formulated for high absorption, these tablets help prevent common colds, support collagen production for radiant skin, and act as a powerful antioxidant to protect your body against free radical damage. Great for both adults and children.',
  'zaminocal-plus': 'ZaminoCal Plus is an advanced calcium supplement uniquely formulated with Zinc, Magnesium, and Amino Acids for maximum absorption. It effectively supports bone density, prevents osteoporosis, and promotes healthy joint function. The amino acid chelation ensures that the calcium is absorbed directly into the bloodstream without causing digestive discomfort.',
  'micro2-cycle-tablets': 'Micro2 Cycle Tablets are specifically designed to promote cardiovascular health and improve blood circulation. Featuring a blend of Radix Salviae Miltiorrhizae and Panax Notoginseng, this supplement helps prevent blood clots, lowers blood viscosity, and maintains healthy blood pressure levels, ensuring your heart functions optimally.',
  'constirelax': 'ConstiRelax is a natural, gentle herbal formula designed to safely and effectively relieve occasional constipation and promote digestive regularity. By utilizing traditional herbs like Radix Astragali and Fructus Cannabis, it softens stool and stimulates bowel movements without the harsh cramping associated with chemical laxatives.',
  'prostatrelax': 'ProstatRelax is a comprehensive prostate health supplement formulated for men. It utilizes a synergistic blend of Epimedium extract and other natural herbs to relieve urinary frequency, reduce nighttime urination, and support a healthy prostate gland. Essential for maintaining men\'s vitality and urinary tract comfort.',
  'feminergy-capsules': 'Feminergy Capsules are the ultimate anti-aging and beauty supplement for women. Packed with potent grape seed extract (OPC), it acts as a superior antioxidant that is 50 times more effective than Vitamin E. It promotes skin elasticity, reduces wrinkles, supports cardiovascular health, and boosts feminine vitality from the inside out.',
  'anatic-herbal-essence-soap': 'Anatic Herbal Essence Soap is a luxurious, therapeutic cleansing bar infused with wild honey, green tea extract, and grapefruit essence. It deeply cleanses pores, eliminates acne-causing bacteria, and controls excess oil while maintaining the skin\'s natural moisture balance. Leaves your skin feeling refreshed, smooth, and naturally radiant.',
  'dr-cow-smart-kids-calcium': 'Dr. Cow Smart Kids Calcium provides delicious, bone-building calcium sourced from premium New Zealand milk. Formulated specifically for growing children, these chewable, milky tablets support strong teeth, robust bone development, and healthy immune function without any artificial colors or preservatives.',
  '4-in-1-reishi-coffee': 'BF Suma 4 in 1 Reishi Coffee combines the rich, robust flavor of premium coffee beans with the incredible health benefits of Reishi mushroom (Ganoderma). This energizing blend boosts immunity, reduces fatigue, improves sleep quality, and provides a sustained energy lift without the jittery crash of regular coffee.',
  '4-in-1-ginseng-coffee': 'Our 4 in 1 Ginseng Coffee is an invigorating beverage that blends high-quality coffee with pure Panax Ginseng extract. Known as the "King of Herbs," Ginseng enhances physical stamina, improves mental focus, and supports immune health. It\'s the perfect morning kickstart or afternoon energy boost for active individuals.',
  'relivin-tea': 'Relivin Tea is a soothing, therapeutic herbal infusion designed to support cardiovascular health and reduce stress. Made from a proprietary blend of natural herbs, it helps lower blood pressure, improves circulation, and promotes a calm, relaxed state of mind. Enjoy a warm cup daily for holistic wellness.',
  'gymeffect': 'GymEffect is a specialized fitness and energy supplement tailored for active individuals and athletes. It enhances endurance, accelerates muscle recovery, and boosts overall physical performance. Whether you are hitting the gym or just leading an active lifestyle, GymEffect provides the nutritional support you need to push your limits.',
  'youthessence-cleanser': 'YouthEssence Cleanser is a premium facial wash that gently lifts away dirt, oil, and impurities while nourishing the skin. Infused with active botanical extracts, it promotes cellular renewal, brightens the complexion, and prepares your skin to absorb the full benefits of your anti-aging skincare routine.',
  'youthessence-lotion': 'YouthEssence Lotion is an advanced, deeply hydrating anti-aging moisturizer. It penetrates the skin to deliver potent antioxidants, peptides, and moisture-binding ingredients. Regular use visibly reduces fine lines, restores skin firmness, and leaves you with a glowing, youthful complexion.',
  'nmn-duo-release': 'NMN-Duo Release is a cutting-edge anti-aging supplement featuring a dual-release technology for sustained NAD+ boosting. It combats cellular aging, enhances energy metabolism, and supports cognitive function. It is the ultimate longevity supplement for those looking to turn back the biological clock.',
  'nmn-coffee': 'NMN Coffee combines the longevity benefits of NMN (Nicotinamide Mononucleotide) with premium coffee. It provides an immediate energy boost while simultaneously working at the cellular level to elevate NAD+ levels, promoting youthful vitality, sharper focus, and long-term metabolic health.',
  'nmn-sharp-mind': 'NMN-Sharp Mind is scientifically formulated to support brain health and cognitive function. By combining NMN with targeted neuro-supportive nutrients, it improves memory, enhances focus, and protects against age-related cognitive decline, keeping your mind sharp and agile.',
  'ntdiarr-pills-50s': 'Ntdiarr Pills provide fast, effective relief from acute and chronic diarrhea. Formulated with potent traditional herbs, it quickly soothes gastrointestinal distress, restores normal bowel function, and helps balance gut flora, making it an essential addition to your home medicine cabinet.',
  'femibiotics': 'FemiBiotics is a specialized probiotic blend designed exclusively for women\'s intimate health. It restores and maintains a healthy vaginal flora, prevents recurring infections, and supports urinary tract health. Experience daily comfort and confidence with this targeted feminine care supplement.',
  'detoxilive-pro-oil-capsules': 'Detoxilive Pro Oil Capsules are a powerful liver support and detoxification supplement. Featuring high-grade Soy Lecithin, it protects liver cells from damage, promotes the regeneration of liver tissue, and helps metabolize fats effectively, reducing the risk of fatty liver disease.',
  'femicalcium-d3': 'FemiCalcium D3 is tailored for women\'s bone health. It combines highly absorbable calcium with Vitamin D3 to ensure maximum bone mineralization. It actively prevents osteoporosis, supports healthy teeth, and helps maintain bone density through all stages of a woman\'s life, including menopause.',
  'bf-suma-pure-broken-ganoderma-spores': 'Pure & Broken Ganoderma Spores offer the most concentrated form of Reishi mushroom benefits. Utilizing advanced wall-breaking technology (99% breakage rate), the active ingredients are fully released for maximum absorption. It aggressively supports the immune system, aids in tumor suppression, and promotes exceptional overall health.',
  'ez-xlim': 'Ez-xlim is a natural weight management formula that helps you achieve your fitness goals safely. It works by blocking fat absorption, suppressing appetite, and boosting metabolism. Paired with a healthy diet, Ez-xlim makes shedding excess weight easier and more sustainable.',
  'pure-broken-ganoderma-spores-60s': 'Pure & Broken Ganoderma Spores (60 capsules) provide a convenient, concentrated dose of Reishi mushroom spores. With a 99% wall-breaking rate, this supplement delivers unparalleled immune support, reduces fatigue, and offers powerful antioxidant protection to maintain long-term wellness.',
  'veggie-veggie': 'Veggie Veggie is a comprehensive digestive health supplement packed with natural dietary fibers and beneficial enzymes. It acts as a natural "intestinal scavenger," clearing out toxins, promoting regular bowel movements, and supporting a healthy gut microbiome for improved nutrient absorption.',
  'x-power-coffee': 'X Power Coffee is a premium functional coffee specially formulated for men. Infused with Maca and Epimedium extract, it naturally boosts testosterone levels, enhances stamina, and improves intimate performance. Enjoy a delicious cup to re-ignite your passion and vitality.',
  'pure-broken-ganoderma-spores': 'Pure & Broken Ganoderma Spores represent the pinnacle of immune support. Extracted from the highest quality Reishi mushrooms, these spores are broken using advanced technology to release potent polysaccharides and triterpenes. It is a premium daily supplement for superior immune defense and longevity.',
  'femicare-feminine-cleanser': 'FemiCare Feminine Cleanser is a gentle, pH-balanced wash designed for daily feminine hygiene. It effectively eliminates odor-causing bacteria, relieves itching and discomfort, and maintains a healthy micro-environment, keeping you feeling fresh, clean, and confident all day long.',
  'elements': 'Elements is a comprehensive daily multivitamin and mineral complex designed to fill nutritional gaps in your diet. It provides a balanced spectrum of essential nutrients to boost energy levels, support immune function, and promote overall vitality for a healthy, active lifestyle.',
  'probio3-straweberry-flavor-30s': 'Probio3 (Strawberry Flavor) is a delicious, kid-friendly probiotic supplement that supports digestive and immune health. Packed with billions of active beneficial bacteria, it helps balance the gut microbiome, reduces digestive discomfort, and strengthens natural defenses in a tasty strawberry powder.',
  'gluzojoint-ultra-pro': 'GluzoJoint-Ultra Pro is the ultimate joint care formula. Combining Glucosamine, Chondroitin, and MSM, it rebuilds cartilage, reduces joint inflammation, and improves mobility. It is highly effective for relieving the pain and stiffness associated with arthritis and heavy physical exertion.',
  'blueberry-chewable-tablets-for-sharp-vision': 'Blueberry Chewable Tablets are formulated to protect and enhance your eyesight. Rich in natural anthocyanins from premium blueberries, they reduce eye fatigue, improve night vision, and protect the retina from blue light and oxidative stress. Perfect for students, professionals, and the elderly.'
};

async function run() {
  console.log('Updating product descriptions...');
  let updatedCount = 0;
  
  for (const [slug, description] of Object.entries(descriptions)) {
    const { error } = await supabase
      .from('products')
      .update({ 
        full_description: description,
        short_description: description.substring(0, 150) + '...'
      })
      .eq('slug', slug);
      
    if (error) {
      console.error(`Error updating ${slug}:`, error.message);
    } else {
      updatedCount++;
      console.log(`Updated ${slug}`);
    }
  }
  
  console.log(`Successfully updated ${updatedCount} product descriptions.`);
}

run();
