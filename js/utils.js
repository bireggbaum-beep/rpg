// js/utils.js
export const $ = s => document.querySelector(s);

export function txt(x){ return (x===null||x===undefined||x==="") ? "–" : String(x); }

export function plusify(v, isSaveDC = false){
  if (v===undefined || v===null) return "–";
  if (String(v).toLowerCase() === "immun") return "immun";
  const n = Number(v);
  return isNaN(n) ? String(v) : ((n >= 0 && !isSaveDC ? "+" : "") + n);
}

export function formatNote(note){ return note ? ` (${note})` : ""; }

export function parseRes(bes){
  const res = { imm:[], res:[], weak:[], other:[] };
  (bes||[]).forEach(s=>{
    const t = String(s||"").trim();
    if (/^immun/i.test(t)){
      let val = t.replace(/^immun(?:ität|itäten)?(?:\s*:\s*|\s+gegen\s*)?/i,"").trim();
      if (val) res.imm.push(`Immun ${/^gegen\s/i.test(val)?val:("gegen "+val)}`);
    } else if (/^resistenz/i.test(t)){
      let val = t.replace(/^resistenzen?|resistenz/i,"").replace(/^(?:\s*:\s*|\s+gegen\s*)?/,"").trim();
      if (val) res.res.push(`Resistent ${/^gegen\s/i.test(val)?val:("gegen "+val)}`);
    } else if (/^anfälligkeit/i.test(t)){
      let val = t.replace(/^anfälligkeiten?|anfälligkeit/i,"").replace(/^(?:\s*:\s*|\s+gegen\s*)?/,"").trim();
      if (val) res.weak.push(`Anfällig ${/^gegen\s/i.test(val)?val:("gegen "+val)}`);
    } else {
      res.other.push(t);
    }
  });
  return res;
}

export function fmtBew(b){
  if (!b) return "–";
  const m = b.match(/^(\d+)(?:\s*\((.+)\))?$/);
  if (!m) return b;
  const modes = m[2] ? m[2].replace(/,\s*/g,"; ").replace(/vs/gi,"gegen") : "";
  return modes ? `${m[1]}; ${modes}` : m[1];
}

export function formatPaNote(paBemerkung){
  if (!Array.isArray(paBemerkung) || paBemerkung.length === 0) return "";
  const textNotes = paBemerkung.filter(note => typeof note === "string");
  const shieldNote = paBemerkung.find(note => typeof note === 'object' && note.icon === "shield");
  let output = "";
  if (shieldNote) {
    output += `<span class="icon-shield"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0c53 0 101.8 20.3 138.1 53.4L499.9 174.1c1.3 1.2 2.3 2.6 3.3 4c16.1 22.4 25.8 49.5 28.8 78.3c4.5 44.1-17.5 87.1-55.2 114.5L283.7 499.9c-11.9 8.9-26.7 12.1-41.8 9.3S211.9 504 201.7 494.7L33.9 370.3C-3.8 342.9-25.8 299.9-21.3 255.8c3-28.8 12.7-55.9 28.8-78.3c.9-1.4 2-2.8 3.3-4L117.9 53.4C154.2 20.3 203 0 256 0zM256 160a96 96 0 1 0 0 192 96 96 0 1 0 0-192z"/></svg>${shieldNote.value}</span>`;
    if (shieldNote.description) output += ` (${shieldNote.description})`;
  }
  if (textNotes.length > 0) {
    const prefix = shieldNote ? ", " : " ";
    output += prefix + `(${textNotes.join("; ")})`;
  }
  return output;
}

// Sort-Helfer: Zahlen und Brüche ("1/2") vergleichbar machen
export function normalizeHg(hg){
  if (hg === null || hg === undefined) return 999;
  if (typeof hg === 'string' && hg.includes('/')) {
    const parts = hg.split('/');
    return parseFloat(parts[0]) / parseFloat(parts[1]);
  }
  return parseFloat(hg);
}
