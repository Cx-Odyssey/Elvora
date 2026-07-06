/* ═══════════════════════════════════════════════════════════
   ELVORA — REVIEWS
   ═══════════════════════════════════════════════════════════
   Writing and submitting product reviews — saved to a shared
   Supabase table so every visitor sees them, not just the person
   who wrote it. Reviewing is gated to customers who actually
   bought AND received this exact product (order status must be
   "Delivered" — you set that yourself in Supabase's Table Editor
   once you've confirmed delivery). One review per customer per
   product, enforced both here and by a unique database constraint.
   ═══════════════════════════════════════════════════════════ */

/* Checks Supabase directly (not localStorage) so this works
   correctly across devices — the authoritative record of what
   someone actually received is the orders table, not this browser. */
async function hasReceivedProduct(productId){
  if(!currentUser||!supabaseClient)return false;
  try{
    var res=await supabaseClient.from('orders').select('items').eq('user_id',currentUser.id).eq('status','Delivered');
    if(res.error)throw res.error;
    return (res.data||[]).some(function(o){return o.items&&o.items.some(function(i){return i.id===productId;});});
  }catch(e){
    console.warn('ELVORA: could not verify purchase history',e);
    return false;
  }
}

async function openReview(){
  revStar=0;document.querySelectorAll('.spick').forEach(function(s){s.classList.remove('lit');});
  if(!currentUser){toast('Please sign in to leave a review');openAuth('login');return;}
  if(!supabaseClient){toast('Reviews need the site to be connected to Supabase first.');return;}
  toast('Checking your order history...');
  var already=await supabaseClient.from('reviews').select('id').eq('product_id',curRevProd).eq('user_id',currentUser.id).limit(1);
  if(already.data&&already.data.length){toast('You\'ve already reviewed this product');return;}
  var eligible=await hasReceivedProduct(curRevProd);
  if(!eligible){toast('Reviews are only available once your order for this product is delivered');return;}
  document.getElementById('rvName').value=(currentUser.fname+' '+(currentUser.lname||'')).trim();
  document.getElementById('rvText').value='';
  var notice=document.getElementById('rvNote');
  if(notice){notice.style.display='flex';notice.textContent='✓ Verified Purchase — your order was delivered';notice.style.cssText='display:flex;align-items:center;gap:6px;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:500;margin-bottom:16px;background:rgba(82,200,154,.09);color:var(--green);border:1px solid rgba(82,200,154,.18);';}
  openModal('reviewModal');
}

function setStar(n){revStar=n;document.querySelectorAll('.spick').forEach(function(s,i){s.classList.toggle('lit',i<n);});}

async function submitReview(){
  var name=document.getElementById('rvName')?document.getElementById('rvName').value.trim():'';
  var text=document.getElementById('rvText')?document.getElementById('rvText').value.trim():'';
  if(!name||!text||!revStar){toast('Please fill all fields and select a rating');return;}
  if(!currentUser){toast('Please sign in first');return;}
  if(!supabaseClient){toast('Reviews need the site to be connected to Supabase first.');return;}
  // Re-verify eligibility right before writing, as a defense-in-depth check
  // rather than trusting only the gate that ran when the modal opened.
  var eligible=await hasReceivedProduct(curRevProd);
  if(!eligible){toast('Reviews are only available once your order for this product is delivered');closeModal('reviewModal');return;}
  try{
    var res=await supabaseClient.from('reviews').insert([{
      product_id:curRevProd,user_id:currentUser.id,author_name:name,
      rating:revStar,body:text,verified:true,avatar_url:currentUser.avatar||null
    }]);
    if(res.error)throw res.error;
    closeModal('reviewModal');
    var p=PRODUCTS.find(function(x){return x.id===curRevProd;});
    if(curProd===curRevProd&&p)renderPdRevs(curRevProd,p);
    toast('Review posted with Verified badge! ✓');
  }catch(e){
    console.warn('ELVORA: review submit failed',e);
    if(e.code==='23505')toast('You have already reviewed this product');
    else toast('Something went wrong posting your review. Try again.');
  }
}
