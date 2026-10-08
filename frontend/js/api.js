(function() {
  const API_BASE = 'http://localhost:4000/api';
  console.log('🔗 API base:', API_BASE);

  function getToken() { return localStorage.getItem('token'); }
  function headers(extra = {}) {
    const h = { 'Accept': 'application/json', ...extra };
    const t = getToken();
    if (t) h['Authorization'] = 'Bearer ' + t;
    return h;
  }

  async function get(path) {
    const r = await fetch(API_BASE + path, { headers: headers() });
    if (!r.ok) {
      const e = await r.json().catch(() => ({ error: r.statusText }));
      throw new Error(e.error || `GET ${path} → ${r.status}`);
    }
    return r.json();
  }

  async function post(path, body, isForm = false) {
    const opts = { method: 'POST', headers: headers() };
    if (isForm) opts.body = body;
    else { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
    const r = await fetch(API_BASE + path, opts);
    if (!r.ok) {
      const e = await r.json().catch(() => ({ error: r.statusText }));
      throw new Error(e.error || `POST ${path} → ${r.status}`);
    }
    return r.json();
  }

  async function del(path) {
    const r = await fetch(API_BASE + path, { method: 'DELETE', headers: headers() });
    if (!r.ok) throw new Error(`DELETE ${path} → ${r.status}`);
    return r.json();
  }

  window.api = { get, post, del };
  console.log('✅ API client ready');
})();