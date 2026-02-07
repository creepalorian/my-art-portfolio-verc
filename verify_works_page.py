from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Wait for server to be up
        max_retries = 30
        for i in range(max_retries):
            try:
                page.goto("http://localhost:3000/works")
                break
            except Exception as e:
                print(f"Waiting for server... ({i+1}/{max_retries})")
                time.sleep(1)

        # Verify empty state
        try:
            page.wait_for_selector("text=No artworks found.", timeout=5000)
            print("Found empty state message.")
        except:
            print("Did not find empty state message immediately, maybe it's loading or has content?")

        # Take screenshot
        page.screenshot(path="verification_works.png")
        print("Screenshot saved to verification_works.png")

        browser.close()

if __name__ == "__main__":
    run()
