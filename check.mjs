import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {reservationEmailHTML} from './email-template.mjs';
const shared=fs.readFileSync(new URL('./dist/booking.mjs',import.meta.url),'utf8').replaceAll('export function','function');
const source=shared+fs.readFileSync(new URL('./dist/app.js',import.meta.url),'utf8').replace(/^import .*;\r?\n/,'');
const menu=JSON.parse(fs.readFileSync(new URL('./dist/menu.json',import.meta.url)));
assert.equal(menu.length,20);
assert.equal(menu.flatMap(c=>c.items).length,139);
for(const c of menu){assert(fs.existsSync(new URL('./dist/assets/'+c.image,import.meta.url)));assert(c.media.length>=1);for(const p of c.media){assert(fs.existsSync(new URL('./dist/assets/'+p.src,import.meta.url)));assert(p.width>0&&p.height>0);}for(const d of c.items){assert(d.prices.length>0);assert(d.prices.every(p=>/^\d+,\d{2}€$/.test(p)));assert(d.prices.length===1||d.prices.length===d.variants.length);}}
const photos=JSON.parse(fs.readFileSync(new URL('./dist/photos.json',import.meta.url)));
assert.equal(photos.length,65);assert.equal(new Set(photos.map(p=>p.src)).size,65);
assert.equal(photos.filter(p=>p.generated).length,23);
for(const c of menu){assert.equal(c.media.length,1);assert(c.image.startsWith('generated/'));assert(Math.abs(c.media[0].width/c.media[0].height-16/9)<0.01);}
const prompts=JSON.parse(fs.readFileSync(new URL('./image-prompts.json',import.meta.url)));
assert.equal(prompts.assets.length,23);assert(prompts.assets.every(p=>p.prompt&&p.references.length));
const homepage=fs.readFileSync(new URL('./dist/index.html',import.meta.url),'utf8');
assert(homepage.includes('assets/generated/hero-mobile.webp'));assert(homepage.includes('assets/generated/hero-landscape.webp'));assert(homepage.includes('assets/generated/story-portrait.webp'));
assert.equal(photos.filter(p=>p.src.startsWith('nama-')).length,12);
for(const p of photos)assert(fs.existsSync(new URL('./dist/assets/'+p.src,import.meta.url)));
for(const name of ['index.html','impressum.html','datenschutz.html','speisekarte.html']){
 const html=fs.readFileSync(new URL('./dist/'+name,import.meta.url),'utf8');
 for(const [,url] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
  if(/^(https?:|mailto:|tel:|#)/.test(url))continue;
  assert(fs.existsSync(new URL('./dist/'+(url.split('#')[0]||'.'),import.meta.url)),`${name}: missing ${url}`);
 }
}
function harness({enabled=true,result={success:'true'},networkError=false,provider='formsubmit'}={}){
 let handler, sent=0, opened=0, resets=0;const ids=[];
 let date=new Date();date.setUTCDate(date.getUTCDate()+2);while(date.getUTCDay()===1)date.setUTCDate(date.getUTCDate()+1);
 const data={name:'Test Guest',phone:'+49 123456789',email:'test@example.com',date:date.toISOString().slice(0,10),time:'18:00',guests:'2',privacy:'on',note:'',website:''};
 const button={disabled:false,textContent:''},status={textContent:''};
 const form={elements:{date:{},time:{add(){}},guests:{add(){}}},dataset:{},querySelector:()=>button,addEventListener(type,fn){handler=fn;},reset(){resets++;}};
 const nodes={'#reservation-form':form,'#form-status':status,'#booking-summary':{textContent:''},'#success-dialog':{showModal(){opened++;}}};
 const context=vm.createContext({console,Intl,Date,AbortSignal,Error,TypeError,crypto:globalThis.crypto,FormData:class{constructor(){return Object.entries(data);}},Option:class{},window:{},document:{querySelector:s=>nodes[s]||null,querySelectorAll:()=>[],addEventListener(){}},fetch:async(url,options)=>{if(url==='booking-config.json')return {ok:true,json:async()=>({recipient:'test@example.com',cc:'copy@example.com',enabled,provider,endpoint:'https://api.example/api/reservations'})};sent++;assert.equal(options.method,'POST');const payload=JSON.parse(options.body);if(provider==='resend'){assert.equal(url,'https://api.example/api/reservations');assert.equal(payload.guests,'2');assert.equal(payload.privacy,'on');assert.match(payload.requestId,/^[a-f\d-]{36}$/);assert.equal(payload._subject,undefined);ids.push(payload.requestId);}else{assert.equal(payload.Personen,'2');assert.equal(payload._template,'table');assert.equal(payload._cc,'copy@example.com');assert.equal(payload._replyto,data.email);assert.match(payload._subject,/NAMA.*18:00 Uhr.*2 Gäste/);assert(payload.Termin.includes('2026')||payload.Termin.includes(String(date.getUTCFullYear())));assert(!payload.Termin.includes('T12:'));}if(networkError)throw new TypeError('offline');return {ok:true,json:async()=>result};}});
 vm.runInContext(source,context);
 return {data,status,button,context,ids,submit:()=>handler({preventDefault(){}}),stats:()=>({sent,opened,resets})};
}
let h=harness();await h.submit();assert.deepEqual(h.stats(),{sent:1,opened:1,resets:1});assert.equal(h.button.disabled,false);
for(const options of [{result:{success:false}},{result:{success:'true',message:'Please activate your form'}},{networkError:true},{enabled:false}]){h=harness(options);await h.submit();assert.equal(h.stats().opened,0);assert.equal(h.stats().resets,0);assert(h.status.textContent);assert.equal(h.button.disabled,false);}
h=harness();h.data.date='2026-10-12';await h.submit();assert.equal(h.stats().sent,0);assert.match(h.status.textContent,/Montags|Zukunft/);
h=harness();h.data.date='2026-02-30';await h.submit();assert.equal(h.stats().sent,0);
h=harness();h.data.phone='invalid';await h.submit();assert.equal(h.stats().sent,0);
h=harness();h.data.privacy='';await h.submit();assert.equal(h.stats().sent,0);
h=harness();await Promise.all([h.submit(),h.submit()]);assert.equal(h.stats().sent,1);
const ctx=h.context;
const email=vm.runInContext(`bookingEmail({date:'2026-10-09',time:'18:30',guests:'1',name:'  Max Mustermann  ',phone:'+49 123456789',email:'max@example.com',note:'',website:''},{cc:'copy@example.com'})`,ctx);
assert.equal(email._template,'table');assert.equal(email._subject,'[NAMA] Neue Tischanfrage | 09.10.2026, 18:30 Uhr | 1 Gast | Max Mustermann');
assert.equal(email.Termin,'Freitag, 09. Oktober 2026, 18:30 Uhr (Bad Oldesloe)');assert.equal(email.Gast,'Max Mustermann');assert.equal(email['Wünsche und Hinweise'],'Keine besonderen Wünsche');assert.equal(email._cc,'copy@example.com');
assert.equal(vm.runInContext(`berlinNow(new Date('2026-10-06T22:30:00Z')).date`,ctx),'2026-10-07');
assert.equal(vm.runInContext(`berlinNow(new Date('2026-12-06T22:30:00Z')).date`,ctx),'2026-12-06');
console.log('PASS: 139 menu entries, 65 unique photographs (23 generated and 42 originals), responsive hero, 20 landscape menu images, saved prompts, routes, German email format, compact table template, Reply-To/CC, booking validation, Berlin timezone, success/failure and duplicate-submit protection. Email requests mocked; no email sent.');

const htmlEmail=reservationEmailHTML({name:'<script>alert(1)</script>',email:'guest@example.com',phone:'+49 123456789',date:'2026-10-21',time:'21:30',guests:'5',note:'<img src=x onerror=alert(1)>\nAm Fenster'});
assert(!htmlEmail.includes('<script>'));assert(!htmlEmail.includes('<img src=x'));assert(htmlEmail.includes('&lt;script&gt;'));assert(htmlEmail.includes('<br>Am Fenster'));assert(htmlEmail.includes('mailto:guest@example.com'));assert(htmlEmail.includes('21:30 Uhr'));assert(htmlEmail.includes('5 Gäste'));
console.log('PASS: custom HTML email escapes guest input and preserves booking details; template is a preview until an HTML email provider is configured.');

h=harness({provider:'resend'});await h.submit();assert.deepEqual(h.stats(),{sent:1,opened:1,resets:1});
h=harness({provider:'resend',networkError:true});await h.submit();await h.submit();assert.equal(h.ids[0],h.ids[1]);assert.equal(h.stats().opened,0);assert.equal(h.stats().resets,0);h.data.time='19:00';await h.submit();assert.notEqual(h.ids[1],h.ids[2]);
console.log('PASS: frontend Resend payload, success/failure and stable retry identifiers. All email requests mocked.');
