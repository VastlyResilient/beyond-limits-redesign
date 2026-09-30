// PLAYWRIGHT_MODULE may point to an existing Playwright installation.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const base=process.env.SITE_URL||'http://127.0.0.1:4194/';
(async()=>{
 const browser=await chromium.launch();
 try{
 for(const width of [390,1440])for(const reducedMotion of ['no-preference','reduce']){
  const page=await browser.newPage({viewport:{width,height:844},reducedMotion});
  await page.goto(base);
  if(reducedMotion==='reduce'){
   assert.equal(await page.locator('.hero-track.reduced').count(),1);
   assert.equal(await page.locator('.scroll-cue').count(),0);
   const url=new URL(base);url.searchParams.set('motion','full');await page.goto(url.href);
   await page.reload(); // Explicit choice must survive a return visit without the query.
  }
  assert.equal(await page.locator('.hero-track.reduced').count(),0);
  for(const progress of [0,.35,1,.55,0]){
   const expected=Math.round(progress*242);
   await page.evaluate(p=>{const h=document.querySelector('.hero-track');scrollTo({top:h.offsetTop+p*(h.offsetHeight-innerHeight),behavior:'instant'})},progress);
   await page.waitForFunction(n=>Math.abs(Number(document.querySelector('canvas').dataset.frame)-n)<=1,expected,{timeout:20000});
   assert.equal(await page.locator('.scroll-cue').count(),progress===0?1:0);
  }
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
