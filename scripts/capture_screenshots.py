#!/usr/bin/env python3
"""
High-resolution screenshot capture script for the Visit Sri Lanka platform.
Captures Retina-quality, beautifully rendered screenshots with full JS/tile rendering.
"""
import os
import subprocess
import time

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SCREENSHOTS_DIR = os.path.join(BASE_DIR, "img", "screenshots")
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

SHOTS = [
    {
        "url": "http://localhost:3000/index.html",
        "output": "01-homepage-hero.png",
        "width": 1440,
        "height": 920,
        "budget": 5000
    },
    {
        "url": "http://localhost:3000/destinations.html",
        "output": "02-destinations-catalog.png",
        "width": 1440,
        "height": 960,
        "budget": 5000
    },
    {
        "url": "http://localhost:3000/map.html",
        "output": "03-interactive-map.png",
        "width": 1440,
        "height": 920,
        "budget": 7000
    },
    {
        "url": "http://localhost:3000/provinces/central-province.html",
        "output": "04-province-central.png",
        "width": 1440,
        "height": 920,
        "budget": 5000
    },
    {
        "url": "http://localhost:3000/districts/kandy.html",
        "output": "05-district-kandy.png",
        "width": 1440,
        "height": 920,
        "budget": 5000
    },
    {
        "url": "http://localhost:3000/places/sigiriya-rock-fortress.html",
        "output": "06-destination-sigiriya.png",
        "width": 1440,
        "height": 960,
        "budget": 5000
    },
    {
        "url": "http://localhost:3000/itineraries.html",
        "output": "07-itineraries-planner.png",
        "width": 1440,
        "height": 920,
        "budget": 5000
    }
]

def capture():
    print("Capturing high-resolution application preview screenshots...")
    for item in SHOTS:
        out_file = os.path.join(SCREENSHOTS_DIR, item["output"])
        cmd = [
            CHROME,
            "--headless=new",
            "--user-data-dir=/tmp/chrome-hd-shots",
            "--no-sandbox",
            "--hide-scrollbars",
            f"--window-size={item['width']},{item['height']}",
            "--force-device-scale-factor=1.5",
            f"--virtual-time-budget={item['budget']}",
            "--run-all-compositor-stages-before-draw",
            f"--screenshot={out_file}",
            item["url"]
        ]
        print(f"Capturing {item['output']} from {item['url']}...")
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if os.path.exists(out_file):
            size_kb = os.path.getsize(out_file) // 1024
            print(f"Successfully captured {item['output']} ({size_kb} KB)")
        else:
            print(f"Failed to capture {item['output']}")

if __name__ == "__main__":
    capture()
