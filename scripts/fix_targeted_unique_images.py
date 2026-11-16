import os
import urllib.request
from PIL import Image

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEST_DIR = os.path.join(ROOT_DIR, 'img', 'destinations')

USER_AGENT = 'SriLankaTourismPlatform/2.0 (https://visitsrilanka.gov.lk; contact@visitsrilanka.gov.lk) Python-urllib'

targeted_urls = {
    'adams-bridge-viewpoints': 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Adams_Bridge_aerial.jpg',
    'ella-rock': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Ella_Rock%2C_Sri_Lanka.jpg/1280px-Ella_Rock%2C_Sri_Lanka.jpg',
    'little-adams-peak': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/Little_adams_peak%2C_Ella_Sri_Lanka.jpg/1280px-Little_adams_peak%2C_Ella_Sri_Lanka.jpg',
    'kaudulla-national-park': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Elefantenfamilie_kaudulla_nationalpark_2017-10-17_%2820%29.jpg/1280px-Elefantenfamilie_kaudulla_nationalpark_2017-10-17_%2820%29.jpg',
    'sinharaja-forest-reserve': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/SL_Sinharaja_Forest_asv2020-01_img03.jpg/1280px-SL_Sinharaja_Forest_asv2020-01_img03.jpg',
    'maha-saman-devalaya': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Maha_Saman_Devalaya.jpg/1280px-Maha_Saman_Devalaya.jpg',
    'batadombalena-cave': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Aerial_view_from_the_Batadombalena.jpg/1280px-Aerial_view_from_the_Batadombalena.jpg',
    'bible-rock-bathalegala': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Bathalegala.jpg/1280px-Bathalegala.jpg',
    'delft-island': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/Chestnut_pony_Delft_Island_-_head.jpg/1280px-Chestnut_pony_Delft_Island_-_head.jpg',
    'rekawa-turtle-conservation': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Sea_Turtle_in_a_Hatchery.jpg/1280px-Sea_Turtle_in_a_Hatchery.jpg',
    'gal-oya-nilgala': 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Vedda_man_and_child%2C_Sri_Lanka.jpg',
    'belilena-cave': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Serendib_123.jpg/1280px-Serendib_123.jpg'
}

for slug, url in targeted_urls.items():
    target_path = os.path.join(DEST_DIR, f"{slug}.jpg")
    temp_path = target_path + '.t.tmp'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
        with urllib.request.urlopen(req, timeout=12) as response:
            data = response.read()
        with open(temp_path, 'wb') as f:
            f.write(data)
        with Image.open(temp_path) as im:
            rgb = im.convert('RGB')
            rgb.thumbnail((960, 960), Image.Resampling.LANCZOS)
            rgb.save(target_path, 'JPEG', quality=85, optimize=True)
        if os.path.exists(temp_path):
            os.remove(temp_path)
        print(f"[SUCCESS] {slug} -> {target_path} ({os.path.getsize(target_path)} bytes)")
    except Exception as e:
        print(f"[ERROR] {slug} from {url}: {e}")
