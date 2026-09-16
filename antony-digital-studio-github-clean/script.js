const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Números animados — sem inventar métricas comerciais.
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || entry.target.dataset.done) return;
    entry.target.dataset.done = '1';
    const target = Number(entry.target.dataset.count || 0);
    const start = performance.now();
    const duration = 900;
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      entry.target.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: .6 });
document.querySelectorAll('.counter').forEach(counter => counterObserver.observe(counter));

// Soluções -> formulário de orçamento.
const projectType = document.getElementById('projectType');
document.querySelectorAll('.quote-plan').forEach(button => {
  button.addEventListener('click', () => {
    if (projectType) projectType.value = button.dataset.plan || '';
    document.getElementById('orcamento')?.scrollIntoView({ behavior: 'smooth' });
  });
});

// Orçamento inteligente: organiza a mensagem e abre o WhatsApp.
document.getElementById('budgetForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('clientName').value.trim();
  const type = document.getElementById('projectType').value;
  const business = document.getElementById('businessName').value.trim();
  const deadline = document.getElementById('projectDeadline').value;
  const goal = document.getElementById('projectGoal').value.trim();
  const details = document.getElementById('projectDetails').value.trim();

  const message = `Olá, Antony! Vim pelo site da Antony Digital Studio e gostaria de solicitar um orçamento.\n\nNome: ${name}\nTipo de projeto: ${type}\nNegócio/Marca: ${business || 'Não informado'}\nPrazo desejado: ${deadline || 'Sem prazo definido'}\nObjetivo: ${goal}\nDetalhes extras: ${details || 'Não informado'}`;
  sessionStorage.setItem('websitesQuoteName', name);
  const url = `https://wa.me/5582988200266?text=${encodeURIComponent(message)}`;
  const popup = window.open(url, '_blank', 'noopener');
  if (!popup) window.location.href = url;
  else setTimeout(() => { window.location.href = 'obrigado.html'; }, 650);
});

// Fecha menu ao tocar fora dele no mobile.
document.addEventListener('click', (event) => {
  if (!nav?.classList.contains('open')) return;
  if (nav.contains(event.target) || toggle?.contains(event.target)) return;
  nav.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
});

// Interações premium para dispositivos com mouse.
const canUsePointerEffects = window.matchMedia('(pointer: fine)').matches
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canUsePointerEffects) {
  const glow = document.querySelector('.cursor-glow');
  let pointerX = innerWidth / 2;
  let pointerY = innerHeight / 2;
  let glowFrame = 0;

  document.body.classList.add('pointer-active');
  document.addEventListener('pointermove', event => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (glowFrame) return;
    glowFrame = requestAnimationFrame(() => {
      glow?.style.setProperty('transform', `translate3d(${pointerX - 170}px,${pointerY - 170}px,0)`);
      glowFrame = 0;
    });
  }, { passive: true });

  const interactiveCards = document.querySelectorAll(
    '.service-card, .portfolio-card, .plan-card, .support-card, .project-showcase, .founder-frame'
  );

  interactiveCards.forEach(card => {
    if (card.classList.contains('founder-frame')) {
      const reflection = document.createElement('span');
      reflection.className = 'pointer-reflection';
      reflection.setAttribute('aria-hidden', 'true');
      card.appendChild(reflection);
    }

    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - .5) * 7;
      const rotateX = (.5 - (y / rect.height)) * 7;
      card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
      card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
      card.style.setProperty('--mx', `${x.toFixed(0)}px`);
      card.style.setProperty('--my', `${y.toFixed(0)}px`);
      card.classList.add('is-pointer-over');
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
      card.classList.remove('is-pointer-over');
    });
  });

  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('pointermove', event => {
      const rect = button.getBoundingClientRect();
      button.style.setProperty('--mag-x', `${(event.clientX - rect.left - rect.width / 2) * .13}px`);
      button.style.setProperty('--mag-y', `${(event.clientY - rect.top - rect.height / 2) * .18}px`);
    }, { passive: true });
    button.addEventListener('pointerleave', () => {
      button.style.setProperty('--mag-x', '0px');
      button.style.setProperty('--mag-y', '0px');
    });
  });
}
