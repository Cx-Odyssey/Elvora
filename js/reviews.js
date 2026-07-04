/* ═══════════════════════════════════════════════════════════
   ELVORA — REVIEWS
   ═══════════════════════════════════════════════════════════
   Writing and submitting product reviews — now saved to a shared
   Supabase table so every visitor sees them, not just the person
   who wrote it. One review per signed-in customer per product,
   enforced both here and by a unique constraint in the database.
   ═══════════════════════════════════════════════════════════ */

function openReview(){
  revStar=0;document.querySelectorAll('.spick').forEach(function(s){s.classList.remove('lit');});
  if(!currentUser){toast('Please sign in to leave a review');openAuth('login');return;}
  var orders=JSON.parse(localStorage.getItem('el_orders')||'[]');
  var bought=orders.some(function(o){return o.items&&o.items.some(function(i){return i.id===curRevProd;});});
  document.getElementById('rvName').value=(currentUser.fname+' '+(currentUser.lname||'')).trim();
  document.getElementById('rvText').value='';
  var notice=document.getElementById('rvNote');
  if(notice){notice.style.display='flex';if(bought){notice.textContent='✓ Verified Purchase — gets a special badge';notice.style.cssText='display:flex;align-items:center;gap:6px;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:500;margin-bottom:16px;background:rgba(82,200,154,.09);color:var(--green);border:1px solid rgba(82,200,154,.18);';}else{notice.textContent='ℹ Buy this product to earn a Verified badge';notice.style.cssText='display:flex;align-items:center;gap:6px;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:500;margin-bottom:16px;background:rgba(180,168,208,.06);color:var(--muted);border:1px solid var(--border)';}}
  openModal('reviewModal');
}

function setStar(n){revStar=n;document.querySelectorAll('.spick').forEach(function(s,i){s.classList.toggle('lit',i<n);});}

async function submitReview(){
  var name=document.getElementById('rvName')?document.getElementById('rvName').value.trim():'';
  var text=document.getElementById('rvText')?document.getElementById('rvText').value.trim():'';
  if(!name||!text||!revStar){toast('Please fill all fields and select a rating');return;}
  if(!currentUser){toast('Please sign in first');return;}
  if(!supabaseClient){toast('Reviews need the site to be connected to Supabase first.');return;}
  var orders=JSON.parse(localStorage.getItem('el_orders')||'[]');
  var bought=orders.some(function(o){return o.items&&o.items.some(function(i){return i.id===curRevProd;});});
  try{
    var res=await supabaseClient.from('reviews').insert([{
      product_id:curRevProd,user_id:currentUser.id,author_name:name,
      rating:revStar,body:text,verified:bought
    }]);
    if(res.error)throw res.error;
    closeModal('reviewModal');
    var p=PRODUCTS.find(function(x){return x.id===curRevProd;});
    if(curProd===curRevProd&&p)renderPdRevs(curRevProd,p);
    toast(bought?'Review posted with Verified badge! ✓':'Review posted! Thank you 🌸');
  }catch(e){
    console.warn('ELVORA: review submit failed',e);
    if(e.code==='23505')toast('You have already reviewed this product');
    else toast('Something went wrong posting your review. Try again.');
  }
}
