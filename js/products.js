/* ═══════════════════════════════════════════════════════════
   ELVORA — PRODUCT CATALOG
   ═══════════════════════════════════════════════════════════
   Products now load from your Supabase database (see SETUP.md
   section 4 for the SQL to create the tables, and the schema
   file supabase-schema.sql in this repo).

   Once Supabase is connected (you've pasted your URL + anon key
   into index.html), you manage products entirely from the
   Supabase dashboard — Table Editor → products / product_variants.
   No more code editing needed for day-to-day catalog changes.

   The single example product below is only a FALLBACK — it's
   what visitors see if Supabase isn't connected yet, or if the
   fetch fails for any reason (e.g. no internet). It keeps the
   site looking correct instead of showing a blank page while
   you're still setting things up.
   ─────────────────────────────────────────────────────────── */

var PRODUCTS=[
  {
    id:1,
    name:"EXAMPLE — Replace With Your Real Product",
    brand:"ELVORA",
    category:"serum",
    price:850,
    oldPrice:1200,
    badge:"New",
    badgeType:"new2",
    rating:0,
    reviews:0,
    desc:"This is placeholder text shown only when Supabase isn't connected yet. Once connected, your real products from the database will replace this automatically.",
    ingredients:["Ingredient One","Ingredient Two","Ingredient Three"],
    concerns:["Dryness","Dullness"],
    howTo:"Replace with real usage instructions for this product.",
    size:"30ml",
    reviewList:[],
    variants:[{label:"30ml",price:850}]
  }
];

/* Fetch real products from Supabase and replace the fallback above.
   Runs immediately; renderProducts() (defined in app.js) is called
   only once data arrives, which is safe even though app.js loads
   after this file — by the time this async function resolves,
   app.js has already finished loading and defined that function. */
async function loadProductsFromSupabase(){
  if(!supabaseClient){
    console.info('ELVORA: Supabase not connected yet — showing the example product. See SETUP.md section 4.');
    return;
  }
  try{
    var prodRes=await supabaseClient.from('products').select('*');
    var varRes=await supabaseClient.from('product_variants').select('*');
    if(prodRes.error)throw prodRes.error;
    if(varRes.error)throw varRes.error;
    var prods=prodRes.data;var allVariants=varRes.data||[];
    if(prods&&prods.length){
      PRODUCTS=prods.map(function(p){
        var myVariants=allVariants
          .filter(function(v){return v.product_id===p.id;})
          .map(function(v){return{label:v.label,price:v.price};});
        var ingArr=(p.ingredients||'').split(',').map(function(s){return s.trim();}).filter(Boolean);
        var concernArr=(p.concerns||'').split(',').map(function(s){return s.trim();}).filter(Boolean);
        return{
          id:p.id,name:p.name,brand:p.brand,category:p.category,
          price:p.price,oldPrice:p.old_price,badge:p.badge,badgeType:p.badge_type,
          rating:p.rating||0,reviews:p.reviews||0,desc:p.description,
          ingredients:ingArr,howTo:p.how_to,size:p.size,reviewList:[],image:p.image_url||null,
          concerns:concernArr,
          variants:myVariants.length?myVariants:[{label:p.size,price:p.price}]
        };
      });
      if(typeof renderProducts==='function')renderProducts(PRODUCTS);
      if(typeof renderRecent==='function')renderRecent();
      console.info('ELVORA: Loaded '+PRODUCTS.length+' product(s) from Supabase.');
    }
  }catch(e){
    console.warn('ELVORA: Could not load products from Supabase, showing fallback example product instead.',e);
  }
}
loadProductsFromSupabase();
