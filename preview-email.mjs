import fs from 'node:fs';
import {reservationEmailHTML} from './email-template.mjs';
const html=reservationEmailHTML({name:'Max Mustermann',email:'gast@example.com',phone:'+49 123 456789',date:'2026-10-21',time:'21:30',guests:'5',note:'Ein ruhiger Tisch am Fenster, bitte.\nVielen Dank!'});
fs.writeFileSync(new URL('./dist/email-preview.html',import.meta.url),html);
