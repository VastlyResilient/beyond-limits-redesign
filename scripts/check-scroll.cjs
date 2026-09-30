// PLAYWRIGHT_MODULE may point to an existing Playwright installation.
const playwright=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browserType=playwright[process.env.BROWSER||'chromium'];
const assert=require('node:assert/strict');
const base=process.env.SITE_URL||'http://127.0.0.1:4194/';
(async()=>{
 const browser=await browserType.launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
 try{
 for(const width of [390,1440])for(const reducedMotion of ['no-preference','reduce']){
  const page=await browser.newPage({viewport:{width,height:844},reducedMotion});
  const failed=new Set();await page.route('**/book-film-h3*/*.webp',async route=>{const url=route.request().url();if(process.env.FAULT_TEST&&!failed.has(url)){failed.add(url);return route.abort()}if(process.env.FAULT_TEST)await new Promise(r=>setTimeout(r,120));return route.continue()});
  await page.goto(base);
  assert.equal(await page.getByRole('button',{name:'Turn the pages',exact:true}).count(),0);
  assert.equal(await page.locator('.hero-track.reduced').count(),0);
  for(const progress of [0,.35,1,.55,0]){
   const expected=Math.round(Math.min(progress/.90,1)*242);
   await page.evaluate(p=>{const h=document.querySelector('.hero-track');scrollTo({top:h.offsetTop+p*(h.offsetHeight-h.querySelector('.hero-sticky').offsetHeight),behavior:'instant'})},progress);
   await page.waitForFunction(n=>Math.abs(Number(document.querySelector('canvas').dataset.frame)-n)<=1,expected,{timeout:20000});
   assert.equal(await page.locator('.scroll-cue').count(),progress===0?1:0);
  }
  await page.evaluate(()=>{const h=document.querySelector('.hero-track');scrollTo({top:h.offsetTop+h.offsetHeight-h.querySelector('.hero-sticky').offsetHeight,behavior:'instant'})});
  await page.getByRole('button',{name:'Open navigation'}).click();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('body').evaluate(e=>e.style.overflow),'');
  if(reducedMotion==='reduce'){
   await page.getByRole('button',{name:'Open navigation'}).click();
   await page.getByRole('button',{name:'Use reduced motion'}).click();await page.reload();
   assert.equal(await page.locator('.hero-track.reduced').count(),1);
  }
  console.log('PASS',width,reducedMotion,'forward/reverse, cue, reload, menu');await page.close();
 }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
