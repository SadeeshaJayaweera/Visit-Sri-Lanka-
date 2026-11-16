import os
import urllib.request
from PIL import Image

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
USER_AGENT = 'SriLankaTourismPlatform/2.0 (https://visitsrilanka.gov.lk; contact@visitsrilanka.gov.lk) Python-urllib'

cross_targets = {
    'img/provinces/western-province.jpg': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Colombo_Lotus_Tower_night.jpg/1280px-Colombo_Lotus_Tower_night.jpg',
    'img/provinces/uva-province.jpg': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Ella_Gap%2C_Sri_Lanka.jpg/1280px-Ella_Gap%2C_Sri_Lanka.jpg',
    'img/provinces/southern-province.jpg': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6a/Stilt_fishermen_in_Sri_Lanka_by_amila_tennakoon.jpg/1280px-Stilt_fishermen_in_Sri_Lanka_by_amila_tennakoon.jpg',
    'img/provinces/north-central-province.jpg': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Polonnaruwa%2C_Sri_Lanka%2C_Ancient_city_of_Polonnaruwa%2C_Northern_monastery.jpg/1280px-Polonnaruwa%2C_Sri_Lanka%2C_Ancient_city_of_Polonnaruwa%2C_Northern_monastery.jpg',
    'img/districts/puttalam.jpg': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Kalpitiya_Lagoon.jpg/1280px-Kalpitiya_Lagoon.jpg'
}

for rel_path, url in cross_targets.items():
    target = os.path.join(ROOT_DIR, rel_path)
    temp = target + '.c.tmp'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
        with urllib.request.urlopen(req, timeout=12) as response:
            data = response.read()
        with open(temp, 'wb') as f:
            f.write(data)
        with Image.open(temp) as im:
            rgb = im.convert('RGB')
            rgb.thumbnail((960, 960), Image.Resampling.LANCZOS)
            rgb.save(target, 'JPEG', quality=85, optimize=True)
        if os.path.exists(temp):
            os.remove(temp)
        print(f"[SUCCESS] {rel_path} -> {os.path.getsize(target)} bytes")
    except Exception as e:
        print(f"[ERROR] {rel_path}: {e}")
