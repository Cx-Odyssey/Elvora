/* ═══════════════════════════════════════════════════════════
   ELVORA — EVENTS (site-wide time-limited sales)
   ═══════════════════════════════════════════════════════════
   Loads whichever event is currently active from Supabase (see
   supabase-schema.sql for the `events` table — that's where you
   create a sale: title, discount_percent, starts_at, ends_at).

   Everything else on the site that shows a price calls
   getEventPrice(product) instead of reading product.price
   directly, so a single active event changes prices everywhere
   at once — grid, product page, cart — with no per-product edits.
   ═══════════════════════════════════════════════════════════ */

var activeEvent=null;

async function loadActiveEvent(){
  if(!supabaseClient){renderFlashBanner();return;}
  try{
    var nowIso=new Date().toISOString();
    var res=await supabaseClient.from('events').select('*')
      .eq('active',true).lte('starts_at',nowIso).gte('ends_at',nowIso)
      .order('id',{ascending:false}).limit(1);
    if(res.error)throw res.error;
    activeEvent=(res.data&&res.data.length)?res.data[0]:null;
  }catch(e){
    console.warn('ELVORA: could not load events, no sale will be shown.',e);
    activeEvent=null;
  }
  renderFlashBanner();
  if(typeof renderProducts==='function'&&typeof PRODUCTS!=='undefined')renderProducts(PRODUCTS);
  if(typeof startEventCountdown==='function')startEventCountdown();
}

/* Applies the active event's discount to any raw price number.
   Returns the price unchanged if no event is active. Used for
   variant prices, which aren't full product objects. */
function applyEventDiscount(rawPrice){
  return activeEvent?Math.round(rawPrice*(1-activeEvent.discount_percent/100)):rawPrice;
}

/* Returns {price, oldPrice, onEvent} for a product, accounting for
   whichever event (if any) is currently active. Use this everywhere
   a price is displayed, instead of reading product.price directly. */
function getEventPrice(p){
  if(activeEvent){
    return{price:applyEventDiscount(p.price),oldPrice:p.price,onEvent:true};
  }
  return{price:p.price,oldPrice:p.oldPrice||null,onEvent:false};
}

/* Show/hide the flash-sale banner and fill in its real content.
   If there's no active event, the banner is hidden entirely —
   we never show a fake "Flash Sale" when nothing is actually on sale. */
function renderFlashBanner(){
  var wrap=document.getElementById('flashBannerWrap');
  if(!wrap)return;
  if(!activeEvent){wrap.style.display='none';return;}
  wrap.style.display='block';
  var t=document.getElementById('flH');if(t)t.textContent=activeEvent.title;
  var s=document.getElementById('flSub');if(s)s.textContent=activeEvent.subtitle||(activeEvent.discount_percent+'% off everything');
}

var eventCountdownTmr=null;
function startEventCountdown(){
  if(eventCountdownTmr)clearInterval(eventCountdownTmr);
  if(!activeEvent)return;
  var end=new Date(activeEvent.ends_at);
  function tick(){
    var d=Math.max(0,end-new Date());
    if(d<=0){clearInterval(eventCountdownTmr);loadActiveEvent();return;}
    var h=Math.floor(d/3600000);var m=Math.floor((d%3600000)/60000);var s=Math.floor((d%60000)/1000);
    var el=document.getElementById('timerDisp');
    if(el)el.textContent=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  }
  tick();eventCountdownTmr=setInterval(tick,1000);
}

/* Whether free delivery applies right now purely from an active event
   (there's no permanent "spend over X" threshold anymore — free
   delivery is a limited-time perk, not a standing offer). */
function eventGivesFreeDelivery(){
  return!!(activeEvent&&activeEvent.free_delivery);
}
