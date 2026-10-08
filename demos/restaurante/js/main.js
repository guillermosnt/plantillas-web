// Plantilla Restaurante: todo el contenido sale de content.json.
const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
const link = (cls, text, href, ext = false) => {
  const a = el('a', cls, text); a.href = href;
  if (ext) { a.target = '_blank'; a.rel = 'noopener noreferrer'; a.setAttribute('aria-label', `${text} (se abre en una pestaña nueva)`); }
  return a;
};
const picture = (image) => { const i = el('img'); i.src = image.url; i.alt = image.alt; i.loading = 'lazy'; return i; };

function render(c) {
  const b = c.business, money = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });
  const phone = `tel:${b.phone.replace(/\s/g, '')}`;
  const address = `${b.address.street}, ${b.address.postalCode} ${b.address.city}`;

  document.title = b.seo.title;
  document.querySelector('meta[name=description]').content = b.seo.description;
  $('brand').textContent = b.name;
  $('links').append(...c.navigation.map((n) => { const li = el('li'); li.append(link('', n.label, '#' + n.sectionId)); return li; }));

  const hero = $('hero-img'); hero.src = b.heroImage.url; hero.alt = b.heroImage.alt;
  $('hero-city').textContent = b.address.city;
  $('hero-title').textContent = b.tagline;
  $('hero-desc').textContent = b.description;

  const d = c.dailyMenu;
  $('d-title').textContent = d.title; $('d-price').textContent = money.format(d.price); $('d-note').textContent = d.note;
  $('courses').append(...d.courses.map((k) => {
    const box = el('div', 'course'), ul = el('ul');
    k.options.forEach((o) => ul.append(el('li', '', o)));
    box.append(el('h3', '', k.label), ul); return box;
  }));

  // Carta con pestañas por categoría
  const show = (i) => {
    document.querySelectorAll('.tab').forEach((t, n) => t.setAttribute('aria-pressed', n === i));
    $('dishes').replaceChildren(...c.menu[i].items.map((it) => {
      const li = el('li', 'dish'), top = el('div', 'dish__top');
      top.append(el('h3', '', it.name), el('span', 'dish__dots'), el('span', 'dish__price', money.format(it.price)));
      li.append(top, el('p', '', it.description)); return li;
    }));
  };
  c.menu.forEach((cat, i) => { const t = el('button', 'tab', cat.name); t.type = 'button'; t.addEventListener('click', () => show(i)); $('tabs').append(t); });
  show(0);

  $('l-title').textContent = c.ambience.title; $('l-text').textContent = c.ambience.text;
  $('amb-imgs').append(...c.ambience.images.map((im) => { const box = el('div'); box.append(picture(im)); return box; }));

  // Reserva: se envía como mensaje de WhatsApp (sin servidor)
  const date = $('date'); date.min = new Date().toISOString().slice(0, 10);
  ['13:00', '13:30', '14:00', '14:30', '15:00', '20:00', '20:30', '21:00', '21:30', '22:00'].forEach((h) => $('time').append(new Option(h, h)));
  for (let n = 1; n <= 10; n++) $('people').append(new Option(n === 1 ? '1 persona' : `${n} personas`, n));
  $('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const msg = `Hola, quiero reservar mesa en ${b.name}. Nombre: ${f.get('name')}. Fecha: ${f.get('date')}. Hora: ${f.get('time')}. Personas: ${f.get('people')}.`;
    window.open(`https://wa.me/${b.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });

  const row = (label, node) => { const li = el('li'); li.append(el('small', '', label), node); return li; };
  $('info').append(row('Dirección', el('span', '', address)), row('Teléfono', link('', b.phone, phone)), row('Email', link('', b.email, `mailto:${b.email}`)));
  $('actions').append(link('btn', 'Llamar', phone), link('btn btn--out', 'WhatsApp', `https://wa.me/${b.whatsapp}`, true));
  if (c.socialLinks.instagram) $('actions').append(link('btn btn--out', 'Instagram', c.socialLinks.instagram, true));
  $('hours').append(...c.openingHours.map((h) => { const li = el('li'); li.append(el('span', '', h.days), el('span', '', h.time)); return li; }));

  if (b.address.mapEmbedUrl) {
    const f = el('iframe'); f.src = b.address.mapEmbedUrl; f.title = `Mapa de ${b.name}`; f.loading = 'lazy'; $('map').append(f);
  } else {
    const box = el('div', 'map__empty');
    box.append(el('p', '', address), link('btn btn--out', 'Cómo llegar', `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, true));
    $('map').append(box);
  }
  $('copy').textContent = `© ${new Date().getFullYear()} ${b.name}. Todos los derechos reservados.`;
}

function behaviour() {
  const nav = $('nav'), menu = $('menu'), toggle = $('toggle');
  const set = (open) => {
    menu.classList.toggle('open', open); toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open); toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav.classList.toggle('solid', open || scrollY > 24); document.body.classList.toggle('lock', open);
  };
  toggle.addEventListener('click', () => set(!menu.classList.contains('open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  addEventListener('resize', () => { if (innerWidth >= 900) set(false); });
  addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 24 || menu.classList.contains('open')), { passive: true });
  const links = [...menu.querySelectorAll('a')];
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) links.forEach((a) => a.classList.toggle('active', a.hash === '#' + en.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((a) => { const s = document.querySelector(a.hash); if (s) io.observe(s); });
}

fetch('content.json')
  .then((r) => { if (!r.ok) throw new Error('No se pudo cargar content.json'); return r.json(); })
  .then((c) => { render(c); behaviour(); })
  .catch((e) => $('contenido').prepend(el('p', 'wrap', 'Error: ' + e.message)));
