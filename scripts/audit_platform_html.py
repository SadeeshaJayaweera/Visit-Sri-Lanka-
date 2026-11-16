import os
import re

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

html_files = []
for dirpath, dirnames, filenames in os.walk(ROOT_DIR):
    if 'node_modules' in dirpath or '.git' in dirpath:
        continue
    for f in filenames:
        if f.endswith('.html'):
            html_files.append(os.path.join(dirpath, f))

print(f"Total HTML files found: {len(html_files)}")

# 1. Check for 'District District'
district_double_errors = []
for f in html_files:
    with open(f, 'r', encoding='utf-8') as h:
        content = h.read()
        if 'District District' in content or 'district district' in content:
            district_double_errors.append(f)

print(f"Files with double District: {len(district_double_errors)}")
if district_double_errors:
    for d in district_double_errors[:5]:
        print("  Sample file with double District:", os.path.relpath(d, ROOT_DIR))

# 2. Check for local image references (src='...' and url('...'))
missing_images = []
img_src_regex = re.compile(r'<img[^>]+src=["\']([^"\']+)["\']', re.I)
bg_url_regex = re.compile(r'url\(["\']?([^"\'\)\s]+)["\']?\)', re.I)

for f in html_files:
    folder = os.path.dirname(f)
    with open(f, 'r', encoding='utf-8') as h:
        content = h.read()
    
    # Check <img> tags
    for src in img_src_regex.findall(content):
        if src.startswith('http') or src.startswith('//') or src.startswith('data:'):
            continue
        clean_src = src.split('?')[0]
        resolved = os.path.normpath(os.path.join(folder, clean_src))
        if not os.path.exists(resolved):
            missing_images.append((os.path.relpath(f, ROOT_DIR), src, os.path.relpath(resolved, ROOT_DIR)))
            
    # Check background url()
    for src in bg_url_regex.findall(content):
        if src.startswith('http') or src.startswith('//') or src.startswith('data:'):
            continue
        clean_src = src.split('?')[0]
        resolved = os.path.normpath(os.path.join(folder, clean_src))
        if not os.path.exists(resolved):
            missing_images.append((os.path.relpath(f, ROOT_DIR), src, os.path.relpath(resolved, ROOT_DIR)))

print(f"Missing local image references across all {len(html_files)} files: {len(missing_images)}")
if missing_images:
    for m in missing_images[:10]:
        print(f"  File: {m[0]} -> src: {m[1]} -> resolved: {m[2]}")
else:
    print("ALL local image references across all HTML files resolve to existing files on disk!")
