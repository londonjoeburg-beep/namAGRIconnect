/* Camera — live capture + file upload fallback */

window.captureFromCamera = function(context) {
  return new Promise(function(resolve) {
    // Build modal
    const modal = document.createElement('div');
    modal.className = 'camera-modal';
    modal.style.cssText =
      'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px';

    modal.innerHTML =
      '<div style="background:#fff;border-radius:16px;max-width:560px;width:100%;padding:16px;text-align:center">' +
        '<h3 style="margin:0 0 10px;color:#0b6b3a">📸 Capture ' + (context === 'soil' ? 'Soil' : 'Plant') + ' Photo</h3>' +
        '<video id="camVideo" autoplay playsinline style="width:100%;max-height:340px;border-radius:12px;background:#000;display:none"></video>' +
        '<canvas id="camCanvas" style="display:none"></canvas>' +
        '<div id="camError" style="color:#c0392b;font-size:13px;margin:8px 0;display:none"></div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:12px">' +
          '<button id="camStart" class="btn" style="background:#0b6b3a;color:#fff;border:none;padding:10px 16px;border-radius:10px;font-weight:700;cursor:pointer">📷 Start Camera</button>' +
          '<button id="camSnap" class="btn" style="background:#e8b73a;color:#3a2a00;border:none;padding:10px 16px;border-radius:10px;font-weight:700;cursor:pointer;display:none">⚡ Capture</button>' +
          '<button id="camFile" class="btn outline" style="background:#fff;color:#0b6b3a;border:1.5px solid #0b6b3a;padding:10px 16px;border-radius:10px;font-weight:700;cursor:pointer">🖼️ Upload</button>' +
          '<button id="camCancel" class="btn" style="background:#eee;color:#333;border:none;padding:10px 16px;border-radius:10px;font-weight:700;cursor:pointer">✖ Cancel</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);

    const video = modal.querySelector('#camVideo');
    const canvas = modal.querySelector('#camCanvas');
    const errEl = modal.querySelector('#camError');
    const startBtn = modal.querySelector('#camStart');
    const snapBtn = modal.querySelector('#camSnap');
    const fileBtn = modal.querySelector('#camFile');
    const cancelBtn = modal.querySelector('#camCancel');

    let stream = null;
    let fileInput = null;

    function cleanup() {
      if (stream) stream.getTracks().forEach(function(t) { t.stop(); });
      if (modal.parentNode) modal.parentNode.removeChild(modal);
    }

    function finish(dataUrl) {
      cleanup();
      resolve(dataUrl || null);
    }

    // START CAMERA
    startBtn.onclick = function() {
      errEl.style.display = 'none';

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        errEl.textContent = '⚠️ Camera not supported on this browser. Try Upload.';
        errEl.style.display = 'block';
        return;
      }

      navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      }).then(function(s) {
        stream = s;
        video.srcObject = s;
        video.style.display = 'block';
        startBtn.style.display = 'none';
        snapBtn.style.display = 'inline-block';
        console.log('✅ Camera started for ' + context);
      }).catch(function(err) {
        console.error('Camera error:', err);
        errEl.textContent = '⚠️ Camera access denied: ' + err.message + '. Use Upload instead.';
        errEl.style.display = 'block';
      });
    };

    // SNAPSHOT
    snapBtn.onclick = function() {
      if (!video.videoWidth) return;
      const maxDim = 800;
      let w = video.videoWidth, h = video.videoHeight;
      if (w > h && w > maxDim) { h = h * maxDim / w; w = maxDim; }
      else if (h > maxDim) { w = w * maxDim / h; h = maxDim; }

      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(video, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
      console.log('📸 Captured live photo:', Math.round(dataUrl.length / 1024) + ' KB');
      finish(dataUrl);
    };

    // UPLOAD FALLBACK
    fileBtn.onclick = function() {
      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);

      fileInput.onchange = function(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) { finish(null); return; }

        const reader = new FileReader();
        reader.onload = function(ev) {
          const img = new Image();
          img.onload = function() {
            const maxDim = 800;
            let w = img.width, h = img.height;
            if (w > h && w > maxDim) { h = h * maxDim / w; w = maxDim; }
            else if (h > maxDim) { w = w * maxDim / h; h = maxDim; }

            canvas.width = w;
            canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
            console.log('📸 Uploaded photo:', Math.round(dataUrl.length / 1024) + ' KB');
            finish(dataUrl);
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      };

      fileInput.click();
    };

    // CANCEL
    cancelBtn.onclick = function() { finish(null); };
    modal.onclick = function(e) { if (e.target === modal) finish(null); };

    // Auto-start camera
    setTimeout(function() { startBtn.click(); }, 300);
  });
};

console.log('✅ camera.js loaded (live + upload)');