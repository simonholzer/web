// Rothirsch — tiny progressive enhancements (site works without this file)
(() => {
  // Fade sections in as they scroll into view
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('in'));
  }

  // Gallery lightbox
  const lb = document.getElementById('lightbox');
  const links = [...document.querySelectorAll('[data-lightbox]')];
  if (!lb || !links.length || typeof lb.showModal !== 'function') return;

  const img = lb.querySelector('img');
  const count = lb.querySelector('.lb-count');
  let i = 0;

  const show = (n) => {
    i = (n + links.length) % links.length;
    const a = links[i];
    img.src = a.href;
    img.alt = a.querySelector('img').alt;
    count.textContent = `${i + 1} / ${links.length}`;
    // warm up the neighbour
    new Image().src = links[(i + 1) % links.length].href;
  };

  links.forEach((a, n) => a.addEventListener('click', (ev) => {
    ev.preventDefault();
    show(n);
    lb.showModal();
  }));

  lb.querySelector('.lb-prev').addEventListener('click', () => show(i - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(i + 1));
  lb.querySelector('.lb-close').addEventListener('click', () => lb.close());
  lb.addEventListener('click', (ev) => { if (ev.target === lb) lb.close(); });
  lb.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowLeft') show(i - 1);
    if (ev.key === 'ArrowRight') show(i + 1);
  });

  // swipe on touch screens
  let x0 = null;
  lb.addEventListener('touchstart', (ev) => { x0 = ev.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (ev) => {
    if (x0 === null) return;
    const dx = ev.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(dx < 0 ? i + 1 : i - 1);
    x0 = null;
  });
})();
