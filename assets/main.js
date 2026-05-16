(function(){
  const track = document.getElementById('rl-track');
  const dotsEl = document.getElementById('rl-dots');
  const prevBtn = document.getElementById('rl-prev');
  const nextBtn = document.getElementById('rl-next');
  const cards = Array.from(track.querySelectorAll('.rl-card'));
  let current = 0;

  function visibleCount(){
    return window.innerWidth <= 768 ? 1 : 2;
  }

  function maxIndex(){
    return Math.max(0, cards.length - visibleCount());
  }

  function buildDots(){
    dotsEl.innerHTML = '';
    const total = maxIndex() + 1;
    for(let i=0;i<total;i++){
      const d = document.createElement('span');
      d.className = 'c-dot' + (i===current?' active':'');
      d.addEventListener('click',()=>goTo(i));
      dotsEl.appendChild(d);
    }
  }

  function updateButtons(){
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= maxIndex();
  }

  function getCardWidth(){
    const card = cards[0];
    const style = getComputedStyle(track);
    const gap = parseFloat(style.gap) || 14;
    return card.offsetWidth + gap;
  }

  function goTo(n){
    current = Math.max(0, Math.min(n, maxIndex()));
    track.style.transform = `translateX(-${current * getCardWidth()}px)`;
    Array.from(dotsEl.children).forEach((d,i)=>d.classList.toggle('active',i===current));
    updateButtons();
  }

  prevBtn.addEventListener('click',()=>goTo(current-1));
  nextBtn.addEventListener('click',()=>goTo(current+1));

  let startX=0,isDragging=false;
  track.addEventListener('mousedown',e=>{startX=e.clientX;isDragging=true;});
  track.addEventListener('mousemove',e=>{if(!isDragging)return;});
  track.addEventListener('mouseup',e=>{
    if(!isDragging)return;isDragging=false;
    const dx=e.clientX-startX;
    if(dx<-40)goTo(current+1);
    else if(dx>40)goTo(current-1);
  });
  track.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;},{passive:true});
  track.addEventListener('touchend',e=>{
    const dx=e.changedTouches[0].clientX-startX;
    if(dx<-40)goTo(current+1);
    else if(dx>40)goTo(current-1);
  });

  window.addEventListener('resize',()=>{goTo(Math.min(current,maxIndex()));buildDots();});
  buildDots();
  updateButtons();
})();

(function(){
  const grid = document.getElementById('gh-grid');
  if(!grid) return;
  // Seeded contribution pattern — looks realistic
  const pat = [0,0,1,0,2,1,0,3,1,2,4,2,1,0,0,1,3,2,4,1,0,2,0,1,2,3,1,0,4,2,1,3,0,2,1,0,3,4,1,2,0,1,3,2,0,1,4,2,1,0,3,1,2];
  for(let w=0;w<52;w++){
    const wk=document.createElement('div');wk.className='gh-week';
    for(let d=0;d<7;d++){
      const day=document.createElement('div');
      const l=pat[(w*7+d)%pat.length];
      day.className='gh-day'+(l?` l${l}`:'');
      wk.appendChild(day);
    }
    grid.appendChild(wk);
  }
})();
/* ══ FLOATING SECTION NAV ══ */
(function(){
  const fnav = document.getElementById('fnav');
  const skillsSection = document.getElementById('section-skills');
  if(!fnav || !skillsSection) return;

  const sectionIds = [
    'section-skills','section-experience','section-education',
    'section-projects','section-research','section-contact'
  ];
  const btns = fnav.querySelectorAll('.fnav-btn[data-section]');

  // Cache the trigger offset after layout is stable
  let _triggerY = null;
  function triggerY(){
    if(_triggerY === null){
      _triggerY = skillsSection.getBoundingClientRect().bottom + window.scrollY - 80;
    }
    return _triggerY;
  }
  // Recalculate on resize (orientation change on mobile)
  window.addEventListener('resize', function(){ _triggerY = null; }, {passive:true});

  function updateNav(){
    const sy = window.scrollY || window.pageYOffset || 0;
    if(sy > triggerY()){
      fnav.classList.add('visible');
    } else {
      fnav.classList.remove('visible');
    }

    // active section highlight
    let active = null;
    for(const id of sectionIds){
      const el = document.getElementById(id);
      if(el && el.getBoundingClientRect().top <= 130) active = id;
    }
    btns.forEach(b => b.classList.toggle('active', b.dataset.section === active));
  }

  // smooth scroll — use scrollIntoView with fallback for older mobile browsers
  btns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const t = document.getElementById(btn.dataset.section);
      if(!t) return;
      try {
        t.scrollIntoView({behavior:'smooth', block:'start'});
      } catch(_){
        // fallback for old browsers
        t.scrollIntoView(true);
      }
    });
  });

  window.addEventListener('scroll', updateNav, {passive:true});
  // Run once after page fully loads to get correct layout
  window.addEventListener('load', function(){ _triggerY = null; updateNav(); });
  updateNav();
})();

/* ══ PROJECT BANNER IMAGE LOADER ══ */
(function(){
  // For each banner image div, test-load the image.
  // If it loads successfully → add .loaded to reveal it over the gradient bg.
  // If it fails (404 / not set) → gradient background stays, no broken image shown.
  document.querySelectorAll('.pj-banner-img').forEach(function(el){
    const url = el.style.backgroundImage.replace(/^url\(['"]?|['"]?\)$/g,'');
    if(!url) return;
    const img = new Image();
    img.onload = function(){ el.classList.add('loaded'); };
    img.src = url;
  });
})();
