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
    items:order.items,total:total,fee:order.fee,status:'Confirmed'
  }]).then(function(res){
    if(res.error)console.warn('ELVORA: order saved locally but failed to sync to Supabase.',res.error);
  });
}
