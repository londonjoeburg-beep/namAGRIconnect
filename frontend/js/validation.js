console.log('🔍 validation.js loading...');

window.validateFields = function(fields) {
  let valid = true;
  let firstError = null;

  fields.forEach(f => {
    const el = f.el;
    if (!el) return;

    // Clear previous error
    el.style.borderColor = '';
    el.style.borderWidth = '';
    el.style.boxShadow = '';
    el.style.background = '';
    const prev = el.parentElement.querySelector('.direct-err');
    if (prev) prev.remove();

    const value = (el.value || '').trim();
    let ok = value.length > 0;
    if (ok && f.check) ok = f.check(value);
    if (ok && f.minLen) ok = value.length >= f.minLen;

    if (!ok) {
      el.style.borderColor = '#c0392b';
      el.style.borderWidth = '2px';
      el.style.boxShadow = '0 0 0 3px rgba(192,57,43,0.15)';
      el.style.background = 'rgba(192,57,43,0.05)';

      const err = document.createElement('div');
      err.className = 'direct-err';
      err.style.cssText = 'color:#c0392b;font-size:12px;margin-top:4px;font-weight:600';
      err.textContent = '⚠️ ' + (f.message || 'Required');
      el.parentElement.appendChild(err);

      if (!firstError) firstError = el;
      valid = false;
    }
  });

  if (firstError) {
    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => firstError.focus(), 300);
  }

  return valid;
};

// Auto-clear red when user types
document.addEventListener('input', function(e) {
  const el = e.target;
  if (el.style && el.style.borderColor === 'rgb(192, 57, 43)') {
    el.style.borderColor = '';
    el.style.borderWidth = '';
    el.style.boxShadow = '';
    el.style.background = '';
    const err = el.parentElement.querySelector('.direct-err');
    if (err) err.remove();
  }
});

// Add shake animation
if (!document.getElementById('validation-styles')) {
  const style = document.createElement('style');
  style.id = 'validation-styles';
  style.textContent = `
    input, select, textarea {
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    }
  `;
  document.head.appendChild(style);
}

console.log('✅ validation.js loaded — validateFields is ready');