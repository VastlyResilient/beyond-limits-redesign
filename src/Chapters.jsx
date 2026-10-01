import React,{useEffect,useRef,useState} from 'react';
import {CirclePlus,CircleMinus,ChevronDown} from 'lucide-react';

const D=import.meta.env.BASE_URL+'documents/';
const M=import.meta.env.BASE_URL+'media/';
const chapters=[['program','Program'],['tutoring','Learning'],['community','Community'],['join','Get involved'],['resources','Resources']];

export function ChapterNav(){
  const [active,setActive]=useState('program'),[visible,setVisible]=useState(false),[open,setOpen]=useState(false);
  const navRef=useRef();
  useEffect(()=>{
    let raf;
    const update=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{
      const start=document.getElementById('program'),footer=document.querySelector('footer');
      if(!start||!footer)return;
      const shown=start.getBoundingClientRect().top<180&&footer.getBoundingClientRect().top>innerHeight*.5;
      setVisible(shown);
      if(!shown)setOpen(false);
      let current='program';
      for(const [id] of chapters){const target=document.getElementById(id);if(target&&target.getBoundingClientRect().top<innerHeight*.42)current=id}
      setActive(current);
    })};
    update();addEventListener('scroll',update,{passive:true});addEventListener('resize',update);
    return()=>{cancelAnimationFrame(raf);removeEventListener('scroll',update);removeEventListener('resize',update)};
  },[]);
  useEffect(()=>{if(!open)return;const onKey=e=>{if(e.key==='Escape')setOpen(false)},close=()=>setOpen(false),onPointer=e=>{if(!navRef.current?.contains(e.target))setOpen(false)};addEventListener('keydown',onKey);addEventListener('scroll',close,{passive:true});addEventListener('hashchange',close);addEventListener('pointerdown',onPointer);return()=>{removeEventListener('keydown',onKey);removeEventListener('scroll',close);removeEventListener('hashchange',close);removeEventListener('pointerdown',onPointer)}},[open]);
  const index=chapters.findIndex(c=>c[0]===active);
  const choose=()=>setOpen(false);
  return <nav ref={navRef} className={'reading-nav '+(visible?'visible ':'')+(open?'is-open':'')} aria-label="Page chapters" inert={!visible?true:undefined}>
    <button className="reading-toggle" aria-expanded={open} aria-controls="reading-links" onClick={()=>setOpen(!open)}><span className="reading-current"><small>0{index+1}</small>{chapters[index][1]}</span><ChevronDown className="reading-chevron" aria-hidden="true"/></button>
    <div id="reading-links" className={open?'expanded':''}>{chapters.map(([id,label],i)=><a key={id} href={'#'+id} aria-current={active===id?'location':undefined} onClick={choose}><small>0{i+1}</small>{label}</a>)}</div>
  </nav>;
}

export function FirstSteps(){
  const ref=useRef(),[step,setStep]=useState(-1);
  useEffect(()=>{
    let raf;
    const update=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{
      if(!ref.current)return;
      const items=[...ref.current.querySelectorAll('[data-step]')],group=ref.current.querySelector('.steps-path');
      let next=-1;
      if(matchMedia('(max-width:700px)').matches){items.forEach((item,i)=>{if(item.getBoundingClientRect().top<innerHeight*.76)next=i})}
      else{const top=group.getBoundingClientRect().top;[.78,.57,.36].forEach((threshold,i)=>{if(top<innerHeight*threshold)next=i})}
      setStep(next);
    })};
    update();addEventListener('scroll',update,{passive:true});addEventListener('resize',update);
    return()=>{cancelAnimationFrame(raf);removeEventListener('scroll',update);removeEventListener('resize',update)};
  },[]);
  return <section className="first-steps" ref={ref} aria-labelledby="first-steps-title"><div className="section-head reveal"><p className="eyebrow">YOUR FIRST THREE STEPS</p><h2 id="first-steps-title">A conversation.<br/>A plan. A beginning.</h2></div><div className="steps-path" style={{'--path':(step+1)/3}}>{[['Share your needs','Tell the team about your learner’s goals and the subjects where support would help.'],['Discuss your learning plan','Ask about fit, fees, available times and whether in-person or remote sessions work best.'],['Begin your sessions','Complete the participant agreement and confirm arrangements with the team.']].map(([title,copy],i)=><article key={title} data-step={i} className={step>=i?'active':''}><span className="step-number">0{i+1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div><a className="text-link" href="#join">Start with the team ↗</a></section>;
}

export function LearningCards(){return <div className="learning-cards">{[['01','Tutoring','Support for the subject. Space for the question.','Individualized math and science tutoring, generally for grades 4–10, with in-person and remote options.','tutoring'],['02','Mentoring','A little guidance from someone a step ahead.','Working with high school and college tutors creates opportunities for informal encouragement and perspective.','enrichment'],['03','Enrichment','Room to explore beyond the homework.','Workshops and summer opportunities extend learning into coding, writing, study skills and more.','enrichment']].map(([n,title,short,copy,id])=><LearningCard key={title} n={n} title={title} short={short} copy={copy} id={id}/>)}</div>}
function LearningCard({n,title,short,copy,id}){const ref=useRef(),[open,setOpen]=useState(false),[seen,setSeen]=useState(false),panelId='learning-card-'+n;useEffect(()=>{const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){setSeen(true);observer.disconnect()}},{threshold:.12});observer.observe(ref.current);return()=>observer.disconnect()},[]);return <article ref={ref} className={'learning-card '+(seen?'seen ':'')+(open?'open':'')}><button className="learning-card-trigger" aria-expanded={open} aria-controls={panelId} onClick={()=>setOpen(!open)}><span className="eyebrow">{n} / A WAY FORWARD</span><h3>{title}</h3><p>{short}</p><span className="learning-card-action">{open?'Close details':'Read more'}<ChevronDown aria-hidden="true"/></span></button><div id={panelId} className="learning-card-reveal" inert={!open?true:undefined}><div className="learning-card-inner"><div className="learning-card-detail"><p>{copy}</p><a className="text-link" href={'#'+id}>Explore {title.toLowerCase()} ↗</a></div></div></div></article>}

const resources=[
  ['For families',[
    ['District flyer','district-flyer.pdf','Published tutoring details, fees and eligibility guidance.'],
    ['Participant agreement','participant-agreement.pdf','The agreement to review when getting started.'],
    ['Summer 2025 flyer · English (archive)','summer-2025-english.pdf','Past summer program information in English.'],
    ['Summer 2025 flyer · Español (archive)','summer-2025-spanish.pdf','Past summer program information in Spanish.']
  ]],
  ['For tutors', [['Tutor recruitment & application','tutor-recruitment.pdf','Published information for prospective high school and college tutors.']]],
  ['News & program information',[
    ['Articles informing our work','program-flyer.pdf','Selected reading and context behind the program.'],
    ['Program highlights','program-highlights.pdf','An overview of activities and partnerships.'],
    ['Beyond Limits presentation','program-presentation.pdf','A presentation introducing the program.']
  ]],
  ['Support the program', [['Sponsorship kit · 2025–2026','sponsorship-2025-2026.pdf','Ways for local partners to support academic opportunity.']]]
];

export function ResourceLibrary(){
  const [selected,setSelected]=useState(resources[0][1][0]),[openGroups,setOpenGroups]=useState([0]);
  return <div className="resource-desk"><div className="resource-library" aria-label="Program documents">{resources.map(([title,links],i)=>{const open=openGroups.includes(i),panelId='resource-group-'+i;return <section className={'resource-group '+(open?'open':'')} key={title}><button className="resource-group-toggle" aria-expanded={open} aria-controls={panelId} onClick={()=>setOpenGroups(previous=>open?previous.filter(group=>group!==i):[...previous,i])}><span>{title}</span><small>{links.length} {links.length===1?'document':'documents'}</small>{open?<CircleMinus className="resource-group-mark" aria-hidden="true"/>:<CirclePlus className="resource-group-mark" aria-hidden="true"/>}</button><div id={panelId} className="resource-group-reveal" inert={!open?true:undefined}><div>{links.map(item=><div className={'resource-row '+(selected[1]===item[1]?'selected':'')} key={item[1]}><button type="button" onClick={()=>setSelected(item)} aria-pressed={selected[1]===item[1]} aria-label={'Preview '+item[0]}>{item[0]}</button><a className="resource-desktop-link" href={D+item[1]} aria-label={'Open '+item[0]+' PDF'}>PDF ↗</a><a className="resource-mobile-link" href={D+item[1]}>{item[0]} <span>PDF ↗</span></a></div>)}</div></div></section>})}</div><aside className="resource-preview" aria-live="polite" aria-label="Selected document"><div className="preview-paper" key={selected[1]}><img src={M+'document-previews/'+selected[1].replace('.pdf','.jpg')} alt={'First page of '+selected[0]} loading="lazy"/></div><div className="preview-meta" key={selected[1]+"-meta"}><span className="eyebrow">FROM THE BEYOND LIMITS LIBRARY</span><h3>{selected[0]}</h3><p>{selected[2]}</p><span className="preview-type">PDF DOCUMENT</span><a className="text-link" href={D+selected[1]}>Open document ↗</a></div></aside></div>;
}

export function ClosingChoices(){return <section className="section closing-choices"><div className="section-head reveal"><p className="eyebrow">THE NEXT CHAPTER IS YOURS</p><h2>Choose your way forward.</h2></div><div className="closing-choices-grid" data-stagger-group>{[['Find support','A conversation about your learner’s next step.','join'],['Become a tutor','Share your knowledge. Support someone’s confidence.','become-tutor'],['Support a learner','Help make academic opportunity more accessible.','support']].map(([title,copy,id],i)=><a className="scroll-stage" data-stage={i} key={id} href={'#'+id}><small>0{i+1}</small><h3>{title}</h3><p>{copy}</p><span aria-hidden="true">↗</span></a>)}</div></section>}
