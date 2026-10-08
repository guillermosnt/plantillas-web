// Plantilla Peluquería: todo el contenido sale de content.json.
const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
const link = (cls, text, href, ext = false) => { const a = el('a', cls, text); a.href = href; if (ext) { a.target = '_blank'; a.rel = 'noopener noreferrer'; a.setAttribute('aria-label', `${text} (se abre en una pestaña nueva)`); } return a; };

function render(c) {
  const b = c.business, money = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const phone = `tel:${b.phone.replace(/\s/g, '')}`, address = `${b.address.street}, ${b.address.postalCode} ${b.address.city}`;
  document.title = b.seo.title; document.querySelector('meta[name=description]').content = b.seo.description;
  $('brand').textContent = b.name;
  $('links').append(...c.navigation.map((n) => { const li = el('li'); li.append(link('', n.label, '#' + n.sectionId)); return li; }));
  $('hero-city').textContent = b.address.city; $('hero-title').textContent = b.tagline; $('hero-desc').textContent = b.description;
  $('hero-img').src = b.heroImage.url; $('hero-img').alt = b.heroImage.alt;
  $('book').href = `https://wa.me/${b.whatsapp}?text=${encodeURIComponent('Hola, me gustaría reservar cita en ' + b.name + '.')}`;

  $('services').append(...c.services.map((cat) => {
    const box = el('div'), ul = el('ul');
    cat.items.forEach((it) => { const li = el('li'), t = el('span'); const s = el('b', '', it.name); t.append(s, el('small', '', it.note)); li.append(t, el('span', 'price', money.format(it.price))); ul.append(li); });
    box.append(el('h3', '', cat.name), ul); return box;
  }));
  $('team').append(...c.team.map((m) => {
    const li = el('li'); li.append(el('div', 'mono', m.name[0]), el('h3', '', m.name), el('p', 'role', m.role), el('p', '', m.bio)); return li;
  }));
  $('gallery').append(...c.gallery.map((g) => { const li = el('li'), i = el('img'); i.src = g.url; i.alt = g.alt; i.loading = 'lazy'; li.append(i); return li; }));

  const row = (l, n) => { const li = el('li'); li.append(el('small', '', l), n); return li; };
  $('info').append(row('Dirección', el('span', '', address)), row('Teléfono', link('', b.phone, phone)), row('Email', link('', b.email, `mailto:${b.email}`)));
  $('actions').append(link('btn', 'Llamar', phone), link('btn', 'WhatsApp', `https://wa.me/${b.whatsapp}`, true));
  if (c.socialLinks.instagram) $('actions').append(link('btn', 'Instagram', c.socialLinks.instagram, true));
  $('hours').append(...c.openingHours.map((h) => { const li = el('li'); li.append(el('span', '', h.days), el('span', '', h.time)); return li; }));
  if (b.address.mapEmbedUrl) { const f = el('iframe'); f.src = b.address.mapEmbedUrl; f.title = `Mapa de ${b.name}`; f.loading = 'lazy'; $('map').append(f); }
  else { const box = el('div', 'map__empty'); box.append(el('p', '', address), link('btn', 'Cómo llegar', `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, true)); $('map').append(box); }
  $('copy').textContent = `© ${new Date().getFullYear()} ${b.name}. Todos los derechos reservados.`;
}

function behaviour() {
  const menu = $('menu'), toggle = $('toggle');
  const set = (o) => { menu.classList.toggle('open', o); toggle.classList.toggle('open', o); toggle.setAttribute('aria-expanded', o); toggle.setAttribute('aria-label', o ? 'Cerrar menú' : 'Abrir menú'); document.body.classList.toggle('lock', o); };
  toggle.addEventListener('click', () => set(!menu.classList.contains('open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  addEventListener('resize', () => { if (innerWidth >= 900) set(false); });
  const links = [...menu.querySelectorAll('a')];
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) links.forEach((a) => a.classList.toggle('active', a.hash === '#' + en.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((a) => { const s = document.querySelector(a.hash); if (s) io.observe(s); });
}

fetch('content.json').then((r) => { if (!r.ok) throw new Error('No se pudo cargar content.json'); return r.json(); })
  .then((c) => { render(c); behaviour(); }).catch((e) => $('contenido').prepend(el('p', 'wrap', 'Error: ' + e.message)));
