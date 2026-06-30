/* ═══════════════════════════════════════════════════════════
   ELVORA — LOYALTY (streaks, points, free delivery vouchers)
   ═══════════════════════════════════════════════════════════
   Requires being signed in (the existing account system in
   auth.js) — rewards are tied to an account on purpose, so this
   can't be gamed by just reloading the page anonymously.

   Streak = consecutive CALENDAR DAYS signed in. Miss a day and
   it resets to 1, not 0 — by design this takes genuine daily
   habit to build, not just one visit. Milestones award bonus
   points and, at bigger milestones, a free delivery voucher.

   Redeeming points isn't built yet on purpose — the Rewards page
   clearly shows "Redeem — Coming Soon" rather than pretending a
   redemption flow exists when it doesn't.
   ═══════════════════════════════════════════════════════════ */

var STREAK_MILESTONES=[
  {days:3, bonus:20, voucher:false},
  {days:7, bonus:50, voucher:true},
  {days:14,bonus:100,voucher:true},
  {days:30,bonus:250,voucher:true}
];

/* Call after any change to currentUser's loyalty fields — keeps both
   the active session copy and the persisted users list in sync. */
function saveUserUpdate(){
  if(!currentUser)return;
  localStorage.setItem('el_user',JSON.stringify(currentUser));
  var users=JSON.parse(localStorage.getItem('el_users')||'[]');
  var idx=users.findIndex(function(u){return u.email===currentUser.email;});
  if(idx>-1){users[idx]=currentUser;localStorage.setItem('el_users',JSON.stringify(users));}
}

/* Run once per page load if signed in (called from main.js). Checks
   whether today continues yesterday's streak, breaks it, or is a
   repeat visit already counted today — and awards milestone bonuses. */
function checkDailyStreak(){
  if(!currentUser)return;
  if(currentUser.streak==null)currentUser.streak=0;
  if(currentUser.points==null)currentUser.points=0;
  if(currentUser.freeDeliveryVouchers==null)currentUser.freeDeliveryVouchers=0;
  var today=new Date().toISOString().slice(0,10);
  var last=currentUser.lastVisitDate;
  if(last===today){return;} // already counted today
  var yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10);
  if(last===yesterday){
    currentUser.streak+=1;
  }else{
    currentUser.streak=1; // first visit ever, or streak broken by a gap
  }
  currentUser.lastVisitDate=today;
  currentUser.points+=5; // small reward just for showing up
  var milestone=STREAK_MILESTONES.find(function(m){return m.days===currentUser.streak;});
  if(milestone){
    currentUser.points+=milestone.bonus;
    if(milestone.voucher){
      currentUser.freeDeliveryVouchers+=1;
      toast('🔥 '+milestone.days+'-day streak! +'+milestone.bonus+' points and a free delivery voucher!');
    }else{
      toast('🔥 '+milestone.days+'-day streak! +'+milestone.bonus+' bonus points!');
    }
  }
  saveUserUpdate();
}

/* Small points award for completing a purchase — separate from the
   daily streak. Called once from placeOrder() in checkout.js. */
function awardOrderPoints(){
  if(!currentUser)return;
  currentUser.points=(currentUser.points||0)+10;
  saveUserUpdate();
}

function nextMilestone(){
  if(!currentUser)return null;
  return STREAK_MILESTONES.find(function(m){return m.days>currentUser.streak;})||null;
}

function renderRewards(){
  var el=document.getElementById('rewardsContent');if(!el)return;
  if(!currentUser){
    el.innerHTML='<div class="nlogged"><div style="font-size:52px;margin-bottom:16px;">🎁</div><h3>Sign In to Start Earning</h3><p>Rewards are tied to your account — streaks, points, and free delivery vouchers all need you to be signed in.</p><div class="auth-btns"><button class="btn-rose" onclick="openAuthLogin()">Sign In</button><button class="btn-outline btn-full" style="border-radius:10px;margin-top:2px;" onclick="openAuthRegister()">Create Account</button></div></div>';
    return;
  }
  var streak=currentUser.streak||0;
  var points=currentUser.points||0;
  var vouchers=currentUser.freeDeliveryVouchers||0;
  var nm=nextMilestone();
  var nmHtml=nm?'<div class="pd-desc" style="text-align:center;">'+(nm.days-streak)+' more day'+(nm.days-streak===1?'':'s')+' to your next reward — <strong style="color:var(--text);">+'+nm.bonus+' points'+(nm.voucher?' and a free delivery voucher':'')+'</strong></div>':'<div class="pd-desc" style="text-align:center;">You\'ve hit every streak milestone — amazing!</div>';
  el.innerHTML=
    '<div style="text-align:center;padding:8px 0 22px;">'
    +'<div style="font-size:42px;margin-bottom:6px;">🔥</div>'
    +'<div style="font-family:var(--serif);font-size:34px;font-weight:400;color:var(--text);">'+streak+'-Day Streak</div>'
    +'<div style="font-size:12px;color:var(--muted);margin-top:2px;">Sign in daily to keep it going — miss a day and it resets.</div>'
    +'</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;">'
    +'<div class="fcard" style="margin-bottom:0;text-align:center;"><div style="font-family:var(--serif);font-size:28px;color:var(--link);">'+points.toLocaleString()+'</div><div class="pd-lbl" style="margin-bottom:0;">Points</div></div>'
    +'<div class="fcard" style="margin-bottom:0;text-align:center;"><div style="font-family:var(--serif);font-size:28px;color:var(--link);">'+vouchers+'</div><div class="pd-lbl" style="margin-bottom:0;">Free Delivery Vouchers</div></div>'
    +'</div>'
    +nmHtml
    +'<div class="pd-div"></div>'
    +'<div class="pd-lbl">Redeem Points</div>'
    +'<div class="fcard" style="text-align:center;color:var(--muted);"><svg viewBox="0 0 24 24" style="width:32px;height:32px;stroke:var(--muted);stroke-width:1.5;fill:none;margin:0 auto 10px;display:block;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Redeem — Coming Soon<div style="font-size:12px;margin-top:4px;">We\'re building ways to spend your points. For now, keep your streak alive — vouchers already work at checkout.</div></div>';
}
