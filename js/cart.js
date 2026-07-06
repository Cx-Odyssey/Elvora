/* ═══════════════════════════════════════════════════════════
   ELVORA — CART
   ═══════════════════════════════════════════════════════════
   Shopping cart — add/remove/update items, totals, promo code
   entry, and the cart page itself. Item prices already reflect
   any active event discount at the moment they're added (see
   addToCart, which uses applyEventDiscount from events.js).
   ═══════════════════════════════════════════════════════════ */

function saveCart(){localStorage.setItem('el_cart',JSON.stringify(cart));}

function addToCart(id,qty){
  if(!qty)qty=1;var p=PRODUCTS.find(function(x){return x.id===id;});if(!p)return;
  var price=applyEventDiscount(selVarP||p.price);var label=selVarL||null;
  var ex=cart.find(function(x){return x.id===id&&x.variant==label;});
  if(ex)ex.qty+=qty;else cart.push({id:id,qty:qty,price:price,name:p.name,brand:p.brand,variant:label,category:p.category,image:p.image||null});
  saveCart();updateBadges();toast((p.name.length>22?p.name.slice(0,22)+'...':p.name)+' added to cart! 🛍️');
}

function removeFromCart(id,variant){cart=cart.filter(function(x){return!(x.id===id&&x.variant==variant);});saveCart();updateBadges();renderCart();}

function changeCartQty(id,variant,d){var item=cart.find(function(x){return x.id===id&&x.variant==variant;});if(!item)return;item.qty=Math.max(1,item.qty+d);saveCart();updateBadges();renderCart();}

function clearCart(){if(!cart.length)return;cart=[];appliedPromo=null;saveCart();updateBadges();renderCart();}

function getTotal(){return cart.reduce(function(a,b){return a+b.price*b.qty;},0);}

/* How much the currently-applied promo code takes off a given subtotal.
   Returns 0 if no promo is applied. Never discounts below zero. */
function getPromoDiscount(subtotal){
  if(!appliedPromo)return 0;
  if(appliedPromo.discount_type==='percent')return Math.round(subtotal*appliedPromo.discount_value/100);
  return Math.min(subtotal,appliedPromo.discount_value);
}

function renderCart(){
  var el=document.getElementById('cartContent');if(!el)return;
  if(!cart.length){el.innerHTML='<div class="empty-wrap"><div style="font-size:52px;margin-bottom:16px;">🛒</div><h3>Your cart is empty</h3><p>Add your favourite products to get started.</p><button class="btn-primary" onclick="navHome()">Browse Products</button></div>';return;}
  var sub=getTotal();
  var promoOff=getPromoDiscount(sub);
  var freeDeliveryMsg=eventGivesFreeDelivery()
    ?'<div style="background:rgba(82,200,154,.09);border:1px solid rgba(82,200,154,.18);border-radius:8px;padding:10px 14px;margin-bottom:12px;font-size:12px;color:var(--green);font-weight:600;text-align:center;">✦ Free delivery — limited time offer!</div>'
    :'';
  var promoRow=appliedPromo?'<div class="srow" style="color:var(--green);"><span>Promo "'+appliedPromo.code+'"</span><span>-৳'+promoOff.toLocaleString()+'</span></div>':'';
  el.innerHTML=cart.map(function(item,idx){
    var fb=getIll(item.category||'serum',false).replace(/width="\d+"/,'style="width:34px;height:34px;"');
    return '<div class="citem"><div class="citem-img" style="background:'+getGrad(item.category||'serum')+';">'+getProdVisual(item,fb)+'</div>'
      +'<div style="flex:1;"><div class="citem-name">'+item.name+'</div>'
      +'<div class="citem-var">'+item.brand+(item.variant?' · '+item.variant:'')+'</div>'
      +'<div class="citem-price">৳'+(item.price*item.qty).toLocaleString()+'</div>'
      +'<div class="qctrl" style="margin-top:8px;">'
      +'<button class="qbtn" onclick="cartQty('+idx+',-1)">−</button>'
      +'<div class="qnum">'+item.qty+'</div>'
      +'<button class="qbtn" onclick="cartQty('+idx+',1)">+</button></div></div>'
      +'<div class="citem-acts">'
      +'<button class="citem-rm" onclick="cartDel('+idx+')">&#x2715;</button>'
      +'<span style="font-size:12px;color:var(--muted);">৳'+item.price.toLocaleString()+'</span>'
      +'</div></div>';
  }).join('')
    +'<div class="csumm">'
    +'<div class="srow"><span>Subtotal</span><span>৳'+sub.toLocaleString()+'</span></div>'
    +promoRow
    +'<div class="srow"><span>Delivery</span><span style="color:var(--rose2);font-size:12px;">'+(eventGivesFreeDelivery()?'FREE (limited time)':'Dhaka ৳80 · Outside ৳150')+'</span></div>'
    +'<div class="srow tot"><span>Total</span><span>৳'+Math.max(0,sub-promoOff).toLocaleString()+'</span></div>'
    +freeDeliveryMsg
    +renderPromoBox()
    +'<p style="font-size:11px;color:var(--muted);text-align:center;margin:12px 0;">Delivery calculated at checkout</p>'
    +'<button class="ckbtn" onclick="navCheckout()">Proceed to Checkout →</button></div>';
}

function cartQty(idx,d){if(idx<0||idx>=cart.length)return;cart[idx].qty=Math.max(1,cart[idx].qty+d);saveCart();updateBadges();renderCart();}

function cartDel(idx){if(idx<0||idx>=cart.length)return;cart.splice(idx,1);saveCart();updateBadges();renderCart();}

function updateBadges(){var total=cart.reduce(function(a,b){return a+b.qty;},0);var cb=document.getElementById('cartBadgeC');if(cb){cb.textContent=total;cb.style.display=total?'flex':'none';}var wb=document.getElementById('wishBadge');if(wb){wb.textContent=wishlist.length;wb.style.display=wishlist.length?'flex':'none';}}
