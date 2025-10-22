const debounce = (fn, d) => {
  let t;
  return () => {
    clearTimeout(t);
    t = setTimeout(fn, d);
  };
};

const adjustDropdowns = () => {
  const m = window.innerWidth < 992;
  document.querySelectorAll(".navbar .offcanvas .subdropdown").forEach(d =>
    d.classList.toggle("dropdown", m) || d.classList.toggle("dropend", !m)
  );
  document.querySelectorAll(".navbar .offcanvas .color-dropdown").forEach(d =>
    d.classList.toggle("dropup", m) || d.classList.toggle("dropdown", !m)
  );
};

const positionDropdownMenus = () => {
  document.querySelectorAll('.navbar .offcanvas .dropdown-toggle:not(.subdropdown .dropdown-toggle)').forEach(t => {
    const m = t.parentElement.querySelector('.dropdown-menu');
    if (!m) return;

    if (window.innerWidth > 992) {
      m.style.visibility = 'hidden';
      m.style.display = 'block';

      const r = t.getBoundingClientRect(), w = m.offsetWidth, h = m.offsetHeight;
      const p = m.offsetParent || document.body, pr = p.getBoundingClientRect();
      const b = 12;
      let l = r.left - pr.left, top = r.bottom, pw = p.clientWidth;
      const ox = l + w + b - pw;
      if (ox > 0) l -= ox;
      if (l < b) l = b;

      Object.assign(m.style, {
        position: 'absolute',
        left: `${l}px`,
        top: `${top}px`,
        minWidth: `${r.width}px`,
        width: `${w}px`,
        height: `${h}px`,
        transform: 'none',
        display: '',
        visibility: ''
      });
    } else {
      Object.assign(m.style, {
        position: '',
        left: '',
        top: '',
        minWidth: '',
        width: '',
        height: '',
        transform: ''
      });
    }
  });
};

const init = () => {
  adjustDropdowns();
  positionDropdownMenus();
};

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('pageshow', positionDropdownMenus);
window.addEventListener('resize', debounce(init, 150));
