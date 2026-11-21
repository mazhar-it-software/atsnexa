// Server-only Amazon Creators API integration. Never expose credentials to the browser.
export const runtime='nodejs';
const CATEGORY_QUERIES={office:'ergonomic office desk accessories',interview:'webcam microphone video interview',tech:'wireless keyboard USB C hub office',study:'career development books',travel:'laptop backpack work travel'};
const TAG=process.env.AMAZON_ASSOCIATE_TAG||'engr11112019-20';
const MARKETPLACE='www.amazon.com';
let tokenCache={token:null,expires:0};
const productCache=new Map();
function fallback(query){return 'https://www.amazon.com/s?k='+encodeURIComponent(query)+'&tag='+encodeURIComponent(TAG)}
async function token(){
 if(tokenCache.token&&Date.now()<tokenCache.expires)return tokenCache.token;
 const id=process.env.AMAZON_CREATORS_CREDENTIAL_ID;
 const secret=process.env.AMAZON_CREATORS_SECRET;
 if(!id||!secret)throw new Error('Amazon credentials not configured');
 const response=await fetch('https://api.amazon.com/auth/o2/token',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({grant_type:'client_credentials',client_id:id,client_secret:secret,scope:'creatorsapi::default'}),cache:'no-store',signal:AbortSignal.timeout(12000)});
 if(!response.ok)throw new Error('Amazon authentication unavailable ('+response.status+')');
 const data=await response.json();if(!data.access_token)throw new Error('Amazon did not return an access token');
 tokenCache={token:data.access_token,expires:Date.now()+Math.max(60,(Number(data.expires_in)||3600)-120)*1000};return tokenCache.token;
}
function safeAmazonLink(raw,asin){try{const u=new URL(raw);if(!['amazon.com','www.amazon.com'].includes(u.hostname))throw Error();u.searchParams.set('tag',TAG);return u.toString()}catch{return 'https://www.amazon.com/dp/'+encodeURIComponent(asin)+'?tag='+encodeURIComponent(TAG)}}
export async function GET(req){
 const url=new URL(req.url);const category=url.searchParams.get('category')||'office';
 if(!Object.prototype.hasOwnProperty.call(CATEGORY_QUERIES,category))return Response.json({error:'Invalid category'},{status:400});
 const keywords=CATEGORY_QUERIES[category];const cached=productCache.get(category);
 if(cached&&Date.now()<cached.expires)return Response.json(cached.data,{headers:{'Cache-Control':'public, max-age=120'}});
 try{
  const accessToken=await token();
  const response=await fetch('https://creatorsapi.amazon/catalog/v1/searchItems',{method:'POST',headers:{'Authorization':'Bearer '+accessToken,'Content-Type':'application/json','x-marketplace':MARKETPLACE},body:JSON.stringify({keywords,marketplace:MARKETPLACE,partnerTag:TAG,searchIndex:'All',itemCount:10,resources:['images.primary.medium','itemInfo.title','offersV2.listings.price']}),cache:'no-store',signal:AbortSignal.timeout(15000)});
  if(!response.ok){if(response.status===401)tokenCache={token:null,expires:0};throw new Error('Amazon catalog unavailable ('+response.status+')')}
  const json=await response.json();
  const items=json.searchResult?.items||json.searchItemsResult?.items||[];
  const products=items.filter(p=>p.asin&&p.itemInfo?.title?.displayValue).map(p=>({asin:p.asin,title:p.itemInfo.title.displayValue,image:p.images?.primary?.medium?.url||p.images?.primary?.large?.url||p.images?.primary?.small?.url||null,price:p.offersV2?.listings?.[0]?.price?.displayAmount||null,url:safeAmazonLink(p.detailPageURL,p.asin)}));
  if(!products.length)throw new Error('No products returned by Amazon');
  const data={mode:'live',products,category};productCache.set(category,{data,expires:Date.now()+15*60*1000});
  return Response.json(data,{headers:{'Cache-Control':'public, max-age=120'}});
 }catch(e){return Response.json({mode:'fallback',category,products:[],fallbackUrl:fallback(keywords),message:'Live Amazon listings are not available yet. Browse Amazon search results instead.'},{headers:{'Cache-Control':'no-store'}})}
}
