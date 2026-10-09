// Vercel Function: chạy lại handler của resend-worker.mjs với biến môi trường của Vercel.
import {handleReservation} from '../resend-worker.mjs';

// Giới hạn 5 yêu cầu/phút/IP trong bộ nhớ của mỗi instance; chỉ chống gửi dồn cơ bản, không thay WAF.
const hits=new Map();
function limiterFor(request) {
 const ip=request.headers.get('x-real-ip')||request.headers.get('x-forwarded-for')?.split(',')[0].trim()||'unknown';
 return {limit:async()=>{
  const now=Date.now(),recent=(hits.get(ip)||[]).filter(t=>now-t<60000);
  if(recent.length>=5){hits.set(ip,recent);return {success:false};}
  recent.push(now);hits.set(ip,recent);
  if(hits.size>5000)for(const [key,times] of hits)if(times.every(t=>now-t>=60000))hits.delete(key);
  return {success:true};
 }};
}

const env=request=>({
 RESEND_API_KEY:process.env.RESEND_API_KEY,
 MAIL_FROM:process.env.MAIL_FROM,
 MAIL_TO:process.env.MAIL_TO,
 MAIL_CC:process.env.MAIL_CC,
 PUBLIC_SITE_ORIGIN:process.env.PUBLIC_SITE_ORIGIN,
 BOOKING_LIMITER:limiterFor(request)
});

export const POST=request=>handleReservation(request,env(request));
export const OPTIONS=request=>handleReservation(request,env(request));
