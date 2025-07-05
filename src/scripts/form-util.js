
export async function getFormData(inputList) {
  const fdata = {};
  Array.from(inputList).forEach(async el => {
    const name = el.id.trim();
    if (!name) return;  // skip unnamed fields
    switch (el.type) {
      case 'checkbox':
        fdata[name] = el.checked
        break;
      case 'radio':
        fdata[name] = el.checked; 
        break;
      case 'select-multiple':
        fdata[name] = Array.from(el.selectedOptions).map(o => o.value);
        break;
      case 'select-one':
        fdata[name] = el.value;
        break;
      case 'file':

        break;
      default:
        fdata[name] = el.value;
    }
  });
  return fdata;
}


export function setFormData(inputList, data) {

  Array.from(inputList).forEach(els => {
    const name = els.id;
    if (!data || !data[name]) return;
    if (els.type === 'file') return;
    const value = data[name];
    if (els.type === 'radio') {
      els.checked = value;
    } else if (els.type === 'checkbox') {
      if(value === false || value === 'false') {
        els.removeAttribute('checked');
      } else
      els.checked = value;
    } else if (els instanceof HTMLSelectElement) {
      if (els.multiple) {
        Array.from(els.options)
          .forEach(opt => opt.selected = value.includes(opt.value));
      } else {
        els.value = value;
      }
    } else {
      els.value = value;
    }
  });
}
