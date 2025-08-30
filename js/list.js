// js/list.js
import { normalizeHg } from './utils.js';

export function filterAndSort(
  creatures,
  { nameTerm = '', typ = '', hg = '', sort = 'az' } = {}
) {
  const n = nameTerm.trim().toLowerCase();

  let result = creatures
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => {
      const hayName = String(item.name || '').toLowerCase();
      
      const okName = !n || hayName.includes(n);
      const okType = !typ || item.typ === typ;
      const okHg = !hg || String(item.hg) === String(hg);
      return okName && okType && okHg;
    });

  if (sort === 'hg') {
    result.sort((a, b) => {
      const da = normalizeHg(a.item.hg);
      const db = normalizeHg(b.item.hg);
      if (da !== db) return da - db;
      return String(a.item.name).localeCompare(String(b.item.name), 'de');
    });
  } else {
    result.sort((a, b) => String(a.item.name).localeCompare(String(b.item.name), 'de'));
  }

  return result;
}

export function populateList(listEl, items, { activeIndex = -1, onSelect } = {}) {
  if (!listEl) return;
  listEl.innerHTML = '';

  if (items.length === 0) {
    const li = document.createElement('li');
    li.className = 'muted';
    li.textContent = 'Keine Treffer';
    listEl.appendChild(li);
    return;
  }

  items.forEach(({ item, index }) => {
    const li = document.createElement('li');
    li.className = 'creature-item' + (index === activeIndex ? ' active' : '');
    li.tabIndex = 0;
    li.dataset.index = index;
    
    // Immer Name, Typ und HG anzeigen
    li.innerHTML = `
      <div class="creature-name">${item.name || 'Unbenannt'}</div>
      <div class="creature-meta">
        <span class="creature-type">${item.typ || 'Kein Typ'}</span>
        <span class="creature-hg">HG ${item.hg || '?'}</span>
      </div>
    `;

    const click = () => { if (typeof onSelect === 'function') onSelect(index); };
    li.addEventListener('click', click);
    li.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); click(); }
    });

    listEl.appendChild(li);
  });
}
