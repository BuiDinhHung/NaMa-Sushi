export function berlinNow(now = new Date()) {
 const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(x=>[x.type,x.value]));
 return {date:`${p.year}-${p.month}-${p.day}`,time:`${p.hour}:${p.minute}`};
}
// Đặt bàn sớm nhất 30 phút sau giờ hiện tại (giờ Bad Oldesloe); slot chỉ có :00 và :30.
export function earliestBookingTime(now = new Date()) {
 const [h,m]=berlinNow(now).time.split(':').map(Number);
 return h*60+m+30;
}
export function bookingError(data, now = new Date()) {
 const current=berlinNow(now);
 if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)||!/^\d{2}:\d{2}$/.test(data.time))return 'Bitte wählen Sie Datum und Uhrzeit.';
 const day = new Date(data.date+'T12:00:00Z');
 if (Number.isNaN(day.valueOf()) || day.toISOString().slice(0,10)!==data.date)return 'Bitte wählen Sie ein gültiges Datum.';
 if (data.date<current.date)return 'Bitte wählen Sie einen Termin in der Zukunft.';
 const [h,m]=data.time.split(':').map(Number);
 if (data.date===current.date && h*60+m<earliestBookingTime(now))return 'Bitte wählen Sie eine Uhrzeit mindestens 30 Minuten ab jetzt.';
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
export function bookingSubject(data) {
 const date=new Intl.DateTimeFormat('de-DE',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}).format(new Date(data.date+'T12:00:00Z'));
 return `[NAMA] Neue Tischanfrage | ${date}, ${data.time} Uhr | ${data.guests} ${data.guests==='1'?'Gast':'Gäste'} | ${data.name.replace(/\s+/g,' ').trim()}`;
}
