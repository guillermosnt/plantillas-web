// Pinta el escaparate leyendo data/site.json. Todo el contenido vive en ese archivo.
const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
};

/** Marco de navegador con la demo real dentro (o un bloque de color si aún no existe). */
function frame(t) {
  const f = el('div', 'frame');
  const bar = el('div', 'frame__bar');
  bar.append(el('i'), el('i'), el('i'), el('span', '', 'tunegocio.es'));
  bar.setAttribute('aria-hidden', 'true');

  let shot;
  if (t.available) {
    shot = el('div', 'shot');
    const ifr = el('iframe');
    ifr.src = t.url;
    ifr.title = `Vista previa de la demo ${t.name}`;
    ifr.loading = 'lazy';
    ifr.tabIndex = -1;
    ifr.setAttribute('aria-hidden', 'true');
    shot.append(ifr);
  } else {
    shot = el('div', 'shot shot--soon', t.name);
    shot.style.background = t.color;
    shot.style.color = t.ink || '#fff';
  }
  f.append(bar, shot);
  return f;
}

function modelCard(t) {
  const li = el('li', 'model rv');
  const wrap = t.available ? el('a', 'model__link') : el('div', 'model__link');
  if (t.available) { wrap.href = t.url; wrap.setAttribute('aria-label', `Ver la demo de ${t.name}`); }
  wrap.append(frame(t), el('h3', '', t.name), el('p', '', `${t.style}. ${t.description}`),
    t.available ? el('span', 'model__go', 'Ver demo →') : el('span', 'model__soon', 'Próximamente'));
  li.append(wrap);
  return li;
}

function planCard(p) {
  const card = el('article', 'plan rv' + (p.featured ? ' plan--featured' : ''));
  const list = el('ul');
  p.features.forEach((f) => list.append(el('li', '', f)));
  card.append(el('h3', '', p.name), el('p', 'plan__price', p.price), list);
  return card;
}

function tile(f) {
  const li = el('li', 'tile rv' + (f.size ? ` tile--${f.size}` : ''));
  li.append(el('h3', '', f.title), el('p', '', f.text));
  return li;
}

/** Titular con un fragmento resaltado en color. */
function headline(text, highlight) {
  const h = $('headline');
  const i = highlight ? text.indexOf(highlight) : -1;
  if (i < 0) { h.textContent = text; return; }
  const em = el('span', 'hl', highlight);
  h.append(text.slice(0, i), em, text.slice(i + highlight.length));
}

/** Las demos se renderizan a 1280px de ancho y se reducen al tamaño de su marco. */
function scaleShots() {
  document.querySelectorAll('.shot iframe').forEach((ifr) => {
    const box = ifr.parentElement;
    const apply = () => { ifr.style.transform = `scale(${box.clientWidth / 1280})`; };
    new ResizeObserver(apply).observe(box);
    apply();
  });
}

function reveal() {
  const items = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window)) { items.forEach((n) => n.classList.add('in')); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  items.forEach((n) => io.observe(n));
}

async function init() {
  const res = await fetch('data/site.json');
  if (!res.ok) throw new Error('No se pudo cargar data/site.json');
  const site = await res.json();

  document.title = `${site.brand.tagline} | ${site.brand.name}`;
  $('brand-name').textContent = site.brand.name;
  headline(site.brand.headline, site.brand.highlight);
  $('intro').textContent = site.brand.intro;

  // Pila del hero: las tres primeras demos reales; la primera de la lista queda delante
  const stack = $('stack');
  site.templates.filter((t) => t.available).slice(0, 3).reverse().forEach((t) => stack.append(frame(t)));

  // Cinta con los tipos de negocio (duplicada para que el bucle no tenga saltos)
  const names = site.templates.map((t) => t.name);
  const marquee = $('marquee');
  for (let r = 0; r < 4; r++) names.forEach((n) => marquee.append(el('span', '', n)));

  $('templates').append(...site.templates.map(modelCard));
  $('features').append(...site.features.map(tile));
  $('steps').append(...site.steps.map((s) => {
    const li = el('li', 'rv');
    li.append(el('h3', '', s.title), el('p', '', s.text));
    return li;
  }));
  $('plans').append(...site.plans.map(planCard));
  $('notes').append(...site.planNotes.map((n) => el('li', '', n)));

  const mail = $('mail');
  mail.textContent = site.contact.email;
  mail.href = `mailto:${site.contact.email}?subject=${encodeURIComponent('Quiero una web para mi negocio')}`;
  $('linkedin').href = site.contact.linkedin;
  $('copy').textContent = `© ${new Date().getFullYear()} ${site.brand.name}`;

  scaleShots();
  reveal();
}

init().catch((err) => {
  document.querySelector('main').prepend(el('p', 'lead wrap', 'Error al cargar el contenido: ' + err.message));
});
