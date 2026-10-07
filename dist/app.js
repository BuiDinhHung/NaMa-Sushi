const $ = (s) => document.querySelector(s);
const escapeHTML = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const navToggle = $('.nav-toggle');
navToggle?.addEventListener('click', () => { const open = navToggle.getAttribute('aria-expanded') !== 'true'; navToggle.setAttribute('aria-expanded', String(open)); $('#navigation').classList.toggle('open', open); navToggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen'); });
$('#navigation')?.addEventListener('click', e => { if (e.target.closest('a')) { $('#navigation').classList.remove('open'); navToggle.setAttribute('aria-expanded','false'); } });
document.querySelectorAll('.contact>div,.section-heading').forEach(el=>el.classList.add('reveal'));
document.querySelectorAll('.quotes,.contact').forEach(group=>[...group.querySelectorAll('.reveal')].forEach((el,i)=>el.style.setProperty('--d',i*120+'ms')));
if ('IntersectionObserver' in window) { document.documentElement.classList.add('js-motion'); const observer = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),{threshold:.08}); document.querySelectorAll('.reveal').forEach(el => observer.observe(el)); }
if ($('#year')) $('#year').textContent = new Date().getFullYear();
let menu = [];
function dishHTML(d, i = 0) {
 const variants = d.variants.length ? `<ul class="dish-variants">${d.variants.map((v,i)=>`<li><span>${escapeHTML(v)}</span><span>${escapeHTML(d.prices[i] || (d.prices.length === 1 ? d.prices[0] : ''))}</span></li>`).join('')}</ul>` : '';
 return `<article class="dish" style="--i:${Math.min(i,14)}"><div class="dish-top"><h4>${escapeHTML(d.name)}</h4><span class="dish-price">${d.prices.length>1?'ab ':''}${escapeHTML(d.prices[0])}</span></div>${d.description?`<p>${escapeHTML(d.description)}</p>`:''}${variants}</article>`;
}
function photographyHTML(photos) {
 return `<div class="menu-photography" data-count="${photos.length}">${photos.map(p=>`<button type="button" class="photo-frame" data-image="assets/${escapeHTML(p.src)}" style="--photo-bg:${escapeHTML(p.background)}" aria-label="Foto vergrößern: ${escapeHTML(p.alt)}"><img src="assets/${escapeHTML(p.src)}" alt="${escapeHTML(p.alt)}" width="${p.width}" height="${p.height}" loading="lazy"></button>`).join('')}</div>`;
}
function selectCategory(index) {
 if (!Number.isInteger(index) || !menu[index]) throw new Error('Unbekannte Kategorie');
 const c = menu[index];
 document.querySelectorAll('.menu-categories button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
 const bar=$('.menu-categories'),active=bar?.children[index];
 if(active&&bar.scrollWidth>bar.clientWidth)bar.scrollTo({left:active.offsetLeft-bar.offsetLeft-(bar.clientWidth-active.offsetWidth)/2,behavior:'smooth'});
 const panel=$('#menu-panel');panel.classList.remove('swap');void panel.offsetWidth;panel.classList.add('swap');
 panel.innerHTML = `${photographyHTML(c.media)}<div class="menu-title-row"><h3>${escapeHTML(c.name)}</h3><span class="menu-count">${c.items.length} ${c.drinks?'Getränke':'Gerichte'}</span></div><div class="dish-list">${c.items.map(dishHTML).join('')}</div>`;
}
if ($('#menu-root')) fetch('menu.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{
 menu=data; $('#menu-root').innerHTML = `<div class="menu-layout"><div class="menu-categories" role="group" aria-label="Speisekarten-Kategorien">${menu.map((c,i)=>`<button type="button" data-category="${i}" aria-controls="menu-panel" aria-pressed="false">${escapeHTML(c.name)}</button>`).join('')}</div><div class="menu-panel" id="menu-panel" aria-live="polite" aria-atomic="true"></div></div>`;
 selectCategory(10);
 $('.menu-categories').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b)selectCategory(Number(b.dataset.category));});
 if(document.modelContext?.registerTool) Promise.resolve(document.modelContext.registerTool({name:'show_menu_category',title:'Speisekarte anzeigen',description:'Zeigt eine Kategorie der NAMA-Speisekarte an. Erstellt keine Reservierung.',inputSchema:{type:'object',properties:{category:{type:'string',enum:menu.map(c=>c.name)}},required:['category'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){const i=menu.findIndex(c=>c.name===input?.category);selectCategory(i);$('#speisekarte').scrollIntoView();return {category:menu[i].name,items:menu[i].items};}})).catch(()=>{});
}).catch(()=>{$('#menu-root').innerHTML='<p>Die Speisekarte konnte nicht geladen werden. <a class="text-link" href="speisekarte.html">Vollständige Karte öffnen</a></p>';});
if ($('#gallery')) {
 fetch('photos.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(photos=>{
  $('#gallery').innerHTML=photos.map((p,i)=>`<button type="button" data-image="assets/${escapeHTML(p.src)}" aria-label="Foto vergrößern: ${escapeHTML(p.alt)}" ${i>=9?'hidden':''}><img src="assets/${escapeHTML(p.src)}" alt="${escapeHTML(p.alt)}" loading="lazy" width="${p.width}" height="${p.height}"></button>`).join('');
  $('#gallery-count').textContent=`${photos.length} Bilder`;
  const expand=$('#gallery-expand');expand.hidden=false;expand.textContent=`Alle ${photos.length} Bilder ansehen`;
  expand.addEventListener('click',()=>{
   const expanded=expand.getAttribute('aria-expanded')!=='true';
   $('#gallery').querySelectorAll('button').forEach((b,i)=>b.hidden=!expanded&&i>=9);
   expand.setAttribute('aria-expanded',String(expanded));expand.textContent=expanded?'Weniger Bilder anzeigen':`Alle ${photos.length} Bilder ansehen`;
   if(!expanded)$('#einblicke').scrollIntoView({behavior:'smooth'});
  });
 }).catch(()=>{$('#gallery').innerHTML='<p>Die Bilder konnten nicht geladen werden. Bitte versuchen Sie es später erneut.</p>';});
}
document.addEventListener('click',e=>{const button=e.target.closest('[data-image]');if(!button)return;$('#lightbox img').src=button.dataset.image;$('#lightbox img').alt=button.querySelector('img').alt;$('#lightbox').showModal();});
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>dialog.close()));dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});});
function berlinNow(now = new Date()) {
 const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(x=>[x.type,x.value]));
 return {date:`${p.year}-${p.month}-${p.day}`,time:`${p.hour}:${p.minute}`};
}
function bookingError(data, now = new Date()) {
 const current=berlinNow(now);
 if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)||!/^\d{2}:\d{2}$/.test(data.time))return 'Bitte wählen Sie Datum und Uhrzeit.';
 const day = new Date(data.date+'T12:00:00Z');
 if (Number.isNaN(day.valueOf()) || day.toISOString().slice(0,10)!==data.date)return 'Bitte wählen Sie ein gültiges Datum.';
 if (data.date<current.date || (data.date===current.date && data.time<=current.time))return 'Bitte wählen Sie einen Termin in der Zukunft.';
 if (day.getUTCDay()===1)return 'Montags haben wir geschlossen. Bitte wählen Sie einen anderen Tag.';
 if(!/^(1[2-9]|2[01]):(00|30)$/.test(data.time))return 'Bitte wählen Sie eine Uhrzeit zwischen 12:00 und 21:30 Uhr.';
 if(!/^([1-9]|10)$/.test(data.guests))return 'Bitte wählen Sie 1 bis 10 Gäste. Für größere Gruppen rufen Sie uns bitte an.';
 if(!data.name?.trim()||data.name.length>100)return 'Bitte geben Sie Ihren Namen an.';
 if(!/^[+\d\s()./-]{6,40}$/.test(data.phone)||data.phone.replace(/\D/g,'').length<6)return 'Bitte geben Sie eine gültige Telefonnummer an.';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)||data.email.length>254)return 'Bitte geben Sie eine gültige E-Mail-Adresse an.';
 if((data.note||'').length>1000)return 'Ihre Nachricht darf maximal 1000 Zeichen enthalten.';
 if(data.privacy!=='on')return 'Bitte bestätigen Sie die Datenschutzhinweise.';
 return '';
}
function bookingEmail(data, config) {
 const date=new Intl.DateTimeFormat('de-DE',{weekday:'long',day:'2-digit',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(data.date+'T12:00:00Z'));
 const shortDate=new Intl.DateTimeFormat('de-DE',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}).format(new Date(data.date+'T12:00:00Z'));
 const guests=`${data.guests} ${data.guests==='1'?'Gast':'Gäste'}`;
 return {
  _subject:`[NAMA] Neue Tischanfrage | ${shortDate}, ${data.time} Uhr | ${guests} | ${data.name.replace(/\s+/g,' ').trim()}`,
  _template:'table',_replyto:data.email,...(config.cc?{_cc:config.cc}:{}),
  Termin:`${date}, ${data.time} Uhr (Bad Oldesloe)`,Personen:data.guests,
  Gast:data.name.trim(),Telefon:data.phone.trim(),email:data.email.trim(),
  'Wünsche und Hinweise':data.note?.trim()||'Keine besonderen Wünsche',
  Status:'Bitte Verfügbarkeit prüfen und dem Gast per Antwort auf diese E-Mail bestätigen. Noch keine bestätigte Reservierung.',
  _honey:data.website||''
 };
}
const form=$('#reservation-form');
if(form){
 form.elements.date.min=berlinNow().date;
 for(let hour=12;hour<=21;hour++) for(const minute of ['00','30'])form.elements.time.add(new Option(`${hour}:${minute} Uhr`,`${hour}:${minute}`));
 for(let n=1;n<=10;n++)form.elements.guests.add(new Option(`${n} ${n===1?'Person':'Personen'}`,String(n)));
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(form.dataset.sending==='true')return;
  const data=Object.fromEntries(new FormData(form));const status=$('#form-status');const error=bookingError(data);
  if(error){status.textContent=error;return;}
  if(data.website){status.textContent='Die Anfrage konnte nicht gesendet werden. Bitte rufen Sie uns an.';return;}
  const button=form.querySelector('[type=submit]');form.dataset.sending='true';button.disabled=true;button.textContent='Wird gesendet …';status.textContent='';
  try {
   const configResponse=await fetch('booking-config.json');if(!configResponse.ok)throw Error('Konfiguration nicht verfügbar.');const config=await configResponse.json();
   if(!config.enabled)throw Error('Online-Anfragen sind noch nicht freigeschaltet. Bitte reservieren Sie telefonisch unter 04531 4259856.');
   const response=await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(config.recipient)}`,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},signal:AbortSignal.timeout(20000),body:JSON.stringify(bookingEmail(data,config))});
   const result=await response.json();
   if(!response.ok || ![true,'true'].includes(result.success) || /activat|confirm your email|verify your email/i.test(result.message||'')){
    console.warn('FormSubmit:', response.status, result);
    const local=/^(localhost|127\.0\.0\.1)$/.test(window.location?.hostname||'');
    throw Error('Ihre Anfrage konnte noch nicht übermittelt werden. Bitte rufen Sie uns unter 04531 4259856 an.'+(local&&result.message?` [Test: ${result.message}]`:''));
   }
   $('#booking-summary').textContent=`${new Intl.DateTimeFormat('de-DE',{dateStyle:'long',timeZone:'UTC'}).format(new Date(data.date+'T12:00:00Z'))} · ${data.time} Uhr · ${data.guests} ${data.guests==='1'?'Person':'Personen'}`;
   $('#success-dialog').showModal();form.reset();
  }catch(error){status.textContent=error.name==='TimeoutError'?'Keine eindeutige Rückmeldung vom Versanddienst. Bitte rufen Sie uns an, bevor Sie die Anfrage erneut senden.':(error instanceof TypeError?'Verbindung fehlgeschlagen. Bitte prüfen Sie Ihre Internetverbindung oder rufen Sie uns an.':error.message);}
  finally{delete form.dataset.sending;button.disabled=false;button.textContent='Reservierung anfragen';}
 });
}

// Hiệu ứng: header khi cuộn, thanh tiến trình, nút lên đầu, hero trình chiếu, chữ NAMA, parallax
const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const header = $('.header:not(.legal-header)'), progress = $('.scroll-progress'), toTop = $('.to-top'), storyPhoto = $('.story-photo img');
function onScroll() {
 const y = window.scrollY || 0, max = document.documentElement.scrollHeight - innerHeight;
 header?.classList.toggle('scrolled', y > 60);
 if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
 toTop?.classList.toggle('show', y > 900);
 if (storyPhoto && !reduceMotion) { const r = storyPhoto.parentElement.getBoundingClientRect(); const shift = Math.max(-26, Math.min(26, (r.top + r.height / 2 - innerHeight / 2) * -0.06)); storyPhoto.style.transform = `translateY(${shift.toFixed(1)}px) scale(1.12)`; }
}
if (window.addEventListener) { addEventListener('scroll', () => requestAnimationFrame(onScroll), {passive:true}); onScroll(); }
toTop?.addEventListener('click', () => scrollTo({top:0, behavior:reduceMotion?'auto':'smooth'}));
const heroTitle = $('#hero-title');
if (heroTitle?.firstChild?.nodeType === 3) {
 const word = heroTitle.firstChild.textContent;
 heroTitle.firstChild.replaceWith(Object.assign(document.createElement('span'), {className:'hero-word', innerHTML:`<span class="sr-only">${escapeHTML(word)}</span>`+[...word].map((ch,i)=>`<span class="hero-letter" aria-hidden="true" style="--i:${i}">${escapeHTML(ch)}</span>`).join('')}));
}
const slides = [...document.querySelectorAll('.hero-slide')], dots = [...document.querySelectorAll('.hero-dots span')];
if (slides.length > 1 && !reduceMotion) {
 let current = 0;
 setInterval(() => {
  if (document.hidden) return;
  slides[current].classList.remove('active'); dots[current]?.classList.remove('active');
  current = (current + 1) % slides.length;
  slides[current].classList.add('active'); dots[current]?.classList.add('active');
 }, 6000);
}
