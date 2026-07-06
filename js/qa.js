/* ═══════════════════════════════════════════════════════════
   ELVORA — PRODUCT Q&A
   ═══════════════════════════════════════════════════════════
   Customers ask a question on a product page; you answer it
   yourself from the Supabase Table Editor (find the row in
   product_questions, paste your answer into the `answer` column).
   Only answered questions ever show on the site — see
   supabase-schema.sql for why that's the deliberate design.
   ═══════════════════════════════════════════════════════════ */

function openAsk(){
  if(!currentUser){toast('Please sign in to ask a question');openAuth('login');return;}
  document.getElementById('qName').value=(currentUser.fname+' '+(currentUser.lname||'')).trim();
  document.getElementById('qText').value='';
  openModal('askModal');
}

async function submitQuestion(){
  var name=document.getElementById('qName')?document.getElementById('qName').value.trim():'';
  var text=document.getElementById('qText')?document.getElementById('qText').value.trim():'';
  if(!name||!text){toast('Please fill in both fields');return;}
  if(!currentUser){toast('Please sign in first');return;}
  if(!supabaseClient){toast('Q&A needs the site to be connected to Supabase first.');return;}
  try{
    var res=await supabaseClient.from('product_questions').insert([{
      product_id:curRevProd,user_id:currentUser.id,asker_name:name,question:text
    }]);
    if(res.error)throw res.error;
    closeModal('askModal');
    toast('Question submitted! We\'ll post an answer soon 🌸');
  }catch(e){
    console.warn('ELVORA: question submit failed',e);
    toast('Something went wrong submitting your question. Try again.');
  }
}

/* Only ever shows ANSWERED questions — an unanswered pile looks
   neglected, and this way there's no pressure to reply instantly. */
async function renderPdQA(id){
  var el=document.getElementById('pdQA');if(!el)return;
  el.innerHTML='<div style="text-align:center;padding:20px 0;font-size:13px;color:var(--muted);">Loading...</div>';
  if(!supabaseClient){el.innerHTML='<div style="text-align:center;padding:20px 0;font-size:13px;color:var(--muted);">No questions answered yet. Be the first to ask!</div>';return;}
  try{
    var res=await supabaseClient.from('product_questions').select('*').eq('product_id',id).not('answer','is',null).order('created_at',{ascending:false});
    if(res.error)throw res.error;
    if(curProd!==id)return; // navigated away while this was loading
    var qas=res.data||[];
    el.innerHTML=qas.length?qas.map(function(q){
      return '<div class="rv-item"><div class="rv-head"><div class="rv-info"><div class="rv-av">Q</div><div><div class="rv-name">'+q.asker_name+'</div></div></div></div><div class="rv-text" style="font-weight:600;color:var(--text);margin-bottom:8px;">'+q.question+'</div><div style="display:flex;gap:8px;align-items:flex-start;"><div class="rv-av" style="background:linear-gradient(135deg,var(--a2),var(--a3));flex-shrink:0;">A</div><div class="rv-text" style="margin:0;">'+q.answer+'</div></div></div>';
    }).join(''):'<div style="text-align:center;padding:20px 0;font-size:13px;color:var(--muted);">No questions answered yet. Be the first to ask!</div>';
  }catch(e){
    console.warn('ELVORA: could not load Q&A',e);
    el.innerHTML='<div style="text-align:center;padding:20px 0;font-size:13px;color:var(--muted);">Could not load questions right now.</div>';
  }
}
