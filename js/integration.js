const API_BASE = (window.__SC_API_BASE__ && window.__SC_API_BASE__.trim()) || 'http://127.0.0.1:8000/api';
async function postAndDownload(url, formData, filenameFallback) {
  const btn = document.activeElement;
  try {
    if (btn && btn.tagName === 'BUTTON') btn.disabled = true;

    const res = await fetch(url, {
      method: 'POST',
      body: formData,
      mode: 'cors' // explicitly allow cross-origin request
    });

    if (!res.ok) {
      // try parse JSON error, otherwise text
      let errText = `Request failed: ${res.status}`;
      try {
        const j = await res.json();
        if (j && (j.detail || j.message)) errText = j.detail || j.message;
      } catch (e) {
        try {
          const txt = await res.text();
          if (txt) errText = txt;
        } catch { }
      }
      throw new Error(errText);
    }

    const blob = await res.blob();
    const contentDisp = res.headers.get('Content-Disposition') || '';
    let fname = filenameFallback || 'download.txt';
    const m = /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/.exec(contentDisp);
    if (m && m[1]) fname = decodeURIComponent(m[1]);

    const urlObj = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlObj;
    a.download = fname;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(urlObj);
  } catch (err) {
    alert('Error: ' + err.message);
    console.error('postAndDownload error', err);
  } finally {
    if (btn && btn.tagName === 'BUTTON') btn.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {

  const imageEncryptBtn = document.getElementById('imageEncryptBtn');
  if (imageEncryptBtn) {
    imageEncryptBtn.addEventListener('click', async () => {
      const f = document.getElementById('imageFile')?.files?.[0];
      const txt = document.getElementById('imageMessage')?.value || '';
      if (!f) { alert('Choose an image file first.'); return; }
      if (!txt) { if (!confirm('No message entered — continue?')) return; }
      const pwd = prompt('Enter encryption password (will be required to decrypt):') || '';
      if (!pwd) { alert('Password required'); return; }
      const fd = new FormData();
      fd.append('image', f, f.name);
      fd.append('password', pwd);
      fd.append('text', txt);
      await postAndDownload(`${API_BASE}/encode/image`, fd, 'stego.png');
    });
  }

  const imageDecryptBtn = document.getElementById('imageDecryptBtn');
  if (imageDecryptBtn) {
    imageDecryptBtn.addEventListener('click', async () => {
      const f = document.getElementById('imageDecryptFile')?.files?.[0];
      if (!f) { alert('Choose an encrypted image first.'); return; }
      const pwd = document.getElementById('imageDecryptKey')?.value || prompt('Enter decryption password (if used):') || '';
      const fd = new FormData(); fd.append('image', f, f.name); fd.append('password', pwd);
      await postAndDownload(`${API_BASE}/decode/image`, fd, 'decrypted.txt');
    });
  }

  const audioEncryptBtn = document.getElementById('audioEncryptBtn');
  if (audioEncryptBtn) {
    audioEncryptBtn.addEventListener('click', async () => {
      const f = document.getElementById('audioFile')?.files?.[0];
      const txt = document.getElementById('audioMessage')?.value || '';
      if (!f) { alert('Choose an audio file first.'); return; }
      const pwd = prompt('Enter encryption password (will be required to decrypt):') || '';
      if (!pwd) { alert('Password required'); return; }
      const fd = new FormData(); fd.append('audio', f, f.name);
      fd.append('password', pwd);
      fd.append('text', txt);
      await postAndDownload(`${API_BASE}/encode/audio`, fd, 'stego.wav');
    });
  }

  const audioDecryptBtn = document.getElementById('audioDecryptBtn');
  if (audioDecryptBtn) {
    audioDecryptBtn.addEventListener('click', async () => {
      const f = document.getElementById('audioDecryptFile')?.files?.[0];
      if (!f) { alert('Choose an encrypted audio first.'); return; }
      const pwd = document.getElementById('audioDecryptKey')?.value || prompt('Enter decryption password (if used):') || '';
      const fd = new FormData(); fd.append('audio', f, f.name); fd.append('password', pwd);
      await postAndDownload(`${API_BASE}/decode/audio`, fd, 'decrypted.txt');
    });
  }

  const contactSend = document.getElementById('contactSendBtn');
  if (contactSend) {
    contactSend.addEventListener('click', async () => {
      const name = document.getElementById('contactName')?.value.trim();
      const email = document.getElementById('contactEmail')?.value.trim();
      const msg = document.getElementById('contactMessage')?.value.trim();

      if (!name || !email || !msg) {
        alert('Complete the form.');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ name, email, message: msg }),
          mode: 'cors'
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.detail || data.message || 'Send failed');

        document.getElementById('contactStatus').textContent = data.message || 'Sent';
        alert('Message sent successfully!');
      } catch (e) {
        alert('Contact send failed: ' + e.message);
        console.error('contact send error', e);
      }
    });
  }
});

//  UNIVERSAL FILE-BOX HANDLER (Click, Drag, Drop)

function bindFileBox(boxId, inputId, downloadBtnId) {
  const box = document.getElementById(boxId);
  const input = document.getElementById(inputId);
  const dlBtn = downloadBtnId ? document.getElementById(downloadBtnId) : null;
}
