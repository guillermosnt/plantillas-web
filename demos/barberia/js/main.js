// Plantilla Barbería: todo el contenido sale de content.json.
const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
};
const link = (cls, text, href, external = false) => {
  const a = el('a', cls, text);
  a.href = href;
  if (external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; a.setAttribute('aria-label', `${text} (se abre en una pestaña nueva)`); }
  return a;
};
const img = (target, image) => { target.src = image.url; target.alt = image.alt; };
const wa = (c, msg) => `https://wa.me/${c.business.whatsapp}?text=${encodeURIComponent(msg)}`;

function render(c) {
  const b = c.business;
  const money = new Intl.NumberFormat('es-ES', { style: 'currency', currency: b.currency, maximumFractionDigits: 0 });
  const phone = `tel:${b.phone.replace(/\s/g, '')}`;
  const address = `${b.address.street}, ${b.address.postalCode} ${b.address.city}`;

  document.title = b.seo.title;
  document.querySelector('meta[name=description]').content = b.seo.description;

  $('brand').textContent = b.name;
  $('links').append(...c.navigation.map((n) => { const li = el('li'); li.append(link('', n.label, '#' + n.sectionId)); return li; }));

  img($('hero-img'), b.heroImage);
  $('hero-city').textContent = b.address.city;
  $('hero-title').textContent = b.name;
  $('hero-slogan').textContent = b.slogan;
  $('hero-desc').textContent = b.description;
  $('book').href = wa(c, `Hola, me gustaría reservar una cita en ${b.name}.`);

  img($('about-img'), c.about.image);
  $('about-eyebrow').textContent = c.about.eyebrow;
  $('about-title').textContent = c.about.title;
  $('about-text').append(...c.about.paragraphs.map((p) => el('p', '', p)));
  $('stats').append(...c.about.stats.map((s) => { const d = el('div'); d.append(el('dt', '', s.label), el('dd', '', s.value)); return d; }));

  $('services').append(...c.services.map((s) => {
    const li = el('li', 'card'), media = el('div', 'card__img'), i = el('img');
    img(i, s.image); i.loading = 'lazy'; media.append(i);
    const body = el('div', 'card__body'), top = el('div', 'card__top');
    top.append(el('h3', '', s.name), el('p', 'card__price', money.format(s.price)));
    body.append(top, el('p', 'card__desc', s.description), el('p', 'card__time', `${s.durationMinutes} min`),
      link('card__cta', 'Reservar', wa(c, `Hola, me gustaría reservar "${s.name}" en ${b.name}.`), true));
    li.append(media, body);
    return li;
  }));

  $('gallery').append(...c.gallery.map((g) => {
    const li = el('li'), fig = el('figure'), i = el('img');
    img(i, g); i.loading = 'lazy'; fig.append(i);
    if (g.caption) fig.append(el('figcaption', '', g.caption));
    li.append(fig);
    return li;
  }));

  const today = new Date().getDay();
  $('hours').append(...c.openingHours.map((h) => {
    const closed = !h.open || !h.close, li = el('li', (h.dayOfWeek === today ? 'today ' : '') + (closed ? 'closed' : ''));
    const day = el('span', 'day', h.day);
    if (h.dayOfWeek === today) { day.append(el('span', 'badge', 'Hoy')); li.setAttribute('aria-current', 'date'); }
    li.append(day, el('span', 'time', closed ? 'Cerrado' : `${h.open} - ${h.close}`));
    return li;
  }));

  const row = (label, node) => { const li = el('li'); li.append(el('small', '', label), node); return li; };
  const socials = el('span');
  if (c.socialLinks.instagram) socials.append(link('', 'Instagram', c.socialLinks.instagram, true), ' ');
  if (c.socialLinks.facebook) socials.append(link('', 'Facebook', c.socialLinks.facebook, true));
  $('info').append(row('Teléfono', link('', b.phone, phone)), row('Email', link('', b.email, `mailto:${b.email}`)),
    row('Dirección', el('span', '', address)), row('Redes sociales', socials));
  $('contact-actions').append(link('btn btn--primary', 'Llamar', phone),
    link('btn btn--outline', 'WhatsApp', wa(c, `Hola, quería hacer una consulta a ${b.name}.`), true));
  if (c.socialLinks.instagram) $('contact-actions').append(link('btn btn--outline', 'Instagram', c.socialLinks.instagram, true));

  if (b.address.mapEmbedUrl) {
    const f = el('iframe'); f.src = b.address.mapEmbedUrl; f.title = `Mapa con la ubicación de ${b.name}`; f.loading = 'lazy';
    $('map').append(f);
  } else {
    const box = el('div', 'map__empty');
    box.append(el('p', '', address), link('btn btn--outline', 'Cómo llegar', `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, true));
    $('map').append(box);
  }
  $('copy').textContent = `© ${new Date().getFullYear()} ${b.name}. Todos los derechos reservados.`;
}

function behaviour() {
  const nav = $('nav'), menu = $('menu'), toggle = $('toggle');
  const setMenu = (open) => {
    menu.classList.toggle('open', open); toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open); toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav.classList.toggle('solid', open || scrollY > 24); document.body.classList.toggle('lock', open);
  };
  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  addEventListener('resize', () => { if (innerWidth >= 900) setMenu(false); });
  addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 24 || menu.classList.contains('open')), { passive: true });

  const links = [...menu.querySelectorAll('a')];
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) links.forEach((a) => a.classList.toggle('active', a.hash === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((a) => { const s = document.querySelector(a.hash); if (s) io.observe(s); });
}

fetch('content.json')
  .then((r) => { if (!r.ok) throw new Error('No se pudo cargar content.json'); return r.json(); })
  .then((c) => { render(c); behaviour(); })
  .catch((e) => { document.getElementById('contenido').prepend(el('p', 'container', 'Error: ' + e.message)); });
