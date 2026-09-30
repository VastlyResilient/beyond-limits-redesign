import React,{useEffect,useRef} from 'react';
// Direct frames from the approved H3 film, not a procedural paper approximation.
const COUNT=243;
const path=i=>`${import.meta.env.BASE_URL}media/book-film-h3/frame-${String(i+1).padStart(3,'0')}.webp`;
export default function BookScene({progress,reduced}){
 const canvas=useRef(null),engine=useRef(null);
 const target=reduced?0:Math.round(Math.max(0,Math.min(1,progress))*(COUNT-1));
 useEffect(()=>{
  const el=canvas.current,ctx=el.getContext('2d');let stopped=false,latest=0,shown=-1;
  const cache=new Map();
  function draw(i){
   const img=cache.get(i);if(stopped||!img?.complete||!img.naturalWidth)return;
   const {width:w,height:h}=el.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
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
  function load(i){if(i<0||i>=COUNT||cache.has(i))return;const img=new Image();cache.set(i,img);img.onload=()=>{if(stopped)return;if(i===latest||shown<0)draw(i)};img.src=path(i)}
  function update(i){latest=i;load(i);draw(i);for(let n=1;n<=5;n++){load(i+n);load(i-n)}
   for(const [key,img] of cache){if(Math.abs(key-i)>8&&key!==shown){img.onload=null;cache.delete(key)}}
  }
  const resize=()=>{if(shown>=0)draw(shown)};const observer=new ResizeObserver(resize);observer.observe(el);
  engine.current=update;update(0);return()=>{stopped=true;observer.disconnect();for(const img of cache.values())img.onload=null;cache.clear();engine.current=null};
 },[]);
 useEffect(()=>{engine.current?.(target)},[target]);
 return <canvas className="book-scene" ref={canvas} role="img" aria-label="An open book in warm sunlight. Three pages turn as you scroll."/>;
}
