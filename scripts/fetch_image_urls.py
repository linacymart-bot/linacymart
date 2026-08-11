import sys
import json
import time
from duckduckgo_search import DDGS

products = [
  {"name": 'Refined Yunzhi Essence', "slug": 'refined-yunzhi-essence'},
  {"name": 'Vitamin C Chewable Tablets', "slug": 'vitamin-c-chewable-tablets'},
  {"name": 'ZaminoCal Plus', "slug": 'zaminocal-plus'},
  {"name": 'Micro2 Cycle Tablets', "slug": 'micro2-cycle-tablets'},
  {"name": 'ConstiRelax', "slug": 'constirelax'},
  {"name": 'ProstatRelax', "slug": 'prostatrelax'},
  {"name": 'Feminergy Capsules', "slug": 'feminergy-capsules'},
  {"name": 'Anatic Herbal Essence Soap', "slug": 'anatic-herbal-essence-soap'},
  {"name": 'Dr. Cow Smart Kids Calcium', "slug": 'dr-cow-smart-kids-calcium'},
  {"name": '4 in 1 Reishi Coffee', "slug": '4-in-1-reishi-coffee'},
  {"name": '4 in 1 Ginseng Coffee', "slug": '4-in-1-ginseng-coffee'},
  {"name": 'Relivin Tea', "slug": 'relivin-tea'},
  {"name": 'GymEffect', "slug": 'gymeffect'},
  {"name": 'YouthEssence Cleanser', "slug": 'youthessence-cleanser'},
  {"name": 'YouthEssence Lotion', "slug": 'youthessence-lotion'}
]

results = {}

with DDGS() as ddgs:
    for prod in products:
        query = f"BF Suma {prod['name']} product"
        try:
            search_results = list(ddgs.images(query, max_results=2))
            if search_results:
                results[prod['slug']] = search_results[0]['image']
            else:
                results[prod['slug']] = None
        except Exception as e:
            sys.stderr.write(f"Error fetching {prod['name']}: {e}\n")
            results[prod['slug']] = None
        time.sleep(1)

print(json.dumps(results))
