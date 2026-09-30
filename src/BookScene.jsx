import React,{useEffect,useRef} from 'react';
// Direct frames from the approved H3 film, not a procedural paper approximation.
const COUNT=243;
const path=(i,mobile)=>`${import.meta.env.BASE_URL}media/book-film-h3${mobile?'-mobile':''}/frame-${String(i+1).padStart(3,'0')}.webp`;
export default function BookScene({progress,reduced}){
 const canvas=useRef(null),engine=useRef(null);
 const target=reduced?0:Math.round(Math.max(0,Math.min(1,progress))*(COUNT-1));
 useEffect(()=>{
  const el=canvas.current,ctx=el.getContext('2d');let stopped=false,latest=0,shown=-1;
  const cache=new Map(),pending=new Map(),attempts=new Map(),timers=new Set();
  let direction=1,paint=0,queued=-1;
  let bounds=el.getBoundingClientRect();
  const mobile=innerWidth<=480;
  function paintFrame(i){
   const img=cache.get(i);if(stopped||!img?.complete||!img.naturalWidth)return;
   const {width:w,height:h}=bounds,dpr=Math.min(devicePixelRatio||1,2);
   if(el.width!==Math.round(w*dpr)||el.height!==Math.round(h*dpr)){el.width=Math.round(w*dpr);el.height=Math.round(h*dpr)}
   ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#bcd4e5';ctx.fillRect(0,0,w,h);
   if(w<700){
    const scale=Math.max(w/1150,h*.52/1080),x=w*.5-1250*scale,y=h-1080*scale;
    ctx.drawImage(img,x,y,1920*scale,1080*scale);
    const wash=ctx.createLinearGradient(0,y,0,y+140);wash.addColorStop(0,'#bcd4e5');wash.addColorStop(1,'#bcd4e500');ctx.fillStyle=wash;ctx.fillRect(0,0,w,y+140);
   }else{
    const scale=Math.max(w/1920,h/1080);ctx.drawImage(img,(w-1920*scale)/2,(h-1080*scale)/2,1920*scale,1080*scale);
   }
   shown=i;el.dataset.frame=String(i);
  }
  function draw(i){queued=i;if(!paint)paint=requestAnimationFrame(()=>{paint=0;paintFrame(queued)})}
  function candidates(){return [latest,...Array.from({length:18},(_,n)=>latest+(n+1)*direction),...Array.from({length:6},(_,n)=>latest-(n+1)*direction)].filter(i=>i>=0&&i<COUNT)}
  function pump(){
   if(stopped)return;
   for(const i of candidates()){
    if(pending.size>=4)break;
    if(cache.has(i)||pending.has(i)||(attempts.get(i)||0)>=3)continue;
    const img=new Image();pending.set(i,img);attempts.set(i,(attempts.get(i)||0)+1);
    const finish=()=>{img.onload=null;img.onerror=null;pending.delete(i)};
    img.decoding='async';
    img.onload=async()=>{try{await img.decode()}catch{}finish();if(stopped)return;cache.set(i,img);attempts.delete(i);
     // Display the closest ready frame while the exact target is loading.
     const nearest=[...cache.keys()].sort((a,b)=>Math.abs(a-latest)-Math.abs(b-latest))[0];
     if(shown<0||Math.abs(nearest-latest)<Math.abs(shown-latest))draw(nearest);
     for(const key of cache.keys())if(Math.abs(key-latest)>28&&key!==shown)cache.delete(key);
     pump();
    };
    img.onerror=()=>{finish();if(stopped)return;const timer=setTimeout(()=>{timers.delete(timer);pump()},300*(attempts.get(i)||1));timers.add(timer)};
    img.src=path(i,mobile);
   }
  }
  function update(i){direction=i>=latest?1:-1;latest=i;draw(i);pump()}
  const resize=()=>{bounds=el.getBoundingClientRect();if(shown>=0)draw(shown)};
  const recover=()=>{if(document.hidden)return;attempts.clear();update(latest);resize()};
  const observer=new ResizeObserver(resize);observer.observe(el);
  addEventListener('online',recover);addEventListener('pageshow',recover);document.addEventListener('visibilitychange',recover);
  engine.current=update;update(0);return()=>{stopped=true;cancelAnimationFrame(paint);observer.disconnect();removeEventListener('online',recover);removeEventListener('pageshow',recover);document.removeEventListener('visibilitychange',recover);for(const timer of timers)clearTimeout(timer);for(const img of pending.values()){img.onload=null;img.onerror=null}pending.clear();cache.clear();engine.current=null};
 },[]);
 useEffect(()=>{engine.current?.(target)},[target]);
 return <canvas className="book-scene" ref={canvas} role="img" aria-label="An open book in warm sunlight. Three pages turn as you scroll."/>;
}
