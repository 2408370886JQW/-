import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = '/home/ubuntu/social-life-app/screenshots_export';
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 390, height: 844, isMobile: true, hasTouch: true } // iPhone 12 Pro dimensions
  });
  const page = await browser.newPage();

  // Helper to wait and screenshot
  const takeScreenshot = async (name) => {
    await new Promise(r => setTimeout(r, 1000)); // Wait for animations
    await page.screenshot({ path: path.join(OUTPUT_DIR, name), fullPage: true });
    console.log(`Captured: ${name}`);
  };

  try {
    console.log('Navigating to app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    // 0. Initial State (Home)
    // Click "Meet" tab (assuming it's the 4th tab based on icon count, or find by text/icon)
    // The tabs are at the bottom. Let's look for the text "相见"
    const meetTab = await page.waitForSelector('xpath///span[text()="相见"]/..');
    if (meetTab) {
        await meetTab.click();
        await takeScreenshot('0_Meet_Tab.png');
    } else {
        console.error('Could not find Meet tab');
    }

    // 1. Entry Page (Simulate Scan)
    // Click "模拟扫码进店" button
    const scanBtn = await page.waitForSelector('xpath///button[contains(., "模拟扫码进店")]');
    await scanBtn.click();
    await takeScreenshot('1_Store_Entry.png');

    // 2. Login Page
    // Click "模拟扫码 (scene=store)"
    const simulateScanBtn = await page.waitForSelector('xpath///button[contains(., "模拟扫码 (scene=store)")]');
    await simulateScanBtn.click();
    await takeScreenshot('2_Login.png');

    // 3. Store Home & Modal
    // Fill phone (optional as mock doesn't validate) and click Login
    const loginBtn = await page.waitForSelector('xpath///button[contains(., "登录并绑定门店")]');
    await loginBtn.click();
    // Wait for modal to appear
    await page.waitForSelector('xpath///h2[contains(., "你今天是和谁来吃饭")]');
    await takeScreenshot('3_Relationship_Modal.png');

    // 4. Scenario Page
    // Select "第一次见面" (First Date)
    const firstDateBtn = await page.waitForSelector('xpath///span[contains(., "第一次见面")]/..');
    await firstDateBtn.click();
    await takeScreenshot('4_Scenario_Page.png');

    // 5. Package Detail
    // Click the first package
    const firstPackage = await page.waitForSelector('xpath///h4[contains(., "初见·双人轻食套餐")]/../../..');
    await firstPackage.click();
    await takeScreenshot('5_Package_Detail.png');

    // 6. Payment & Success
    // Click "立即下单"
    const orderBtn = await page.waitForSelector('xpath///button[contains(., "立即下单")]');
    // Use evaluate to click to avoid overlay issues
    await page.evaluate(el => el.click(), orderBtn);
    
    // Wait for payment simulation (2s) + transition
    // Explicitly wait for the "支付成功" text to appear
    try {
      await page.waitForSelector('xpath///h2[contains(., "支付成功")]', { timeout: 10000 });
      // Add a small buffer for animations to settle
      await new Promise(r => setTimeout(r, 1000));
      await takeScreenshot('6_Success_Page.png');
    } catch (e) {
      console.error('Timeout waiting for Success Page:', e);
      // Take a debug screenshot to see where it got stuck
      await takeScreenshot('6_Debug_Stuck.png');
    }

  } catch (e) {
    console.error('Error capturing screenshots:', e);
  } finally {
    await browser.close();
  }
})();
