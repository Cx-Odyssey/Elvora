/* ═══════════════════════════════════════════════════════════
   ELVORA — MAIN / BOOTSTRAP
   ═══════════════════════════════════════════════════════════
   Runs once the page finishes loading. Wires up the ticker,
   carousel, scroll-reveal animations, and calls the initial
   render functions from the other files. This file should be
   loaded LAST in index.html, after every other js/ file.
   ═══════════════════════════════════════════════════════════ */

window.addEventListener('load',function(){
  /* Theme toggle sync (silent - no toast on initial load) */
  setTheme(localStorage.getItem('el_theme')==='dark'?'dark':'light',true);

  /* Ticker */
  var tks=['✦ Grand Opening — 20% OFF','✦ Dhaka Delivery ৳80','✦ Cash on Delivery','✦ Outside Dhaka ৳150','✦ 100% Authentic','✦ Physical Store Savar','✦ K-Beauty Now In Stock','✦ Perfumes Coming Soon','✦ Easy 7-Day Returns','✦ Grand Opening — 20% OFF','✦ Dhaka Delivery ৳80','✦ Cash on Delivery','✦ Outside Dhaka ৳150','✦ 100% Authentic','✦ Physical Store Savar','✦ K-Beauty Now In Stock','✦ Perfumes Coming Soon','✦ Easy 7-Day Returns'];
  document.getElementById('tickerInner').innerHTML=tks.map(function(t){return '<span class="ti">'+t+'</span>';}).join('');

  /* Loader hide */
  var ldr=document.getElementById('loader');
  if(ldr){ldr.style.transition='opacity .5s';setTimeout(function(){ldr.style.opacity='0';setTimeout(function(){ldr.style.display='none';},500);},1850);}

  /* Modal close on backdrop */
  ['authModal','reviewModal','settingsModal','csModal'].forEach(function(id){var el=document.getElementById(id);if(el)el.addEventListener('click',function(e){if(e.target===el)closeModal(id);});});

  /* Notif toggle */
  if(!notifOn){var t=document.getElementById('notifTgl');var d=document.getElementById('notifDot');if(t)t.style.background='var(--border)';if(d)d.style.right='23px';}

  /* Ripple on buttons */
  document.addEventListener('click',function(e){
    var btn=e.target.closest('button,.btn-rose,.btn-primary,.padd,.ckbtn,.placebtn,.nl-btn');
    if(!btn)return;
    btn.style.position='relative';btn.style.overflow='hidden';
    var r=document.createElement('span');r.className='rpl';
    var rect=btn.getBoundingClientRect();
    r.style.left=(e.clientX-rect.left)+'px';r.style.top=(e.clientY-rect.top)+'px';
    btn.appendChild(r);setTimeout(function(){r.remove();},600);
  });

  /* Scroll progress */
  document.querySelectorAll('.page').forEach(function(pg){
    pg.addEventListener('scroll',function(){
      if(!pg.classList.contains('active'))return;
      var fill=document.getElementById('spfill');if(!fill)return;
      var pct=pg.scrollTop/(pg.scrollHeight-pg.clientHeight)*100;
      fill.style.width=Math.min(100,isNaN(pct)?0:pct)+'%';
    });
  });

  /* IntersectionObserver for scroll reveals + stats */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          en.target.classList.add('vis');
          if(en.target.id==='statsSection'&&!statsAnim){
            statsAnim=true;
            animCnt('stat1',100,'+');
            animCnt('stat2',100,'%');animCnt('stat3',7,'');
            /* Lit top border on stats */
            document.querySelectorAll('.stat').forEach(function(s,i){setTimeout(function(){s.classList.add('lit');},i*180);});
          }
        }
      });
    },{threshold:.15});
    document.querySelectorAll('.fade-up').forEach(function(el){io.observe(el);});
    document.getElementById('statsSection')&&io.observe(document.getElementById('statsSection'));
  }

  startTimer();startCarousel();
  renderProducts(PRODUCTS);renderCart();renderAccount();renderWishlist();renderRecent();updateBadges();
});

