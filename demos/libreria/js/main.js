// Plantilla Librería: todo el contenido sale de content.json.
const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
const link = (cls, text, href, ext = false) => {
  const a = el('a', cls, text); a.href = href;
  if (ext) { a.target = '_blank'; a.rel = 'noopener noreferrer'; a.setAttribute('aria-label', `${text} (se abre en una pestaña nueva)`); }
  return a;
};

function cover(b) {
  const c = el('div', 'cover');
  c.style.background = b.color; c.style.color = b.ink;
  c.append(el('b', '', b.title), el('span', '', b.author));
  return c;
}

function render(c) {
  const b = c.business, money = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
  const phone = `tel:${b.phone.replace(/\s/g, '')}`;
  const address = `${b.address.street}, ${b.address.postalCode} ${b.address.city}`;

  document.title = b.seo.title;
  document.querySelector('meta[name=description]').content = b.seo.description;
  $('brand').textContent = b.name;
  $('links').append(...c.navigation.map((n) => { const li = el('li'); li.append(link('', n.label, '#' + n.sectionId)); return li; }));

  $('hero-kicker').textContent = `Librería independiente · ${b.address.city}`;
  $('hero-title').textContent = b.tagline;
  $('hero-desc').textContent = b.description;
  $('shelf').append(...c.newReleases.slice(0, 3).map(cover));

  $('books').append(...c.newReleases.map((bk) => {
    const li = el('li', 'book');
    li.append(cover(bk), el('h3', '', bk.title), el('p', '', bk.author), el('p', 'price', money.format(bk.price)));
    return li;
  }));

  $('pick-cover').append(cover(c.pick.book));
  $('pick-title').textContent = c.pick.label;
  $('pick-quote').textContent = `“${c.pick.quote}”`;
  $('pick-by').textContent = `${c.pick.bookseller} · ${c.pick.book.title}, ${c.pick.book.author} (${money.format(c.pick.book.price)})`;

  $('toc').append(...c.categories.map((k) => { const li = el('li'); li.append(el('h3', '', k.name), el('p', '', k.description)); return li; }));

  $('events').append(...c.events.map((e) => {
    const li = el('li', 'event');
    li.append(el('small', '', `${e.when} · ${e.time}`), el('h3', '', e.title), el('p', '', e.description));
    return li;
  }));

  const row = (label, node) => { const li = el('li'); li.append(el('small', '', label), node); return li; };
  $('info').append(row('Dirección', el('span', '', address)), row('Teléfono', link('', b.phone, phone)), row('Email', link('', b.email, `mailto:${b.email}`)));
  $('actions').append(link('btn btn--light', 'Llamar', phone),
    link('btn btn--out', 'WhatsApp', `https://wa.me/${b.whatsapp}?text=${encodeURIComponent('Hola, quería consultar un libro en ' + b.name + '.')}`, true));
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
  const menu = $('menu'), toggle = $('toggle');
  const set = (open) => {
    menu.classList.toggle('open', open); toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open); toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('lock', open);
  };
  toggle.addEventListener('click', () => set(!menu.classList.contains('open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  addEventListener('resize', () => { if (innerWidth >= 900) set(false); });
  const links = [...menu.querySelectorAll('a')];
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) links.forEach((a) => a.classList.toggle('active', a.hash === '#' + en.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((a) => { const s = document.querySelector(a.hash); if (s) io.observe(s); });
}

fetch('content.json')
  .then((r) => { if (!r.ok) throw new Error('No se pudo cargar content.json'); return r.json(); })
  .then((c) => { render(c); behaviour(); })
  .catch((e) => $('contenido').prepend(el('p', 'wrap', 'Error: ' + e.message)));
