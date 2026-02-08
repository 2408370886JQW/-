
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = '/home/ubuntu/social-life-app/screenshots';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: false,
    dumpio: true,
    args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--window-size=375,812',
        '--use-gl=swiftshader',
        '--enable-webgl',
        '--ignore-certificate-errors'
    ] // Mobile viewport
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

  console.log('Starting screenshot capture...');

  try {
    // 1. Home - Encounter Map (with fallback)
    console.log('Capturing 1_Home_Encounter.png');
    // Use fallback=true to render static map background instead of Google Maps
    await page.goto(`${BASE_URL}?fallback=true`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3000)); // Wait for fallback render
    await page.screenshot({ path: path.join(OUTPUT_DIR, '1_Home_Encounter.png') });

    // 2. Home - Friends Map
    console.log('Capturing 2_Home_Friends.png');
    const friendsTab = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => b.textContent.includes('好友') && b.textContent.includes('我的好友'));
    });
    if (friendsTab.asElement()) {
      await friendsTab.asElement().click();
      await new Promise(r => setTimeout(r, 2000)); // Wait for tab switch
      await page.screenshot({ path: path.join(OUTPUT_DIR, '2_Home_Friends.png') });
    } else {
      console.error('Could not find Friends tab');
    }

    // 3. Home - Moments
    console.log('Capturing 3_Home_Moments.png');
    const momentsTab = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => b.textContent.includes('动态') && b.textContent.includes('看看新鲜事'));
    });
    if (momentsTab.asElement()) {
      await momentsTab.asElement().click();
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: path.join(OUTPUT_DIR, '3_Home_Moments.png') });
    } else {
      console.error('Could not find Moments tab');
    }

    // 4. Home - Meet
    console.log('Capturing 4_Home_Meet.png');
    const meetTab = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => b.textContent.includes('相见') && b.textContent.includes('发现美好生活'));
    });
    if (meetTab) {
      await meetTab.click();
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: path.join(OUTPUT_DIR, '4_Home_Meet.png') });
    } else {
      console.error('Could not find Meet tab');
    }

    // 5. Circles Page
    console.log('Capturing 5_Circles.png');
    await page.goto(`${BASE_URL}/circles`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '5_Circles.png') });

    // 6. Publish Page
    console.log('Capturing 6_Publish.png');
    await page.goto(`${BASE_URL}/publish`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '6_Publish.png') });

    // 7. Messages Page
    console.log('Capturing 7_Messages.png');
    await page.goto(`${BASE_URL}/chat`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '7_Messages.png') });

    // 8. Profile Page
    console.log('Capturing 8_Profile.png');
    await page.goto(`${BASE_URL}/profile`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '8_Profile.png') });

    console.log('All screenshots captured successfully.');

  } catch (error) {
    console.error('Error capturing screenshots:', error);
  } finally {
    await browser.close();
  }
}

takeScreenshots();
