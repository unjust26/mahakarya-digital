import { chromium } from "playwright";

const APP_URL = process.env.APP_URL || "http://localhost:4173";

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log("🧪 Testing MahaKarya Digital landing page...");

  // Load homepage
  await page.goto(APP_URL, { waitUntil: "networkidle" });

  // Hero section
  const heroTitle = await page.locator("text=Your Website,").isVisible();
  if (!heroTitle) throw new Error("Hero title not found");
  console.log("✅ Hero section visible");

  // Check nav items
  for (const label of ["Services", "Process", "Portfolio", "Pricing", "FAQ"]) {
    const nav = await page.locator(`button:text("${label}")`).first().isVisible();
    if (!nav) throw new Error(`Nav item "${label}" not found`);
  }
  console.log("✅ Navigation items present");

  // Check CTA button
  const cta = await page.locator("text=Start Your Project").isVisible();
  if (!cta) throw new Error("CTA button not found");
  console.log("✅ CTA button visible");

  // Check services section
  await page.locator("#services").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const services = await page.locator("text=Everything Your Business Needs Online").isVisible();
  if (!services) throw new Error("Services section not found");
  console.log("✅ Services section visible");

  // Check service cards
  for (const svc of ["Landing Pages", "Business Websites", "E-Commerce", "Web Applications"]) {
    const card = await page.locator(`text=${svc}`).first().isVisible();
    if (!card) throw new Error(`Service "${svc}" not found`);
  }
  console.log("✅ All service cards present");

  // Check process section
  await page.locator("#process").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const process = await page.locator("text=From Idea to Launch in 4 Steps").isVisible();
  if (!process) throw new Error("Process section not found");
  console.log("✅ Process section visible");

  // Check portfolio
  await page.locator("#portfolio").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const portfolio = await page.locator("text=Projects We've Built").isVisible();
  if (!portfolio) throw new Error("Portfolio section not found");
  const halalcalc = await page.locator("text=HalalCalc").isVisible();
  if (!halalcalc) throw new Error("HalalCalc portfolio item not found");
  console.log("✅ Portfolio section with projects visible");

  // Check pricing
  await page.locator("#pricing").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const pricing = await page.locator("text=Transparent, Honest Pricing").isVisible();
  if (!pricing) throw new Error("Pricing section not found");
  for (const plan of ["Starter", "Premium", "Enterprise"]) {
    const planCard = await page.locator(`h3:text-is("${plan}")`).isVisible();
    if (!planCard) throw new Error(`Pricing plan "${plan}" not found`);
  }
  // Business plan has "Most Popular" badge
  const businessPlan = await page.locator('text=Most Popular').isVisible();
  if (!businessPlan) throw new Error("Business plan (Most Popular) not found");
  console.log("✅ Pricing section with all plans visible");

  // Check payment info
  const bibd = await page.locator("text=00017020010553").isVisible();
  const baiduri = await page.locator("text=0200740732166").isVisible();
  if (!bibd || !baiduri) throw new Error("Bank details not found");
  console.log("✅ Payment details visible");

  // Check FAQ section
  await page.locator("#faq").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const faq = await page.locator("text=Questions? We've Got Answers").isVisible();
  if (!faq) throw new Error("FAQ section not found");

  // Test FAQ accordion
  await page.locator("text=How does AI-powered web development work?").click();
  await page.waitForTimeout(300);
  const faqAnswer = await page.locator("text=Our AI handles the heavy lifting").isVisible();
  if (!faqAnswer) throw new Error("FAQ accordion not working");
  console.log("✅ FAQ section with working accordion");

  // Check WhatsApp links
  const waLinks = await page.locator('a[href*="wa.me/6737280573"]').count();
  if (waLinks < 3) throw new Error(`Expected at least 3 WhatsApp links, found ${waLinks}`);
  console.log(`✅ ${waLinks} WhatsApp links found`);

  // Check footer
  const footer = await page.locator("text=© 2026 MahaKarya Digital").isVisible();
  if (!footer) throw new Error("Footer not found");
  const phone = await page.locator("text=+673 728 0573").isVisible();
  if (!phone) throw new Error("Phone number not in footer");
  console.log("✅ Footer with contact info visible");

  console.log("\n🎉 All tests passed!");

  await browser.close();
}

run().catch((err) => {
  console.error("❌ Test failed:", err.message);
  process.exit(1);
});
