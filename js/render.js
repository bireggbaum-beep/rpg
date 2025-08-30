// js/render.js
import { txt, plusify } from './utils.js';

export function naturalAttackLine(a) {
  if (a.isSpell) {
    let line = `<b>${a.name}</b>`;
    if (a.anzahl) line += ` [${a.anzahl}x]`;
    if (a.beschreibung) line += ` ${a.beschreibung}`;
    if (a.reichweite) {
      if (/^\d+$/.test(a.reichweite)) {
        line += `, RW: ${a.reichweite}`;
      } else {
        line += ` (${a.reichweite})`;
      }
    }
    return line;
  }

  const name = (a.name || 'Angriff');
  const bits = [];
  if (a.to_hit != null) bits.push(`${plusify(a.to_hit)} zum Treffen`);
  if (a.schaden != null) bits.push(`${a.schaden} Schaden`);

  if (a.reichweite) {
    if (/^\d+$/.test(a.reichweite)) {
      bits.push(`(RW: ${a.reichweite})`);
    } else {
      bits.push(`(${a.reichweite})`);
    }
  }

  if (a.zusatz) bits.push(`und ${a.zusatz}`);

  let line = `<b>${name}</b> ${bits.filter(Boolean).join(', ')}`;

  if (a.rettungswurf) {
    const r = a.rettungswurf;
    const mis = r.bei_misserfolg || 'negative Wirkung';
    line += ` (Rettungswurf ${r.art} ${txt(r.zw)} oder ${mis})`;
  }

  if (a.anzahl && !a.isSpell) line += ` [${a.anzahl}x]`;
  return line;
}

export function renderLoot(beute) {
  if (!beute || beute.length === 0) return '<span class="muted">Keine.</span>';

  const schatz = beute.filter(b => b.typ === "Schatz");
  const ausruestung = beute.filter(b => b.typ === "Ausrüstung");
  const zutaten = beute.filter(b => b.typ === "Zutaten");

  let html = "";

  if (schatz.length > 0) {
    html += `<div class="loot-category"><b>Schatz:</b></div>`;
    schatz.forEach(item => {
      let text = "";
      if (item.wurf) text += item.wurf + " ";
      if (item.beschreibung) text += item.beschreibung;
      html += `<div class="loot-item">${text}</div>`;
    });
  }

  if (ausruestung.length > 0) {
    html += `<div class="loot-category"><b>Ausrüstung:</b></div>`;
    ausruestung.forEach(item => {
      let text = "";
      if (item.wurf) text += `<span class="muted">${item.wurf}</span> `;
      if (item.anzahl && item.anzahl > 1) text += `${item.anzahl}x `;
      text += item.beschreibung || "Ausrüstung";
      if (item.wert) text += ` (Wert: ${item.wert} GM)`;
      html += `<div class="loot-item">${text}</div>`;
    });
  }

  if (zutaten.length > 0) {
    html += `<div class="loot-category"><b>Zutaten (erntbar):</b></div>`;
    zutaten.forEach(item => {
      let text = "";
      if (item.wurf) text += `<span class="muted">${item.wurf}</span> `;
      if (item.anzahl && item.anzahl > 1) text += `${item.anzahl}x `;
      text += item.beschreibung || "Zutat";
      if (item.wert) text += ` (Wert: ${item.wert} GM)`;
      html += `<div class="loot-item">${text}</div>`;
    });
  }

  return html || '<span class="muted">Keine.</span>';
}
