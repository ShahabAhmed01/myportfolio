const GITHUB_USERNAME = 'ShahabAhmed01';
const EXCLUDE_REPOS = new Set(['ShahabAhmed01.github.io','ShahabAhmed01']);
const LANG_COLORS = {
  'C++':        { bg:'rgba(243,75,125,.15)',  text:'#f34b7d' },
  'Python':     { bg:'rgba(53,114,165,.15)',  text:'#4ea8e4' },
  'JavaScript': { bg:'rgba(241,224,90,.15)',  text:'#f1e05a' },
  'HTML':       { bg:'rgba(227,76,38,.15)',   text:'#e34c26' },
  'CSS':        { bg:'rgba(86,61,124,.15)',   text:'#a97de8' },
  'TypeScript': { bg:'rgba(49,120,198,.15)',  text:'#3178c6' },
  'Java':       { bg:'rgba(176,114,25,.15)',  text:'#c89e5a' },
  'default':    { bg:'rgba(100,100,255,.12)', text:'#a0a8ff' },
};
function langStyle(l){return LANG_COLORS[l]||LANG_COLORS.default;}

async function fetchGitHub(){
  try{
    const[uR,rR]=await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`),
    ]);
    if(!uR.ok||!rR.ok)throw new Error('API fail');
    const user=await uR.json(), repos=await rR.json();
    const el=document.getElementById('stat-repos');
    if(el){el.dataset.target=user.public_repos;animateCounter(el,user.public_repos);}
    const filtered=repos.filter(r=>!EXCLUDE_REPOS.has(r.name)&&!r.fork)
      .sort((a,b)=>new Date(b.pushed_at)-new Date(a.pushed_at));
    renderProjects(filtered);
  }catch(e){console.warn('GitHub fetch failed',e);renderProjectsFallback();}
}

function renderProjects(repos){
  const grid=document.getElementById('projects-grid');
  if(!grid)return;
  if(!repos.length){grid.innerHTML='<p class="no-projects">No public projects found.</p>';return;}
  grid.innerHTML=repos.map(repo=>{
    const lang=repo.language||'Code';
    const{bg,text}=langStyle(lang);
    const desc=repo.description?(repo.description.slice(0,120)+(repo.description.length>120?'…':'')):' No description provided.';
    const topics=(repo.topics||[]).slice(0,3).map(t=>`<span class="project-tag" style="background:rgba(99,102,241,.15);color:#818cf8">${t}</span>`).join('');
    const stars=repo.stargazers_count>0?`<span class="project-meta-item">⭐ ${repo.stargazers_count}</span>`:'';
    const forks=repo.forks_count>0?`<span class="project-meta-item">🍴 ${repo.forks_count}</span>`:'';
    return`<div class="project-card reveal-item" data-delay="${(Math.random()*.3).toFixed(2)}">
      <div class="project-header">
        <div class="project-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div>
        <div class="project-meta">${stars}${forks}</div>
      </div>
      <h3 class="project-title">${repo.name.replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</h3>
      <p class="project-desc">${desc}</p>
      <div class="project-tags"><span class="project-tag" style="background:${bg};color:${text}">${lang}</span>${topics}</div>
      <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-link">View on GitHub
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a></div>`;
  }).join('');
  observeReveal();
}

function renderProjectsFallback(){
  const grid=document.getElementById('projects-grid');
  if(grid)grid.innerHTML=`<div class="projects-error"><p>Could not load projects.</p><a href="https://github.com/${GITHUB_USERNAME}" target="_blank" class="btn">View GitHub →</a></div>`;
}

function animateCounter(el,target,duration=1800){
  const start=performance.now(),from=parseInt(el.textContent)||0;
  (function step(now){
    const p=Math.min((now-start)/duration,1),ease=1-Math.pow(1-p,3);
    el.textContent=Math.round(from+(target-from)*ease);
    if(p<1)requestAnimationFrame(step);
  })(performance.now());
}

function initTyping(){
  const el=document.getElementById('typing-text');
  if(!el)return;
  const phrases=el.dataset.phrases?JSON.parse(el.dataset.phrases):['Software Engineer','CS Student at UMT','Problem Solver','Open Source Enthusiast'];
  let pi=0,ci=0,del=false;
  function tick(){
    const ph=phrases[pi];
    if(del){el.textContent=ph.slice(0,--ci);if(ci===0){del=false;pi=(pi+1)%phrases.length;}setTimeout(tick,60);}
    else{el.textContent=ph.slice(0,++ci);if(ci===ph.length){del=true;setTimeout(tick,2000);}else setTimeout(tick,110);}
  }
  tick();
}

function observeReveal(){
  const items=document.querySelectorAll('.reveal-item:not(.revealed), .reveal-up:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed), .reveal-down:not(.revealed)');
  if(!items.length)return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        setTimeout(()=>e.target.classList.add('revealed'),parseFloat(e.target.dataset.delay||0)*1000);
        obs.unobserve(e.target);
      }
    });
  },{threshold:.12});
  items.forEach(el=>obs.observe(el));
}

function initNav(){
  const links=document.querySelectorAll('.nav-link');
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));});
  },{rootMargin:'-40% 0px -55% 0px'});
  document.querySelectorAll('section[id]').forEach(s=>obs.observe(s));
  const toggle=document.getElementById('menu-toggle'),menu=document.getElementById('nav-menu');
  if(toggle&&menu){
    toggle.addEventListener('click',()=>{menu.classList.toggle('open');toggle.setAttribute('aria-expanded',menu.classList.contains('open'));});
    links.forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));
  }
  const header=document.querySelector('header');
  if(header)window.addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>20),{passive:true});
}

function initParticles(){
  const canvas=document.getElementById('particles');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const COUNT=window.matchMedia('(prefers-reduced-motion:reduce)').matches?0:55;
  let W,H,pts;
  function resize(){W=canvas.width=innerWidth;H=canvas.height=innerHeight;}
  function mk(){return{x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5+.5,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,a:Math.random()*.5+.1};}
  function init(){pts=Array.from({length:COUNT},mk);}
  function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(139,92,246,${p.a})`;ctx.fill();
      p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
    });
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<110){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(139,92,246,${.15*(1-d/110)})`;ctx.lineWidth=.5;ctx.stroke();}
    }
    requestAnimationFrame(draw);
  }
  resize();init();draw();
  window.addEventListener('resize',()=>{resize();init();},{passive:true});
}

function initCursor(){
  if(window.matchMedia('(pointer:coarse)').matches)return;
  const dot=document.getElementById('cursor-dot'),ring=document.getElementById('cursor-ring');
  if(!dot||!ring)return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;},{passive:true});
  document.querySelectorAll('a,button,[role="button"]').forEach(el=>{
    el.addEventListener('mouseenter',()=>ring.classList.add('hover'));
    el.addEventListener('mouseleave',()=>ring.classList.remove('hover'));
  });
  (function loop(){dot.style.transform=`translate(${mx}px,${my}px)`;rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(loop);})();
}

function initSmoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}});
  });
}

function initParallax(){
  const img=document.querySelector('.profile-img-container');
  if(img)window.addEventListener('scroll',()=>{img.style.transform=`translateY(${scrollY*.08}px)`;},{passive:true});
}

document.addEventListener('DOMContentLoaded',()=>{
  initParticles();initTyping();initNav();initSmoothScroll();initParallax();initCursor();observeReveal();fetchGitHub();
});
