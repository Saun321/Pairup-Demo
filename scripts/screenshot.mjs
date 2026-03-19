import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'screenshots');
mkdirSync(OUT_DIR, { recursive: true });

const BASE = 'http://localhost:5173';

// Screens to capture: [filename, url, extraActions]
const SCREENS = [
  { name: '01-login',              url: '/login' },
  { name: '02-register',           url: '/register' },
  { name: '03-onboarding-step1',   url: '/onboarding/1' },
  { name: '04-onboarding-step2',   url: '/onboarding/2' },
  { name: '05-onboarding-step3',   url: '/onboarding/3' },
  { name: '06-discover-feed',      url: '/discover' },
  { name: '07-user-profile',       url: '/discover/profile/u1' },
  { name: '08-matches-received',   url: '/matches' },
  { name: '09-partner-list',       url: '/partner' },
  { name: '10-partner-jordan',     url: '/partner/partner1' },
  { name: '11-partner-alex',       url: '/partner/partner2' },
  { name: '12-profile',            url: '/profile' },
  { name: '13-edit-profile',       url: '/profile/edit' },
  { name: '14-settings',           url: '/profile/settings' },
];

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  // Mobile viewport – 430×932 (iPhone 14 Pro Max)
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });

  for (const { name, url } of SCREENS) {
    console.log(`Capturing ${name}…`);
    await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 600)); // let animations settle
    const dest = join(OUT_DIR, `${name}.png`);
    await page.screenshot({ path: dest, fullPage: false });
    console.log(`  → saved ${dest}`);
  }

  // Extra: matches invited tab
  console.log('Capturing 08b-matches-invited…');
  await page.goto(`${BASE}/matches`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));
  // click "Invited & Waiting" tab
  await page.evaluate(() => {
    const tabs = [...document.querySelectorAll('button')];
    const tab = tabs.find(b => b.textContent.includes('Invited'));
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: join(OUT_DIR, '08b-matches-invited.png') });
  console.log('  → saved');

  // Extra: send invite modal
  console.log('Capturing 07b-send-invite-modal…');
  await page.goto(`${BASE}/discover/profile/u1`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const btn = btns.find(b => b.textContent.includes('Send invite'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: join(OUT_DIR, '07b-send-invite-modal.png') });
  console.log('  → saved');

  // Extra: schedule modal step 3 (date/time picker)
  console.log('Capturing 11b-schedule-modal…');
  await page.goto(`${BASE}/partner/partner2`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const btn = btns.find(b => b.textContent.includes('Schedule'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  // step1: pick DSA
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const btn = btns.find(b => b.textContent.trim() === 'DSA');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 200));
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const btn = btns.find(b => b.textContent.trim() === 'Next');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 300));
  // step2: pick Intermediate
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const btn = btns.find(b => b.textContent.trim() === 'Intermediate');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 200));
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const btn = btns.find(b => b.textContent.trim() === 'Next');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: join(OUT_DIR, '11b-schedule-modal-dates.png') });
  console.log('  → saved');

  await browser.close();
  console.log('\nDone! All screenshots saved to /screenshots/');
}

run().catch(err => { console.error(err); process.exit(1); });
