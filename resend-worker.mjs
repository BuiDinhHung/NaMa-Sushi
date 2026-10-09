import {bookingError,bookingSubject} from './dist/booking.mjs';
import {reservationEmailHTML,guestConfirmationHTML,guestConfirmationSubject} from './email-template.mjs';

const json=(body,status,headers)=>Response.json(body,{status,headers:{...headers,'Cache-Control':'no-store'}});
export async function handleReservation(request,env,send=fetch) {
 const origin=request.headers.get('Origin');
 const allowed=env.PUBLIC_SITE_ORIGIN;
 if(!allowed||origin!==allowed)return json({success:false,message:'Zugriff nicht erlaubt.'},403,{});
 const headers={'Access-Control-Allow-Origin':allowed,Vary:'Origin'};
 if(new URL(request.url).pathname!=='/api/reservations')return json({success:false},404,headers);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'POST','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600'}});
 if(request.method!=='POST')return json({success:false},405,{...headers,Allow:'POST, OPTIONS'});
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({success:false,message:'Ungültiges Format.'},415,headers);
 if(Number(request.headers.get('Content-Length'))>12000)return json({success:false,message:'Anfrage zu groß.'},413,headers);
 let data;
 try {
  const text=await request.text();
  if(new TextEncoder().encode(text).length>12000)return json({success:false,message:'Anfrage zu groß.'},413,headers);
  data=JSON.parse(text);
 }catch{return json({success:false,message:'Ungültige Anfrage.'},400,headers);}
 if(!data||typeof data!=='object'||Array.isArray(data)||['name','phone','email','date','time','guests','privacy'].some(k=>typeof data[k]!=='string')||['note','website'].some(k=>data[k]!==undefined&&typeof data[k]!=='string'))return json({success:false,message:'Bitte prüfen Sie Ihre Angaben.'},400,headers);
 const error=bookingError(data);
 if(error||data.website)return json({success:false,message:error||'Die Anfrage konnte nicht gesendet werden.'},400,headers);
 if(!/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(data.requestId||''))return json({success:false,message:'Ungültige Anfragekennung.'},400,headers);
 if(!env.RESEND_API_KEY||!env.MAIL_FROM||!env.MAIL_TO||!env.BOOKING_LIMITER)return json({success:false,message:'Online-Anfragen sind noch nicht verfügbar. Bitte reservieren Sie telefonisch unter 04531 4259856.'},503,headers);
 // Set BOOKING_LIMITER when deploying publicly; Origin checks alone are not bot protection.
 if(env.BOOKING_LIMITER){
  const {success}=await env.BOOKING_LIMITER.limit({key:request.headers.get('CF-Connecting-IP')||'unknown'});
  if(!success)return json({success:false,message:'Zu viele Anfragen. Bitte versuchen Sie es später erneut.'},429,headers);
 }
 const message={from:env.MAIL_FROM,to:env.MAIL_TO.split(',').map(s=>s.trim()).filter(Boolean),reply_to:data.email.trim(),subject:bookingSubject(data),html:reservationEmailHTML(data)};
 if(env.MAIL_CC)message.cc=env.MAIL_CC.split(',').map(s=>s.trim()).filter(Boolean);
 try {
  const response=await send('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`nama-reservation/${data.requestId}`},body:JSON.stringify(message),signal:AbortSignal.timeout(12000)});
  const result=await response.json();
  if(!response.ok||typeof result.id!=='string'||!result.id)return json({success:false,message:'Ihre Anfrage konnte nicht übermittelt werden. Bitte versuchen Sie es später erneut oder reservieren Sie telefonisch.'},502,headers);
  await sendGuestConfirmation(data,env,send);
  return json({success:true,id:result.id},200,headers);
 }catch{return json({success:false,message:'Keine eindeutige Rückmeldung vom Versanddienst. Bitte rufen Sie uns an, bevor Sie die Anfrage erneut senden.'},502,headers);}
}
// Lỗi thư cho khách không làm hỏng đơn: thư cho nhà hàng đã đi, báo lỗi sẽ khiến khách gửi trùng.
async function sendGuestConfirmation(data,env,send) {
 const replyTo=env.MAIL_REPLY_TO||env.MAIL_TO.split(',')[0].trim();
 try {
  await send('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`nama-confirmation/${data.requestId}`},body:JSON.stringify({from:env.MAIL_FROM,to:[data.email.trim()],reply_to:replyTo,subject:guestConfirmationSubject(data),html:guestConfirmationHTML(data)}),signal:AbortSignal.timeout(8000)});
 }catch{}
}
export default {fetch:(request,env)=>handleReservation(request,env)};
