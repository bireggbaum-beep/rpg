// js/main.js
import { $, txt, plusify, formatNote, parseRes, fmtBew, formatPaNote, normalizeHg } from './utils.js';
import { naturalAttackLine, renderLoot } from './render.js';
import { filterAndSort, populateList } from './list.js';

// ===== GLOBALE VARIABLEN =====
let creatureData = [];
let sortMode = 'az';
let currentIndex = -1;

// ===== BEISPIELDATEN =====
const sampleData = [
  {
    "name": "Aboleth",
    "typ": "Monster",
    "hg": 8,
    "pa": 16,
    "paBemerkung": [],
    "lp": 64,
    "ini": "+0",
    "bewegung": "3; Schwimmen 18",
    "sinne": "IM +0",
    "abwehrNahkampf": 16,
    "abwehrFernkampf": 14,
    "schadensreduzierung": 5,
    "schadensreduzierungBemerkung": "Schleimige Haut",
    "zaehigkeit": 8,
    "reflexe": 9,
    "willenskriaft": 14,
    "angriffe": [
      {"name": "Tentakel", "to_hit": 8, "schaden": "4 (1W6) Schaden + Schleim", "reichweite": ""}
    ],
    "besonderheiten": [
      "Gedankenkontrolle: Kann intelligente Gegner kontrollieren",
      "Illusionsmeister: Kann Trugbild nach Belieben wirken",
      "Schleimabsonderung: Erlaubt bezauberte Kreaturen unter Wasser zu atmen",
      "Krankheit: Tentakeltreffer verwandelt Haut langsam in Schleim"
    ],
    "beute": [
      {"typ": "Schatz", "wurf": "6W6×100", "beschreibung": "Goldmünzen"},
      {"typ": "Zutaten", "wurf": "(W61-3)", "beschreibung": "Aboleth-Schleim", "wert": 500}
    ],
    "beschreibung": "Unterirdische aquatische Krustentiere mit telepathischen Kräften."
  },
  {
    "name": "Anhkheg",
    "typ": "Monster",
    "hg": 4,
    "pa": 18,
    "paBemerkung": [],
    "lp": 28,
    "ini": "+0",
    "bewegung": "9; Graben 6",
    "sinne": "SU 18, ZW 3",
    "abwehrNahkampf": 13,
    "abwehrFernkampf": 13,
    "zaehigkeit": 10,
    "reflexe": 6,
    "willenskriaft": 8,
    "angriffe": [
      {"name": "Biss", "to_hit": 5, "schaden": "2W6+1 + Ergreifen"},
      {"name": "Säurespucke", "schaden": "4W4", "reichweite": "9", "rettungswurf": {"art": "Reflexe", "zw": 13, "bei_misserfolg": "voller Schaden"}}
    ],
    "besonderheiten": ["Tunnelgräber"],
    "beute": [],
    "beschreibung": "Große insektenartige Jäger die unter der Erde lauern."
  }
];

// ===== HAUPT-RENDER-FUNKTION =====
function renderStatblock(creature) {
  const out = document.querySelector('#out');
  if (!creature) {
    out.innerHTML = '<div id="placeholder"><p>Keine Kreatur ausgewählt.</p></div>';
    return;
  }

  const res = parseRes(creature.besonderheiten || []);
  const paNote = formatPaNote(creature.paBemerkung);

  let html = `
    <div class="statblock">
      <div class="head">
        <h1 class="name">${txt(creature.name)}</h1>
        <div class="line">
          ${creature.hg ? `<span class="hg-badge">HG ${txt(creature.hg)}</span>` : ''}
          ${creature.typ ? `<span class="chip">${txt(creature.typ)}</span>` : ''}
          ${(creature.traits || []).map(t => `<span class="chip">${txt(t)}</span>`).join('')}
        </div>
        ${creature.beschreibung ? `<div class="desc">${txt(creature.beschreibung)}</div>` : ''}
        <button class="edit-btn" onclick="toggleEditor()">Bearbeiten</button>
      </div>

      <div class="sec">
        <div class="row"><b>Lebenspunkte</b> ${txt(creature.lp)}</div>
        <div class="row"><b>Bewegung</b> ${fmtBew(creature.bewegung)}</div>
        ${creature.sinne ? `<div class="row"><b>Sinne</b> ${txt(creature.sinne)}</div>` : ''}
        ${creature.ini ? `<div class="row"><b>Initiative</b> ${plusify(creature.ini)}</div>` : ''}
      </div>

      <div class="sec">
        <h3>Verteidigung</h3>
        <div class="row">
          <b>Abwehr Nahkampf (PA)</b> ${txt(creature.abwehrNahkampf)}${paNote}
        </div>
        <div class="row"><b>Abwehr Fernkampf (ASW)</b> ${txt(creature.abwehrFernkampf)}</div>
        ${creature.schadensreduzierung ? 
          `<div class="row"><b>Schadensreduktion</b> ${creature.schadensreduzierung}${formatNote(creature.schadensreduzierungBemerkung)}</div>` : ''}
        <div class="rettungswuerfe">
          <span><b>Zähigkeit</b> ${plusify(creature.zaehigkeit)}</span>
          <span><b>Reflexe</b> ${plusify(creature.reflexe)}</span>
          <span><b>Willenskraft</b> ${plusify(creature.willenskriaft)}</span>
        </div>
      </div>

      ${creature.angriffe && creature.angriffe.length > 0 ? `
        <div class="sec">
          <h3>Angriffe</h3>
          <div class="attblock">
            ${creature.angriffe.map(a => `<div class="attline">${naturalAttackLine(a)}</div>`).join('')}
          </div>
        </div>
      ` : ''}

      ${res.imm.length + res.res.length + res.weak.length + res.other.length > 0 ? `
        <div class="sec">
          <h3>Besonderheiten</h3>
          ${res.imm.map(s => `<div class="row">${s}</div>`).join('')}
          ${res.res.map(s => `<div class="row">${s}</div>`).join('')}
          ${res.weak.map(s => `<div class="row">${s}</div>`).join('')}
          ${res.other.map(s => `<div class="row">${s}</div>`).join('')}
        </div>
      ` : ''}

      ${creature.beute && creature.beute.length > 0 ? `
        <div class="sec">
          <h3>Beute</h3>
          ${renderLoot(creature.beute)}
        </div>
      ` : ''}
    </div>
  `;

  out.innerHTML = html;
}

// ===== FILTER FUNKTIONEN =====
function populateHgFilter() {
  const select = document.querySelector('#search-hg');
  if (!select) return;
  
  const hgs = [...new Set(creatureData.map(c => c.hg))];
  hgs.sort((a, b) => normalizeHg(a) - normalizeHg(b));
  
  select.innerHTML = '<option value="">Alle HG</option>';
  hgs.forEach(hg => {
    const opt = document.createElement('option');
    opt.value = hg;
    opt.textContent = `HG ${hg}`;
    select.appendChild(opt);
  });
}

function populateTypeFilter() {
  const elTypeDrop = document.querySelector('#search-type');
  if (!elTypeDrop) return;
  
  const types = [...new Set(creatureData.map(c => c.typ).filter(Boolean))];
  types.sort((a, b) => a.localeCompare(b, 'de'));
  
  elTypeDrop.innerHTML = '<option value="">Alle Typen</option>';
  types.forEach(typ => {
    const opt = document.createElement('option');
    opt.value = typ;
    opt.textContent = typ;
    elTypeDrop.appendChild(opt);
  });
}

// ===== LISTEN-SETUP =====
function setupNewList() {
  const elList     = document.querySelector('#creature-list');
  const elSearchNm = document.querySelector('#search-name');
  const elTypeDrop = document.querySelector('#search-type');
  const elHg       = document.querySelector('#search-hg');
  const btnAlpha   = document.querySelector('#sort-alpha');
  const btnSortHg  = document.querySelector('#sort-hg');

  function refreshList() {
    const items = filterAndSort(creatureData, {
      nameTerm: elSearchNm?.value || '',
      typ: elTypeDrop?.value || '',
      hg: elHg?.value || '',
      sort: sortMode
    });

    populateList(elList, items, {
      activeIndex: currentIndex,
      onSelect: (idx) => {
        currentIndex = idx;
        renderStatblock(creatureData[currentIndex]);
        refreshList();
      }
    });
  }

  elSearchNm?.addEventListener('input', refreshList);
  elTypeDrop?.addEventListener('change', refreshList);
  elHg?.addEventListener('change', refreshList);
  
  btnAlpha?.addEventListener('click', () => {
    sortMode = 'az';
    btnAlpha.classList.add('active');
    btnSortHg.classList.remove('active');
    refreshList();
  });
  
  btnSortHg?.addEventListener('click', () => {
    sortMode = 'hg';
    btnSortHg.classList.add('active');
    btnAlpha.classList.remove('active');
    refreshList();
  });

  refreshList();
}

// ===== DATEI-FUNKTIONEN =====
function handleFileLoad(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      creatureData = JSON.parse(ev.target.result);
      document.querySelector('#file-name').textContent = file.name;
      currentIndex = -1;
      populateHgFilter();
      populateTypeFilter();
      setupNewList();
      renderStatblock(null);
    } catch (err) {
      alert('Fehler beim Laden der Datei: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function handleFileImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const newData = JSON.parse(ev.target.result);
      creatureData = [...creatureData, ...newData];
      populateHgFilter();
      populateTypeFilter();
      setupNewList();
      alert(`${newData.length} Kreaturen hinzugefügt!`);
    } catch (err) {
      alert('Fehler beim Importieren: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function exportAllCreatures() {
  const json = JSON.stringify(creatureData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kreaturen_export.json';
  a.click();
  URL.revokeObjectURL(url);
}

// ===== EDITOR FUNKTIONEN =====
window.toggleEditor = function() {
  let editor = document.querySelector('.inline-editor');
  if (!editor) {
    const out = document.querySelector('#out');
    const editorHTML = `
      <div class="inline-editor visible">
        <div class="editor-header">
          <h3>Kreatur bearbeiten</h3>
          <button onclick="closeEditor()" style="background:transparent;color:var(--ink);border:none;font-size:20px;cursor:pointer;">✕</button>
        </div>
        <div class="editor-body">
          <form id="creature-form">
            <div class="form-section">
              <h4>Grunddaten</h4>
              <div class="form-row">
                <div class="form-group large">
                  <label>Name</label>
                  <input type="text" name="name">
                </div>
                <div class="form-group medium">
                  <label>Typ</label>
                  <input type="text" name="typ">
                </div>
                <div class="form-group small">
                  <label>HG</label>
                  <input type="text" name="hg">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group full">
                  <label>Beschreibung</label>
                  <textarea name="beschreibung" rows="2"></textarea>
                </div>
              </div>
            </div>
            
            <div class="form-section">
              <h4>Kampfwerte</h4>
              <div class="form-row">
                <div class="form-group small">
                  <label>LP</label>
                  <input type="number" name="lp">
                </div>
                <div class="form-group small">
                  <label>PA</label>
                  <input type="number" name="abwehrNahkampf">
                </div>
                <div class="form-group small">
                  <label>ASW</label>
                  <input type="number" name="abwehrFernkampf">
                </div>
                <div class="form-group small">
                  <label>INI</label>
                  <input type="text" name="ini">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group small">
                  <label>Zähigkeit</label>
                  <input type="number" name="zaehigkeit">
                </div>
                <div class="form-group small">
                  <label>Reflexe</label>
                  <input type="number" name="reflexe">
                </div>
                <div class="form-group small">
                  <label>Willenskraft</label>
                  <input type="number" name="willenskriaft">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group medium">
                  <label>Bewegung</label>
                  <input type="text" name="bewegung">
                </div>
                <div class="form-group medium">
                  <label>Sinne</label>
                  <input type="text" name="sinne">
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="editor-footer">
          <button onclick="saveCreature()">Speichern</button>
          <button onclick="closeEditor()">Abbrechen</button>
        </div>
      </div>
    `;
    out.insertAdjacentHTML('beforeend', editorHTML);
    
    // Formular mit aktuellen Daten füllen
    if (currentIndex >= 0 && creatureData[currentIndex]) {
      const creature = creatureData[currentIndex];
      const form = document.querySelector('#creature-form');
      form.name.value = creature.name || '';
      form.typ.value = creature.typ || '';
      form.hg.value = creature.hg || '';
      form.lp.value = creature.lp || '';
      form.abwehrNahkampf.value = creature.abwehrNahkampf || '';
      form.abwehrFernkampf.value = creature.abwehrFernkampf || '';
      form.zaehigkeit.value = creature.zaehigkeit || '';
      form.reflexe.value = creature.reflexe || '';
      form.willenskriaft.value = creature.willenskriaft || '';
      form.ini.value = creature.ini || '';
      form.bewegung.value = creature.bewegung || '';
      form.sinne.value = creature.sinne || '';
      form.beschreibung.value = creature.beschreibung || '';
    }
  } else {
    editor.classList.toggle('visible');
  }
};

window.closeEditor = function() {
  const editor = document.querySelector('.inline-editor');
  if (editor) editor.remove();
};

window.saveCreature = function() {
  if (currentIndex < 0) return;
  
  const form = document.querySelector('#creature-form');
  const creature = creatureData[currentIndex];
  
  // Daten aus Formular übernehmen
  creature.name = form.name.value;
  creature.typ = form.typ.value;
  creature.hg = form.hg.value;
  creature.lp = parseInt(form.lp.value) || 0;
  creature.abwehrNahkampf = parseInt(form.abwehrNahkampf.value) || 0;
  creature.abwehrFernkampf = parseInt(form.abwehrFernkampf.value) || 0;
  creature.zaehigkeit = parseInt(form.zaehigkeit.value) || 0;
  creature.reflexe = parseInt(form.reflexe.value) || 0;
  creature.willenskriaft = parseInt(form.willenskriaft.value) || 0;
  creature.ini = form.ini.value;
  creature.bewegung = form.bewegung.value;
  creature.sinne = form.sinne.value;
  creature.beschreibung = form.beschreibung.value;
  
  // Neu rendern
  renderStatblock(creature);
  populateHgFilter();
  populateTypeFilter();
  setupNewList();
  
  // Editor schließen
  closeEditor();
};


// ===== INITIALISIERUNG =====
function init() {
  creatureData = sampleData;
  populateHgFilter();
  populateTypeFilter();
  setupNewList();
  
  // File-Handler
  document.querySelector('#file-loader')?.addEventListener('change', handleFileLoad);
  document.querySelector('#file-importer')?.addEventListener('change', handleFileImport);
  document.querySelector('#export-btn')?.addEventListener('click', exportAllCreatures);
  
  // Initial-Sortierung aktiv
  document.querySelector('#sort-alpha')?.classList.add('active');

  // GitHub Event Listener
  document.querySelector('#github-pull-btn')?.addEventListener('click', pullFromGitHub);
  document.querySelector('#github-push-btn')?.addEventListener('click', pushToGitHub);
}

// Starten
init();
