import assert from 'node:assert/strict';
import {handleReservation} from './resend-worker.mjs';
let date=new Date();date.setUTCDate(date.getUTCDate()+2);while(date.getUTCDay()===1)date.setUTCDate(date.getUTCDate()+1);
const data={name:'<b>Test Guest</b>',email:'guest@example.com',phone:'+49 123456789',date:date.toISOString().slice(0,10),time:'18:30',guests:'2',privacy:'on',note:'Near the window\nThank you',requestId:'12345678-1234-4234-8234-123456789abc',to:'attacker@example.com',html:'untrusted HTML'};
const origin='https://website.example';
const env={PUBLIC_SITE_ORIGIN:origin,RESEND_API_KEY:'mock-key',MAIL_FROM:'NAMA <booking@verified.example>',MAIL_TO:'restaurant@example.com',MAIL_CC:'copy@example.com',BOOKING_LIMITER:{limit:async()=>({success:true})}};
const request=(body=data,options={})=>new Request('https://api.example/api/reservations',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...options.headers},body:JSON.stringify(body)});
let sent=0;
const send=async(url,options)=>{sent++;assert.equal(url,'https://api.resend.com/emails');const message=JSON.parse(options.body);assert.deepEqual(message.to,['restaurant@example.com']);assert.deepEqual(message.cc,['copy@example.com']);assert.equal(message.reply_to,'guest@example.com');assert(message.html.includes('&lt;b&gt;Test Guest&lt;/b&gt;'));assert(!message.html.includes('untrusted HTML'));assert(message.subject.includes('18:30 Uhr | 2 Gäste'));assert.equal(options.headers['Idempotency-Key'],'nama-reservation/'+data.requestId);return Response.json({id:'mock-message-id'});};
let response=await handleReservation(request(),env,send);assert.equal(response.status,200);assert.equal((await response.json()).success,true);assert.equal(sent,1);
for(const [body,config,headers,status] of [[{...data,date:'2026-02-30'},env,{},400],[{...data,phone:42},env,{},400],[{...data,website:'bot'},env,{},400],[{...data,requestId:'bad'},env,{},400],[data,{...env,RESEND_API_KEY:''},{},503],[data,env,{Origin:'https://other.example'},403],[data,{...env,BOOKING_LIMITER:{limit:async()=>({success:false})}},{},429]]){response=await handleReservation(request(body,{headers}),config,send);assert.equal(response.status,status);assert.equal((await response.json()).success,false);}
assert.equal(sent,1);
for(const result of [Response.json({message:'blocked'},{status:403}),Response.json({})]){response=await handleReservation(request(),env,async()=>result);assert.equal(response.status,502);assert.equal((await response.json()).success,false);}
response=await handleReservation(request(),env,async()=>{throw new Error('timeout')});assert.equal(response.status,502);
response=await handleReservation(new Request('https://api.example/api/reservations',{method:'OPTIONS',headers:{Origin:origin}}),env,send);assert.equal(response.status,204);assert.equal(response.headers.get('Access-Control-Allow-Origin'),origin);
console.log('PASS: Resend endpoint, server validation, fixed recipients, escaped HTML, Reply-To/CC, idempotency, CORS, rate limit, missing setup and provider errors. All delivery mocked; no email sent.');
