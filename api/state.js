import {timingSafeEqual} from 'node:crypto';
function authorized(req){const expected=Buffer.from(process.env.FEEL_ACCESS_CODE||'');const given=Buffer.from(req.headers['x-feel-access-code']||'');return expected.length>0&&expected.length===given.length&&timingSafeEqual(expected,given)}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(!authorized(req))return res.status(401).json({error:'Invalid access code'});
  if(!['GET','PUT'].includes(req.method))return res.status(405).json({error:'Method not allowed'});
  const url=process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)return res.status(503).json({error:'Database configuration missing'});
  try{
    const headers={apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json'};
    const endpoint=url+'/rest/v1/feel_hub_state';
    if(req.method==='GET'){
      const response=await fetch(endpoint+'?id=eq.global&select=payload',{headers});
      const result=await response.json();
      if(!response.ok)return res.status(502).json({error:'Unable to load shared data'});
      return res.status(200).json({payload:result[0]?.payload||null});
    }
    const payload=req.body?.payload;
    if(!payload||typeof payload!=='object'||Array.isArray(payload))return res.status(400).json({error:'Invalid data'});
    if(JSON.stringify(payload).length>3000000)return res.status(413).json({error:'Data too large'});
    const response=await fetch(endpoint+'?on_conflict=id',{method:'POST',headers:{...headers,Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({id:'global',payload,updated_at:new Date().toISOString(),updated_by:null})});
    if(!response.ok)return res.status(502).json({error:'Unable to save shared data'});
    return res.status(200).json({ok:true});
  }catch{return res.status(502).json({error:'Database unavailable'})}
}
