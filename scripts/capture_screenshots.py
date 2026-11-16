#!/usr/bin/env python3
"""
Captures high-resolution preview screenshots of key application views
for the README.md and documentation using headless Google Chrome.
"""
import os
import subprocess
import time

CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DOCS_DIR = os.path.join(BASE_DIR, "img", "screenshots")
os.makedirs(DOCS_DIR, exist_ok=True)

SHOTS = [
    {
        "file": "index.html",
        "output": "01-homepage-hero.png",
        "width": 1440,
        "height": 900
    },
    {
        "file": "destinations.html",
        "output": "02-destinations-catalog.png",
        "width": 1440,
        "height": 960
    },
    {
        "file": "map.html",
        "output": "03-interactive-map.png",
        "width": 1440,
        "height": 900
    },
    {
        "file": "provinces/central-province.html",
        "output": "04-province-central.png",
        "width": 1440,
        "height": 900
    },
    {
        "file": "districts/kandy.html",
        "output": "05-district-kandy.png",
        "width": 1440,
        "height": 900
    },
    {
        "file": "places/sigiriya-rock-fortress.html",
        "output": "06-destination-sigiriya.png",
        "width": 1440,
        "height": 960
    },
    {
        "file": "itineraries.html",
        "output": "07-itineraries-planner.png",
        "width": 1440,
        "height": 900
    }
]

def main():
    print("Capturing screenshots for README...")
    for item in SHOTS:
        url = f"file://{os.path.join(BASE_DIR, item['file'])}"
        out_path = os.path.join(DOCS_DIR, item['output'])
        window_size = f"{item['width']},{item['height']}"
        cmd = [
            CHROME_BIN,
            "--headless=new",
            "--user-data-dir=/tmp/chrome-preview-data",
            "--no-sandbox",
            "--hide-scrollbars",
            f"--window-size={window_size}",
            f"--screenshot={out_path}",
            url
        ]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
            print(f"Captured {item['output']} ({os.path.getsize(out_path) // 1024} KB)")
        else:
            print(f"Failed to capture {item['output']}: {res.stderr[:200]}")

if __name__ == "__main__":
    main()
