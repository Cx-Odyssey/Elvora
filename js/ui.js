/* ═══════════════════════════════════════════════════════════
   ELVORA — UI
   ═══════════════════════════════════════════════════════════
   Core/general functions — navigation between pages, the hero
   carousel, toast notifications, and modal open/close. Things
   almost every other file calls into.
   ═══════════════════════════════════════════════════════════ */

function nav(pg,addH){
  if(addH===undefined)addH=true;
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  var el=document.getElementById('page-'+pg);if(!el)return;
  el.classList.add('active');el.scrollTop=0;
  if(addH&&hist[hist.length-1]!==pg)hist.push(pg);
  var cta=document.getElementById('pdCta');if(cta)cta.classList.toggle('on',pg==='product');
  var tn=document.querySelector('.tnav');if(tn)tn.style.display=(pg==='product')?'none':'flex';
  document.querySelectorAll('.bni').forEach(function(b){b.classList.remove('active');});
  var m={home:'bn-home',shop:'bn-shop',wishlist:'bn-wishlist',account:'bn-account'};
  if(m[pg]){var b=document.getElementById(m[pg]);if(b)b.classList.add('active');}
  document.getElementById('spfill').style.width='0%';
  if(pg==='cart')renderCart();
  if(pg==='account')renderAccount();
  if(pg==='wishlist')renderWishlist();
  if(pg==='home')renderRecent();
}

function navHome(){nav('home');}

function navCart(){nav('cart');}

function navCheckout(){buyNowItem=null;nav('checkout');renderCheckout();}

function navWishlist(){nav('wishlist');}

function navOutletInfo(){nav('outlet-info');}
function navAbout(){nav('about');}
function navPolicies(){nav('policies');}

function goBack(){if(hist.length>1){hist.pop();nav(hist[hist.length-1],false);}else nav('home',false);}

function scrollToEl(id){var el=document.getElementById(id);if(el){var ph=document.getElementById('page-home');if(ph)ph.scrollTop=el.offsetTop-10;}}

/* CAROUSEL */

function goSlide(n){
  var od=document.getElementById('sl'+curSlide);var dots=document.querySelectorAll('.dot');
  if(od)od.classList.remove('on');if(dots[curSlide])dots[curSlide].classList.remove('on');
  curSlide=n;var cur=document.getElementById('sl'+n);if(cur)cur.classList.add('on');if(dots[n])dots[n].classList.add('on');
}

function startCarousel(){if(slideTimer)clearInterval(slideTimer);slideTimer=setInterval(function(){goSlide((curSlide+1)%4);},4400);}

/* TIMER */

var toastT=null;

function toast(msg){var t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('on');},2800);}

/* MODAL */

function openModal(id){var el=document.getElementById(id);if(el)el.classList.add('on');}

function closeModal(id){var el=document.getElementById(id);if(el)el.classList.remove('on');}

/* SEARCH */

function animCnt(id,target,suf){
  var el=document.getElementById(id);if(!el)return;
  var dur=1400,st=performance.now();
  function tick(now){var p=Math.min((now-st)/dur,1);var e=1-Math.pow(1-p,3);el.textContent=Math.floor(e*target)+suf;if(p<1)requestAnimationFrame(tick);}
  requestAnimationFrame(tick);
}

/* NAVIGATION */

