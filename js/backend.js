/* ═══════════════════════════════════════════════════════════
   ELVORA — BACKEND CALLS
   ═══════════════════════════════════════════════════════════
   Every direct call to Supabase for ORDERS lives here, isolated
   from checkout.js so that file only deals with UI/checkout flow
   logic, not backend details. (Product fetching from Supabase
   lives in products.js instead, right next to the PRODUCTS data
   it populates — see that file's loadProductsFromSupabase().)
   ═══════════════════════════════════════════════════════════ */

function saveOrderToBackend(order,total){
  if(!supabaseClient)return;
  supabaseClient.from('orders').insert([{
    id:order.id,name:order.name,phone:order.phone,addr:order.addr,dist:order.dist,
    items:order.items,total:total,fee:order.fee,status:'Confirmed',user_id:order.user_id||null
  }]).then(function(res){
    if(res.error)console.warn('ELVORA: order saved locally but failed to sync to Supabase.',res.error);
  });
}

/* Cancels an order — only succeeds against Supabase if it was
   placed by the currently signed-in customer and is still
   'Confirmed' (RLS enforces this server-side too, so this can't
   be spoofed by editing client-side code). Always updates the
   local copy regardless, so the customer's own device reflects
   the cancellation immediately either way. */
async function cancelOrderInBackend(oid){
  if(!supabaseClient||!currentUser)return;
  try{
    var res=await supabaseClient.from('orders').update({status:'Cancelled'}).eq('id',oid).eq('user_id',currentUser.id);
    if(res.error)console.warn('ELVORA: order cancelled locally but failed to sync to Supabase.',res.error);
  }catch(e){
    console.warn('ELVORA: order cancellation sync failed',e);
  }
}
