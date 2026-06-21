/* ═══════════════════════════════════════════════════════════
   ELVORA — STATE
   ═══════════════════════════════════════════════════════════
   Shared state — every variable here is read or changed by
   multiple other files. Must load before any file that uses
   them (loaded first in index.html).
   ═══════════════════════════════════════════════════════════ */

var cart=JSON.parse(localStorage.getItem('el_cart')||'[]');

var wishlist=JSON.parse(localStorage.getItem('el_wish')||'[]');

var currentUser=JSON.parse(localStorage.getItem('el_user')||'null');

var recent=JSON.parse(localStorage.getItem('el_recent')||'[]');

var hist=['home'];

var curSlide=0,slideTimer=null;

var curProd=null,pdQtyN=1,selVarP=null,selVarL='';

var revStar=0,curRevProd=null;

var deliveryFee=80,selPay='cod';

var notifOn=localStorage.getItem('el_notif')!=='off';

var otpSent=false,genOTP='',verPhone='',otpTmr=null;

var statsAnim=false;

/* SVG ILLUSTRATIONS per category */

var ILLS={
  serum:'<svg viewBox="0 0 60 100" fill="none" width="68"><rect x="22" y="32" width="16" height="58" rx="7" fill="rgba(240,236,247,.1)"/><rect x="24" y="52" width="12" height="38" rx="5" fill="rgba(200,114,106,.15)"/><rect x="20" y="20" width="20" height="14" rx="5" fill="rgba(240,236,247,.08)"/><rect x="26" y="6" width="8" height="16" rx="4" fill="rgba(240,236,247,.12)"/><circle cx="30" cy="5" r="3.5" fill="rgba(240,236,247,.18)"/><rect x="24" y="38" width="12" height="9" rx="2" fill="rgba(255,255,255,.07)"/></svg>',
  moisturiser:'<svg viewBox="0 0 72 72" fill="none" width="78"><ellipse cx="36" cy="57" rx="22" ry="7" fill="rgba(240,236,247,.05)"/><rect x="14" y="28" width="44" height="30" rx="22" fill="rgba(240,236,247,.08)"/><ellipse cx="36" cy="28" rx="22" ry="8" fill="rgba(240,236,247,.12)"/><ellipse cx="36" cy="20" rx="20" ry="7" fill="rgba(240,236,247,.1)"/><rect x="16" y="13" width="40" height="10" rx="5" fill="rgba(240,236,247,.09)"/><ellipse cx="36" cy="43" rx="12" ry="4" fill="rgba(255,255,255,.05)"/></svg>',
  cleanser:'<svg viewBox="0 0 55 95" fill="none" width="62"><rect x="12" y="18" width="31" height="64" rx="9" fill="rgba(240,236,247,.08)"/><rect x="12" y="38" width="31" height="44" rx="0" fill="rgba(120,190,216,.12)"/><rect x="18" y="8" width="19" height="12" rx="4" fill="rgba(240,236,247,.1)"/><rect x="22" y="2" width="11" height="8" rx="4" fill="rgba(240,236,247,.12)"/><circle cx="27.5" cy="1.5" r="3" fill="rgba(240,236,247,.12)"/><rect x="16" y="24" width="23" height="10" rx="2.5" fill="rgba(255,255,255,.06)"/></svg>',
  toner:'<svg viewBox="0 0 50 92" fill="none" width="58"><rect x="8" y="16" width="34" height="64" rx="9" fill="rgba(240,236,247,.08)"/><rect x="8" y="42" width="34" height="38" rx="0" fill="rgba(168,94,181,.12)"/><rect x="16" y="8" width="18" height="10" rx="4" fill="rgba(240,236,247,.1)"/><rect x="18" y="2" width="14" height="8" rx="4" fill="rgba(240,236,247,.12)"/><rect x="12" y="24" width="26" height="12" rx="2.5" fill="rgba(255,255,255,.06)"/></svg>',
  mask:'<svg viewBox="0 0 78 52" fill="none" width="88"><rect x="8" y="14" width="62" height="30" rx="7" fill="rgba(240,236,247,.08)"/><rect x="8" y="22" width="62" height="22" rx="0" fill="rgba(196,90,120,.12)"/><ellipse cx="39" cy="14" rx="31" ry="6" fill="rgba(240,236,247,.12)"/><rect x="6" y="6" width="66" height="10" rx="5" fill="rgba(240,236,247,.09)"/><rect x="16" y="26" width="46" height="5" rx="2" fill="rgba(255,255,255,.05)"/></svg>'
};

function getIll(cat,big){var s=ILLS[cat]||ILLS.serum;if(big)s=s.replace(/width="\d+"/,'width="110"');return s;}

/* Card gradients per category */

var GRADS={serum:'linear-gradient(145deg,#1e0428 0%,#3a0e50 30%,#7a2862 60%,#b84872 85%,#d46860 100%)',moisturiser:'linear-gradient(145deg,#060e28 0%,#0e2242 30%,#1e4470 60%,#2a709a 85%,#38a8c0 100%)',cleanser:'linear-gradient(145deg,#030e1a 0%,#082230 30%,#124050 60%,#1a6878 85%,#22a090 100%)',toner:'linear-gradient(145deg,#180828 0%,#2e1248 30%,#5a2880 60%,#8840b8 85%,#a860d0 100%)',mask:'linear-gradient(145deg,#200820 0%,#3a1038 30%,#6a1860 60%,#9a2880 85%,#c04898 100%)'};

function getGrad(cat){return GRADS[cat]||GRADS.serum;}

