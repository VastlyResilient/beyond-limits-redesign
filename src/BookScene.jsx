import React,{useEffect,useRef} from 'react';
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
export default function BookScene({progress,reduced}){
 const ref=useRef(),state=useRef({progress:0});state.current.progress=reduced?0:progress;
 useEffect(()=>{
  const canvas=ref.current,ctx=canvas.getContext('2d'),img=new Image();let stopped=false,raf,previous=-1,w=0,h=0;
  const paper=document.createElement('canvas');paper.width=1200;paper.height=1500;const pc=paper.getContext('2d');
  let g=pc.createLinearGradient(0,0,1200,1500);g.addColorStop(0,'#fff8e8');g.addColorStop(.7,'#eee0c5');g.addColorStop(1,'#ceba95');pc.fillStyle=g;pc.fillRect(0,0,1200,1500);
  pc.fillStyle='#233553';pc.font='86px Georgia';pc.textAlign='center';pc.fillText('Every learner',600,450);pc.font='96px Georgia';['deserves a chance','to turn the page.'].forEach((t,i)=>pc.fillText(t,600,590+i*135));pc.font='30px Arial';pc.fillText('BEYOND LIMITS ACADEMICS',600,925);
  pc.strokeStyle='#b89b59';pc.lineWidth=2;pc.beginPath();pc.moveTo(480,830);pc.lineTo(720,830);pc.stroke();
  let face=paper;const back=document.createElement('canvas');back.width=1200;back.height=1500;const bc=back.getContext('2d');bc.fillStyle=g;bc.fillRect(0,0,1200,1500);
  function triangle(a,b,c,sa,sb,sc){
   const d=sa[0]*(sb[1]-sc[1])+sb[0]*(sc[1]-sa[1])+sc[0]*(sa[1]-sb[1]);if(Math.abs(d)<.001)return;
   const m=(axis)=>[(a[axis]*(sb[1]-sc[1])+b[axis]*(sc[1]-sa[1])+c[axis]*(sa[1]-sb[1]))/d,(a[axis]*(sc[0]-sb[0])+b[axis]*(sa[0]-sc[0])+c[axis]*(sb[0]-sa[0]))/d,(a[axis]*(sb[0]*sc[1]-sc[0]*sb[1])+b[axis]*(sc[0]*sa[1]-sa[0]*sc[1])+c[axis]*(sa[0]*sb[1]-sb[0]*sa[1]))/d];
   const x=m(0),y=m(1);const center=[(a[0]+b[0]+c[0])/3,(a[1]+b[1]+c[1])/3];const expand=q=>{const dx=q[0]-center[0],dy=q[1]-center[1],len=Math.hypot(dx,dy)||1;return [q[0]+dx/len*1.15,q[1]+dy/len*1.15]};ctx.save();ctx.beginPath();ctx.moveTo(...expand(a));ctx.lineTo(...expand(b));ctx.lineTo(...expand(c));ctx.closePath();ctx.clip();ctx.transform(x[0],y[0],x[1],y[1],x[2],y[2]);ctx.drawImage(face,0,0);ctx.restore();
  }
  function point(x,t,p){
   const turn=ease((p-.34)/.43),bend=Math.sin(Math.PI*t),sx=1100-26*x,sy=606+148*x;
   const f=turn<.5?ease(turn*2):ease((turn-.5)*2);const midx=sx+52,midy=sy-296;const ox=turn<.5?(914+506*x)*(1-f)+midx*f:midx*(1-f)+(800-350*x)*f;const oy=turn<.5?(174+344*x)*(1-f)+midy*f:midy*(1-f)+(650+185*x)*f;
   return [ox*(1-t)+sx*t+70*bend*(1-x)*(1-turn)*Math.abs(1-2*turn),oy*(1-t)+sy*t-36*bend*Math.sin(Math.PI*turn)*Math.abs(1-2*turn)-turn*90*bend*(.2+.8*x)];
  }
  function draw(){if(stopped)return;raf=requestAnimationFrame(draw);let p=state.current.progress;const r=canvas.getBoundingClientRect();if(previous===p&&w===r.width&&h===r.height)return;previous=p;w=r.width;h=r.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
   if(!img.complete||!img.naturalWidth)return;
   const mobile=w<700;let scale=mobile?Math.max(w/1000,h/1180):Math.max(w/1536,h/1024);const dx=mobile?w*.5-1010*scale:(w-1536*scale)/2,dy=mobile?h*.53-320*scale:(h-1024*scale)/2;
   ctx.save();ctx.translate(dx,dy);ctx.scale(scale,scale);ctx.drawImage(img,0,0,1536,1024);
   face=ease((p-.34)/.43)>.5?back:paper;ctx.beginPath();for(let k=0;k<=30;k++){const q=point(k/30,0,p);k?ctx.lineTo(...q):ctx.moveTo(...q)}for(let k=0;k<=30;k++)ctx.lineTo(...point(1,k/30,p));for(let k=30;k>=0;k--)ctx.lineTo(...point(k/30,1,p));for(let k=30;k>=0;k--)ctx.lineTo(...point(0,k/30,p));ctx.closePath();ctx.fillStyle='#eee0c5';ctx.fill();
   const n=22;for(let j=0;j<n;j++)for(let i=0;i<n;i++){
    const x=i/n,t=j/n,xx=(i+1)/n,tt=(j+1)/n,a=point(x,t,p),b=point(xx,t,p),c=point(xx,tt,p),d=point(x,tt,p);
    triangle(a,b,c,[x*1200,t*1500],[xx*1200,t*1500],[xx*1200,tt*1500]);triangle(a,c,d,[x*1200,t*1500],[xx*1200,tt*1500],[x*1200,tt*1500]);
   }ctx.restore();
  }
  img.onload=()=>{previous=-1};img.src=import.meta.env.BASE_URL+'media/book-base.png';raf=requestAnimationFrame(draw);return()=>{stopped=true;cancelAnimationFrame(raf)};
 },[]);
 return <canvas className="book-scene" ref={ref} role="img" aria-label="An open book in a sunlit sky. Its page reads: Every learner deserves a chance to turn the page. The page turns as you scroll."/>;
}
