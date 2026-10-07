// HTML for a provider that supports custom email bodies; FormSubmit cannot send this template.
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function reservationEmailHTML(data) {
 const date = new Intl.DateTimeFormat('de-DE',{weekday:'long',day:'2-digit',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(data.date+'T12:00:00Z'));
 const name = escape(data.name.trim()), email = escape(data.email.trim()), phone = escape(data.phone.trim());
 const guests = `${escape(data.guests)} ${data.guests==='1'?'Gast':'Gäste'}`;
 const note = escape(data.note?.trim() || 'Keine besonderen Wünsche').replace(/\r?\n/g,'<br>');
 return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Neue Tischanfrage · NAMA</title></head>
<body style="margin:0;padding:0;background:#f2ede7;color:#2b211e;font-family:Arial,Helvetica,sans-serif">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${name} · ${date} · ${escape(data.time)} Uhr · ${guests}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2ede7"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#fffdf9;border-top:5px solid #a72a28">
<tr><td style="padding:26px 32px 24px;background:#fbf4e8;border-bottom:1px solid #e8dfd4"><img src="https://nama-asian-fusion.nhokli210.chatgpt.site/assets/logo-email.png" width="134" alt="NAMA Asian Fusion &amp; Sushi" style="display:block;width:134px;max-width:100%;height:auto;border:0"><div style="margin-top:12px;font-size:10px;letter-spacing:2px;color:#77655b">BAD OLDESLOE</div></td></tr>
<tr><td style="padding:30px 32px 22px"><div style="font-size:11px;letter-spacing:1.5px;font-weight:bold;color:#a72a28">NEUE TISCHANFRAGE</div><h1 style="margin:12px 0 8px;font-family:Georgia,serif;font-size:30px;line-height:1.2;font-weight:normal">Ein Tisch für ${name}.</h1><p style="margin:0;color:#77655b;font-size:14px;line-height:1.6">Bitte Verfügbarkeit prüfen und dem Gast persönlich bestätigen.</p></td></tr>
<tr><td style="padding:0 32px 28px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5eee5;border-left:3px solid #a72a28"><tr><td style="padding:20px 22px"><div style="font-size:15px;line-height:1.6">${escape(date)}</div><div style="margin-top:4px;font-size:26px;font-family:Georgia,serif;line-height:1.3">${escape(data.time)} Uhr <span style="color:#bba492">&nbsp;·&nbsp;</span> ${guests}</div><div style="margin-top:6px;font-size:11px;color:#77655b">Ortszeit Bad Oldesloe</div></td></tr></table></td></tr>
<tr><td style="padding:0 32px 26px"><h2 style="margin:0 0 14px;font-size:11px;letter-spacing:1.5px;color:#77655b">KONTAKT</h2><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.5">
<tr><td width="90" style="padding:10px 0;border-bottom:1px solid #eee6dd;color:#77655b">Gast</td><td style="padding:10px 0;border-bottom:1px solid #eee6dd;overflow-wrap:anywhere">${name}</td></tr>
<tr><td style="padding:10px 0;border-bottom:1px solid #eee6dd;color:#77655b">Telefon</td><td style="padding:10px 0;border-bottom:1px solid #eee6dd"><a href="tel:${escape(data.phone.replace(/[^+\d]/g,''))}" style="color:#a72a28;text-decoration:none">${phone}</a></td></tr>
<tr><td style="padding:10px 0;color:#77655b">E-Mail</td><td style="padding:10px 0;overflow-wrap:anywhere"><a href="mailto:${email}" style="color:#a72a28;text-decoration:none">${email}</a></td></tr></table></td></tr>
<tr><td style="padding:0 32px 28px"><h2 style="margin:0 0 10px;font-size:11px;letter-spacing:1.5px;color:#77655b">WÜNSCHE &amp; HINWEISE</h2><p style="margin:0;font-size:14px;line-height:1.7;overflow-wrap:anywhere">${note}</p></td></tr>
<tr><td style="padding:0 32px 30px"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td bgcolor="#a72a28" style="border-radius:3px"><a href="mailto:${email}" style="display:inline-block;padding:14px 24px;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none">Dem Gast antworten &nbsp;→</a></td></tr></table><p style="margin:14px 0 0;font-size:12px;line-height:1.6;color:#77655b">Diese Anfrage ist noch keine bestätigte Reservierung.</p></td></tr>
<tr><td style="padding:20px 32px;background:#2b211e;color:#d4c5b7;font-size:11px;line-height:1.8">NAMA · Asian Fusion &amp; Sushi<br>Hindenburgstraße 38 · 23843 Bad Oldesloe<br>04531 4259856</td></tr>
</table><p style="margin:18px 0 0;font-size:10px;color:#89776a">Tischanfrage über die NAMA Website</p>
</td></tr></table></body></html>`;
}
