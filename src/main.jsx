import React from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';

const M='/media/';
const Arrow=()=> <span aria-hidden="true">↗</span>;
const Mark=({light=false})=><div className={'mark '+(light?'mark-light':'')}><span className="book"><i/><i/><i/></span><span><b>BEYOND LIMITS</b><small>ACADEMICS</small></span></div>;

function OptionOne(){return <main className="one">
  <header><Mark light/><nav><a href="#program">Program</a><a href="#stories">Student stories</a><a href="#support">Support</a></nav><button className="menu">Menu <i/></button></header>
  <section className="one-hero">
    <img className="one-photo" src={M+'Tutoring_H_large.jpg'} alt="Beyond Limits students receiving tutoring"/>
    <div className="one-wash"/>
    <div className="one-kicker"><span>Stamford, Connecticut</span><span>Peer-to-peer tutoring • Grades 4–10</span></div>
    <h1>Potential<br/><em>doesn’t have</em><br/>a limit.</h1>
    <div className="one-copy"><p>Highly subsidized one-to-one tutoring, mentoring, and enrichment that gives every learner room to move forward.</p><div className="actions"><a href="#participate">Find academic support <Arrow/></a><a className="ghost" href="#tutor">Become a tutor</a></div></div>
    <div className="one-rail"><span>01</span><b>Confidence begins when a difficult idea finally clicks.</b><span className="line"/><span>Scroll to follow the learning journey</span></div>
  </section>
</main>}

function OptionTwo(){return <main className="two">
  <header><Mark/><nav><a href="#program">Our program</a><a href="#impact">Impact</a><a href="#join">Get involved</a></nav><a className="donate" href="#donate">Invest in a learner <Arrow/></a></header>
  <section className="two-hero">
    <div className="two-intro"><span>Beyond Limits Academic Program</span><p>One student. One tutor. One breakthrough at a time.</p></div>
    <div className="orbit orbit-a"/><div className="orbit orbit-b"/>
    <div className="portrait-stack">
      <div className="portrait p-left"><img src={M+'MSSSP_3_H_large.JPG'} alt="Students working together at computers"/></div>
      <div className="portrait p-main"><img src={M+'Tutoring_V_large.jpg'} alt="A Beyond Limits tutoring session"/><span>Room to ask.<br/>Time to understand.</span></div>
      <div className="portrait p-right"><img src={M+'Rocket_large.JPG'} alt="Beyond Limits summer program students"/></div>
    </div>
    <h1>Learning,<br/><em>within reach.</em></h1>
    <div className="two-bottom"><div><b>04–10</b><span>Student grades served</span></div><div><b>1:1</b><span>Personalized tutoring</span></div><a href="#participate">Explore the program <Arrow/></a></div>
  </section>
</main>}

function OptionThree(){return <main className="three">
  <header><Mark light/><nav><a href="#learn">Learn</a><a href="#mentor">Mentor</a><a href="#give">Give</a></nav><button aria-label="Open menu" className="round-menu"><i/><i/></button></header>
  <section className="three-hero">
    <div className="three-copy"><span className="eyebrow">ACADEMIC SUPPORT · LOWER FAIRFIELD COUNTY</span><h1>Make room<br/>for the <em>next</em><br/>possibility.</h1><p>Affordable peer-to-peer tutoring in math and science, strengthened by mentoring and enrichment beyond the classroom.</p><a href="#start">Start here <Arrow/></a></div>
    <div className="film-window"><img src={M+'Everyone_2_b_large.JPG'} alt="Beyond Limits summer program community"/><div className="film-label"><span>THE PEOPLE BEHIND THE PROGRESS</span><b>Every learner belongs in the picture.</b></div></div>
    <div className="three-note"><span>01 / 03</span><p>Equity through access</p><i/></div>
    <div className="three-ticker"><span>ONE-TO-ONE TUTORING</span><i>✦</i><span>INFORMAL MENTORING</span><i>✦</i><span>ENRICHMENT</span><i>✦</i><span>COMMUNITY</span></div>
  </section>
</main>}

function App(){const n=new URLSearchParams(location.search).get('direction')||'1';return n==='2'?<OptionTwo/>:n==='3'?<OptionThree/>:<OptionOne/>}

createRoot(document.getElementById('root')).render(<App/>);
