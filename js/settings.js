/* ═══════════════════════════════════════════════════════════
   ELVORA — SETTINGS
   ═══════════════════════════════════════════════════════════
   Settings modal — theme toggle, language toggle, notification
   toggle — plus a few small standalone actions (newsletter
   signup, 'coming soon' notify-me, opening WhatsApp).
   ═══════════════════════════════════════════════════════════ */

function setTheme(mode,silent){
  if(mode==='dark'){document.documentElement.setAttribute('data-theme','dark');}
  else{document.documentElement.removeAttribute('data-theme');}
  localStorage.setItem('el_theme',mode);
  var lt=document.getElementById('theme-light');var dk=document.getElementById('theme-dark');
  if(lt){lt.style.background=mode==='light'?'linear-gradient(135deg,var(--rose),var(--rose2))':'var(--elevated)';lt.style.color=mode==='light'?'#fff':'var(--muted)';lt.style.border=mode==='light'?'none':'1px solid var(--border)';}
  if(dk){dk.style.background=mode==='dark'?'linear-gradient(135deg,var(--rose),var(--rose2))':'var(--elevated)';dk.style.color=mode==='dark'?'#fff':'var(--muted)';dk.style.border=mode==='dark'?'none':'1px solid var(--border)';}
  if(!silent)toast(mode==='dark'?'Dark mode on':'Light mode on');
}

function setLang(lg){var en=document.getElementById('lang-en');var bn=document.getElementById('lang-bn');if(en){en.style.background=lg==='en'?'linear-gradient(135deg,var(--rose),var(--rose2))':'var(--elevated)';en.style.color=lg==='en'?'#fff':'var(--muted)';en.style.border=lg==='en'?'none':'1px solid var(--border)';}if(bn){bn.style.background=lg==='bn'?'linear-gradient(135deg,var(--rose),var(--rose2))':'var(--elevated)';bn.style.color=lg==='bn'?'#fff':'var(--muted)';bn.style.border=lg==='bn'?'none':'1px solid var(--border)';}toast(lg==='bn'?'ভাষা পরিবর্তন হয়েছে':'Language changed to English');}

function toggleNotif(el){notifOn=!notifOn;localStorage.setItem('el_notif',notifOn?'on':'off');el.style.background=notifOn?'var(--rose)':'var(--border)';var d=document.getElementById('notifDot');if(d)d.style.right=notifOn?'3px':'23px';}

function showCS(name){document.getElementById('csTitle').textContent=name+' — Coming Soon';openModal('csModal');}

function notifyMe(){var e=document.getElementById('notifyEmail')?document.getElementById('notifyEmail').value.trim():'';if(!e||!valEmail(e)){toast('Please enter a valid email');return;}var list=JSON.parse(localStorage.getItem('el_notify')||'[]');if(!list.includes(e))list.push(e);localStorage.setItem('el_notify',JSON.stringify(list));closeModal('csModal');toast('You will be first to know! ✦');}

function nlSub(){var e=document.getElementById('nlEmail')?document.getElementById('nlEmail').value.trim():'';if(!valEmail(e)){toast('Please enter a valid email');return;}var subs=JSON.parse(localStorage.getItem('el_subs')||'[]');if(subs.includes(e)){toast('Already subscribed!');return;}subs.push(e);localStorage.setItem('el_subs',JSON.stringify(subs));document.getElementById('nlEmail').value='';toast('Subscribed! Welcome to the ELVORA family ✦');}

function openWA(){window.open('https://wa.me/8801XXXXXXXXX','_blank');}

function toastReturnPolicy(){toast('7-day hassle-free returns via WhatsApp');}

