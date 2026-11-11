(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 15);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  const setMenu = (open) => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
  };

  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });

  const reveals = document.querySelectorAll('.reveal');
  document.querySelectorAll('.services-grid, .process-grid, .pricing-cards, .area-grid').forEach((group) => {
    group.querySelectorAll('.reveal').forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
    });
  });

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries, revealObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px' });
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('is-visible'));
  }

  const scene = document.querySelector('[data-scene]');
  if (scene && finePointer.matches && !reducedMotion.matches) {
    const truck = scene.querySelector('.scene');
    scene.addEventListener('pointermove', (event) => {
      const bounds = scene.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      truck.style.setProperty('--scene-x', `${-y * 9}deg`);
      truck.style.setProperty('--scene-y', `${x * 11}deg`);
    });
    scene.addEventListener('pointerleave', () => {
      truck.style.setProperty('--scene-x', '0deg');
      truck.style.setProperty('--scene-y', '0deg');
    });
  }

  const params = new URLSearchParams(window.location.search);
  document.querySelectorAll('[data-quote-form]').forEach((form) => {
    const serviceSelect = form.querySelector('[name="service"]');
    const areaSelect = form.querySelector('[name="area"]');
    const requestedService = params.get('service');
    const requestedArea = params.get('area');

    if (requestedService && serviceSelect) {
      const option = [...serviceSelect.options].find((item) => item.value === requestedService);
      if (option) serviceSelect.value = requestedService;
    }
    if (requestedArea && areaSelect) {
      const option = [...areaSelect.options].find((item) => item.value === requestedArea);
      if (option) areaSelect.value = requestedArea;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const lines = [
        'Hi Johannesburg Rubble Removal, I would like a quote.',
        '',
        `Name: ${data.get('name')}`,
        `Phone: ${data.get('phone') || 'Not provided'}`,
        `Service: ${data.get('service')}`,
        `Area: ${data.get('area')}`,
        `Access: ${data.get('access') || 'To be discussed'}`,
        '',
        'Job details:',
        data.get('message') || 'I will share the details and photos on WhatsApp.'
      ];
      const url = `https://wa.me/27717137074?text=${encodeURIComponent(lines.join('\n'))}`;
      const status = form.querySelector('.form-status');
      const whatsappWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (whatsappWindow) {
        status.textContent = 'WhatsApp opened with your quote details. Just press send.';
      } else {
        window.location.assign(url);
      }
    });
  });

  const areaChecker = document.querySelector('#area-checker');
  if (areaChecker) {
    areaChecker.addEventListener('submit', (event) => {
      event.preventDefault();
      const area = areaChecker.elements.area.value;
      const result = document.querySelector('#area-result');
      if (area === 'Other') {
        result.textContent = 'Send us your location on WhatsApp and we will confirm availability.';
      } else {
        result.textContent = `Yes — ${area} is in our service area. Call or WhatsApp us to arrange your quote.`;
      }
    });
  }

  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
})();
