/* ═══════════════════════════════════════════════════════════
   ELVORA — PROMO CODES
   ═══════════════════════════════════════════════════════════
   Customer-entered codes at checkout (separate from events.js,
   which handles automatic site-wide sales). See supabase-schema.sql
   for the `promo_codes` table — that's where you create codes.
   ═══════════════════════════════════════════════════════════ */

/* Renders the small "Have a promo code?" box shown in the cart
   summary — either the entry form, or the applied/success state. */
function renderPromoBox(){
  if(appliedPromo){
    return '<div class="promo-applied" style="display:flex;align-items:center;justify-content:space-between;background:rgba(82,200,154,.09);border:1px solid rgba(82,200,154,.18);border-radius:8px;padding:10px 14px;margin-top:8px;">'
      +'<span style="font-size:12px;color:var(--green);font-weight:600;">✓ "'+appliedPromo.code+'" applied</span>'
      +'<span onclick="removePromoCode()" style="font-size:12px;color:var(--muted);cursor:pointer;text-decoration:underline;">Remove</span></div>';
  }
  return '<div style="margin-top:8px;">'
    +'<div class="promo-row" style="display:flex;gap:8px;">'
    +'<input class="fi" id="promoInput" placeholder="Promo code" style="flex:1;padding:10px 12px;font-size:13px;text-transform:uppercase;"/>'
    +'<button onclick="applyPromoCode()" style="background:linear-gradient(135deg,var(--a2),var(--a3));color:#fff;border:none;border-radius:10px;padding:10px 16px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;">Apply</button>'
    +'</div><div id="promoMsg" style="font-size:11px;color:var(--muted);margin-top:6px;"></div></div>';
}

async function applyPromoCode(){
  var input=document.getElementById('promoInput');
  var msg=document.getElementById('promoMsg');
  var code=input?input.value.trim().toUpperCase():'';
  if(!code){if(msg){msg.textContent='Enter a code first';msg.style.color='var(--muted)';}return;}
  if(!supabaseClient){if(msg)msg.textContent='Promo codes need the site to be connected to Supabase first.';return;}
  if(msg){msg.textContent='Checking...';msg.style.color='var(--muted)';}
  try{
    var res=await supabaseClient.from('promo_codes').select('*').eq('code',code).eq('active',true).limit(1);
    if(res.error)throw res.error;
    var promo=(res.data&&res.data.length)?res.data[0]:null;
    if(!promo){if(msg){msg.textContent='That code isn\'t valid.';msg.style.color='#e05c3a';}return;}
    if(promo.expires_at&&new Date(promo.expires_at)<new Date()){if(msg){msg.textContent='That code has expired.';msg.style.color='#e05c3a';}return;}
    if(promo.max_uses!=null&&promo.times_used>=promo.max_uses){if(msg){msg.textContent='That code has reached its usage limit.';msg.style.color='#e05c3a';}return;}
    var sub=getTotal();
    if(promo.min_order&&sub<promo.min_order){if(msg){msg.textContent='Needs a minimum order of ৳'+promo.min_order.toLocaleString()+' (you have ৳'+sub.toLocaleString()+').';msg.style.color='#e05c3a';}return;}
    appliedPromo={code:promo.code,discount_type:promo.discount_type,discount_value:promo.discount_value,id:promo.id};
    toast('Promo code applied! ✦');
    renderCart();
  }catch(e){
    console.warn('ELVORA: promo code check failed',e);
    if(msg){msg.textContent='Something went wrong checking that code. Try again.';msg.style.color='#e05c3a';}
  }
}

function removePromoCode(){appliedPromo=null;renderCart();}

/* Called from placeOrder() after an order succeeds, so a promo's
   times_used count stays accurate for max_uses limits. */
function recordPromoUsage(){
  if(!appliedPromo||!supabaseClient)return;
  // Supabase JS doesn't support increment-in-place directly without a stored
  // procedure, so we fetch the current count then set it — fine at this
  // volume of usage for a small shop.
  supabaseClient.from('promo_codes').select('times_used').eq('id',appliedPromo.id).limit(1).then(function(res){
    if(res.data&&res.data.length){
      var newCount=(res.data[0].times_used||0)+1;
      supabaseClient.from('promo_codes').update({times_used:newCount}).eq('id',appliedPromo.id);
    }
  });
}
