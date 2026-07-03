/* ═══════════════════════════════════════════════════════════
   ELVORA — ACCOUNT
   ═══════════════════════════════════════════════════════════
   The Account page, wishlist (synced to Supabase for signed-in
   customers), recently-viewed, order detail, and Edit Profile
   (including avatar photo upload to Supabase Storage).
   ═══════════════════════════════════════════════════════════ */

function renderAccount(){
  var el=document.getElementById('accountContent');if(!el)return;
  if(!currentUser){el.innerHTML='<div class="nlogged"><div style="font-size:52px;margin-bottom:16px;">👤</div><h3>Sign In to Your Account</h3><p>Track orders, manage your wishlist, check out faster.</p><div class="auth-btns"><button class="btn-rose" onclick="openAuthLogin()">Sign In</button><button class="btn-outline btn-full" style="border-radius:10px;margin-top:2px;" onclick="openAuthRegister()">Create Account</button></div></div>';return;}
  var avHtml=currentUser.avatar
    ?'<img src="'+currentUser.avatar+'" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>'
    :'<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  el.innerHTML='<div class="acc-hero"><div class="acc-av">'+avHtml+'</div><div class="acc-name">'+currentUser.fname+' '+(currentUser.lname||'')+'</div><div class="acc-email">'+currentUser.email+'</div></div>'
    +'<div class="msec"><div class="msec-ttl">My Account</div>'
    +'<div class="mitem" onclick="renderMyOrders()"><div class="mitem-ic"><svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg></div><div class="mitem-lbl">My Orders</div><div class="mitem-arr">›</div></div>'
    +'<div class="mitem" onclick="renderMyReviews()"><div class="mitem-ic"><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><div class="mitem-lbl">My Reviews</div><div class="mitem-arr">›</div></div>'
    +'<div class="mitem" onclick="renderMyReturns()"><div class="mitem-ic"><svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg></div><div class="mitem-lbl">My Returns</div><div class="mitem-arr">›</div></div>'
    +'<div class="mitem" onclick="renderEditProfile()"><div class="mitem-ic"><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div><div class="mitem-lbl">Edit Profile</div><div class="mitem-arr">›</div></div></div>'
    +'<div class="msec"><div class="msec-ttl">About</div>'
    +'<div class="mitem" onclick="navOutletInfo()"><div class="mitem-ic"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div><div class="mitem-lbl">Our Store</div><div class="mitem-arr">›</div></div>'
    +'<div class="mitem" onclick="navAbout()"><div class="mitem-ic"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z"/></svg></div><div class="mitem-lbl">Our Story</div><div class="mitem-arr">›</div></div>'
    +'<div class="mitem" onclick="navPolicies()"><div class="mitem-ic"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div class="mitem-lbl">Policies</div><div class="mitem-arr">›</div></div></div>'
    +'<div class="msec"><div class="msec-ttl">Support</div>'
    +'<div class="mitem" onclick="openWA()"><div class="mitem-ic"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></div><div class="mitem-lbl">WhatsApp Support</div><div class="mitem-arr">›</div></div></div>'
    +'<div class="msec"><div class="mitem" onclick="logout()" style="background:rgba(192,57,43,.07);border-color:rgba(192,57,43,.12);"><div class="mitem-ic" style="background:rgba(192,57,43,.1);border-color:rgba(192,57,43,.18);"><svg viewBox="0 0 24 24" style="stroke:#e05c3a;"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div><div class="mitem-lbl" style="color:#e05c3a;">Sign Out</div></div></div>';
}

/* EDIT PROFILE — reuses the authModal sheet, same pattern as showOrderDetail */

function renderEditProfile(){
  if(!currentUser)return;
  var avHtml=currentUser.avatar
    ?'<img src="'+currentUser.avatar+'" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>'
    :'<svg viewBox="0 0 24 24" style="width:32px;height:32px;stroke:var(--muted);stroke-width:1.5;fill:none;"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  var ac=document.getElementById('authContent');
  ac.innerHTML='<div class="shdl"></div><div style="display:flex;align-items:center;gap:10px;padding:0 0 16px;cursor:pointer;" onclick="closeAuthModal()"><div class="back-ic"><svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:var(--text);stroke-width:2;fill:none;"><polyline points="15 18 9 12 15 6"/></svg></div><div style="font-size:15px;font-weight:600;color:var(--text);">Edit Profile</div></div>'
    +'<div style="text-align:center;margin-bottom:22px;">'
    +'<div style="position:relative;display:inline-block;cursor:pointer;" onclick="document.getElementById(\'avatarInput\').click()">'
    +'<div class="acc-av" style="width:84px;height:84px;margin-bottom:0;">'+avHtml+'</div>'
    +'<div style="position:absolute;bottom:0;right:0;width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--rose),var(--rose2));border:2.5px solid var(--card);display:flex;align-items:center;justify-content:center;"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:#fff;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round;"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg></div>'
    +'</div>'
    +'<div style="margin-top:10px;font-size:13px;color:var(--link);font-weight:600;cursor:pointer;padding:4px 0;" onclick="document.getElementById(\'avatarInput\').click()">Change Photo</div>'
    +'<input type="file" accept="image/*" id="avatarInput" style="display:none;" onchange="uploadAvatar(this)"/>'
    +'<div id="avatarMsg" style="font-size:11px;color:var(--muted);margin-top:4px;"></div></div>'
    +'<div class="fg"><label class="fl">First Name</label><input class="fi" id="ep_fname" value="'+currentUser.fname+'"/></div>'
    +'<div class="fg"><label class="fl">Last Name</label><input class="fi" id="ep_lname" value="'+(currentUser.lname||'')+'"/></div>'
    +'<div class="fg"><label class="fl">Phone</label><input class="fi" id="ep_phone" value="'+(currentUser.phone||'')+'"/></div>'
    +'<div class="fg"><label class="fl">Email</label><input class="fi" value="'+currentUser.email+'" disabled style="opacity:.6;"/></div>'
    +'<button class="btn-rose btn-full" id="saveProfileBtn" onclick="saveProfileEdits()">Save Changes</button>';
  openModal('authModal');
}

async function saveProfileEdits(){
  if(!currentUser||!supabaseClient)return;
  var fname=document.getElementById('ep_fname').value.trim();
  var lname=document.getElementById('ep_lname').value.trim();
  var phone=document.getElementById('ep_phone').value.trim();
  if(!fname){toast('First name is required');return;}
  var btn=document.getElementById('saveProfileBtn');if(btn){btn.disabled=true;btn.textContent='Saving...';}
  try{
    var res=await supabaseClient.from('profiles').update({fname:fname,lname:lname,phone:phone}).eq('id',currentUser.id);
    if(res.error)throw res.error;
    currentUser.fname=fname;currentUser.lname=lname;currentUser.phone=phone;
    closeModal('authModal');renderAccount();toast('Profile updated');
  }catch(e){
    console.warn('ELVORA: profile save failed',e);toast('Could not save changes. Try again.');
  }finally{
    if(btn){btn.disabled=false;btn.textContent='Save Changes';}
  }
}

async function uploadAvatar(input){
  if(!currentUser||!supabaseClient||!input.files||!input.files[0])return;
  var file=input.files[0];
  var msg=document.getElementById('avatarMsg');
  if(file.size>3*1024*1024){if(msg)msg.textContent='Image too large — please pick one under 3MB.';return;}
  if(msg){msg.textContent='Uploading...';msg.style.color='var(--muted)';}
  try{
    var ext=file.name.split('.').pop();
    var path=currentUser.id+'/avatar.'+ext;
    var upRes=await supabaseClient.storage.from('avatars').upload(path,file,{upsert:true});
    if(upRes.error)throw upRes.error;
    var pub=supabaseClient.storage.from('avatars').getPublicUrl(path);
    var url=pub.data.publicUrl+'?t='+Date.now(); // cache-bust so the new photo shows immediately
    var res=await supabaseClient.from('profiles').update({avatar_url:url}).eq('id',currentUser.id);
    if(res.error)throw res.error;
    currentUser.avatar=url;
    if(msg){msg.textContent='Photo updated ✓';msg.style.color='var(--green)';}
    renderEditProfile();renderAccount();
  }catch(e){
    console.warn('ELVORA: avatar upload failed',e);
    if(msg){msg.textContent='Upload failed. Make sure the "avatars" bucket exists in Supabase (see SETUP.md).';msg.style.color='#e05c3a';}
  }
}

/* MY ORDERS — full order list (the account home page only used to show
   3 inline, which felt sparse; this shows everything, each still
   tapping into the existing showOrderDetail sheet). */

function renderMyOrders(){
  var orders=JSON.parse(localStorage.getItem('el_orders')||'[]');
  var sc={Delivered:{bg:'rgba(82,200,154,.1)',c:'var(--green)'},Shipped:{bg:'rgba(120,80,220,.1)',c:'#a080e0'},Processing:{bg:'rgba(212,165,70,.1)',c:'var(--gold)'},Confirmed:{bg:'var(--surface)',c:'var(--muted)'}};
  var oHtml=orders.length
    ?orders.map(function(o){var st=sc[o.status]||sc.Confirmed;return '<div class="mitem" onclick="showOrderDetail(\''+o.id+'\')"><div class="mitem-ic"><svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg></div><div style="flex:1;"><div class="mitem-lbl">'+o.id+'</div><div style="font-size:12px;color:var(--muted);">'+o.date+' · ৳'+o.total.toLocaleString()+'</div></div><div class="mbadge" style="background:'+st.bg+';color:'+st.c+';">'+o.status+'</div></div>';}).join('')
    :'<div style="text-align:center;padding:28px 0;font-size:13px;color:var(--muted);">No orders yet. Start shopping!</div>';
  var ac=document.getElementById('authContent');
  ac.innerHTML='<div class="shdl"></div><div style="display:flex;align-items:center;gap:10px;padding:0 0 16px;cursor:pointer;" onclick="closeAuthModal()"><div class="back-ic"><svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:var(--text);stroke-width:2;fill:none;"><polyline points="15 18 9 12 15 6"/></svg></div><div style="font-size:15px;font-weight:600;color:var(--text);">My Orders</div></div>'+oHtml;
  openModal('authModal');
}

/* MY REVIEWS — every review the signed-in customer has written,
   fetched straight from the shared reviews table. */

async function renderMyReviews(){
  var ac=document.getElementById('authContent');
  ac.innerHTML='<div class="shdl"></div><div style="display:flex;align-items:center;gap:10px;padding:0 0 16px;cursor:pointer;" onclick="closeAuthModal()"><div class="back-ic"><svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:var(--text);stroke-width:2;fill:none;"><polyline points="15 18 9 12 15 6"/></svg></div><div style="font-size:15px;font-weight:600;color:var(--text);">My Reviews</div></div><div style="text-align:center;padding:28px 0;font-size:13px;color:var(--muted);">Loading...</div>';
  openModal('authModal');
  if(!currentUser||!supabaseClient)return;
  try{
    var res=await supabaseClient.from('reviews').select('*').eq('user_id',currentUser.id).order('created_at',{ascending:false});
    if(res.error)throw res.error;
    var revs=res.data||[];
    var html=revs.length?revs.map(function(r){
      var p=PRODUCTS.find(function(x){return x.id===r.product_id;});
      var pname=p?p.name:'Product';
      return '<div class="fcard" style="margin-bottom:12px;" onclick="openProd('+r.product_id+');closeAuthModal();"><div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:4px;">'+pname+'</div><div class="rv-stars" style="margin-bottom:6px;"><span>'+('★'.repeat(r.rating))+'</span></div><div style="font-size:13px;color:var(--text2);line-height:1.6;">'+r.body+'</div>'+(r.verified?'<div class="verified" style="margin-top:8px;">✓ Verified Purchase</div>':'')+'</div>';
    }).join(''):'<div style="text-align:center;padding:28px 0;font-size:13px;color:var(--muted);">You haven\'t written any reviews yet.</div>';
    ac.innerHTML='<div class="shdl"></div><div style="display:flex;align-items:center;gap:10px;padding:0 0 16px;cursor:pointer;" onclick="closeAuthModal()"><div class="back-ic"><svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:var(--text);stroke-width:2;fill:none;"><polyline points="15 18 9 12 15 6"/></svg></div><div style="font-size:15px;font-weight:600;color:var(--text);">My Reviews</div></div>'+html;
  }catch(e){
    console.warn('ELVORA: could not load your reviews',e);
    ac.innerHTML='<div class="shdl"></div><div style="display:flex;align-items:center;gap:10px;padding:0 0 16px;cursor:pointer;" onclick="closeAuthModal()"><div class="back-ic"><svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:var(--text);stroke-width:2;fill:none;"><polyline points="15 18 9 12 15 6"/></svg></div><div style="font-size:15px;font-weight:600;color:var(--text);">My Reviews</div></div><div style="text-align:center;padding:28px 0;font-size:13px;color:var(--muted);">Could not load your reviews. Try again.</div>';
  }
}

/* MY RETURNS — real request-a-return flow, backed by the
   return_requests table (see supabase-schema.sql). */

async function renderMyReturns(){
  var ac=document.getElementById('authContent');
  ac.innerHTML='<div class="shdl"></div><div style="display:flex;align-items:center;gap:10px;padding:0 0 16px;cursor:pointer;" onclick="closeAuthModal()"><div class="back-ic"><svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:var(--text);stroke-width:2;fill:none;"><polyline points="15 18 9 12 15 6"/></svg></div><div style="font-size:15px;font-weight:600;color:var(--text);">My Returns</div></div><div style="text-align:center;padding:28px 0;font-size:13px;color:var(--muted);">Loading...</div>';
  openModal('authModal');
  if(!currentUser||!supabaseClient)return;
  var orders=JSON.parse(localStorage.getItem('el_orders')||'[]');
  var optHtml=orders.length?orders.map(function(o){return '<option value="'+o.id+'">'+o.id+' — ৳'+o.total.toLocaleString()+'</option>';}).join(''):'';
  var formHtml=orders.length
    ?'<div class="fcard"><div class="fcard-ttl"><svg viewBox="0 0 24 24" style="stroke:var(--link);stroke-width:1.75;fill:none;"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>Request a Return</div><div class="fg"><label class="fl">Order</label><select class="fi" id="ret_order">'+optHtml+'</select></div><div class="fg"><label class="fl">Reason</label><textarea class="fta" id="ret_reason" placeholder="What went wrong with this order?"></textarea></div><button class="btn-rose btn-full" id="retSubmitBtn" onclick="submitReturnRequest()">Submit Request</button></div>'
    :'';
  try{
    var res=await supabaseClient.from('return_requests').select('*').eq('user_id',currentUser.id).order('created_at',{ascending:false});
    if(res.error)throw res.error;
    var reqs=res.data||[];
    var listHtml=reqs.length?reqs.map(function(r){return '<div class="mitem"><div class="mitem-ic"><svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg></div><div style="flex:1;"><div class="mitem-lbl">'+r.order_id+'</div><div style="font-size:12px;color:var(--muted);">'+r.reason.slice(0,40)+(r.reason.length>40?'...':'')+'</div></div><div class="mbadge" style="background:var(--surface);color:var(--muted);">'+r.status+'</div></div>';}).join(''):'<div style="text-align:center;padding:16px 0;font-size:13px;color:var(--muted);">No return requests yet.</div>';
    ac.innerHTML='<div class="shdl"></div><div style="display:flex;align-items:center;gap:10px;padding:0 0 16px;cursor:pointer;" onclick="closeAuthModal()"><div class="back-ic"><svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:var(--text);stroke-width:2;fill:none;"><polyline points="15 18 9 12 15 6"/></svg></div><div style="font-size:15px;font-weight:600;color:var(--text);">My Returns</div></div>'+formHtml+'<div class="pd-lbl" style="margin-top:4px;">Your Requests</div>'+listHtml;
  }catch(e){
    console.warn('ELVORA: could not load return requests',e);
    ac.innerHTML='<div class="shdl"></div><div style="display:flex;align-items:center;gap:10px;padding:0 0 16px;cursor:pointer;" onclick="closeAuthModal()"><div class="back-ic"><svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:var(--text);stroke-width:2;fill:none;"><polyline points="15 18 9 12 15 6"/></svg></div><div style="font-size:15px;font-weight:600;color:var(--text);">My Returns</div></div>'+formHtml+'<div style="text-align:center;padding:16px 0;font-size:13px;color:var(--muted);">Could not load your past requests.</div>';
  }
}

async function submitReturnRequest(){
  var orderSel=document.getElementById('ret_order');
  var reasonEl=document.getElementById('ret_reason');
  var orderId=orderSel?orderSel.value:'';
  var reason=reasonEl?reasonEl.value.trim():'';
  if(!orderId||!reason){toast('Please select an order and describe the reason');return;}
  if(!currentUser||!supabaseClient)return;
  var btn=document.getElementById('retSubmitBtn');if(btn){btn.disabled=true;btn.textContent='Submitting...';}
  try{
    var res=await supabaseClient.from('return_requests').insert([{order_id:orderId,user_id:currentUser.id,reason:reason}]);
    if(res.error)throw res.error;
    toast('Return request submitted — we\'ll be in touch');
    renderMyReturns();
  }catch(e){
    console.warn('ELVORA: return request failed',e);toast('Could not submit request. Try again.');
    if(btn){btn.disabled=false;btn.textContent='Submit Request';}
  }
}

function showOrderDetail(oid){
  var orders=JSON.parse(localStorage.getItem('el_orders')||'[]');var order=orders.find(function(o){return o.id===oid;});if(!order){toast('Order not found');return;}
  var steps=['Confirmed','Processing','Shipped','Out for Delivery','Delivered'];var cur=steps.indexOf(order.status);
  var sh='';steps.forEach(function(step,i){var done=i<cur,active=i===cur;var bg=(done||active)?'linear-gradient(135deg,var(--a1),var(--a2))':'var(--border)';var inner=done?'<svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:#fff;stroke-width:2.5;fill:none;"><polyline points="20 6 9 17 4 12"/></svg>':active?'<div style="width:8px;height:8px;border-radius:50%;background:#fff;"></div>':'<div style="width:8px;height:8px;border-radius:50%;background:var(--muted);"></div>';var line=i<steps.length-1?'<div style="position:absolute;left:13px;top:36px;width:2px;height:18px;background:'+(done?'var(--rose)':'var(--border)')+';"></div>':'';sh+='<div style="display:flex;align-items:center;gap:12px;padding:8px 0;position:relative;"><div style="width:28px;height:28px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:'+bg+';">'+inner+'</div>'+line+'<div><div style="font-size:13px;font-weight:'+(active?700:500)+';color:'+((done||active)?'var(--text)':'var(--muted)')+';">'+step+'</div>'+(active?'<div style="font-size:11px;color:var(--rose2);">Current Status</div>':'')+'</div></div>';});
  var ih=(order.items||[]).map(function(i){return '<div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text2);padding:4px 0;">'+i.name+(i.variant?' · '+i.variant:'')+' ×'+i.qty+'<span style="font-weight:600;color:var(--text);">৳'+(i.price*i.qty).toLocaleString()+'</span></div>';}).join('');
  var ac=document.getElementById('authContent');
  ac.innerHTML='<div class="shdl"></div><div style="display:flex;align-items:center;gap:10px;padding:0 0 16px;cursor:pointer;" onclick="closeAuthModal()"><div class="back-ic"><svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:var(--text);stroke-width:2;fill:none;"><polyline points="15 18 9 12 15 6"/></svg></div><div style="font-size:15px;font-weight:600;color:var(--text);">Order Details</div></div>'
    +'<div style="background:var(--elevated);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:20px;"><div style="font-size:10px;color:var(--muted);font-weight:600;letter-spacing:1px;text-transform:uppercase;">Order ID</div><div style="font-size:18px;font-weight:700;color:var(--rose2);">'+order.id+'</div><div style="font-size:13px;color:var(--muted);margin-top:4px;">'+order.date+' · ৳'+order.total.toLocaleString()+'</div></div>'
    +'<div style="margin-bottom:20px;"><div style="font-size:10px;color:var(--muted);font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;">Status</div>'+sh+'</div>'
    +'<div style="background:var(--card);border-radius:12px;padding:14px;border:1px solid var(--border);margin-bottom:16px;"><div style="font-size:10px;color:var(--muted);font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;">Items</div>'+ih+'</div>'
    +'<a href="https://wa.me/8801XXXXXXXXX?text=Order+ID:+'+order.id+'" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#25D366;color:#fff;padding:14px;border-radius:12px;text-decoration:none;font-weight:600;font-size:14px;">Track via WhatsApp</a>';
  openModal('authModal');
}

/* WISHLIST — synced to Supabase for signed-in customers, falls
   back to localStorage-only if signed out or not connected. */

function saveWishLocal(){localStorage.setItem('el_wish',JSON.stringify(wishlist));}

async function loadWishlistFromBackend(){
  if(!currentUser||!supabaseClient)return;
  try{
    var res=await supabaseClient.from('wishlists').select('product_id').eq('user_id',currentUser.id);
    if(res.error)throw res.error;
    wishlist=(res.data||[]).map(function(r){return r.product_id;});
    saveWishLocal();
  }catch(e){console.warn('ELVORA: could not load wishlist from Supabase',e);}
}

function toggleWish(id){
  var idx=wishlist.indexOf(id);
  var adding=idx===-1;
  if(adding)wishlist.push(id);else wishlist.splice(idx,1);
  saveWishLocal();updateBadges();
  var btn=document.getElementById('wish-'+id);
  if(btn){var s=btn.querySelector('svg');if(s){s.style.fill=wishlist.includes(id)?'var(--rose)':'none';s.style.stroke=wishlist.includes(id)?'var(--rose)':'var(--text2)';}}
  toast(adding?'Saved to wishlist ❤️':'Removed from wishlist');
  if(currentUser&&supabaseClient){
    if(adding)supabaseClient.from('wishlists').insert([{user_id:currentUser.id,product_id:id}]).then(function(res){if(res.error)console.warn('ELVORA: wishlist sync failed',res.error);});
    else supabaseClient.from('wishlists').delete().eq('user_id',currentUser.id).eq('product_id',id).then(function(res){if(res.error)console.warn('ELVORA: wishlist sync failed',res.error);});
  }
}

function renderWishlist(){
  var el=document.getElementById('wishlistContent');if(!el)return;
  if(!wishlist.length){el.innerHTML='<div class="wl-empty"><div style="font-size:52px;margin-bottom:16px;">🤍</div><h3>Your wishlist is empty</h3><p>Tap the heart on any product to save it here.</p><button class="btn-primary" onclick="navHome()">Discover Products</button></div>';return;}
  var prods=PRODUCTS.filter(function(p){return wishlist.includes(p.id);});
  var h='<div style="font-family:var(--serif);font-size:22px;font-weight:400;color:var(--text);padding:4px 0 14px;">'+prods.length+' Saved Item'+(prods.length>1?'s':'')+'</div><div class="pgrid" style="padding:0;">';
  prods.forEach(function(p){var ev=getEventPrice(p);h+='<div class="pcard" onclick="openProd('+p.id+')"><div class="pcard-img" style="background:'+getGrad(p.category)+';">'+getProdVisual(p,'<div class="pcard-ill">'+getIll(p.category,false)+'<span>'+p.category+'</span></div>')+(p.badge?'<div class="pbadge best">'+p.badge+'</div>':'')+'<button class="pwish" onclick="event.stopPropagation();toggleWish('+p.id+')"><svg viewBox="0 0 24 24" style="width:13px;height:13px;stroke:var(--rose);stroke-width:2;fill:var(--rose);stroke-linecap:round;stroke-linejoin:round;"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></button></div><div class="pinfo"><div class="pbrand">'+p.brand+'</div><div class="pname">'+p.name+'</div><div class="ppr-row"><span class="pprice">৳'+ev.price.toLocaleString()+'</span><button class="padd" onclick="event.stopPropagation();addToCart('+p.id+',1)">+</button></div></div></div>';});
  el.innerHTML=h+'</div>';
}

/* RECENTLY VIEWED — stays local; this is standard behaviour even
   on major sites (browsing history isn't account data). */

function addToRecent(id){recent=recent.filter(function(x){return x!==id;});recent.unshift(id);if(recent.length>8)recent=recent.slice(0,8);localStorage.setItem('el_recent',JSON.stringify(recent));renderRecent();}

function renderRecent(){
  var sec=document.getElementById('rvSection');var list=document.getElementById('rvList');if(!sec||!list)return;
  var prods=recent.map(function(id){return PRODUCTS.find(function(p){return p.id===id;});}).filter(Boolean);
  if(!prods.length){sec.style.display='none';return;}
  sec.style.display='block';
  list.innerHTML=prods.map(function(p){var fb=getIll(p.category,false).replace(/width="\d+"/,'style="width:30px;height:30px;opacity:.8;"');var ev=getEventPrice(p);return '<div class="rvc" onclick="openProd('+p.id+')"><div class="rvc-img" style="background:'+getGrad(p.category)+';opacity:.85;">'+getProdVisual(p,fb)+'</div><div class="rvc-name">'+p.name+'</div><div class="rvc-price">৳'+ev.price.toLocaleString()+'</div></div>';}).join('');
}
