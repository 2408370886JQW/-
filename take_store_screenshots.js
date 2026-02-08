
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = '/home/ubuntu/social-life-app/screenshots/store_mode';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function takeStoreScreenshots() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=375,812']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

  console.log('Starting Store Mode screenshot capture...');

  try {
    // 1. Scan Simulation Page
    console.log('Capturing 1_Scan_Simulation.png');
    await page.goto(`${BASE_URL}/scan`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '1_Scan_Simulation.png') });

    // Click "模拟扫码进店" button
    // Wait for button to be available
    await page.waitForSelector('button');
    // Try to find ANY button, as there is only one on the page
    const scanButton = await page.$('button'); 
    if (scanButton) {
      await scanButton.click();
      await new Promise(r => setTimeout(r, 2000)); // Wait for navigation
    } else {
      console.error('Could not find Scan button');
      return;
    }

    // 2. Store Login / Scenario Selection (StoreMode.tsx)
    // This page shows the store info and "今天和谁相见" card
    console.log('Capturing 2_Store_Scenario_Selection.png');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '2_Store_Scenario_Selection.png') });

    // Select a scenario (e.g., "闺蜜")
    // In StoreMode.tsx, scenarios are buttons with text "闺蜜"
    // Wait for any button to be present first
    await page.waitForSelector('button');
    
    // Try to find by text content using evaluateHandle
    // Just click the first button that is not "暂不进店"
    const scenarioButton = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(b => !b.innerText.includes('暂不进店') && b.innerText.length > 0);
    });

    if (scenarioButton.asElement()) {
      console.log('Clicking a scenario button...');
      await scenarioButton.asElement().click();
      await new Promise(r => setTimeout(r, 2000)); // Wait for transition/modal
    } else {
      console.error('Could not find any scenario button');
    }
    
    // 3. Package Detail / Store Home (After selecting scenario)
    // It might navigate to StoreHomePage or show a list of packages.
    console.log('Capturing 3_Store_Home_Packages.png');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '3_Store_Home_Packages.png') });

    // Click on a package to go to detail
    // In StoreMode.tsx, packages are divs with onClick handlers
    // We can find one by looking for price or title
    await page.waitForSelector('div');
    
     // Try to click by coordinates (middle of the screen, slightly lower)
    // Assuming the package list is visible
    console.log('Clicking by coordinates as fallback...');
    // Try to find the element with text "双人微醺套餐"
    const specificPackage = await page.evaluateHandle(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        return elements.find(el => el.innerText && el.innerText.includes('双人微醺套餐'));
    });

    if (specificPackage.asElement()) {
        console.log('Found specific package, clicking...');
        await specificPackage.asElement().click();
    } else {
        console.log('Specific package not found, clicking by coordinates...');
        await page.mouse.click(200, 500); // Click somewhere in the middle-bottom
    }
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('Capturing 4_Package_Detail.png');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '4_Package_Detail.png') });
    
    // Click "立即购买" or "支付"
    const buyButton = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(b => b.innerText.includes('立即购买') || b.innerText.includes('支付'));
    });

    if (buyButton.asElement()) {
        console.log('Clicking buy button...');
        await buyButton.asElement().click();
    } else {
        console.log('Buy button not found, clicking bottom right as fallback...');
        await page.mouse.click(300, 750); // Click bottom right
    }
    
    await new Promise(r => setTimeout(r, 4000)); // Wait for payment simulation (1.5s scan + 1.5s process + buffer)
    console.log('Capturing 5_Payment_Success.png');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '5_Payment_Success.png') });

    console.log('Store Mode screenshots captured successfully.');

  } catch (error) {
    console.error('Error capturing store screenshots:', error);
  } finally {
    await browser.close();
  }
}

takeStoreScreenshots();
