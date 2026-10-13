import {timingSafeEqual,randomUUID} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';

const BUCKET='feel-documents';
const MAX_BYTES=30*1024*1024;
function authorized(req){
  const expected=Buffer.from(process.env.FEEL_ACCESS_CODE||'');
  const given=Buffer.from(req.headers['x-feel-access-code']||'');
  return expected.length>0&&expected.length===given.length&&timingSafeEqual(expected,given);
}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(!authorized(req))return res.status(401).json({error:'Invalid access code'});
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const url=process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)return res.status(503).json({error:'Storage configuration missing'});
  const storage=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}}).storage.from(BUCKET);
  const {action,path,name,size,type,market,scope}=req.body||{};
  try{
    if(action==='sign-upload'){
      if(typeof name!=='string'||!name.trim()||name.length>240||!Number.isInteger(size)||size<1||size>MAX_BYTES)return res.status(400).json({error:'Invalid file or file exceeds 30 MB'});
      if(typeof market!=='string'||!market.trim()||market.length>100||typeof scope!=='string'||scope.length>100)return res.status(400).json({error:'Invalid market or scope'});
      const safeName=name.replace(/[^a-zA-Z0-9._-]/g,'_').slice(0,140);
      const objectPath=encodeURIComponent(market)+'/'+encodeURIComponent(scope)+'/'+randomUUID()+'-'+safeName;
      const {data,error}=await storage.createSignedUploadUrl(objectPath);
      if(error)throw error;
      return res.status(200).json({path:objectPath,token:data.token,signedUrl:data.signedUrl});
    }
    if(typeof path!=='string'||path.length>500||path.includes('..')||!path.includes('/'))return res.status(400).json({error:'Invalid document path'});
    if(action==='sign-download'){
      const {data,error}=await storage.createSignedUrl(path,60);
      if(error)throw error;
      return res.status(200).json({url:data.signedUrl});
    }
    if(action==='delete'){
      const {error}=await storage.remove([path]);
      if(error)throw error;
      return res.status(200).json({ok:true});
    }
    return res.status(400).json({error:'Invalid action'});
  }catch(e){return res.status(502).json({error:e?.message||'Storage operation failed'});}
}
