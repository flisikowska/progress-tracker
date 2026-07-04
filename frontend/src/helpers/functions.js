
export const resizeGridItem = (item, itemParent) => {
  var grid = document.getElementsByClassName(itemParent)[0]
  var rowHeight = parseInt(
    window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
  )
  var rowGap = parseInt(
    window.getComputedStyle(grid).getPropertyValue("grid-row-gap")
  )
  var rowSpan = Math.ceil(
    (item.getBoundingClientRect().height + rowGap) /
      (rowHeight + rowGap)
  )
  item.style.gridRowEnd = "span " + rowSpan
}

export const ResizeGridItems = (itemParent) => {
  var allItems = Array.from(document.getElementsByClassName('grid-item'));
  allItems.forEach(function(item) {
      resizeGridItem(item, itemParent);
  });
}

export function FormattedDate(d) {
    if (typeof d == 'string' || typeof d == 'number') d = new Date(d);
    const yyyy = d.getFullYear().toString();
    const mm = (d.getMonth() + 1).toString(); // getMonth() is zero-based
    const dd = d.getDate().toString();
    return `${yyyy}-${mm[1] ? mm : `0${mm[0]}`}-${dd[1] ? dd : `0${dd[0]}`}`;
  }
  
  export function DateToFormattedTime(d) {
    if (typeof d == 'string' || typeof d == 'number') d = new Date(d);
  
    const hh = d.getHours().toString();
    const min = d.getMinutes().toString();
  
    return `${hh[1] ? hh : `0${hh[0]}`}:${min[1] ? min : `0${min[0]}`}`;
  }
  
  export function DateToFormattedString(d) {
    if (typeof d == 'string' || typeof d == 'number') d = new Date(d);
  
    return FormattedDate(d) + ' ' + DateToFormattedTime(d);
  }
  export function MinutesToFormattedTime(d){
    const h = Math.floor(d/60);
    const m = d%60;
    if (h !== 0) return m !== 0 ? (h+'h '+m+'min') : (h+'h');
    return m+'min';
  }

  export const addDays = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  };

  // Początek następnego okresu celu = moment resetu (spójnie z backendem: tydzień od poniedziałku)
  export function getPeriodEnd(period, now = new Date()) {
    if (period === 'month') return new Date(now.getFullYear(), now.getMonth() + 1, 1);
    if (period === 'year') return new Date(now.getFullYear() + 1, 0, 1);
    // 'week' - poniedziałek jako pierwszy dzień
    const day = now.getDay() || 7; // Pon=1 ... Niedz=7
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (day - 1));
    monday.setDate(monday.getDate() + 7);
    return monday;
  }

  // Ile zostało do końca okresu celu - zwraca { text, days } (days = pełne dni do ostatniego dnia włącznie)
  export function timeLeftInPeriod(period, now = new Date()) {
    const end = getPeriodEnd(period, now);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastDay = new Date(end);
    lastDay.setDate(lastDay.getDate() - 1); // ostatni dzień okresu (przed resetem)
    const days = Math.round((lastDay - today) / 86400000);
    let text;
    if (days <= 0) text = 'Kończy się dziś';
    else if (days === 1) text = 'Kończy się jutro';
    else text = `Zostało ${days} dni`;
    return { text, days };
  }
