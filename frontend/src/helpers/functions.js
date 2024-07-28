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
  
  export const addDays = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  };