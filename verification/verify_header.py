from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:3000")
        # Wait for the image to load
        # Note: next/image renders an img tag, so searching by alt text should work
        page.wait_for_selector("img[alt='AD Logo']")

        # Take a screenshot of the header area
        # Header height is 60px. Let's take 100px.
        page.screenshot(path="verification/header.png", clip={"x": 0, "y": 0, "width": 1280, "height": 100})
        browser.close()

if __name__ == "__main__":
    run()
