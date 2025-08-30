// js/list.js
import { normalizeHg } from './utils.js';

export function filterAndSort(
  creatures,
  { nameTerm = '', typeTerm = '', hg = '', sort = 'az' } = {}
) {
  const n = nameTerm.trim().toLowerCase();
  const t = typeTerm.trim().toLowerCase();

  let result = creatures
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => {
      const hayName = String(item.name || '').toLowerCase();
      const hayType = `${item.typ || ''} ${
        Array.isArray(item.traits) ? item.traits.join(' ') : ''
      }`.toLowerCase();

      const okName = !n || hayName.includes(n);
      const okType = !t || hayType.includes(t);
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
    li.textContent = item.name || '(ohne Namen)';

    const click = () => { if (typeof onSelect === 'function') onSelect(index); };
    li.addEventListener('click', click);
    li.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); click(); }
    });

    listEl.appendChild(li);
  });
}
// Diese Funktion in list.js einfügen (am Ende der Datei)
export function populateGroupedList(listEl, items, { groupBy = 'typ', activeIndex = -1, onSelect } = {}) {
  if (!listEl) return;
  listEl.innerHTML = '';
  
  // Gruppiere die Items
  const groups = {};
  items.forEach(({ item, index }) => {
    const key = item[groupBy] || 'Andere';
    if (!groups[key]) groups[key] = [];
    groups[key].push({ item, index });
  });
  
  // Sortiere Gruppennamen alphabetisch
  const sortedGroups = Object.keys(groups).sort((a, b) => a.localeCompare(b, 'de'));
  
  // Rendere jede Gruppe
  sortedGroups.forEach(groupName => {
    const groupItems = groups[groupName];
    
    // Gruppe-Header (klickbar zum auf/zuklappen)
    const groupHeader = document.createElement('li');
    groupHeader.className = 'group-header';
    groupHeader.innerHTML = `
      <span class="group-arrow">▼</span>
      <span class="group-name">${groupName}</span>
      <span class="group-count">(${groupItems.length})</span>
    `;
    
    const groupContent = document.createElement('ul');
    groupContent.className = 'group-content';
    
    // Items in der Gruppe
    groupItems.forEach(({ item, index }) => {
      const li = document.createElement('li');
      li.className = 'creature-item' + (index === activeIndex ? ' active' : '');
      li.tabIndex = 0;
      li.dataset.index = index;
      li.textContent = item.name || '(ohne Namen)';
      
      const click = () => { if (onSelect) onSelect(index); };
      li.addEventListener('click', click);
      li.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { 
          e.preventDefault(); 
          click(); 
        }
      });
      
      groupContent.appendChild(li);
    });
    
    // Toggle-Funktion für Gruppe
    groupHeader.addEventListener('click', () => {
      const arrow = groupHeader.querySelector('.group-arrow');
      const isOpen = groupContent.style.display !== 'none';
      
      if (isOpen) {
        groupContent.style.display = 'none';
        arrow.textContent = '▶';
      } else {
        groupContent.style.display = 'block';
        arrow.textContent = '▼';
      }
    });
    
    listEl.appendChild(groupHeader);
    listEl.appendChild(groupContent);
  });
}
