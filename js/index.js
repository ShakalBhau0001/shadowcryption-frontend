// THEME

const themeBtn = document.getElementById('themeBtn');
const store = localStorage;
const THEME_KEY = 'sc-theme';

(function initTheme() {
  if (store.getItem(THEME_KEY) === 'dark') {
    document.body.classList.add('dark');
    themeBtn.textContent = '☀️';
  } else {
    document.body.classList.remove('dark');
    themeBtn.textContent = '🌙';
  }
})();

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const dark = document.body.classList.contains('dark');
  themeBtn.textContent = dark ? '☀️' : '🌙';
  store.setItem(THEME_KEY, dark ? 'dark' : 'light');
});

//   NAV + SMOOTH SCROLL + ACTIVE HIGHLIGHT

const navLinks = Array.from(document.querySelectorAll('.nav .nav-link'));
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href')));
const pageTitle = document.getElementById('pageTitle');
pageTitle.textContent = "ShadowCryption";

function showSection(targetEl) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('show'));
  if (!targetEl) return;
  targetEl.classList.add('show');
  pageTitle.textContent = targetEl.querySelector('h2')?.textContent || 'Page';
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    navLinks.forEach(n => n.classList.remove('active'));
    link.classList.add('active');
  });
});


// POLISHED SCROLL & FADE-IN HANDLER

function updateActiveSection() {
  sections.forEach((sec, idx) => {
    if (!sec) return;
    const rect = sec.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.6 && rect.bottom > 0) {
      navLinks.forEach(n => n.classList.remove('active'));
      navLinks[idx]?.classList.add('active');

      if (!sec.classList.contains('show')) {
        sec.classList.add('show', 'fade-in');
      }
    }
  });
}
window.addEventListener('load', () => {
  document.querySelectorAll('.section').forEach(s => s.classList.add('fade-in'));
  updateActiveSection(); // ensures dashboard is visible
});

window.addEventListener('scroll', () => {
  window.requestAnimationFrame(updateActiveSection);
});

//  UNIVERSAL FILE-BOX HANDLER (Click, Drag, Drop)

function bindFileBox(boxId, inputId, downloadBtnId) {
  const box = document.getElementById(boxId);
  const input = document.getElementById(inputId);
  const dlBtn = downloadBtnId ? document.getElementById(downloadBtnId) : null;

  if (!box || !input) return;

  // CLICK → open input
  box.addEventListener('click', () => input.click());

  // KEYBOARD accessibility
  box.addEventListener('keydown', e => {
    if (['Enter', ' '].includes(e.key)) input.click();
  });

  // DRAG OVER
  box.addEventListener('dragover', e => {
    e.preventDefault();
    box.classList.add('drag');
  });

  // DRAG LEAVE
  box.addEventListener('dragleave', () => {
    box.classList.remove('drag');
  });

  // DROP
  box.addEventListener('drop', e => {
    e.preventDefault();
    box.classList.remove('drag');
    if (e.dataTransfer.files.length) {
      input.files = e.dataTransfer.files;
      updateBox(box, input.files[0], dlBtn);
    }
  });

  // FILE SELECTED
  input.addEventListener('change', () => {
    if (input.files.length) {
      updateBox(box, input.files[0], dlBtn);
    }
  });

  function updateBox(boxEl, file, dlButton) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    boxEl.textContent = `${file.name} — ${sizeMB} MB`;
    if (dlButton) dlButton.disabled = true;
  }
}

// Attach to all file boxes
const BOX_IDS = ['imageUploadBox', 'imageDecryptBox', 'audioUploadBox', 'audioDecryptBox'];

function mapBoxToInputId(boxId) {
  // explicit and safe mapping that matches your HTML
  if (boxId === 'imageUploadBox') return 'imageFile';
  if (boxId === 'imageDecryptBox') return 'imageDecryptFile';
  if (boxId === 'audioUploadBox') return 'audioFile';
  if (boxId === 'audioDecryptBox') return 'audioDecryptFile';
  // fallback: try the replace pattern (keeps compatibility)
  return boxId.replace(/Box$/, 'File');
}

function mapBoxToDownloadId(boxId) {
  // only the encrypt boxes have download buttons in your HTML:
  if (boxId === 'imageUploadBox') return 'imageDownloadBtn';
  if (boxId === 'audioUploadBox') return 'audioDownloadBtn';
  return null;
}

BOX_IDS.forEach(boxId => {
  const inputId = mapBoxToInputId(boxId);
  const dlId = mapBoxToDownloadId(boxId);
  bindFileBox(boxId, inputId, dlId);
});

/* CONTACT FORM CLEAR BUTTON*/
const contactClear = document.getElementById('contactClearBtn');

if (contactClear) {
  contactClear.addEventListener('click', () => {
    ['contactName', 'contactEmail', 'contactMessage']
      .forEach(id => (document.getElementById(id).value = ''));

    document.getElementById('contactStatus').textContent = '';
  });
}

const hamburger = document.getElementById("hamburger");
const sidebar = document.querySelector(".sidebar");
const body = document.body;

hamburger.addEventListener("click", e => {
  e.stopPropagation(); // prevent body click
  sidebar.classList.toggle("show");
  body.classList.toggle("sidebar-open");
});

// Close sidebar when clicking outside
body.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
    sidebar.classList.remove("show");
    body.classList.remove("sidebar-open");
  }
});

// Prevent clicks inside sidebar from closing
sidebar.addEventListener("click", e => e.stopPropagation());
