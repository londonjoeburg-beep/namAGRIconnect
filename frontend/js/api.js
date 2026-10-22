/* ══════════════════════════════════════════════════
   API.JS — With 90-second timeout for Render cold starts
   ══════════════════════════════════════════════════ */

(function() {
  const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:4000/api'
    : 'https://namagriconnect-3.onrender.com/api';

  console.log('🔗 API base:', API_BASE);

  function getToken() { return localStorage.getItem('token'); }
  
  function headers(extra = {}) {
    const h = { 'Accept': 'application/json', ...extra };
    const t = getToken();
    if (t) h['Authorization'] = 'Bearer ' + t;
    return h;
  }

  async function get(path) {
    const url = API_BASE + path;
    console.log('GET', url);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    try {
      const r = await fetch(url, { 
        headers: headers(),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!r.ok) {
        const e = await r.json().catch(() => ({ error: r.statusText }));
        throw new Error(e.error || `GET ${path} → ${r.status}`);
      }
      return r.json();
    } catch (e) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        throw new Error('Server took too long. Please try again.');
      }
      throw e;
    }
  }

  async function post(path, body, isForm = false) {
    const url = API_BASE + path;
    console.log('POST', url, isForm ? '(form)' : '(json)');
    
    const opts = { 
      method: 'POST',
      headers: headers()
    };
    
    if (isForm) {
      opts.body = body;
      // Don't set Content-Type for FormData - browser handles it
    } else {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);
    opts.signal = controller.signal;

    try {
      const r = await fetch(url, opts);
      clearTimeout(timeoutId);
      
      if (!r.ok) {
        const e = await r.json().catch(() => ({ error: r.statusText }));
        throw new Error(e.error || `POST ${path} → ${r.status}`);
      }
      return r.json();
    } catch (e) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        throw new Error('Server took too long. Please try again.');
      }
      throw e;
    }
  }

  async function del(path) {
    const url = API_BASE + path;
    const r = await fetch(url, { method: 'DELETE', headers: headers() });
    if (!r.ok) throw new Error(`DELETE ${path} → ${r.status}`);
    return r.json();
  }

  window.api = { get, post, del };
  console.log('✅ API client ready (90s timeout)');
})();