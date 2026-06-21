/* ═══════════════════════════════════════════════════════════
   ELVORA — PROMOTIONS
   ═══════════════════════════════════════════════════════════
   Events & discounts — the flash-sale countdown timer and the
   delivery-fee / free-shipping-threshold logic.
   ═══════════════════════════════════════════════════════════ */

function startTimer(){
  var end=new Date();end.setHours(23,59,59,0);
  function tick(){var d=Math.max(0,end-new Date());var h=Math.floor(d/3600000);var m=Math.floor((d%3600000)/60000);var s=Math.floor((d%60000)/1000);var el=document.getElementById('timerDisp');if(el)el.textContent=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');}
  tick();setInterval(tick,1000);
}

/* TOAST */

function updDel(v){deliveryFee=v==='outside'?150:80;var sub=getTotal();if(sub>=1500)deliveryFee=0;var m=document.getElementById('miniDel');if(m)m.textContent=deliveryFee===0?'FREE':'৳'+deliveryFee;var t=document.getElementById('miniTot');if(t)t.textContent='৳'+(sub+deliveryFee).toLocaleString();var b=document.getElementById('placeBtn');if(b)b.textContent='Place Order — Cash on Delivery (৳'+(sub+deliveryFee).toLocaleString()+')';}

