(function(){
  const track = document.getElementById('rl-track');
  const dotsEl = document.getElementById('rl-dots');
  const prevBtn = document.getElementById('rl-prev');
  const nextBtn = document.getElementById('rl-next');
  if(!track || !dotsEl || !prevBtn || !nextBtn) return;
  const cards = Array.from(track.querySelectorAll('.rl-card'));
  if(!cards.length) return;
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

(function(){
  var loader = document.getElementById('terminal-loader');
  if(!loader) return;


  var fullText = "r1c0swab11\uD83D\uDC80portfolio:~ $ ";
  var el = document.getElementById('termText');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function finish(){
    setTimeout(function(){ loader.classList.add('loaded'); }, 700);
    loader.addEventListener('transitionend', function(){ loader.classList.add('tl-hidden'); }, {once:true});
  }

  if(reduceMotion){
    el.textContent = fullText;
    finish();
    return;
  }

  var i = 0;
  function type(){
    if(i < fullText.length){
      el.textContent += fullText.charAt(i);
      i++;
      setTimeout(type, 55);
    } else {
      finish();
    }
  }
  type();
})();


/* ═══════════════════════════════════════════════════════════════
   PROJECT TIMELINE
   ═══════════════════════════════════════════════════════════════ */

(function(){

  const stack = document.getElementById('projectStack');
  const nav = document.getElementById('projectNav');

  if (!stack || !nav) return;


  const projects = [

    {
      title: 'Network Troubleshoot Toolkit',

      desc:
        'Windows bat.exe file toolkit that makes network troubleshooting easier with quick-access shortcuts for common diagnostics and repair commands.',

      img: 'assets/img/proj_network_toolkit.svg',

      icon: 'ti-network',

      date: 'TOOLKIT',

      accent: 'var(--cyn)',

      tags: [
        ['GUI/CLI','cyn'],
        ['Diagnose','cyn'],
        ['Networking','cyn']
      ]
    },


    {
      title: '4SCAN Port Scanner',

      desc:
        'Python TCP port scanner — scan open ports on IP addresses and domains. Networking and socket programming.',

      img: 'assets/img/proj_4scan.svg',

      icon: 'ti-radar-2',

      date: 'PYTHON',

      accent: 'var(--grn)',

      tags: [
        ['Python','grn'],
        ['Networking','grn'],
        ['Security','grn']
      ]
    },


    {
      title: 'CyberOps Lab',

      desc:
        'Personal homelab for offensive and defensive security research.',

      img: 'assets/img/image_566c43c9.png',

      icon: 'ti-shield-lock',

      date: 'HOMELAB',

      accent: 'var(--red)',

      tags: [
        ['Security Ops','red'],
        ['Homelab','red'],
        ['Blue Team','red']
      ]
    },


    {
      title: 'SIEM Analysis Lab',

      desc:
        'Elastic SIEM for security event simulation and threat detection.',

      img: 'assets/img/proj_siem.svg',

      icon: 'ti-activity',

      date: 'SIEM',

      accent: 'var(--ylw)',

      tags: [
        ['Elastic SIEM','ylw'],
        ['Threat Detection','ylw']
      ]
    },


    {
      title: 'Network Seg. Lab',

      desc:
        'VLAN segmentation, firewall rules, and traffic monitoring.',

      img: 'assets/img/proj_vlan.svg',

      icon: 'ti-router',

      date: 'NETWORK',

      accent: 'var(--blu)',

      tags: [
        ['pfSense','blu'],
        ['Wireshark','blu']
      ]
    },


    {
      title: 'Do-it App',

      desc:
        'Python CLI to-do list — add, view and remove tasks. File handling and program logic.',

      img: 'assets/img/image_41eea144.png',

      icon: 'ti-terminal-2',

      date: 'PYTHON',

      accent: 'var(--pur)',

      tags: [
        ['Python','pur'],
        ['CLI','pur'],
        ['Productivity','pur']
      ]
    }

  ];


  const info = {

    num:
      document.getElementById('projectNumber'),

    title:
      document.getElementById('projectTitle'),

    desc:
      document.getElementById('projectDesc'),

    tags:
      document.getElementById('projectTags'),

    link:
      document.getElementById('projectLink')

  };


  let active = 0;

  let timer;

  let startX = null;

  let lastInteraction = Date.now();


  function renderStack(){

    stack.innerHTML = '';


    projects.forEach((p, i) => {

      const offset = i - active;


      const card =
        document.createElement('div');


      card.className =
        'proj-card-3d';


      card.setAttribute(
        'aria-hidden',
        i === active ? 'false' : 'true'
      );


      const img =
        document.createElement('img');


      img.src = p.img;

      img.alt = p.title;

      img.loading =
        i === active
          ? 'eager'
          : 'lazy';


      const ico =
        document.createElement('div');


      ico.className =
        'proj-card-icon';


      ico.style.color =
        p.accent;


      ico.innerHTML =
        '<i class="ti ' +
        p.icon +
        '" aria-hidden="true"></i>';


      card.append(img, ico);


      const abs =
        Math.abs(offset);


      if (i === active) {

        card.style.transform =
          'translate3d(0,0,50px) ' +
          'rotateX(0deg) ' +
          'rotateY(0deg) ' +
          'scale(1)';

        card.style.opacity = '1';

        card.style.filter = 'none';

        card.style.zIndex = '30';

      }


      else if (
        offset > 0 &&
        offset <= 3
      ) {

        card.style.transform =
          'translate3d(' +
          (-offset * 30) +
          'px,' +
          (offset * 12) +
          'px,' +
          (-offset * 70) +
          'px) ' +
          'rotateY(' +
          (offset * 3) +
          'deg) ' +
          'scale(' +
          (1 - offset * .045) +
          ')';

        card.style.opacity =
          String(
            Math.max(
              .16,
              1 - offset * .23
            )
          );

        card.style.filter =
          'brightness(.72) saturate(.7)';

        card.style.zIndex =
          String(30 - offset);

      }


      else if (
        offset < 0 &&
        abs <= 2
      ) {

        card.style.transform =
          'translate3d(' +
          (abs * 35) +
          'px,' +
          (-abs * 18) +
          'px,' +
          (-abs * 65) +
          'px) ' +
          'rotateY(' +
          (-abs * 4) +
          'deg) ' +
          'scale(' +
          (1 - abs * .06) +
          ')';

        card.style.opacity =
          String(
            Math.max(
              .1,
              1 - abs * .35
            )
          );

        card.style.filter =
          'brightness(.5) saturate(.6)';

        card.style.zIndex =
          String(20 - abs);

      }


      else {

        card.style.transform =
          'translate3d(0,45px,-250px) scale(.75)';

        card.style.opacity = '0';

        card.style.zIndex = '1';

      }


      stack.appendChild(card);

    });

  }


  function renderNav(){

    nav.innerHTML = '';


    projects.forEach((p, i) => {

      const btn =
        document.createElement('button');


      btn.type = 'button';


      btn.className =
        'proj-nav-item' +
        (i === active
          ? ' active'
          : '');


      btn.setAttribute(
        'aria-label',
        'Show ' + p.title
      );


      btn.setAttribute(
        'aria-current',
        i === active
          ? 'true'
          : 'false'
      );


      btn.innerHTML =
        '<span class="proj-nav-date">' +
        String(i + 1).padStart(2,'0') +
        ' · ' +
        p.date +
        '</span>' +

        '<span class="proj-nav-line"></span>';


      btn.addEventListener(
        'mouseenter',
        () => setActive(i)
      );


      btn.addEventListener(
        'focus',
        () => setActive(i)
      );


      btn.addEventListener(
        'click',
        () => setActive(i)
      );


      nav.appendChild(btn);

    });

  }


  function renderInfo(){

    const p =
      projects[active];


    info.num.textContent =
      'PROJECT_' +
      String(active + 1).padStart(2,'0') +
      ' // ' +
      p.date;


    info.title.textContent =
      p.title;


    info.desc.textContent =
      p.desc;


    info.tags.innerHTML =
      p.tags.map(t => {

        return `
          <span
            class="ptag"
            style="
              background: rgba(255,255,255,.045);
              color: ${p.accent};
              border: 1px solid rgba(255,255,255,.08);
            "
          >
            ${t[0]}
          </span>
        `;

      }).join('');


    info.link.style.color =
      p.accent;


    info.link.href = 'projects.html';

  }


  function setActive(index){

    const next =
      Math.max(
        0,
        Math.min(
          projects.length - 1,
          Math.round(index)
        )
      );


    active = next;


    lastInteraction =
      Date.now();


    renderStack();

    renderNav();

    renderInfo();

    schedule();

  }


  function schedule(){

    clearTimeout(timer);


    timer = setTimeout(() => {

      if (
        Date.now() -
        lastInteraction >=
        6500
      ) {

        setActive(
          (active + 1) %
          projects.length
        );

      }

    }, 6500);

  }


  /* TOUCH SWIPE */

  stack.addEventListener(
    'touchstart',
    e => {

      startX =
        e.touches[0].clientX;

      lastInteraction =
        Date.now();

    },
    { passive: true }
  );


  stack.addEventListener(
    'touchend',
    e => {

      if (startX === null)
        return;


      const dx =
        e.changedTouches[0].clientX -
        startX;


      if (Math.abs(dx) > 45) {

        setActive(
          active +
          (dx < 0 ? 1 : -1)
        );

      }


      startX = null;

    },
    { passive: true }
  );


  /* KEYBOARD */

  document
    .getElementById('projectTimeline')
    .addEventListener(
      'keydown',
      e => {

        if (
          e.key === 'ArrowDown' ||
          e.key === 'ArrowRight'
        ) {

          e.preventDefault();

          setActive(active + 1);

        }


        if (
          e.key === 'ArrowUp' ||
          e.key === 'ArrowLeft'
        ) {

          e.preventDefault();

          setActive(active - 1);

        }

      }
    );


  renderStack();

  renderNav();

  renderInfo();

  schedule();

})();

/* ══ THEME TOGGLE ══ */
(function(){
  var btn = document.getElementById('theme-toggle');
  var icon = document.getElementById('theme-icon');
  
  function applyIcon(){
    var isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if(icon){ icon.className = isLight ? 'ti ti-sun' : 'ti ti-moon'; }
  }
  applyIcon();
  if(!btn) return;
  
  btn.addEventListener('click', function(){
    var html = document.documentElement;
    var isLight = html.getAttribute('data-theme') === 'light';
    
    // Add transitioning class for smooth effect
    html.classList.add('theme-transitioning');
    
    if(isLight){
      html.removeAttribute('data-theme');
      try{ localStorage.setItem('theme','dark'); }catch(e){}
    } else {
      html.setAttribute('data-theme','light');
      try{ localStorage.setItem('theme','light'); }catch(e){}
    }
    applyIcon();
    
    // Remove transitioning class after animation completes
    setTimeout(function(){
      html.classList.remove('theme-transitioning');
    }, 700);
  });
})();

/* ══ SCROLL-TO ANCHOR ON LOAD (for logs.html#case-N etc) ══ */
(function(){
  if(!window.location.hash) return;
  var target = document.querySelector(window.location.hash);
  if(!target) return;
  setTimeout(function(){
    target.scrollIntoView({behavior:'smooth', block:'start'});
    target.classList.add('log-highlight');
  }, 350);
})();



/* ══ PROJECT CAROUSEL (Dots Only + View All Link) ══ */
(function(){
  const track = document.getElementById('pj-track');
  const dotsEl = document.getElementById('pj-dots');
  if(!track || !dotsEl) return;
  
  const cards = Array.from(track.querySelectorAll('.rl-card'));
  if(!cards.length) return;
  
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
    for(let i = 0; i < total; i++){
      const d = document.createElement('span');
      d.className = 'c-dot' + (i === current ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
    }
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
    Array.from(dotsEl.children).forEach((d, i) => d.classList.toggle('active', i === current));
  }

  // --- Drag/Swipe Support ---
  let startX = 0;
  let isDragging = false;
  
  track.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
  });
  
  track.addEventListener('mouseup', (e) => {
    if(!isDragging) return;
    isDragging = false;
    const dx = e.clientX - startX;
    if(dx < -40) goTo(current + 1);
    else if(dx > 40) goTo(current - 1);
  });
  
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, {passive: true});
  
  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if(dx < -40) goTo(current + 1);
    else if(dx > 40) goTo(current - 1);
  });

  window.addEventListener('resize', () => {
    goTo(Math.min(current, maxIndex()));
    buildDots();
  });
  
  buildDots();
})();





// ============================================================
// TECH CAROUSEL CONTROLS - Toggle Both
// ============================================================

(function() {
    const techTrack = document.getElementById('techTrack');
    const skillsTrack = document.getElementById('skillsTrack');
    const toggleBtn = document.getElementById('techToggle');
    
    if (!techTrack || !skillsTrack || !toggleBtn) return;
    
    let isPaused = false;
    
    toggleBtn.addEventListener('click', function() {
        isPaused = !isPaused;
        techTrack.classList.toggle('paused', isPaused);
        skillsTrack.classList.toggle('paused', isPaused);
        this.innerHTML = isPaused ? '<i class="ti ti-play"></i>' : '<i class="ti ti-pause"></i>';
    });
})();



// ============================================================
// PROJECT POPUP MODAL
// ============================================================

(function() {
    // --- Project Data ---
    // ============================================================
// PROJECT DATA - ALL PROJECTS
// ============================================================

const projects = [
    {
        id: '4scan',
        title: '4SCAN Port Scanner',
        description: 'Python TCP port scanner — scan open ports on IP addresses and domains. Built from scratch with a custom threading model, timeout handling, and CIDR range parsing.',
        tags: ['Python', 'Networking', 'Security'],
        images: [
            'assets/img/4scan.jpg',
            'assets/img/4scan_2.jpg',
            'assets/img/4scan_3.jpg'
        ],
        liveLink: '#',
        codeLink: '#'
    },
    {
        id: 'network-toolkit',
        title: 'Network Troubleshoot Toolkit',
        description: 'Windows bat.exe file toolkit that makes network troubleshooting easier with quick-access shortcuts for common diagnostics and repair commands.',
        tags: ['GUI/CLI', 'Diagnose', 'Windows'],
        images: [
            'assets/img/network-config.png',
            'assets/img/proj_network_toolkit.svg'
        ],
        liveLink: '#',
        codeLink: '#'
    },
    {
        id: 'cyberops-lab',
        title: 'CyberOps Lab',
        description: 'Personal homelab for offensive and defensive security research. Configuring and analyzing network traffic, vulnerabilities, and attack vectors.',
        tags: ['Security Ops', 'Homelab', 'Research'],
        images: [
            'assets/img/cyberops.png',
            'assets/img/cyberops1.jpg',
            'assets/img/'
        ],
        liveLink: '#',
        codeLink: '#'
    },
    {
        id: 'siem-lab',
        title: 'SIEM Analysis Lab',
        description: 'Elastic SIEM for security event simulation and threat detection. Custom dashboards and alerting pipelines to identify suspicious activity.',
        tags: ['Elastic SIEM', 'Threat Detection', 'Analytics'],
        images: [
            'assets/img/elastickibana.png',
            'assets/img/elastic.png'
        ],
        liveLink: '#',
        codeLink: '#'
    },
    {
        id: 'network-seg-lab',
        title: 'Network Seg. Lab',
        description: 'VLAN segmentation, firewall rules, and traffic monitoring modeled after enterprise environments to enforce strict access control.',
        tags: ['pfSense', 'Wireshark', 'Networking'],
        images: [
            'assets/img/proj_vlan.svg',
            'assets/img/network_seg_2.jpg'
        ],
        liveLink: '#',
        codeLink: '#'
    },
    {
        id: 'doit-app',
        title: 'Do-it App',
        description: 'Python CLI to-do list — add, view and remove tasks. File handling and program logic built for productivity and task management.',
        tags: ['Python', 'CLI', 'Productivity'],
        images: [
            'assets/img/do-it-app.png',
            'assets/img/image_41eea144.png'
        ],
        liveLink: '#',
        codeLink: '#'
    },
    {
        id: 'coming-soon',
        title: 'Coming Soon',
        description: 'Something new is taking shape behind the scenes. Stay tuned for updates on this upcoming project.',
        tags: ['Pending', 'On Going', 'Coming Soon'],
        images: [
            'assets/img/newproj.jpg'
        ],
        liveLink: '#',
        codeLink: '#'
    }
];

    // --- DOM Elements ---
    const modal = document.getElementById('projectModal');
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');
    const sliderContainer = document.getElementById('sliderContainer');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');
    const modalTitle = document.getElementById('modalTitle');
    const modalTags = document.getElementById('modalTags');
    const modalDescription = document.getElementById('modalDescription');
    const modalLiveLink = document.getElementById('modalLiveLink');
    const modalCodeLink = document.getElementById('modalCodeLink');

    let currentProject = null;
    let currentSlide = 0;

    // --- Functions ---
    function openModal(projectId) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;
        
        currentProject = project;
        currentSlide = 0;
        
        // Set details
        modalTitle.textContent = project.title;
        modalDescription.textContent = project.description;
        
        // Set tags
        modalTags.innerHTML = project.tags.map(tag => 
            `<span class="ptag" style="background:rgba(74,222,128,0.15);color:var(--grn);border:1px solid rgba(74,222,128,0.25);">${tag}</span>`
        ).join('');
        
        // Set links
        modalLiveLink.href = project.liveLink;
        modalCodeLink.href = project.codeLink;
        
        // Build slider
        buildSlider(project.images);
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function buildSlider(images) {
        // Clear previous
        sliderContainer.innerHTML = '';
        dotsContainer.innerHTML = '';
        
        if (!images || images.length === 0) {
            // Placeholder if no images
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.innerHTML = `
                <div class="slide-placeholder">
                    <i class="ti ti-photo" aria-hidden="true"></i>
                    <span>No images available</span>
                </div>
            `;
            sliderContainer.appendChild(slide);
            return;
        }
        
        // Build slides
        images.forEach((img, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.innerHTML = `<img src="${img}" alt="Project image ${index + 1}" loading="lazy">`;
            sliderContainer.appendChild(slide);
        });
        
        // Build dots
        images.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot' + (index === 0 ? ' active' : '');
            dot.dataset.index = index;
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        // Update slider position
        updateSlider();
    }

    function goToSlide(index) {
        const slides = sliderContainer.querySelectorAll('.slide');
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        currentSlide = index;
        updateSlider();
    }

    function updateSlider() {
        const slides = sliderContainer.querySelectorAll('.slide');
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        
        if (slides.length === 0) return;
        
        sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // --- Event Listeners ---
    // Close modal
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
        if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
    });

    // Slider controls
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    // --- Click on project cards ---
    document.querySelectorAll('.pj-card').forEach((card, index) => {
        card.addEventListener('click', function(e) {
            // Prevent if clicking on a link inside
            if (e.target.closest('a')) return;
            
            // Get project ID from data attribute or use index
            const projectId = this.dataset.project || projects[index]?.id;
            if (projectId) openModal(projectId);
        });
    });

    // Expose for debugging
    window.openProjectModal = openModal;
    window.closeProjectModal = closeModal;
})();