const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = '/home/ubuntu/social-life-app/product_package';
const VIEWPORT = { width: 390, height: 844, deviceScaleFactor: 2 }; // iPhone 12/13 Pro

// Helper to find element by text
const findByText = async (page, selector, text) => {
  const elements = await page.$$(selector);
  for (const el of elements) {
    const content = await page.evaluate(e => e.textContent, el);
    if (content && content.includes(text)) return el;
  }
  return null;
};

// Structure definition
const STRUCTURE = {
  '相见链路': [
    { name: '相见页-01-关系选择', action: async (page) => {
      await page.goto(BASE_URL);
      // Click "相见" tab
      const tab = await findByText(page, 'button span', '相见');
      if (tab) await tab.evaluate(b => b.closest('button').click());
      await new Promise(r => setTimeout(r, 1000));
    }},
    { name: '相见页-02-商家列表', action: async (page) => {
      // Click "第一次见面"
      const btn = await findByText(page, 'span', '第一次见面');
      if (btn) await btn.evaluate(b => b.closest('button').click());
      await new Promise(r => setTimeout(r, 1500));
    }},
    { name: '相见页-03-商家详情', action: async (page) => {
      // Click first restaurant card
      const card = await page.$('.bg-white.rounded-2xl');
      if (card) await card.click();
      await new Promise(r => setTimeout(r, 1500));
    }},
    { name: '相见页-04-套餐选择', action: async (page) => {
      // Already in detail page, just wait a bit
      await new Promise(r => setTimeout(r, 500));
    }},
    { name: '相见页-05-支付页', action: async (page) => {
      // Click "立即预订"
      const btn = await findByText(page, 'button', '立即预订');
      if (btn) await btn.click();
      await new Promise(r => setTimeout(r, 2000)); // Wait for payment modal
    }},
    { name: '相见页-06-支付完成引导', action: async (page) => {
      // Wait for payment success simulation (2.5s in code)
      await new Promise(r => setTimeout(r, 3000));
    }},
    { name: '相见页-07-订单详情', action: async (page) => {
      // Click "查看订单"
      const btn = await findByText(page, 'button', '查看订单');
      if (btn) await btn.click();
      await new Promise(r => setTimeout(r, 1000));
    }}
  ],
  '偶遇链路': [
    { name: '偶遇页-01-地图首页', action: async (page) => {
      await page.goto(BASE_URL);
      // Click "偶遇" tab
      const tab = await findByText(page, 'button span', '偶遇');
      if (tab) await tab.evaluate(b => b.closest('button').click());
      await new Promise(r => setTimeout(r, 2000));
    }},
    { name: '偶遇页-02-筛选弹窗', action: async (page) => {
      // Click filter button (icon filter)
      await page.evaluate(() => {
        const icons = Array.from(document.querySelectorAll('svg'));
        const filterIcon = icons.find(i => i.classList.contains('lucide-filter'));
        if (filterIcon) filterIcon.closest('button').click();
      });
      await new Promise(r => setTimeout(r, 1000));
    }}
  ],
  '好友链路': [
    { name: '好友页-01-列表模式', action: async (page) => {
      await page.goto(BASE_URL);
      // Click "好友" tab
      const tab = await findByText(page, 'button span', '好友');
      if (tab) await tab.evaluate(b => b.closest('button').click());
      await new Promise(r => setTimeout(r, 1000));
      
      // Click list toggle button (icon users)
      await page.evaluate(() => {
        const icons = Array.from(document.querySelectorAll('svg'));
        const usersIcon = icons.find(i => i.classList.contains('lucide-users'));
        if (usersIcon) usersIcon.closest('button').click();
      });
      await new Promise(r => setTimeout(r, 1000));
    }}
  ],
  '动态链路': [
    { name: '动态页-01-动态流', action: async (page) => {
      await page.goto(BASE_URL);
      // Click "动态" tab
      const tab = await findByText(page, 'button span', '动态');
      if (tab) await tab.evaluate(b => b.closest('button').click());
      await new Promise(r => setTimeout(r, 1000));
    }},
    { name: '动态页-02-发布动态', action: async (page) => {
      // Click plus button
      await page.evaluate(() => {
        const plusBtn = document.querySelector('button.bg-slate-900.rounded-full');
        if (plusBtn) plusBtn.click();
      });
      await new Promise(r => setTimeout(r, 1000));
    }}
  ],
  '消息链路': [
    { name: '消息页-01-消息列表', action: async (page) => {
      await page.goto(BASE_URL);
      // Click "消息" bottom tab
      const tab = await findByText(page, 'span', '消息');
      if (tab) await tab.evaluate(b => b.closest('a, button').click());
      await new Promise(r => setTimeout(r, 1000));
    }}
  ],
  '我的链路': [
    { name: '我的页-01-个人中心', action: async (page) => {
      await page.goto(BASE_URL);
      // Click "我的" bottom tab
      const tab = await findByText(page, 'span', '我的');
      if (tab) await tab.evaluate(b => b.closest('a, button').click());
      await new Promise(r => setTimeout(r, 1000));
    }}
  ]
};

async function run() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true
  });

  try {
    // Create output directories
    if (fs.existsSync(OUTPUT_DIR)) {
      fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    for (const [category, items] of Object.entries(STRUCTURE)) {
      const categoryDir = path.join(OUTPUT_DIR, category);
      if (!fs.existsSync(categoryDir)) fs.mkdirSync(categoryDir);

      console.log(`Processing category: ${category}`);

      // Create a new page for each category to ensure clean state
      const page = await browser.newPage();
      await page.setViewport(VIEWPORT);
      
      for (const item of items) {
        console.log(`  Capturing: ${item.name}`);
        const itemDir = path.join(categoryDir, item.name);
        if (!fs.existsSync(itemDir)) fs.mkdirSync(itemDir);
        
        try {
          await item.action(page);
          await page.screenshot({ path: path.join(itemDir, 'preview.png') });
        } catch (e) {
          console.error(`  Error capturing ${item.name}:`, e);
          // Take error screenshot
          await page.screenshot({ path: path.join(itemDir, 'error.png') });
        }
      }
      await page.close();
    }

    console.log('All screenshots captured successfully.');
  } catch (error) {
    console.error('Global error:', error);
  } finally {
    await browser.close();
  }
}

run();
