/* ═══════════════════════════════════════════════════════════
   ELVORA — AUTH
   ═══════════════════════════════════════════════════════════
   Accounts — sign in / register / sign out, the phone OTP step,
   and all form validation. See README for current limitations
   (passwords aren't securely stored yet, OTP is still cosmetic).
   ═══════════════════════════════════════════════════════════ */

function openAuth(mode){
  var el=document.getElementById('authContent');if(!el)return;
  if(mode==='login'){el.innerHTML='<div class="shdl"></div><div class="sh-tt">Welcome back</div><div class="sh-ss">Sign in to your ELVORA account</div><button class="btn-google" onclick="gLogin()"><div class="glogo">G</div>Continue with Google</button><div class="divdr">or with email</div><div class="fg"><label class="fl">Email</label><input class="fi" id="l_email" type="email" placeholder="your@email.com" oninput="lvEmail(this)"/><div class="ferr" id="l_email_err">Please enter a valid email</div></div><div class="fg"><label class="fl">Password</label><input class="fi" id="l_pass" type="password" placeholder="••••••••"/></div><button class="btn-rose btn-full" onclick="doLogin()">Sign In</button><div class="swlink">No account? <a onclick="openAuthRegister()">Create one</a></div>';}
  else{el.innerHTML='<div class="shdl"></div><div class="sh-tt">Create Account</div><div class="sh-ss">Join ELVORA for exclusive deals</div><button class="btn-google" onclick="gLogin()"><div class="glogo">G</div>Continue with Google</button><div class="divdr">or with email</div><div class="frow"><div class="fg"><label class="fl">First Name *</label><input class="fi" id="r_fname" placeholder="Tasnim"/></div><div class="fg"><label class="fl">Last Name</label><input class="fi" id="r_lname" placeholder="Rahman"/></div></div><div class="fg"><label class="fl">Email *</label><input class="fi" id="r_email" type="email" placeholder="your@email.com" oninput="lvEmail(this)"/><div class="ferr" id="r_email_err">Enter valid email</div></div><div class="fg" id="phoneGrp"><label class="fl">Phone * <span style="font-size:10px;color:var(--muted);">(OTP verified)</span></label><div style="display:flex;gap:8px;"><input class="fi" id="r_phone" placeholder="01XXXXXXXXX" style="flex:1;" oninput="lvPhone(this)"/><button onclick="reqOTP()" style="background:linear-gradient(135deg,var(--a2),var(--a3));color:#fff;border:none;border-radius:10px;padding:10px 14px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;flex-shrink:0;">Send OTP</button></div><div class="ferr" id="r_phone_err">Valid BD number required</div></div><div class="fg" id="otpGrp" style="display:none;"><label class="fl">6-digit OTP <span id="otpTmrL" style="color:var(--rose2);font-size:11px;"></span></label><div class="otp-row"><input class="otp-in" id="otp1" maxlength="1" oninput="otpNxt(this,2)"/><input class="otp-in" id="otp2" maxlength="1" oninput="otpNxt(this,3)"/><input class="otp-in" id="otp3" maxlength="1" oninput="otpNxt(this,4)"/><input class="otp-in" id="otp4" maxlength="1" oninput="otpNxt(this,5)"/><input class="otp-in" id="otp5" maxlength="1" oninput="otpNxt(this,6)"/><input class="otp-in" id="otp6" maxlength="1" oninput="otpNxt(this,null)"/></div><div style="display:flex;gap:8px;"><button onclick="confirmOTP()" class="btn-rose" style="flex:1;padding:11px;border-radius:10px;">Verify OTP</button><button onclick="reqOTP()" style="background:var(--surface);color:var(--muted);border:1px solid var(--border);border-radius:10px;padding:11px 14px;font-size:13px;font-weight:500;cursor:pointer;">Resend</button></div></div><div class="fg"><label class="fl">Password * <span style="font-size:10px;color:var(--muted);">Min 8 chars</span></label><input class="fi" id="r_pass" type="password" placeholder="Min 8 characters" oninput="lvPass(this)"/><div class="ferr" id="r_pass_err">Min 8 characters</div></div><button class="btn-rose btn-full" onclick="doRegister()">Create Account</button><div class="swlink">Have account? <a onclick="openAuthLogin()">Sign in</a></div>';}
  openModal('authModal');
}

function openAuthLogin(){openAuth('login');}

function openAuthRegister(){openAuth('register');}

function gLogin(){toast('Google login needs Supabase backend setup');closeModal('authModal');}

function doLogin(){var email=document.getElementById('l_email')?document.getElementById('l_email').value.trim():'';var pass=document.getElementById('l_pass')?document.getElementById('l_pass').value:'';if(!valEmail(email)){toast('Please enter a valid email');return;}if(!pass){toast('Password required');return;}var users=JSON.parse(localStorage.getItem('el_users')||'[]');var user=users.find(function(u){return u.email===email&&u.password===pass;});if(!user){toast('Incorrect email or password');return;}currentUser=user;localStorage.setItem('el_user',JSON.stringify(user));closeModal('authModal');renderAccount();toast('Welcome back, '+user.fname+'! 🌸');}

function doRegister(){var fname=document.getElementById('r_fname')?document.getElementById('r_fname').value.trim():'';var lname=document.getElementById('r_lname')?document.getElementById('r_lname').value.trim():'';var email=document.getElementById('r_email')?document.getElementById('r_email').value.trim():'';var phone=document.getElementById('r_phone')?document.getElementById('r_phone').value.trim():'';var pass=document.getElementById('r_pass')?document.getElementById('r_pass').value:'';if(!fname){toast('Please enter your first name');return;}if(!valEmail(email)){toast('Please enter a valid email');return;}if(!valPhone(phone)){toast('Enter a valid phone number');return;}if(!verPhone||verPhone!==phone){toast('Please verify your phone with OTP first');return;}if(!valPass(pass)){toast('Password must be at least 8 characters');return;}var users=JSON.parse(localStorage.getItem('el_users')||'[]');if(users.find(function(u){return u.email===email;})){toast('Email already registered');return;}var user={fname:fname,lname:lname,email:email,phone:phone,password:pass};users.push(user);localStorage.setItem('el_users',JSON.stringify(users));currentUser=user;localStorage.setItem('el_user',JSON.stringify(user));closeModal('authModal');renderAccount();toast('Welcome to ELVORA, '+fname+'! 🌸');}

/* VALIDATION */

function valEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);}

function valPhone(p){return /^(8801|01)[3-9]\d{8}$/.test(p.replace(/[\s\-+]/g,''));}

function valPass(p){return p.length>=8;}

function lvEmail(el){var ok=valEmail(el.value.trim());el.classList.toggle('err',!ok&&el.value.length>0);el.classList.toggle('ok',ok);var e=document.getElementById(el.id+'_err');if(e)e.classList.toggle('show',!ok&&el.value.length>3);}

function lvPhone(el){var ok=valPhone(el.value.trim());el.classList.toggle('err',!ok&&el.value.length>4);el.classList.toggle('ok',ok);var e=document.getElementById('r_phone_err');if(e)e.classList.toggle('show',!ok&&el.value.length>5);}

function lvPass(el){var ok=valPass(el.value);el.classList.toggle('err',!ok&&el.value.length>0);el.classList.toggle('ok',ok);var e=document.getElementById(el.id+'_err');if(e)e.classList.toggle('show',!ok&&el.value.length>0);}

/* OTP */

function reqOTP(){var phone=document.getElementById('r_phone')?document.getElementById('r_phone').value.trim():'';if(!valPhone(phone)){toast('Enter a valid BD number');return;}genOTP=Math.floor(100000+Math.random()*900000).toString();toast('Demo OTP: '+genOTP);var og=document.getElementById('otpGrp');if(og)og.style.display='block';var o1=document.getElementById('otp1');if(o1)o1.focus();var secs=60;var te=document.getElementById('otpTmrL');if(otpTmr)clearInterval(otpTmr);otpTmr=setInterval(function(){secs--;if(te)te.textContent='('+secs+'s)';if(secs<=0){clearInterval(otpTmr);if(te)te.textContent='';}},1000);}

function otpNxt(el,n){if(el.value.length===1&&n){var nx=document.getElementById('otp'+n);if(nx)nx.focus();}}

function confirmOTP(){var ids=['otp1','otp2','otp3','otp4','otp5','otp6'];var entered=ids.map(function(id){var e=document.getElementById(id);return e?e.value:'';}).join('');var phone=document.getElementById('r_phone')?document.getElementById('r_phone').value.trim():'';if(entered===genOTP){verPhone=phone;var og=document.getElementById('otpGrp');if(og)og.style.display='none';var pg=document.getElementById('phoneGrp');if(pg){pg.style.background='rgba(82,200,154,.06)';pg.style.borderRadius='10px';pg.style.padding='10px';pg.style.border='1px solid rgba(82,200,154,.2)';}toast('Phone verified! ✓');}else toast('Incorrect OTP. Try again.');}

/* REVIEWS */

function logout(){currentUser=null;localStorage.removeItem('el_user');renderAccount();toast('Signed out');}

/* ORDER DETAIL */

function closeAuthModal(){closeModal('authModal');}

