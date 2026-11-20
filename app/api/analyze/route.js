import {analyze} from "../../../lib/matcher.mjs";
export async function POST(req){try{const data=await req.json();const result=analyze(data.resume,data.job);return Response.json(result,{headers:{"Cache-Control":"no-store"}})}catch(e){return Response.json({error:e.message||"Invalid request"},{status:400})}}
