/* ═══════════════════════════════════════════════════════════
   ELVORA — PRODUCTS DISPLAY
   ═══════════════════════════════════════════════════════════
   Rendering the product catalog — grid view, search, filtering,
   and the full product detail page. Reads from the PRODUCTS
   array defined in products.js.
   ═══════════════════════════════════════════════════════════ */

function toggleSearch(){var b=document.getElementById('searchBar');b.classList.toggle('on');if(b.classList.contains('on'))document.getElementById('searchInput').focus();else{document.getElementById('searchInput').value='';nav('home');}}

function doSearch(v){
  if(!v.trim()){nav('home');return;}
  nav('search');var q=v.toLowerCase();
  var res=PRODUCTS.filter(function(p){return p.name.toLowerCase().includes(q)||p.category.toLowerCase().includes(q)||p.brand.toLowerCase().includes(q);});
  var ti=document.getElementById('searchTitle');if(ti)ti.textContent='Results for "'+v+'"';
  var em=document.getElementById('searchEmpty');if(em)em.style.display=res.length?'none':'block';
  renderProducts(res,'searchGrid');
}

/* RENDER PRODUCTS */

function renderProducts(list,tgt){
  if(!tgt)tgt='productsGrid';
  var grid=document.getElementById(tgt);if(!grid)return;
  if(!list.length){grid.innerHTML='';return;}
  grid.innerHTML=list.map(function(p,idx){
    var wf=wishlist.includes(p.id)?'var(--rose)':'none';
    var ws=wishlist.includes(p.id)?'var(--rose)':'var(--text2)';
    var stars='';for(var i=0;i<Math.round(p.rating);i++)stars+='<span class="s">★</span>';
    var old=p.oldPrice?'<span class="pold">৳'+p.oldPrice.toLocaleString()+'</span>':'';
    var badge=p.badge?'<div class="pbadge '+(p.badgeType||'best')+'">'+p.badge+'</div>':'';
    return '<div class="pcard" style="animation:fadeIn .4s ease '+(idx*60)+'ms both;" onclick="openProd('+p.id+')">'
      +'<div class="pcard-img" style="background:'+getGrad(p.category)+';"><div class="pcard-ill">'+getIll(p.category,false)+'<span>'+p.category+'</span></div>'
      +badge+'<button class="pwish" id="wish-'+p.id+'" onclick="event.stopPropagation();toggleWish('+p.id+')">'
      +'<svg viewBox="0 0 24 24" style="width:13px;height:13px;stroke:'+ws+';stroke-width:2;fill:'+wf+';stroke-linecap:round;stroke-linejoin:round;"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>'
      +'</button></div>'
      +'<div class="pinfo"><div class="pbrand">'+p.brand+'</div><div class="pname">'+p.name+'</div>'
      +'<div class="pstars">'+stars+'<span class="cnt">('+p.reviews+')</span></div>'
      +'<div class="ppr-row"><div><span class="pprice">৳'+p.price.toLocaleString()+'</span>'+old+'</div>'
      +'<button class="padd" onclick="event.stopPropagation();addToCart('+p.id+',1)">+</button>'
      +'</div></div></div>';
  }).join('');
}

function filterCat(cat,btn){
  document.querySelectorAll('.cat').forEach(function(c){c.classList.remove('sel');});if(btn)btn.classList.add('sel');
  renderProducts(cat==='all'?PRODUCTS:PRODUCTS.filter(function(p){return p.category===cat;}));
}

/* PRODUCT DETAIL */

function openProd(id){
  var p=PRODUCTS.find(function(x){return x.id===id;});if(!p)return;
  curProd=id;curRevProd=id;pdQtyN=1;
  selVarP=p.variants&&p.variants.length?p.variants[0].price:null;
  selVarL=p.variants&&p.variants.length?p.variants[0].label:'';
  var s;
  s=document.getElementById('pdTitle');if(s)s.textContent=p.name.length>22?p.name.slice(0,22)+'...':p.name;
  var pdImg=document.getElementById('pdImg');
  if(pdImg)pdImg.style.background=getGrad(p.category);
  var pi=document.getElementById('pdIllus');if(pi)pi.innerHTML=getIll(p.category,true);
  var lb=document.getElementById('pdImgLbl');if(lb)lb.textContent=p.brand+' · '+p.category;
  s=document.getElementById('pdBrand');if(s)s.textContent=p.brand+' · '+p.category.toUpperCase();
  s=document.getElementById('pdName');if(s)s.textContent=p.name;
  var st='';for(var i=0;i<5;i++)st+='<span class="s" style="color:'+(i<Math.round(p.rating)?'var(--gold)':'var(--border)')+';">★</span>';
  s=document.getElementById('pdStars');if(s)s.innerHTML=st;
  s=document.getElementById('pdRating');if(s)s.textContent=p.rating+' · '+p.reviews+' reviews';
  var dp=selVarP||p.price;
  s=document.getElementById('pdPrice');if(s)s.textContent='৳'+dp.toLocaleString();
  s=document.getElementById('pdOld');if(s)s.textContent=p.oldPrice?'৳'+p.oldPrice.toLocaleString():'';
  var de=document.getElementById('pdDisc');if(de){if(p.oldPrice){de.textContent=Math.round((1-p.price/p.oldPrice)*100)+'% off';de.style.display='block';}else de.style.display='none';}
  var be=document.getElementById('pdBadges');
  if(be)be.innerHTML='<div class="pd-badge"><svg viewBox="0 0 24 24" style="stroke:var(--green);stroke-width:2.2;fill:none;stroke-linecap:round;stroke-linejoin:round;"><polyline points="20 6 9 17 4 12"/></svg>100% Authentic</div><div class="pd-badge"><svg viewBox="0 0 24 24" style="stroke:var(--text2);stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round;"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>Cash on Delivery</div><div class="pd-badge"><svg viewBox="0 0 24 24" style="stroke:var(--text2);stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round;"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>7-Day Returns</div>';
  s=document.getElementById('pdDesc');if(s)s.textContent=p.desc;
  s=document.getElementById('pdSize');if(s)s.textContent=p.size;
  s=document.getElementById('pdQtyN');if(s)s.textContent=1;
  var vs=document.getElementById('pdVarSec');
  if(vs){if(p.variants&&p.variants.length){var vh='<div class="pd-lbl">Size — Select</div><div class="vrow">';p.variants.forEach(function(v,i){vh+='<div class="vchip'+(i===0?' sel':'')+'" onclick="selVar(this,'+v.price+',\''+v.label+'\')">'  +v.label+' — ৳'+v.price.toLocaleString()+'</div>';});vh+='</div>';vs.innerHTML=vh;selVarP=p.variants[0].price;selVarL=p.variants[0].label;document.getElementById('pdPrice').textContent='৳'+p.variants[0].price.toLocaleString();}else vs.innerHTML='';}
  var ws=document.getElementById('pdWishSvg');if(ws){ws.style.fill=wishlist.includes(id)?'var(--rose)':'none';ws.style.stroke=wishlist.includes(id)?'var(--rose)':'var(--text)';}
  renderPdRevs(id,p);
  addToRecent(id);nav('product');
}

function renderPdRevs(id,p){
  var stored=JSON.parse(localStorage.getItem('el_reviews_'+id)||'[]');
  var all=stored.concat(p.reviewList||[]);
  var re=document.getElementById('pdReviews');if(!re)return;
  if(!all.length){re.innerHTML='<div style="text-align:center;padding:28px 0;font-size:13px;color:var(--muted);">No reviews yet. Be the first!</div>';return;}
  re.innerHTML=all.map(function(r){return '<div class="rv-item"><div class="rv-head"><div class="rv-info"><div class="rv-av">🌸</div><div><div class="rv-name">'+r.name+'</div><div class="rv-date">'+r.date+'</div></div></div><div class="rv-stars"><span>'+('★'.repeat(r.rating))+'</span></div></div><div class="rv-text">'+r.text+'</div>'+(r.verified?'<div class="verified">✓ Verified Purchase</div>':'')+'</div>';}).join('');
}

function chQty(d){pdQtyN=Math.max(1,pdQtyN+d);var el=document.getElementById('pdQtyN');if(el)el.textContent=pdQtyN;}

function selVar(el,price,label){document.querySelectorAll('.vchip').forEach(function(c){c.classList.remove('sel');});el.classList.add('sel');selVarP=price;selVarL=label;var pe=document.getElementById('pdPrice');if(pe)pe.textContent='৳'+price.toLocaleString();}

function pdAdd(){if(!curProd)return;addToCart(curProd,pdQtyN);}

function pdBuy(){pdAdd();nav('checkout');renderCheckout();}

function togglePdWish(){if(!curProd)return;toggleWish(curProd);var s=document.getElementById('pdWishSvg');if(s){s.style.fill=wishlist.includes(curProd)?'var(--rose)':'none';s.style.stroke=wishlist.includes(curProd)?'var(--rose)':'var(--text)';}}

/* CART */

