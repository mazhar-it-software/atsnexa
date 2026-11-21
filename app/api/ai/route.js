import {generateAI} from '../../../lib/ai';
import {userFromBearer,adminQuery} from '../../../lib/supabase';

export const runtime='nodejs';

async function rpc(name,payload){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)throw new Error('Database not configured');
  const response=await fetch(`${url}/rest/v1/rpc/${name}`,{
    method:'POST',cache:'no-store',
    headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},
    body:JSON.stringify(payload)
  });
  if(!response.ok){
    console.error('ATSNexa quota RPC failed',name,response.status);
    throw new Error('AI usage service unavailable. Check the Supabase quota SQL setup.');
  }
  return response.json();
}

export async function POST(req){
  let reserved=false,uid=null,day=null;
  try{
    const u=await userFromBearer(req);
    if(!u)return Response.json({error:'Sign in to use AI tools.'},{status:401});
    const d=await req.json();
    if(!d||!['rewrite','cover','match','interview'].includes(d.task)||typeof d.resume!=='string'||d.resume.trim().length<30||d.resume.length>15000||typeof(d.job??'')!=='string'||(d.job||'').length>12000||typeof(d.extra??'')!=='string'||(d.extra||'').length>1000)
      return Response.json({error:'Invalid input or size limit exceeded.'},{status:400});
    day=new Date().toISOString().slice(0,10);uid=u.id;
    const subs=await adminQuery('subscriptions',`?user_id=eq.${encodeURIComponent(uid)}&status=eq.ACTIVE&select=id&limit=1`);
    const limit=subs.length?30:2;
    reserved=await rpc('reserve_ai_generation',{p_user_id:uid,p_day:day,p_limit:limit});
    if(!reserved)return Response.json({error:`Daily AI limit reached (${limit}). Upgrade or try tomorrow.`},{status:429});
    const output=await generateAI(d);
    if(typeof output!=='string'||!output.trim())throw new Error('AI returned an empty result. Please retry.');
    return Response.json({output},{headers:{'Cache-Control':'no-store'}});
  }catch(e){
    if(reserved&&uid&&day){
      try{await rpc('refund_ai_generation',{p_user_id:uid,p_day:day});}
      catch(refundError){console.error('ATSNexa quota refund failed',refundError);}
    }
    console.error('ATSNexa AI generation failed:',e?.message);
    return Response.json({error:e?.message||'AI request failed'},{status:500});
  }
}
