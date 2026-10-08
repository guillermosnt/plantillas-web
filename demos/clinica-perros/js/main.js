// Plantilla Clínica de perros: todo el contenido sale de content.json.
const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
const link = (cls, text, href, ext = false) => { const a = el('a', cls, text); a.href = href; if (ext) { a.target = '_blank'; a.rel = 'noopener noreferrer'; a.setAttribute('aria-label', `${text} (se abre en una pestaña nueva)`); } return a; };

function render(c) {
  const b = c.business, phone = `tel:${b.phone.replace(/\s/g, '')}`, address = `${b.address.street}, ${b.address.postalCode} ${b.address.city}`;
  document.title = b.seo.title; document.querySelector('meta[name=description]').content = b.seo.description;
  $('brand').textContent = b.name;
  $('links').append(...c.navigation.map((n) => { const li = el('li'); li.append(link('', n.label, '#' + n.sectionId)); return li; }));
  $('hero-city').textContent = b.address.city; $('hero-title').textContent = b.tagline; $('hero-desc').textContent = b.description;
  $('hero-img').src = b.heroImage.url; $('hero-img').alt = b.heroImage.alt;

  $('services').append(...c.services.map((s) => { const li = el('li'); li.style.setProperty('--c', s.color); li.append(el('h3', '', s.name), el('p', '', s.text)); return li; }));
  $('u-title').textContent = c.emergency.title; $('u-text').textContent = c.emergency.text;
  $('call').textContent = `Llamar: ${b.phone}`; $('call').href = phone;
  $('team').append(...c.team.map((m) => { const li = el('li'), t = el('div'); t.append(el('h3', '', m.name), el('p', '', m.role)); li.append(el('div', 'mono', m.name.replace(/^(Dra?\.)\s*/, '')[0]), t); return li; }));
  $('tips').append(...c.tips.map((t) => { const li = el('li'); li.append(el('h3', '', t.title), el('p', '', t.text)); return li; }));

  c.services.forEach((s) => $('reason').append(new Option(s.name, s.name)));
  $('form').addEventListener('submit', (e) => {
    e.preventDefault(); const f = new FormData(e.target);
    const msg = `Hola, soy ${f.get('name')}. Quiero pedir cita en ${b.name} para mi perro ${f.get('pet')}. Motivo: ${f.get('reason')}.`;
    window.open(`https://wa.me/${b.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });

  const row = (l, n) => { const li = el('li'); li.append(el('small', '', l), n); return li; };
  $('info').append(row('Dirección', el('span', '', address)), row('Teléfono', link('', b.phone, phone)), row('Email', link('', b.email, `mailto:${b.email}`)));
  $('actions').append(link('btn', 'Llamar', phone), link('btn btn--alt', 'WhatsApp', `https://wa.me/${b.whatsapp}`, true));
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
