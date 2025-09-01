// js/render.js
import { txt, plusify } from './utils.js';

export function naturalAttackLine(a) {
    const name = `<b>${a.name || 'Unbenannter Angriff'}</b>`;
    const bits = [];

    if (a.to_hit != null) {
        bits.push(`${plusify(a.to_hit)} zum Treffen`);
    }
    if (a.schaden) {
        bits.push(`${a.schaden} Schaden`);
    }
    if (a.reichweite) {
        bits.push(`(${a.reichweite})`);
    }
    if (a.zusatz && !a.rettungswurf) {
        bits.push(`und ${a.zusatz}`);
    }

    let line = `${name} ${bits.join(', ')}`;

    if (a.rettungswurf) {
        const r = a.rettungswurf;
        const effekt = r.bei_misserfolg || a.zusatz || 'Effekt';
        line += ` (Rettungswurf ${r.art} ${txt(r.zw)} oder ${effekt})`;
    }

    if (a.anzahl) {
        line += ` <span class="muted">[${a.anzahl}x pro Kampf]</span>`;
    }

    return line;
}


export function renderLoot(beute) {
    if (!beute || beute.length === 0) return '<span class="muted">Keine.</span>';

    const lootGroups = beute.reduce((acc, item) => {
        const typ = item.typ || 'Unbekannt';
        if (!acc[typ]) acc[typ] = [];
        acc[typ].push(item);
        return acc;
    }, {});

    let html = "";
    const categoryOrder = [
        { key: 'Schatz', title: 'Schatz' },
        { key: 'Ausrüstung', title: 'Ausrüstung' },
        { key: 'Zutaten', title: 'Zutaten (erntbar)' }
    ];

    categoryOrder.forEach(category => {
        const items = lootGroups[category.key];
        if (items && items.length > 0) {
            html += `<div class="loot-category"><b>${category.title}:</b></div>`;
            items.forEach(item => {
                html += '<div class="loot-item">';
                let mainLine = '';
                if (item.wurf) mainLine += `<span class="muted">${item.wurf}</span> `;
                mainLine += item.beschreibung || "Gegenstand";
                html += `<div>${mainLine}</div>`;

                if (Array.isArray(item.optionen) && item.optionen.length > 0) {
                    html += '<div class="loot-options">';
                    item.optionen.forEach(opt => {
                        let optLine = `<span class="muted">(Bei ${opt.bedingung || '?'})</span> `;
                        if (opt.anzahl && opt.anzahl > 1) optLine += `${opt.anzahl}x `;
                        optLine += opt.name || 'Unbekannter Gegenstand';
                        if (opt.wert) optLine += ` (Wert: ${opt.wert} GM)`;
                        html += `<div class="loot-option-item">${optLine}</div>`;
                    });
                    html += '</div>';
                } else if (item.wert) {
                    html = html.slice(0, -6);
                    html += ` (Wert: ${item.wert} GM)</div>`;
                }
                html += '</div>';
            });
        }
    });
    return html || '<span class="muted">Keine.</span>';
}

