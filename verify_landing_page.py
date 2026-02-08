from playwright.sync_api import sync_playwright
import time
import sys

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Wait for server to be up
        print("Waiting for server to be up...")
        for i in range(30):
            try:
                page.goto("http://localhost:3000/")
                break
            except Exception as e:
                print(f"Waiting... ({i+1}/30)")
                time.sleep(1)
        else:
             print("Server did not start in time.")
             sys.exit(1)

        print("Page loaded. Taking screenshot...")
        # Take screenshot
        time.sleep(2) # Wait a bit for images to load if any
        page.screenshot(path="verification_landing.png")
        print("Screenshot saved to verification_landing.png")

        browser.close()

if __name__ == "__main__":
    run()
