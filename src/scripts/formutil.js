export async function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

export async function getFormData(form, nodekey) {
  const fdata = {};
  const elements = form.querySelectorAll(`[${nodekey}]`);
  Array.from(elements).forEach(async el => {
    const name = el.id.trim();
    if (!name) return;  // skip unnamed fields
    switch (el.type) {
      case 'checkbox':
        fdata[name] = fdata[name] || [];
        if (el.checked) fdata[name].push(el.value);
        break;
      case 'radio':
        if (el.checked) fdata[name] = el.value;
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


export function setFormData(form, data, nodekey) {

  Array.from(form.querySelectorAll(`[${nodekey}]`)).forEach(els => {
    const name = els.id;
    if (!data || !data[name]) return;
    if (els.type === 'file') return;
    const value = data[name];
    if (els.type === 'radio') {
      form.querySelectorAll(`input[name="${name}"]`)
        .forEach(r => r.checked = (r.value === value));
    } else if (els.type === 'checkbox') {
      form.querySelectorAll(`input[name="${name}"]`)
        .forEach(cb => cb.checked = Array.isArray(value)
          ? value.includes(cb.value)
          : Boolean(value));
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
