/* ═══════════════════════════════════════════════════════════
   ELVORA — AUTH
   ═══════════════════════════════════════════════════════════
   Real accounts via Supabase Auth — passwords are hashed and
   stored by Supabase itself, never in plain text anywhere in
   this app or its database. currentUser is a plain object built
   from the signed-in session + the matching profiles row, kept
   in the same shape the rest of the app already expects
   (fname, lname, email, phone, avatar) so account.js, checkout.js
   etc. don't need to know the difference.

   Phone OTP here is still a visual demo, not real SMS — see
   SETUP.md for wiring up a real SMS provider.
   ═══════════════════════════════════════════════════════════ */

function openAuth(mode){
  var el=document.getElementById('authContent');if(!el)return;
  if(mode==='login'){el.innerHTML='<div class="shdl"></div><div class="sh-tt">Welcome back</div><div class="sh-ss">Sign in to your ELVORA account</div><button class="btn-google" onclick="gLogin()"><div class="glogo">G</div>Continue with Google</button><div class="divdr"><div style="flex:1;height:1px;background:var(--border);"></div>or with email<div style="flex:1;height:1px;background:var(--border);"></div></div><div class="fg"><label class="fl">Email</label><input class="fi" id="l_email" type="email" placeholder="your@email.com" oninput="lvEmail(this)"/><div class="ferr" id="l_email_err">Please enter a valid email</div></div><div class="fg"><label class="fl">Password</label><input class="fi" id="l_pass" type="password" placeholder="••••••••"/></div><button class="btn-rose btn-full" id="loginBtn" onclick="doLogin()">Sign In</button><div class="swlink">No account? <a onclick="openAuthRegister()">Create one</a></div>';}
  else{el.innerHTML='<div class="shdl"></div><div class="sh-tt">Create Account</div><div class="sh-ss">Join ELVORA for exclusive deals</div><button class="btn-google" onclick="gLogin()"><div class="glogo">G</div>Continue with Google</button><div class="divdr"><div style="flex:1;height:1px;background:var(--border);"></div>or with email<div style="flex:1;height:1px;background:var(--border);"></div></div><div class="frow"><div class="fg"><label class="fl">First Name *</label><input class="fi" id="r_fname" placeholder="Tasnim"/></div><div class="fg"><label class="fl">Last Name</label><input class="fi" id="r_lname" placeholder="Rahman"/></div></div><div class="fg"><label class="fl">Email *</label><input class="fi" id="r_email" type="email" placeholder="your@email.com" oninput="lvEmail(this)"/><div class="ferr" id="r_email_err">Enter valid email</div></div><div class="fg" id="phoneGrp"><label class="fl">Phone * <span style="font-size:10px;color:var(--muted);">(OTP verified)</span></label><div style="display:flex;gap:8px;"><input class="fi" id="r_phone" placeholder="01XXXXXXXXX" style="flex:1;" oninput="lvPhone(this)"/><button onclick="reqOTP()" style="background:linear-gradient(135deg,var(--a2),var(--a3));color:#fff;border:none;border-radius:10px;padding:10px 14px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;flex-shrink:0;">Send OTP</button></div><div class="ferr" id="r_phone_err">Valid BD number required</div></div><div class="fg" id="otpGrp" style="display:none;"><label class="fl">6-digit OTP <span id="otpTmrL" style="color:var(--rose2);font-size:11px;"></span></label><div class="otp-row"><input class="otp-in" id="otp1" type="tel" inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code" maxlength="1" oninput="otpNxt(this,2)" onkeydown="otpBack(event,this,null)"/><input class="otp-in" id="otp2" type="tel" inputmode="numeric" pattern="[0-9]*" maxlength="1" oninput="otpNxt(this,3)" onkeydown="otpBack(event,this,1)"/><input class="otp-in" id="otp3" type="tel" inputmode="numeric" pattern="[0-9]*" maxlength="1" oninput="otpNxt(this,4)" onkeydown="otpBack(event,this,2)"/><input class="otp-in" id="otp4" type="tel" inputmode="numeric" pattern="[0-9]*" maxlength="1" oninput="otpNxt(this,5)" onkeydown="otpBack(event,this,3)"/><input class="otp-in" id="otp5" type="tel" inputmode="numeric" pattern="[0-9]*" maxlength="1" oninput="otpNxt(this,6)" onkeydown="otpBack(event,this,4)"/><input class="otp-in" id="otp6" type="tel" inputmode="numeric" pattern="[0-9]*" maxlength="1" oninput="otpNxt(this,null)" onkeydown="otpBack(event,this,5)"/></div><div style="display:flex;gap:8px;"><button onclick="confirmOTP()" class="btn-rose" style="flex:1;padding:11px;border-radius:10px;">Verify OTP</button><button onclick="reqOTP()" style="background:var(--surface);color:var(--muted);border:1px solid var(--border);border-radius:10px;padding:11px 14px;font-size:13px;font-weight:500;cursor:pointer;">Resend</button></div></div><div class="fg"><label class="fl">Password * <span style="font-size:10px;color:var(--muted);">Min 8 chars</span></label><input class="fi" id="r_pass" type="password" placeholder="Min 8 characters" oninput="lvPass(this)"/><div class="ferr" id="r_pass_err">Min 8 characters</div></div><button class="btn-rose btn-full" id="registerBtn" onclick="doRegister()">Create Account</button><div class="swlink">Have account? <a onclick="openAuthLogin()">Sign in</a></div>';}
  openModal('authModal');
}

function openAuthLogin(){openAuth('login');}

function openAuthRegister(){openAuth('register');}

function closeAuthModal(){closeModal('authModal');}

/* Starts real Google sign-in via Supabase Auth. This redirects the
   whole page to Google and back — there's no popup, so nothing
   more happens here after the redirect starts. When the browser
   returns, main.js's restoreSession() (which runs on every page
   load) picks up the new session automatically. */
async function gLogin(){
  if(!supabaseClient){toast('Google sign-in needs the site to be connected to Supabase first.');return;}
  var res=await supabaseClient.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.href}});
  if(res.error){console.warn('ELVORA: Google sign-in failed to start',res.error);toast('Could not start Google sign-in. Try again.');}
}

/* Builds the currentUser object the rest of the app expects,
   from a Supabase Auth user + their matching profiles row. */
function buildCurrentUser(authUser,profile){
  return{
    id:authUser.id,
    email:authUser.email,
    fname:profile?profile.fname:'',
    lname:profile?profile.lname:'',
    phone:profile?profile.phone:'',
    avatar:profile?profile.avatar_url:null
  };
}

async function doLogin(){
  var email=document.getElementById('l_email')?document.getElementById('l_email').value.trim():'';
  var pass=document.getElementById('l_pass')?document.getElementById('l_pass').value:'';
  if(!valEmail(email)){toast('Please enter a valid email');return;}
  if(!pass){toast('Password required');return;}
  if(!supabaseClient){toast('Sign-in needs the site to be connected to Supabase first.');return;}
  var btn=document.getElementById('loginBtn');if(btn){btn.disabled=true;btn.textContent='Signing in...';}
  try{
    var res=await supabaseClient.auth.signInWithPassword({email:email,password:pass});
    if(res.error)throw res.error;
    var prof=await supabaseClient.from('profiles').select('*').eq('id',res.data.user.id).limit(1);
    var profile=(prof.data&&prof.data.length)?prof.data[0]:null;
    currentUser=buildCurrentUser(res.data.user,profile);
    closeModal('authModal');renderAccount();renderWishlist();
    toast('Welcome back, '+(currentUser.fname||'')+'! 🌸');
  }catch(e){
    console.warn('ELVORA: login failed',e);
    toast(e.message&&e.message.indexOf('Invalid')>-1?'Incorrect email or password':'Something went wrong signing in. Try again.');
  }finally{
    if(btn){btn.disabled=false;btn.textContent='Sign In';}
  }
}

async function doRegister(){
  var fname=document.getElementById('r_fname')?document.getElementById('r_fname').value.trim():'';
  var lname=document.getElementById('r_lname')?document.getElementById('r_lname').value.trim():'';
  var email=document.getElementById('r_email')?document.getElementById('r_email').value.trim():'';
  var phone=document.getElementById('r_phone')?document.getElementById('r_phone').value.trim():'';
  var pass=document.getElementById('r_pass')?document.getElementById('r_pass').value:'';
  if(!fname){toast('Please enter your first name');return;}
  if(!valEmail(email)){toast('Please enter a valid email');return;}
  if(!valPhone(phone)){toast('Enter a valid phone number');return;}
  if(!verPhone||verPhone!==phone){toast('Please verify your phone with OTP first');return;}
  if(!valPass(pass)){toast('Password must be at least 8 characters');return;}
  if(!supabaseClient){toast('Account creation needs the site to be connected to Supabase first.');return;}
  var btn=document.getElementById('registerBtn');if(btn){btn.disabled=true;btn.textContent='Creating account...';}
  try{
    var res=await supabaseClient.auth.signUp({email:email,password:pass});
    if(res.error)throw res.error;
    var authUser=res.data.user;
    if(!authUser){toast('Check your email to confirm your account, then sign in.');closeModal('authModal');return;}
    var profile={id:authUser.id,fname:fname,lname:lname,phone:phone};
    var profRes=await supabaseClient.from('profiles').insert([profile]);
    if(profRes.error)console.warn('ELVORA: profile row failed to save',profRes.error);
    currentUser=buildCurrentUser(authUser,profile);
    closeModal('authModal');renderAccount();renderWishlist();
    toast('Welcome to ELVORA, '+fname+'! 🌸');
  }catch(e){
    console.warn('ELVORA: registration failed',e);
    toast(e.message&&e.message.indexOf('already registered')>-1?'Email already registered':'Something went wrong creating your account. Try again.');
  }finally{
    if(btn){btn.disabled=false;btn.textContent='Create Account';}
  }
}

async function logout(){
  if(supabaseClient)await supabaseClient.auth.signOut();
  currentUser=null;wishlist=[];saveWishLocal();
  renderAccount();renderWishlist();
  toast('Signed out');
}

/* Called once on page load (from main.js) to restore a signed-in
   session if the browser still has one, so the customer doesn't
   have to sign in again every visit. */
async function restoreSession(){
  if(!supabaseClient)return;
  try{
    var res=await supabaseClient.auth.getSession();
    var session=res.data.session;
    if(!session)return;
    var prof=await supabaseClient.from('profiles').select('*').eq('id',session.user.id).limit(1);
    var profile=(prof.data&&prof.data.length)?prof.data[0]:null;
    if(!profile){
      /* No profile row yet — this is a first-time Google sign-in (email/password
         signups always create their profile row in doRegister(), so if we get
         here it means someone came in through gLogin() instead). Pull a name
         and photo from what Google gave us and create the row now. */
      var meta=session.user.user_metadata||{};
      var full=meta.full_name||meta.name||'';
      var fname=full.split(' ')[0]||'Friend';
      var lname=full.split(' ').slice(1).join(' ');
      profile={id:session.user.id,fname:fname,lname:lname,phone:null,avatar_url:meta.avatar_url||meta.picture||null};
      var insRes=await supabaseClient.from('profiles').insert([profile]);
      if(insRes.error)console.warn('ELVORA: could not create profile for Google sign-in',insRes.error);
      toast('Welcome to ELVORA, '+fname+'! 🌸');
    }
    currentUser=buildCurrentUser(session.user,profile);
    await loadWishlistFromBackend();
    renderAccount();renderWishlist();
  }catch(e){
    console.warn('ELVORA: could not restore session',e);
  }
}

/* VALIDATION */

function valEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);}

function valPhone(p){return /^(8801|01)[3-9]\d{8}$/.test(p.replace(/[\s\-+]/g,''));}

function valPass(p){return p.length>=8;}

function lvEmail(el){var ok=valEmail(el.value.trim());el.classList.toggle('err',!ok&&el.value.length>0);el.classList.toggle('ok',ok);var e=document.getElementById(el.id+'_err');if(e)e.classList.toggle('show',!ok&&el.value.length>3);}

function lvPhone(el){var ok=valPhone(el.value.trim());el.classList.toggle('err',!ok&&el.value.length>4);el.classList.toggle('ok',ok);var e=document.getElementById('r_phone_err');if(e)e.classList.toggle('show',!ok&&el.value.length>5);}

function lvPass(el){var ok=valPass(el.value);el.classList.toggle('err',!ok&&el.value.length>0);el.classList.toggle('ok',ok);var e=document.getElementById(el.id+'_err');if(e)e.classList.toggle('show',!ok&&el.value.length>0);}

/* OTP — still a visual demo. See SETUP.md for real SMS setup. */

function reqOTP(){var phone=document.getElementById('r_phone')?document.getElementById('r_phone').value.trim():'';if(!valPhone(phone)){toast('Enter a valid BD number');return;}genOTP=Math.floor(100000+Math.random()*900000).toString();toast('Demo OTP: '+genOTP);var og=document.getElementById('otpGrp');if(og)og.style.display='block';var o1=document.getElementById('otp1');if(o1)o1.focus();var secs=60;var te=document.getElementById('otpTmrL');if(otpTmr)clearInterval(otpTmr);otpTmr=setInterval(function(){secs--;if(te)te.textContent='('+secs+'s)';if(secs<=0){clearInterval(otpTmr);if(te)te.textContent='';}},1000);}

function otpNxt(el,n){if(el.value.length===1&&n){var nx=document.getElementById('otp'+n);if(nx)nx.focus();}}

/* Pressing backspace on an already-empty box jumps back to the previous
   box and clears it too — so holding backspace deletes right-to-left
   across all 6 boxes, instead of needing to tap into each one by hand. */
function otpBack(e,el,prevN){
  if(e.key==='Backspace'&&el.value===''&&prevN){
    var prev=document.getElementById('otp'+prevN);
    if(prev){prev.value='';prev.focus();}
  }
}

function confirmOTP(){var ids=['otp1','otp2','otp3','otp4','otp5','otp6'];var entered=ids.map(function(id){var e=document.getElementById(id);return e?e.value:'';}).join('');var phone=document.getElementById('r_phone')?document.getElementById('r_phone').value.trim():'';if(entered===genOTP){verPhone=phone;var og=document.getElementById('otpGrp');if(og)og.style.display='none';var pg=document.getElementById('phoneGrp');if(pg){pg.style.background='rgba(82,200,154,.06)';pg.style.borderRadius='10px';pg.style.padding='10px';pg.style.border='1px solid rgba(82,200,154,.2)';}toast('Phone verified! ✓');}else toast('Incorrect OTP. Try again.');}
