/* ═══════════════════════════════════════════════════════════
   ELVORA — CHECKOUT
   ═══════════════════════════════════════════════════════════
   Checkout flow — the checkout form, payment method selection,
   and placing the order. Calls saveOrderToBackend() from
   backend.js rather than talking to Supabase directly. Totals
   account for an active event's free-delivery perk (events.js),
   any applied promo code (promo.js), and a signed-in customer's
   free delivery voucher (loyalty.js), in that priority order.
   ═══════════════════════════════════════════════════════════ */

function getFreeDeliveryReason(){
  if(eventGivesFreeDelivery())return'event';
  if(currentUser&&(currentUser.freeDeliveryVouchers||0)>0&&useVoucherThisOrder)return'voucher';
  return null;
}

var useVoucherThisOrder=false;

function toggleVoucher(){
  useVoucherThisOrder=!useVoucherThisOrder;
  renderCheckout();
}

function renderCheckout(){
  var sub=getTotal();
  var promoOff=getPromoDiscount(sub);
  var freeReason=getFreeDeliveryReason();
  if(freeReason)deliveryFee=0;
  var grandTotal=Math.max(0,sub-promoOff)+deliveryFee;
  var el=document.getElementById('checkoutContent');if(!el)return;
  var items=cart.map(function(i){return '<div class="mrow"><span>'+i.name+(i.variant?' · '+i.variant:'')+' ×'+i.qty+'</span><span>৳'+(i.price*i.qty).toLocaleString()+'</span></div>';}).join('');
  var promoRow=appliedPromo?'<div class="mrow" style="color:var(--green);"><span>Promo "'+appliedPromo.code+'"</span><span>-৳'+promoOff.toLocaleString()+'</span></div>':'';
  var voucherRow='';
  if(currentUser&&(currentUser.freeDeliveryVouchers||0)>0&&!eventGivesFreeDelivery()){
    voucherRow='<div class="fcard"><div class="fcard-ttl"><svg viewBox="0 0 24 24" style="stroke:var(--link);stroke-width:1.75;fill:none;"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>Free Delivery Voucher</div>'
      +'<div style="display:flex;align-items:center;justify-content:space-between;"><span style="font-size:13px;color:var(--text2);">You have '+currentUser.freeDeliveryVouchers+' voucher'+(currentUser.freeDeliveryVouchers===1?'':'s')+' available</span>'
      +'<div class="tgl" style="background:'+(useVoucherThisOrder?'var(--rose)':'var(--border)')+';" onclick="toggleVoucher()"><div class="tgl-dot" style="right:'+(useVoucherThisOrder?'3px':'23px')+';"></div></div></div></div>';
  }
  el.innerHTML='<div class="back-row" onclick="goBack()"><div class="back-ic"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></div><div class="back-lbl">Checkout</div></div>'
    +'<div class="omini">'+items+promoRow+'<div class="mrow"><span>Delivery</span><span id="miniDel">'+(deliveryFee===0?'FREE':'৳'+deliveryFee)+'</span></div><div class="mrow tot"><span>Total</span><span id="miniTot">৳'+grandTotal.toLocaleString()+'</span></div></div>'
    +voucherRow
    +'<div class="fcard"><div class="fcard-ttl"><svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Delivery Info</div>'
    +'<div class="frow"><div class="fg"><label class="fl">Full Name *</label><input class="fi" id="o_name" placeholder="Your full name" value="'+(currentUser?(currentUser.fname+' '+(currentUser.lname||'')).trim():'')+'"/></div><div class="fg"><label class="fl">Phone *</label><input class="fi" id="o_phone" placeholder="01XXXXXXXXX" value="'+(currentUser&&currentUser.phone?currentUser.phone:'')+'"/></div></div>'
    +'<div class="fg"><label class="fl">District *</label><select class="fi" id="o_dist" onchange="updDel(this.value)" style="cursor:pointer;"><option value="">Select district...</option><option value="dhaka">Dhaka (৳80)</option><option value="outside">Outside Dhaka (৳150)</option></select></div>'
    +'<div class="fg"><label class="fl">Full Address *</label><textarea class="fta" id="o_addr" placeholder="House, Road, Area, City..."></textarea></div>'
    +'<div class="fg"><label class="fl">Email (optional)</label><input class="fi" id="o_email" type="email" placeholder="your@email.com" value="'+(currentUser&&currentUser.email?currentUser.email:'')+'"/></div>'
    +'<div class="fg"><label class="fl">Note (optional)</label><input class="fi" id="o_note" placeholder="Any special requests..."/></div></div>'
    +'<div class="fcard"><div class="fcard-ttl"><svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>Payment</div>'
    +'<div class="pay-opt sel" id="pay-cod" onclick="setPayCod()"><div class="pay-radio"><div class="pay-dot"></div></div><div><div class="pay-name">Cash on Delivery</div><div class="pay-sub">Pay when your order arrives</div></div><div class="pay-tag avail">Available</div></div>'
    +'<div class="pay-opt" id="pay-bkash" onclick="setPayBkash()"><div class="pay-radio"><div class="pay-dot"></div></div><div><div class="pay-name">bKash</div><div class="pay-sub">Mobile banking</div></div><div class="pay-tag soon">Soon</div></div></div>'
    +'<button class="placebtn" id="placeBtn" onclick="placeOrder()">Place Order — Cash on Delivery (৳'+grandTotal.toLocaleString()+')</button>'
    +'<div style="text-align:center;font-size:12px;color:var(--muted);margin-top:12px;margin-bottom:20px;">By placing an order you agree to our terms.</div>';
}

function setPay(type){if(type==='bkash'){toast('bKash coming soon! Please use Cash on Delivery.');return;}selPay=type;document.querySelectorAll('.pay-opt').forEach(function(e){e.classList.remove('sel');});var el=document.getElementById('pay-'+type);if(el)el.classList.add('sel');}

function setPayCod(){setPay('cod');}

function setPayBkash(){setPay('bkash');}

function placeOrder(){
  var name=document.getElementById('o_name')?document.getElementById('o_name').value.trim():'';
  var phone=document.getElementById('o_phone')?document.getElementById('o_phone').value.trim():'';
  var addr=document.getElementById('o_addr')?document.getElementById('o_addr').value.trim():'';
  var dist=document.getElementById('o_dist')?document.getElementById('o_dist').value:'';
  if(!name||!phone||!addr||!dist){toast('Please fill all required fields including district');return;}
  var sub=getTotal();
  var promoOff=getPromoDiscount(sub);
  var freeReason=getFreeDeliveryReason();
  var total=Math.max(0,sub-promoOff)+deliveryFee;
  var oid='EL-'+Date.now().toString().slice(-7);
  var order={id:oid,name:name,phone:phone,addr:addr,dist:dist,items:JSON.parse(JSON.stringify(cart)),total:total,fee:deliveryFee,promo:appliedPromo?appliedPromo.code:null,date:new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}),status:'Confirmed'};
  var orders=JSON.parse(localStorage.getItem('el_orders')||'[]');orders.unshift(order);localStorage.setItem('el_orders',JSON.stringify(orders));
  /* Save to Supabase too, so you (the shop owner) can see every order in your
     dashboard. This runs in the background — checkout doesn't wait for it,
     so the customer's experience stays instant either way. */
  saveOrderToBackend(order,total);
  recordPromoUsage();
  awardOrderPoints();
  if(freeReason==='voucher'&&currentUser){currentUser.freeDeliveryVouchers=Math.max(0,(currentUser.freeDeliveryVouchers||0)-1);saveUserUpdate();}
  useVoucherThisOrder=false;
  cart=[];appliedPromo=null;saveCart();updateBadges();fireConfetti();
  var el=document.getElementById('checkoutContent');
  if(el)el.innerHTML='<div class="order-success"><div class="succ-anim">🎉</div><div class="succ-title">Order Placed!</div><div class="succ-sub">Thank you, '+name+'!<br/>Your order is confirmed and being prepared.</div><div class="oid-box"><div class="oid-lbl">Order ID</div><div class="oid-val">'+oid+'</div></div><div class="odet"><div class="odet-row"><span style="color:var(--muted)">Payment</span><span>Cash on Delivery</span></div><div class="odet-row"><span style="color:var(--muted)">Delivery</span><span>'+(deliveryFee===0?'FREE':'৳'+deliveryFee)+'</span></div><div class="odet-row"><span style="color:var(--muted)">Total</span><span>৳'+total.toLocaleString()+'</span></div><div class="odet-row"><span style="color:var(--muted)">ETA</span><span>1–3 business days</span></div></div><a href="https://wa.me/8801XXXXXXXXX?text=Order+ID:+'+oid+'" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#25D366;color:#fff;padding:14px;border-radius:12px;text-decoration:none;font-weight:600;font-size:14px;margin-bottom:10px;">Track via WhatsApp</a><button class="btn-outline btn-full" style="border-radius:12px;padding:13px;cursor:pointer;" onclick="navHome()">Continue Shopping</button></div>';
}
