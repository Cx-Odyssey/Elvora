/* ═══════════════════════════════════════════════════════════
   ELVORA — PROMOTIONS
   ═══════════════════════════════════════════════════════════
   Delivery-fee logic. The flash-sale countdown itself lives in
   events.js (startEventCountdown), since it's tied to a real
   event's end time rather than a fixed daily reset.

   Free delivery comes from either an active event or a customer's
   loyalty voucher (see events.js / loyalty.js / checkout.js's
   getFreeDeliveryReason) — there's no permanent "spend over X"
   threshold anymore.
   ═══════════════════════════════════════════════════════════ */

function updDel(v){
  deliveryFee=v==='outside'?150:80;
  if(typeof getFreeDeliveryReason==='function'&&getFreeDeliveryReason())deliveryFee=0;
  var m=document.getElementById('miniDel');if(m)m.textContent=deliveryFee===0?'FREE':'৳'+deliveryFee;
  var sub=getTotal()-(typeof getPromoDiscount==='function'?getPromoDiscount(getTotal()):0);
  var t=document.getElementById('miniTot');if(t)t.textContent='৳'+Math.max(0,sub+deliveryFee).toLocaleString();
  var b=document.getElementById('placeBtn');if(b)b.textContent='Place Order — Cash on Delivery (৳'+Math.max(0,sub+deliveryFee).toLocaleString()+')';
}
