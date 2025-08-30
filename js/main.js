import { $, txt, plusify, formatNote, parseRes, fmtBew, formatPaNote, normalizeHg } from './utils.js';
import { naturalAttackLine, renderLoot } from './render.js';


document.addEventListener("DOMContentLoaded", () => {
  const $ = s => document.querySelector(s);
  let creatureData = [];
  let currentCreatureIndex = -1;
  let editorVisible = false;

  const sampleData = [
    {
      "name": "Ork-Plünderer",
      "typ": "Humanoid",
      "traits": ["Ork"],
      "hg": 1,
      "ep": 150,
      "lp": 22,
      "sr": 3,
      "sr_bemerkung": "Felle und rostige Metallplatten",
      "bew": "5",
      "pa": 14,
      "asw": 13,
      "ini": 1,
      "rz": 12,
      "rr": 11,
      "rw": 10,
      "pa_bemerkung": [
        {
          "icon": "shield",
          "value": "+1",
          "description": "Holzschild"
        }
      ],
      "asw_bemerkung": "",
      "angriffe": [
        {
          "name": "Grobes Kriegsbeil",
          "to_hit": 4,
          "schaden": "7 (1W8+3)",
          "zusatz": "Niederschlagen"
        }
      ],
      "besonderheiten": [
        "Aggressiv: Bewegt sich in seiner Runde immer auf den nächsten Feind zu, wenn möglich."
      ],
      "beute": [
        { "typ": "Schatz", "wurf": "2W8", "beschreibung": "Goldmünzen" },
        { "typ": "Ausrüstung", "beschreibung": "Grobes Kriegsbeil", "wert": 10 },
        { "typ": "Ausrüstung", "beschreibung": "Holzschild", "wert": 5 }
      ],
      "beschreibung": "Dieser grimmige, grün-häutige Humanoid starrt dich mit blutunterlaufenen Augen an und entblößt seine hauerartigen Zähne."
    },
    {
      "name": "Sumpf-Schleicher",
      "typ": "Tier",
      "traits": ["Reptil"],
      "hg": 2,
      "ep": 200,
      "lp": 28,
      "sr": 2,
      "sr_bemerkung": "Schuppige Haut",
      "bew": "4 (Schwimmen 6)",
      "pa": 14,
      "asw": 14,
      "ini": 3,
      "rz": 13,
      "rr": 14,
      "rw": 11,
      "angriffe": [
        {
          "name": "Biss",
          "to_hit": 5,
          "schaden": "6 (1W8+2)"
        },
        {
          "name": "Giftspucke",
          "to_hit": 5,
          "schaden": "3 (1W4+1)",
          "reichweite": "3xLang",
          "anzahl": 2,
          "zusatz": "Ziel wird verlangsamt",
          "rettungswurf": {
            "art": "RZ",
            "zw": 13,
            "bei_misserfolg": "1 Runde verlangsamt"
          }
        }
      ],
      "besonderheiten": [
        "Sumpftarnung: Hat einen Vorteil bei Verstecken-Proben in Sumpfgebieten."
      ],
      "beute": [
        { "typ": "Schatz", "wurf": "3W6", "beschreibung": "Goldmünzen" },
        { "typ": "Zutaten", "beschreibung": "Giftzahn", "wert": 25 },
        { "typ": "Zutaten", "beschreibung": "Schuppenhaut (1W4 Stück)", "wert": 10 }
      ],
      "beschreibung": "Diese große, echsenartige Kreatur hat eine schlammverkrustete, moosgrüne Haut."
    },
    {
      "name": "Gruftschrecken",
      "typ": "Untot",
      "traits": ["Geist", "Körperlos"],
      "hg": 3,
      "ep": 350,
      "lp": 35,
      "sr": 4,
      "sr_bemerkung": "Körperlos",
      "bew": "0 (Flug 6)",
      "pa": 15,
      "asw": 15,
      "ini": 2,
      "rz": "immun",
      "rr": 13,
      "rw": "immun",
      "angriffe": [
        {
          "name": "Berührung der Verzweiflung",
          "to_hit": 5,
          "schaden": "7 (2W6)",
          "zusatz": "Ziel wird furchtsam",
          "rettungswurf": {
            "art": "RW",
            "zw": 14,
            "bei_misserfolg": "Ziel wird furchtsam für 1W4 Runden"
          }
        },
        {
          "name": "Dunkle Stärkung",
          "isSpell": true,
          "reichweite": "8",
          "anzahl": 2,
          "beschreibung": "Verbündeter erhält +2 auf Angriff und Schaden für 3 Runden"
        }
      ],
      "besonderheiten": [
        "Körperlos: Kann sich durch Kreaturen und Objekte bewegen."
      ],
      "beute": [
        { "typ": "Zutaten", "beschreibung": "Ektoplasma-Rest", "wert": 40 }
      ],
      "beschreibung": "Ein kalter Hauch erfüllt den Raum, kurz bevor diese durchscheinende Gestalt erscheint."
    }
  ];

function init() {
  creatureData = sampleData;
  populateHgFilter();
  filterAndPopulateSidebar();
  $("#out").innerHTML = `<div id="placeholder"><p>Beispieldaten geladen. Bitte wählen Sie einen Gegner aus der Liste links.</p></div>`;
  $("#file-name").textContent = "Beispieldaten";

  $("#file-loader").addEventListener("change", handleFileLoad);
  $("#search-name").addEventListener("input", filterAndPopulateSidebar);
  $("#search-type").addEventListener("input", filterAndPopulateSidebar);
  $("#search-hg").addEventListener("change", filterAndPopulateSidebar);
  
  // NEUE SORTIER-BUTTONS
  $("#sort-alpha").addEventListener("click", () => handleSort('alpha'));
  $("#sort-hg").addEventListener("click", () => handleSort('hg'));
  
  // Import/Export Event Listener (falls bereits implementiert)
  if ($("#file-importer")) {
    $("#file-importer").addEventListener("change", handleFileImport);
  }
  if ($("#export-btn")) {
    $("#export-btn").addEventListener("click", exportAllCreatures);
  }
}


  function handleFileLoad(event) {
    const file = event.target.files[0];
    if (!file) return;
    $("#file-name").textContent = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) throw new Error("Die JSON-Datei muss ein Array von Gegner-Objekten enthalten.");
        creatureData = data;
        populateHgFilter();
        filterAndPopulateSidebar();
        $("#out").innerHTML = `<div id="placeholder"><p>Daten geladen. Bitte wählen Sie einen Gegner aus der Liste links.</p></div>`;
      } catch (err) {
        alert(`Fehler beim Lesen der Datei: ${err.message}`);
        creatureData = [];
        filterAndPopulateSidebar();
        $("#out").innerHTML = `<div id="placeholder"><p class="error">Fehler: ${err.message}</p></div>`;
      }
    };
    reader.readAsText(file);
  }
  
  // NEUE FUNKTION: Kreaturen importieren und zur bestehenden Liste hinzufügen
  function handleFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) throw new Error("Die JSON-Datei muss ein Array von Gegner-Objekten enthalten.");
      
      // Kreaturen zur bestehenden Liste hinzufügen
      const beforeCount = creatureData.length;
      creatureData = [...creatureData, ...data];
      const addedCount = data.length;
      
      // UI aktualisieren
      populateHgFilter();
      filterAndPopulateSidebar();
      
      // Erfolgsmeldung
      alert(`${addedCount} Kreatur(en) wurden erfolgreich hinzugefügt.\nGesamt: ${creatureData.length} Kreaturen`);
      
      // Dateiname aktualisieren
      $("#file-name").textContent = `${beforeCount} + ${addedCount} Kreaturen`;
      
    } catch (err) {
      alert(`Fehler beim Importieren: ${err.message}`);
    }
  };
  reader.readAsText(file);
  
  // Input zurücksetzen, damit dieselbe Datei erneut importiert werden kann
  event.target.value = '';
}

// Neue Variable für Sortier-Status (nach den anderen let Deklarationen)
let currentSort = 'none'; // 'none', 'alpha', 'hg'

// Neue Funktion: HG-Wert für Sortierung normalisieren
 function normalizeHg(hg) {
  if (hg === null || hg === undefined) return 999; // Ohne HG ans Ende
  if (typeof hg === 'string') {
    // Brüche wie "1/8", "1/4", "1/2" in Dezimalzahlen umwandeln
    if (hg.includes('/')) {
      const parts = hg.split('/');
      return parseFloat(parts[0]) / parseFloat(parts[1]);
    }
  }
  return parseFloat(hg);
}

// Erweiterte filterAndPopulateSidebar Funktion (ersetzen Sie die bestehende):
 function filterAndPopulateSidebar() {
  const nameFilter = ($("#search-name").value || "").toLowerCase();
  const typeFilter = ($("#search-type").value || "").toLowerCase();
  const hgFilter = $("#search-hg").value;

  let filteredCreatures = creatureData.filter(creature => {
    const nameMatch = (creature.name || "").toLowerCase().includes(nameFilter);
    const typeString = (creature.typ || "").toLowerCase();
    const traitsString = (creature.traits || []).join(" ").toLowerCase();
    const typeMatch = typeString.includes(typeFilter) || traitsString.includes(typeFilter);
    const hgMatch = !hgFilter || String(creature.hg) === hgFilter;
    return nameMatch && typeMatch && hgMatch;
  });

  // Sortierung anwenden
  if (currentSort === 'alpha') {
    filteredCreatures.sort((a, b) => {
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      return nameA.localeCompare(nameB, 'de');
    });
  } else if (currentSort === 'hg') {
    filteredCreatures.sort((a, b) => {
      const hgA = normalizeHg(a.hg);
      const hgB = normalizeHg(b.hg);
      if (hgA === hgB) {
        // Bei gleichem HG alphabetisch sortieren
        return (a.name || "").localeCompare(b.name || "", 'de');
      }
      return hgA - hgB;
    });
  }

  populateSidebar(filteredCreatures);
}

// Neue Funktion für Sortier-Buttons
   function handleSort(sortType) {
  // Alle Buttons deaktivieren
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  if (currentSort === sortType) {
    // Wenn bereits aktiv, Sortierung aufheben
    currentSort = 'none';
  } else {
    // Neue Sortierung aktivieren
    currentSort = sortType;
    document.getElementById(`sort-${sortType}`).classList.add('active');
  }
  
   filterAndPopulateSidebar();
  }


// NEUE FUNKTION: Alle Kreaturen als JSON exportieren
  function exportAllCreatures() {
  if (creatureData.length === 0) {
    alert("Keine Kreaturen zum Exportieren vorhanden.");
    return;
  }
  
  // JSON-String erstellen
  const jsonStr = JSON.stringify(creatureData, null, 2);
  
  // Blob erstellen
  const blob = new Blob([jsonStr], { type: 'application/json' });
  
  // Download-Link erstellen
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  // Dateiname mit Timestamp
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  a.download = `kreaturen_export_${timestamp}.json`;
  a.href = url;
  
  // Download auslösen
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // URL freigeben
  URL.revokeObjectURL(url);
  
  // Bestätigungsmeldung (optional)
  console.log(`${creatureData.length} Kreatur(en) wurden exportiert.`);
}

  
  
  
  
  function populateHgFilter() {
    const hgSelect = $("#search-hg");
    const hgValues = [...new Set(creatureData.map(c => c.hg).filter(hg => hg != null))];
    hgValues.sort((a, b) => a - b);
    
    hgSelect.innerHTML = '<option value="">Alle HG</option>';
    hgValues.forEach(hg => {
      const option = document.createElement("option");
      option.value = hg;
      option.textContent = `HG ${hg}`;
      hgSelect.appendChild(option);
    });
  }


 function populateSidebar(creatures) {
  const list = $("#creature-list");
  list.innerHTML = "";
  
  if (creatures.length === 0) {
    list.innerHTML = '<li style="text-align:center; color: var(--muted); font-style: italic;">Keine Treffer</li>';
    return;
  }
  
  creatures.forEach(creature => {
    const originalIndex = creatureData.findIndex(c => c === creature);
    const li = document.createElement("li");
    
    // ANPASSUNG: Strukturierter Inhalt mit Name, Typ und HG
    const name = creature.name || `Unbenannter Gegner ${originalIndex + 1}`;
    const typ = creature.typ || "Unbekannt";
    const hg = creature.hg != null ? `HG ${creature.hg}` : "HG –";
    
    li.innerHTML = `
      <div class="creature-name">${name}</div>
      <div class="creature-meta">
        <span class="creature-type">${typ}</span>
        <span class="creature-hg">${hg}</span>
      </div>
    `;
    
    li.dataset.index = originalIndex;
    li.addEventListener("click", () => {
      document.querySelectorAll("#creature-list li").forEach(item => item.classList.remove("active"));
      li.classList.add("active");
      currentCreatureIndex = originalIndex;
      renderStatblock(creatureData[originalIndex]);
      editorVisible = false;
      const editor = document.querySelector("#inline-editor");
      if (editor) {
        editor.classList.remove("visible");
      }
    });
    list.appendChild(li);
  });
}

  // ANPASSUNG 1 & 2: Verbessertes Attack-Line Rendering
  function naturalAttackLine(a) {
    // Zauber/Spezialfähigkeiten (keine Trefferbonus/Schaden)
    if (a.isSpell) {
      let line = `<b>${a.name}</b>`;
      if (a.anzahl) line += ` [${a.anzahl}x]`;
      if (a.beschreibung) line += ` ${a.beschreibung}`;
      if (a.reichweite) {
        // Wenn Reichweite nur eine Zahl ist, als RW formatieren
        if (/^\d+$/.test(a.reichweite)) {
          line += `, RW: ${a.reichweite}`;
        } else {
          line += ` (${a.reichweite})`;
        }
      }
      return line;
    }
    
    // Normale Angriffe
    const name = (a.name || 'Angriff');
    const bits = [];
    
    if (a.to_hit != null) bits.push(`${plusify(a.to_hit)} zum Treffen`);
    if (a.schaden != null) bits.push(`${a.schaden} Schaden`);
    
    // ANPASSUNG 1: Reichweite richtig formatieren
    if (a.reichweite) {
      if (/^\d+$/.test(a.reichweite)) {
        // Wenn nur eine Zahl, als RW formatieren (für Fernkampf)
        bits.push(`(RW: ${a.reichweite})`);
      } else {
        // Sonst wie angegeben (z.B. "3xLang")
        bits.push(`(${a.reichweite})`);
      }
    }
    
    if (a.zusatz) bits.push(`und ${a.zusatz}`);
    
    let line = `<b>${name}</b> ${bits.filter(Boolean).join(', ')}`;
    
    // Rettungswurf anhängen
    if (a.rettungswurf) {
      const r = a.rettungswurf;
      const mis = r.bei_misserfolg || 'negative Wirkung';
      line += ` (Rettungswurf ${r.art} ${txt(r.zw)} oder ${mis})`;
    }
    
    if (a.anzahl && !a.isSpell) line += ` [${a.anzahl}x]`;
    
    return line;
  }

  // ANPASSUNG 3: Verbessertes Beute-Rendering
function renderLoot(beute) {
  if (!beute || beute.length === 0) return '<span class="muted">Keine.</span>';
  
  const schatz = beute.filter(b => b.typ === "Schatz");
  const ausruestung = beute.filter(b => b.typ === "Ausrüstung");
  const zutaten = beute.filter(b => b.typ === "Zutaten");
  
  let html = "";
  
  // Schatz
  if (schatz.length > 0) {
    html += `<div class="loot-category"><b>Schatz:</b></div>`;
    schatz.forEach(item => {
      let text = "";
      if (item.wurf) text += item.wurf + " ";
      if (item.beschreibung) text += item.beschreibung;
      html += `<div class="loot-item">${text}</div>`;
    });
  }
  
  // Ausrüstung
  if (ausruestung.length > 0) {
    html += `<div class="loot-category"><b>Ausrüstung:</b></div>`;
    ausruestung.forEach(item => {
      let text = "";
      // ZUERST Würfelwurf
      if (item.wurf) text += `<span class="muted">${item.wurf}</span> `;
      // DANN Anzahl
      if (item.anzahl && item.anzahl > 1) text += `${item.anzahl}x `;
      // DANN Beschreibung
      text += item.beschreibung || "Ausrüstung";
      // DANN Wert
      if (item.wert) text += ` (Wert: ${item.wert} GM)`;
      html += `<div class="loot-item">${text}</div>`;
    });
  }
  
  // Zutaten (erntbar)
  if (zutaten.length > 0) {
    html += `<div class="loot-category"><b>Zutaten (erntbar):</b></div>`;
    zutaten.forEach(item => {
      let text = "";
      // ZUERST Würfelwurf
      if (item.wurf) text += `<span class="muted">${item.wurf}</span> `;
      // DANN Anzahl
      if (item.anzahl && item.anzahl > 1) text += `${item.anzahl}x `;
      // DANN Beschreibung
      text += item.beschreibung || "Zutat";
      // DANN Wert
      if (item.wert) text += ` (Wert: ${item.wert} GM)`;
      html += `<div class="loot-item">${text}</div>`;
    });
  }
  
  return html || '<span class="muted">Keine.</span>';
}




  function renderStatblock(d) {
    const res = parseRes(d.besonderheiten || []);
    const traits = Array.isArray(d.traits) ? d.traits : [];
    const srNote = formatNote(d.sr_bemerkung);
    const aswNote = formatNote(d.asw_bemerkung);
    const paNote = formatPaNote(d.pa_bemerkung);
    const hasBes = res.imm.length || res.res.length || res.weak.length || res.other.length;

    $("#out").innerHTML = `
      <div class="head">
        <button class="edit-btn">Bearbeiten</button>
        <div class="name">${txt(d.name)}</div>
        <div class="line">
          ${d.hg != null ? `<span class="hg-badge">HG ${txt(d.hg)}</span>` : ""}
          ${d.typ ? `<span class="chip">${d.typ}</span>` : ""}
          ${traits.map(t => `<span class="chip">${t}</span>`).join("")}
          ${d.ep != null ? `<span class="chip">${d.ep} EP</span>` : ""}
        </div>
        ${d.beschreibung ? `<div class="desc">${d.beschreibung}</div>` : ""}
      </div>
      <div class="sec">
        <div class="row"><b>Lebenspunkte</b> ${txt(d.lp)}</div>
        <div class="row"><b>Bewegung</b> ${fmtBew(d.bew)}; <b>INI</b> ${plusify(d.ini)}</div>
      </div>
      <div class="sec">
        <h3>Verteidigung</h3>
        <div class="row"><b>Abwehr Nahkampf (PA)</b> ${txt(d.pa)}${paNote}</div>
        <div class="row"><b>Abwehr Fernkampf (ASW)</b> ${txt(d.asw)}${aswNote}</div>
        <div class="row"><b>Schadensreduktion</b> ${txt(d.sr)}${srNote}</div>
        <div class="rettungswuerfe">
          <span><b>Zähigkeit</b> ${plusify(d.rz, true)}</span><span>|</span>
          <span><b>Reflexe</b> ${plusify(d.rr, true)}</span><span>|</span>
          <span><b>Willenskraft</b> ${plusify(d.rw, true)}</span>
        </div>
      </div>
      ${Array.isArray(d.angriffe) && d.angriffe.length ? `<div class="sec"><h3>Angriffe</h3><div class="attblock">${d.angriffe.map(a => `<div class="attline">${naturalAttackLine(a)}</div>`).join("")}</div></div>` : ""}
      ${hasBes ? `<div class="sec"><h3>Besonderheiten</h3>${res.imm.map(x=>`<div class="row">${x}</div>`).join("")}${res.res.map(x=>`<div class="row">${x}</div>`).join("")}${res.weak.map(x=>`<div class="row">${x}</div>`).join("")}${res.other.map(x=>`<div class="row">${x}</div>`).join("")}</div>` : ""}
      <div class="sec"><h3>Beute</h3>${renderLoot(d.beute || [])}</div>
      
      <div class="inline-editor" id="inline-editor">
        <div class="editor-header">
          <h3>Kreatur bearbeiten</h3>
          <button class="close-btn">Schließen</button>
        </div>
        <div class="editor-body">
          ${renderEditorForm(d)}
        </div>
        <div class="editor-footer">
          <button class="save-btn">Speichern</button>
          <button class="cancel-btn">Abbrechen</button>
        </div>
      </div>
    `;

    // Event Listener hinzufügen
    document.querySelector(".edit-btn").addEventListener("click", toggleEditor);
    document.querySelector(".close-btn").addEventListener("click", toggleEditor);
    document.querySelector(".cancel-btn").addEventListener("click", toggleEditor);
    document.querySelector(".save-btn").addEventListener("click", saveCreature);
    
    // Event Listener für Add-Buttons
    document.querySelectorAll(".add-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const parent = e.target.parentElement;
        if (parent.querySelector("#edit-angriffe-container")) {
          addAttackField();
        } else if (parent.querySelector("#edit-besonderheiten-container")) {
          addBesonderheitField();
        } else if (parent.querySelector("#edit-beute-container")) {
          addLootField();
        }
      });
    });
  }

  function toggleEditor() {
    editorVisible = !editorVisible;
    const editor = document.querySelector("#inline-editor");
    if (editorVisible) {
      editor.classList.add("visible");
      populateEditor(creatureData[currentCreatureIndex]);
    } else {
      editor.classList.remove("visible");
    }
  }

  function populateEditor(creature) {
    if (!creature) return;

    document.querySelector("#edit-name").value = creature.name || "";
    document.querySelector("#edit-hg").value = creature.hg || "";
    document.querySelector("#edit-typ").value = creature.typ || "";
    document.querySelector("#edit-traits").value = (creature.traits || []).join(", ");
    document.querySelector("#edit-ep").value = creature.ep || "";
    document.querySelector("#edit-beschreibung").value = creature.beschreibung || "";

    document.querySelector("#edit-lp").value = creature.lp || "";
    document.querySelector("#edit-bew").value = creature.bew || "";
    document.querySelector("#edit-ini").value = creature.ini || "";
    
    document.querySelector("#edit-pa").value = creature.pa || "";
    
    // PA Bemerkung Felder
    const textPaBemerkung = (creature.pa_bemerkung || []).filter(note => typeof note === 'string').join("; ");
    document.querySelector("#edit-pa-bemerkung").value = textPaBemerkung;
    
    const shield = (creature.pa_bemerkung || []).find(item => item.icon === "shield");
    document.querySelector("#edit-pa-shield-value").value = shield ? shield.value : "";
    document.querySelector("#edit-pa-shield-desc").value = shield ? shield.description : "";

    document.querySelector("#edit-asw").value = creature.asw || "";
    document.querySelector("#edit-asw-bemerkung").value = creature.asw_bemerkung || "";
    document.querySelector("#edit-sr").value = creature.sr || "";
    document.querySelector("#edit-sr-bemerkung").value = creature.sr_bemerkung || "";
    document.querySelector("#edit-rz").value = creature.rz || "";
    document.querySelector("#edit-rr").value = creature.rr || "";
    document.querySelector("#edit-rw").value = creature.rw || "";

    const attacksContainer = document.querySelector("#edit-angriffe-container");
    attacksContainer.innerHTML = "";
    (creature.angriffe || []).forEach(attack => addAttackField(attack));

    const besonderheitenContainer = document.querySelector("#edit-besonderheiten-container");
    besonderheitenContainer.innerHTML = "";
    (creature.besonderheiten || []).forEach(besonderheit => addBesonderheitField(besonderheit));

    const lootContainer = document.querySelector("#edit-beute-container");
    lootContainer.innerHTML = "";
    (creature.beute || []).forEach(loot => addLootField(loot));

    const editHgSelect = document.querySelector("#edit-hg");
    editHgSelect.innerHTML = "";
    for (let i = 0; i <= 20; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `HG ${i}`;
      editHgSelect.appendChild(option);
    }
    editHgSelect.value = creature.hg || 0;
  }

function addAttackField(attack = {}) {
  const container = document.querySelector("#edit-angriffe-container");
  const div = document.createElement("div");
  div.classList.add("dynamic-item");
  
  const isSpell = attack.isSpell || false;
  
  div.innerHTML = `
    <div class="attack-type-toggle" style="width:100%;">
      <input type="checkbox" class="edit-attack-is-spell" ${isSpell ? 'checked' : ''}>
      <label>Zauber/Fähigkeit (kein Treffer/Schaden)</label>
    </div>
    <div class="form-group large"><label>Name</label><input type="text" class="edit-attack-name" value="${attack.name || ""}"></div>
    ${!isSpell ? `
    <div class="form-group small"><label>Treffen</label><input type="number" class="edit-attack-to-hit" value="${attack.to_hit || ""}"></div>
    <div class="form-group medium"><label>Schaden</label><input type="text" class="edit-attack-schaden" value="${attack.schaden || ""}"></div>
    ` : `
    <div class="form-group full"><label>Beschreibung</label><input type="text" class="edit-attack-beschreibung" value="${attack.beschreibung || ""}"></div>
    `}
    <div class="form-group medium"><label>Reichweite/RW</label><input type="text" class="edit-attack-reichweite" value="${attack.reichweite || ""}" placeholder="8 oder 3xLang"></div>
    <div class="form-group small"><label>Anzahl</label><input type="number" class="edit-attack-anzahl" value="${attack.anzahl || ""}"></div>
    ${!isSpell ? `
    <div class="form-group full"><label>Zusatz</label><input type="text" class="edit-attack-zusatz" value="${attack.zusatz || ""}" placeholder="z.B. Niederschlagen"></div>
    <div class="rettungswurf-group" style="width:100%;">
      <h5>Rettungswurf (optional)</h5>
      <div class="form-row">
        <div class="form-group small">
          <label>Art</label>
          <select class="edit-attack-rw-art">
            <option value="">Keine</option>
            <option value="RZ" ${attack.rettungswurf?.art === "RZ" ? "selected" : ""}>RZ (Zähigkeit)</option>
            <option value="RR" ${attack.rettungswurf?.art === "RR" ? "selected" : ""}>RR (Reflexe)</option>
            <option value="RW" ${attack.rettungswurf?.art === "RW" ? "selected" : ""}>RW (Willenskraft)</option>
          </select>
        </div>
        <div class="form-group small"><label>ZW</label><input type="number" class="edit-attack-rw-zw" value="${attack.rettungswurf?.zw || ""}"></div>
        <div class="form-group full"><label>Bei Misserfolg</label><input type="text" class="edit-attack-rw-misserfolg" value="${attack.rettungswurf?.bei_misserfolg || ""}"></div>
      </div>
    </div>
    ` : ''}
    <button class="remove-btn">×</button>
  `;
  
  // Toggle zwischen Zauber und normalem Angriff
  const checkbox = div.querySelector(".edit-attack-is-spell");
  checkbox.addEventListener("change", () => {
    div.remove();
    attack.isSpell = checkbox.checked;
    addAttackField(attack);
  });
  
  div.querySelector(".remove-btn").addEventListener("click", () => div.remove());
  container.appendChild(div);
}


  function addBesonderheitField(besonderheit = "") {
    const container = document.querySelector("#edit-besonderheiten-container");
    const div = document.createElement("div");
    div.classList.add("dynamic-item");
    div.innerHTML = `
      <div class="form-group full"><label>Besonderheit</label><textarea class="edit-besonderheit-text">${besonderheit}</textarea></div>
      <button class="remove-btn">×</button>
    `;
    div.querySelector(".remove-btn").addEventListener("click", () => div.remove());
    container.appendChild(div);
  }

  // ANPASSUNG 3: Dropdown für Beute-Typ
  function addLootField(loot = {}) {
    const container = document.querySelector("#edit-beute-container");
    const div = document.createElement("div");
    div.classList.add("dynamic-item");
    div.innerHTML = `
      <div class="form-group medium">
        <label>Typ</label>
        <select class="edit-loot-typ">
          <option value="Schatz" ${loot.typ === "Schatz" ? "selected" : ""}>Schatz</option>
          <option value="Ausrüstung" ${loot.typ === "Ausrüstung" ? "selected" : ""}>Ausrüstung</option>
          <option value="Zutaten" ${loot.typ === "Zutaten" ? "selected" : ""}>Zutaten (erntbar)</option>
        </select>
      </div>
      <div class="form-group full"><label>Beschreibung</label><input type="text" class="edit-loot-beschreibung" value="${loot.beschreibung || ""}" placeholder="z.B. Goldmünzen, Schwert, Giftzahn"></div>
      <div class="form-group medium"><label>Würfelwurf</label><input type="text" class="edit-loot-wurf" value="${loot.wurf || ""}" placeholder="2W8, 1W4"></div>
      <div class="form-group small"><label>Wert (GM)</label><input type="number" class="edit-loot-wert" value="${loot.wert || ""}"></div>
      <div class="form-group small"><label>Anzahl</label><input type="number" class="edit-loot-anzahl" value="${loot.anzahl || ""}"></div>
      <button class="remove-btn">×</button>
    `;
    div.querySelector(".remove-btn").addEventListener("click", () => div.remove());
    container.appendChild(div);
  }

  function saveCreature() {
    const creature = creatureData[currentCreatureIndex];
    if (!creature) return;

    creature.name = document.querySelector("#edit-name").value;
    creature.hg = parseInt(document.querySelector("#edit-hg").value);
    creature.typ = document.querySelector("#edit-typ").value;
    creature.traits = document.querySelector("#edit-traits").value.split(",").map(t => t.trim()).filter(t => t);
    creature.ep = parseInt(document.querySelector("#edit-ep").value);
    creature.beschreibung = document.querySelector("#edit-beschreibung").value;

    creature.lp = parseInt(document.querySelector("#edit-lp").value);
    creature.bew = document.querySelector("#edit-bew").value;
    creature.ini = parseInt(document.querySelector("#edit-ini").value) || 0;
    creature.pa = parseInt(document.querySelector("#edit-pa").value);
    
    // PA Bemerkung speichern
    creature.pa_bemerkung = [];
    const textPaBemerkung = document.querySelector("#edit-pa-bemerkung").value;
    if (textPaBemerkung) {
      textPaBemerkung.split(";").forEach(note => {
        if (note.trim()) creature.pa_bemerkung.push(note.trim());
      });
    }
    
    const shieldValue = document.querySelector("#edit-pa-shield-value").value;
    const shieldDesc = document.querySelector("#edit-pa-shield-desc").value;
    if (shieldValue || shieldDesc) {
      creature.pa_bemerkung.push({
        icon: "shield",
        value: shieldValue,
        description: shieldDesc
      });
    }

    creature.asw = parseInt(document.querySelector("#edit-asw").value);
    creature.asw_bemerkung = document.querySelector("#edit-asw-bemerkung").value;
    creature.sr = parseInt(document.querySelector("#edit-sr").value);
    creature.sr_bemerkung = document.querySelector("#edit-sr-bemerkung").value;
    creature.rz = document.querySelector("#edit-rz").value;
    creature.rr = document.querySelector("#edit-rr").value;
    creature.rw = document.querySelector("#edit-rw").value;

    // Angriffe speichern
    creature.angriffe = [];
    document.querySelectorAll("#edit-angriffe-container .dynamic-item").forEach(item => {
      const isSpell = item.querySelector(".edit-attack-is-spell").checked;
      const attack = {
        name: item.querySelector(".edit-attack-name").value
      };
      
      if (isSpell) {
        attack.isSpell = true;
        const beschreibung = item.querySelector(".edit-attack-beschreibung");
        if (beschreibung) attack.beschreibung = beschreibung.value;
      } else {
        const toHit = item.querySelector(".edit-attack-to-hit");
        const schaden = item.querySelector(".edit-attack-schaden");
        if (toHit) attack.to_hit = parseInt(toHit.value) || null;
        if (schaden) attack.schaden = schaden.value || null;
        
        const zusatz = item.querySelector(".edit-attack-zusatz");
        if (zusatz && zusatz.value) attack.zusatz = zusatz.value;
        
        const rwArt = item.querySelector(".edit-attack-rw-art");
        if (rwArt && rwArt.value) {
          attack.rettungswurf = {
            art: rwArt.value,
            zw: parseInt(item.querySelector(".edit-attack-rw-zw").value) || null,
            bei_misserfolg: item.querySelector(".edit-attack-rw-misserfolg").value || null
          };
        }
      }
      
      const reichweite = item.querySelector(".edit-attack-reichweite").value;
      if (reichweite) attack.reichweite = reichweite;
      
      const anzahl = parseInt(item.querySelector(".edit-attack-anzahl").value);
      if (anzahl) attack.anzahl = anzahl;
      
      creature.angriffe.push(attack);
    });

    // Besonderheiten speichern
    creature.besonderheiten = [];
    document.querySelectorAll("#edit-besonderheiten-container .dynamic-item").forEach(item => {
      const text = item.querySelector(".edit-besonderheit-text").value;
      if (text) creature.besonderheiten.push(text);
    });

    // Beute speichern
    creature.beute = [];
    document.querySelectorAll("#edit-beute-container .dynamic-item").forEach(item => {
      const loot = {
        typ: item.querySelector(".edit-loot-typ").value
      };
      
      const beschreibung = item.querySelector(".edit-loot-beschreibung").value;
      if (beschreibung) loot.beschreibung = beschreibung;
      
      const wurf = item.querySelector(".edit-loot-wurf").value;
      if (wurf) loot.wurf = wurf;
      
      const wert = parseInt(item.querySelector(".edit-loot-wert").value);
      if (wert) loot.wert = wert;
      
      const anzahl = parseInt(item.querySelector(".edit-loot-anzahl").value);
      if (anzahl && anzahl > 1) loot.anzahl = anzahl;
      
      creature.beute.push(loot);
    });

    renderStatblock(creature);
    toggleEditor();
  }

  function renderEditorForm(creature) {
    return `
      <div class="form-section">
        <h4>Allgemein</h4>
        <div class="form-row">
          <div class="form-group full"><label for="edit-name">Name</label><input type="text" id="edit-name" value="${creature.name || ""}"></div>
          <div class="form-group small"><label for="edit-hg">HG</label><select id="edit-hg"></select></div>
          <div class="form-group medium"><label for="edit-typ">Typ</label><input type="text" id="edit-typ" value="${creature.typ || ""}"></div>
          <div class="form-group small"><label for="edit-ep">EP</label><input type="number" id="edit-ep" value="${creature.ep || ""}"></div>
        </div>
        <div class="form-row">
          <div class="form-group full"><label for="edit-traits">Traits (Komma-getrennt)</label><input type="text" id="edit-traits" value="${(creature.traits || []).join(", ")}"></div>
        </div>
        <div class="form-row">
          <div class="form-group full"><label for="edit-beschreibung">Beschreibung</label><textarea id="edit-beschreibung">${creature.beschreibung || ""}</textarea></div>
        </div>
      </div>

      <div class="form-section">
        <h4>Grundwerte</h4>
        <div class="form-row">
          <div class="form-group small"><label for="edit-lp">LP</label><input type="number" id="edit-lp" value="${creature.lp || ""}"></div>
          <div class="form-group medium"><label for="edit-bew">Bewegung</label><input type="text" id="edit-bew" value="${creature.bew || ""}"></div>
          <div class="form-group small"><label for="edit-ini">INI</label><input type="number" id="edit-ini" value="${creature.ini || ""}"></div>
        </div>
      </div>

      <div class="form-section">
        <h4>Verteidigung</h4>
        <div class="form-row">
          <div class="form-group small"><label for="edit-pa">PA</label><input type="number" id="edit-pa" value="${creature.pa || ""}"></div>
          <div class="form-group full"><label for="edit-pa-bemerkung">PA Bemerkung</label><input type="text" id="edit-pa-bemerkung" placeholder="Text-Bemerkungen, Semikolon-getrennt"></div>
          <div class="form-group small"><label for="edit-pa-shield-value">Schild Bonus</label><input type="text" id="edit-pa-shield-value" placeholder="+1"></div>
          <div class="form-group full"><label for="edit-pa-shield-desc">Schild Beschreibung</label><input type="text" id="edit-pa-shield-desc" placeholder="Holzschild"></div>
        </div>
        <div class="form-row">
          <div class="form-group small"><label for="edit-asw">ASW</label><input type="number" id="edit-asw" value="${creature.asw || ""}"></div>
          <div class="form-group full"><label for="edit-asw-bemerkung">ASW Bemerkung</label><input type="text" id="edit-asw-bemerkung" value="${creature.asw_bemerkung || ""}"></div>
        </div>
        <div class="form-row">
          <div class="form-group small"><label for="edit-sr">SR</label><input type="number" id="edit-sr" value="${creature.sr || ""}"></div>
          <div class="form-group full"><label for="edit-sr-bemerkung">SR Bemerkung</label><input type="text" id="edit-sr-bemerkung" value="${creature.sr_bemerkung || ""}"></div>
        </div>
      </div>

      <div class="form-section">
        <h4>Rettungswürfe</h4>
        <div class="form-row">
          <div class="form-group small"><label for="edit-rz">Zähigkeit</label><input type="text" id="edit-rz" value="${creature.rz || ""}"></div>
          <div class="form-group small"><label for="edit-rr">Reflexe</label><input type="text" id="edit-rr" value="${creature.rr || ""}"></div>
          <div class="form-group small"><label for="edit-rw">Willenskraft</label><input type="text" id="edit-rw" value="${creature.rw || ""}"></div>
        </div>
      </div>

      <div class="form-section">
        <h4>Angriffe</h4>
        <div id="edit-angriffe-container" class="dynamic-section"></div>
        <button class="add-btn">+ Angriff hinzufügen</button>
      </div>

      <div class="form-section">
        <h4>Besonderheiten</h4>
        <div id="edit-besonderheiten-container" class="dynamic-section"></div>
        <button class="add-btn">+ Besonderheit hinzufügen</button>
      </div>

      <div class="form-section">
        <h4>Beute</h4>
        <div id="edit-beute-container" class="dynamic-section"></div>
        <button class="add-btn">+ Beute hinzufügen</button>
      </div>
    `;
  }

  // Hilfsfunktionen
  function txt(x){return (x===null||x===undefined||x==="")?"–":String(x)}
  function plusify(v, isSaveDC = false){if(v===undefined||v===null) return "–";if(String(v).toLowerCase()==="immun") return "immun";const n=Number(v); return isNaN(n)?String(v):((n>=0 && !isSaveDC?"+":"")+n);}
  function formatNote(note){return note ? ` (${note})` : "";}
  function parseRes(bes){const res={imm:[],res:[],weak:[],other:[]};(bes||[]).forEach(s=>{const t=String(s||"").trim();if(/^immun/i.test(t)){let val=t.replace(/^immun(?:ität|itäten)?(?:\s*:\s*|\s+gegen\s*)?/i,"").trim();if(val) res.imm.push(`Immun ${/^gegen\s/i.test(val)?val:("gegen "+val)}`);} else if(/^resistenz/i.test(t)){let val=t.replace(/^resistenzen?|resistenz/i,"").replace(/^(?:\s*:\s*|\s+gegen\s*)?/,"").trim();if(val) res.res.push(`Resistent ${/^gegen\s/i.test(val)?val:("gegen "+val)}`);} else if(/^anfälligkeit/i.test(t)){let val=t.replace(/^anfälligkeiten?|anfälligkeit/i,"").replace(/^(?:\s*:\s*|\s+gegen\s*)?/,"").trim();if(val) res.weak.push(`Anfällig ${/^gegen\s/i.test(val)?val:("gegen "+val)}`);} else {res.other.push(t);}});return res;}
  function fmtBew(b){if(!b) return "–";const m=b.match(/^(\d+)(?:\s*\((.+)\))?$/);if(!m) return b;const modes = m[2]? m[2].replace(/,\s*/g,"; ").replace(/vs/gi,"gegen") : "";return modes? `${m[1]}; ${modes}` : m[1];}
  function formatPaNote(paBemerkung) {
    if (!Array.isArray(paBemerkung) || paBemerkung.length === 0) return "";
    const textNotes = paBemerkung.filter(note => typeof note === "string");
    const shieldNote = paBemerkung.find(note => typeof note === 'object' && note.icon === "shield");
    let output = "";
    if (shieldNote) {
      output += `<span class="icon-shield"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0c53 0 101.8 20.3 138.1 53.4L499.9 174.1c1.3 1.2 2.3 2.6 3.3 4c16.1 22.4 25.8 49.5 28.8 78.3c4.5 44.1-17.5 87.1-55.2 114.5L283.7 499.9c-11.9 8.9-26.7 12.1-41.8 9.3S211.9 504 201.7 494.7L33.9 370.3C-3.8 342.9-25.8 299.9-21.3 255.8c3-28.8 12.7-55.9 28.8-78.3c.9-1.4 2-2.8 3.3-4L117.9 53.4C154.2 20.3 203 0 256 0zM256 160a96 96 0 1 0 0 192 96 96 0 1 0 0-192z"/></svg>${shieldNote.value}</span>`;
      if (shieldNote.description) {
        output += ` (${shieldNote.description})`;
      }
    }
    if (textNotes.length > 0) {
      const prefix = shieldNote ? ", " : " ";
      output += prefix + `(${textNotes.join("; ")})`;
    }
    return output;
  }

  init();
});
