// js/list.js
import { txt, normalizeHg } from './utils.js';

export function filterAndSort(creatures, { term = '', hg = 'alle', sort = 'az' } = {}) {
  const search = term.trim().toLowerCase();
  let result = creatures
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => {
      const hay = `${item.name || ''} ${item.typ || ''}`.toLowerCase();
      const okSearch = !search || hay.includes(search);
      const okHg = hg === 'alle' || String(item.hg) === String(hg);
      return okSearch && okHg;
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
  listEl.innerHTML = '';
  items.forEach(({ item, index }) => {
    const li = document.createElement('li');
    li.className = 'creature-item' + (index === activeIndex ? ' active' : '');
    li.tabIndex = 0;
    li.dataset.index = index;
    li.textContent = item.name || '(ohne Namen)';

    const click = () => {
      if (typeof onSelect === 'function') onSelect(index);
    };
    li.addEventListener('click', click);
    li.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        click();
      }
    });

    listEl.appendChild(li);
  });
}

