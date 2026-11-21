'use strict';

/* =========================================================
   FUTUROLAB EC | INTERACTIVIDAD
   JavaScript puro, sin librerías ni servicios externos.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // FUNCIONES GENERALES
  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  const reduceMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  // 1. AÑO AUTOMÁTICO EN EL PIE DE PÁGINA

  const year = $('#currentYear');

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }


  // 2. BARRA DE PROGRESO DE LECTURA Y BOTÓN PARA VOLVER ARRIBA

  const progress = $('#scrollProgress');
  const backToTop = $('#backToTop');

  let scrollQueued = false;

  const updateScrollUI = () => {

    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage = maxScroll > 0
      ? Math.min(
          100,
          Math.max(0, (window.scrollY / maxScroll) * 100)
        )
      : 0;

    if (progress) {
      progress.style.width = `${percentage}%`;

      progress.setAttribute(
        'aria-valuenow',
        String(Math.round(percentage))
      );
    }

    if (backToTop) {
      backToTop.classList.toggle(
        'is-visible',
        window.scrollY > 500
      );
    }

    scrollQueued = false;
  };

  window.addEventListener('scroll', () => {

    if (!scrollQueued) {

      window.requestAnimationFrame(updateScrollUI);

      scrollQueued = true;
    }

  }, { passive: true });

  updateScrollUI();

  backToTop?.addEventListener('click', () => {

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });

  });


  // 3. CERRAR AVISO DE AYUDA

  const crisisBar = $('#crisisBar');

  $('#crisisClose')?.addEventListener('click', () => {

    crisisBar?.classList.add('is-hidden');

    crisisBar?.setAttribute('aria-hidden', 'true');

  });


  // 4. MENÚ MÓVIL

  const navToggle = $('#navToggle');

  const mainNav = $('#mainNav');

  const closeMenu = () => {

    if (!navToggle || !mainNav) return;

    mainNav.classList.remove('is-open');

    navToggle.classList.remove('is-active');

    navToggle.setAttribute('aria-expanded', 'false');

    navToggle.setAttribute(
      'aria-label',
      'Abrir menú'
    );

  };

  navToggle?.addEventListener('click', () => {

    const isOpen =
      mainNav?.classList.toggle('is-open') ?? false;

    navToggle.classList.toggle(
      'is-active',
      isOpen
    );

    navToggle.setAttribute(
      'aria-expanded',
      String(isOpen)
    );

    navToggle.setAttribute(
      'aria-label',
      isOpen ? 'Cerrar menú' : 'Abrir menú'
    );

  });

  $$('.main-nav a').forEach(link => {

    link.addEventListener('click', closeMenu);

  });

  document.addEventListener('keydown', event => {

    if (event.key === 'Escape') {
      closeMenu();
    }

  });

  document.addEventListener('click', event => {

    if (
      !mainNav ||
      !navToggle ||
      !mainNav.classList.contains('is-open')
    ) {
      return;
    }

    if (
      !mainNav.contains(event.target) &&
      !navToggle.contains(event.target)
    ) {
      closeMenu();
    }

  });

  window.addEventListener('resize', () => {

    if (window.innerWidth > 850) {
      closeMenu();
    }

  });


  // 5. RESALTAR EN EL MENÚ LA SECCIÓN ACTUAL

  const navLinks = $$('.main-nav a[data-nav]');

  const observedSections = $$('main section[id]');

  if (
    'IntersectionObserver' in window &&
    navLinks.length &&
    observedSections.length
  ) {

    const navObserver = new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          navLinks.forEach(link => {

            const active =
              link.dataset.nav === entry.target.id;

            link.classList.toggle(
              'is-active',
              active
            );

            if (active) {
              link.setAttribute(
                'aria-current',
                'location'
              );
            } else {
              link.removeAttribute('aria-current');
            }

          });

        });

      },
      {
        rootMargin: '-35% 0px -55% 0px',
        threshold: 0
      }
    );

    observedSections.forEach(section => {
      navObserver.observe(section);
    });

  }


  // 6. ACORDEONES INTERACTIVOS

  $$('[data-accordion]').forEach(accordion => {

    const triggers =
      $$('.accordion-trigger', accordion);

    triggers.forEach(trigger => {

      const panel = trigger.nextElementSibling;

      if (
        !panel ||
        !panel.classList.contains('accordion-panel')
      ) {
        return;
      }

      panel.style.maxHeight = '0px';

      trigger.setAttribute(
        'aria-expanded',
        'false'
      );

      trigger.addEventListener('click', () => {

        const shouldOpen =
          !trigger.classList.contains('is-open');

        triggers.forEach(other => {

          other.classList.remove('is-open');

          other.setAttribute(
            'aria-expanded',
            'false'
          );

          const otherPanel =
            other.nextElementSibling;

          if (
            otherPanel?.classList.contains('accordion-panel')
          ) {
            otherPanel.style.maxHeight = '0px';
          }

          const icon = $('span', other);

          if (icon) {
            icon.textContent = '+';
          }

        });

        if (shouldOpen) {

          trigger.classList.add('is-open');

          trigger.setAttribute(
            'aria-expanded',
            'true'
          );

          panel.style.maxHeight =
            `${panel.scrollHeight}px`;

          const icon = $('span', trigger);

          if (icon) {
            icon.textContent = '−';
          }

        }

      });

    });

  });


  // 7. TARJETAS MITO / REALIDAD

  $$('.flip-card').forEach(card => {

    card.addEventListener('click', () => {

      const flipped =
        card.classList.toggle('is-flipped');

      card.setAttribute(
        'aria-pressed',
        String(flipped)
      );

    });

  });


  // 8. RUTA INTERACTIVA DE ACOMPAÑAMIENTO

  const stepper = $('#responseStepper');

  if (stepper) {

    const dots =
      $$('.step-dot', stepper);

    const panels =
      $$('[data-step-panel]', stepper);

    const progressFill =
      $('#stepperProgress');

    const prev = $('#stepPrev');

    const next = $('#stepNext');

    let currentStep = 0;

    const renderStep = index => {

      currentStep = Math.max(
        0,
        Math.min(panels.length - 1, index)
      );

      dots.forEach((dot, i) => {

        const active = i === currentStep;

        dot.classList.toggle(
          'is-active',
          active
        );

        if (active) {
          dot.setAttribute(
            'aria-current',
            'step'
          );
        } else {
          dot.removeAttribute('aria-current');
        }

      });

      panels.forEach((panel, i) => {

        const active = i === currentStep;

        panel.classList.toggle(
          'is-active',
          active
        );

        panel.hidden = !active;

      });

      if (progressFill) {

        progressFill.style.width =
          `${panels.length > 1
            ? (currentStep / (panels.length - 1)) * 100
            : 100}%`;

      }

      if (prev) {
        prev.disabled = currentStep === 0;
      }

      if (next) {

        next.disabled =
          currentStep === panels.length - 1;

        next.textContent =
          currentStep === panels.length - 1
            ? 'Último paso'
            : 'Siguiente →';

      }

    };

    dots.forEach(dot => {

      dot.addEventListener('click', () => {

        renderStep(Number(dot.dataset.step));

      });

    });

    prev?.addEventListener('click', () => {

      renderStep(currentStep - 1);

    });

    next?.addEventListener('click', () => {

      renderStep(currentStep + 1);

    });

    renderStep(0);

  }


  // 9. CARRUSEL DE EXPLORACIÓN

  const track = $('#carouselTrack');

  if (track) {

    const cards =
      $$('.explore-card', track);

    const dotsContainer =
      $('#carouselDots');

    const prevButton =
      $('#carouselPrev');

    const nextButton =
      $('#carouselNext');

    let activeIndex = 0;

    let autoplayId = null;

    const getStep = () => {

      return cards[0]
        ? cards[0].getBoundingClientRect().width + 18
        : 260;

    };

    const setActiveDot = () => {

      const nearest =
        Math.round(track.scrollLeft / getStep());

      activeIndex = Math.max(
        0,
        Math.min(cards.length - 1, nearest)
      );

      $$('.carousel-dots button').forEach((dot, i) => {

        dot.classList.toggle(
          'is-active',
          i === activeIndex
        );

        dot.setAttribute(
          'aria-current',
          i === activeIndex ? 'true' : 'false'
        );

      });

    };

    const goTo = index => {

      if (!cards.length) return;

      activeIndex = Math.max(
        0,
        Math.min(cards.length - 1, index)
      );

      track.scrollTo({
        left: activeIndex * getStep(),
        behavior: reduceMotion ? 'auto' : 'smooth'
      });

      setActiveDot();

    };

    if (dotsContainer && cards.length) {

      dotsContainer.replaceChildren();

      cards.forEach((card, i) => {

        const dot =
          document.createElement('button');

        dot.type = 'button';

        dot.setAttribute(
          'aria-label',
          `Ir al tema ${i + 1}: ${$('h3', card)?.textContent ?? 'tema'}`
        );

        dot.addEventListener('click', () => {

          stopAutoplay();

          goTo(i);

        });

        dotsContainer.append(dot);

      });

    }

    prevButton?.addEventListener('click', () => {

      stopAutoplay();

      goTo(activeIndex - 1);

    });

    nextButton?.addEventListener('click', () => {

      stopAutoplay();

      goTo(activeIndex + 1);

    });

    track.addEventListener('scroll', () => {

      window.requestAnimationFrame(setActiveDot);

    }, { passive: true });

    track.addEventListener('keydown', event => {

      if (event.key === 'ArrowRight') {

        event.preventDefault();

        stopAutoplay();

        goTo(activeIndex + 1);

      }

      if (event.key === 'ArrowLeft') {

        event.preventDefault();

        stopAutoplay();

        goTo(activeIndex - 1);

      }

    });

    function stopAutoplay() {

      if (autoplayId) {
        window.clearInterval(autoplayId);
      }

      autoplayId = null;

    }

    if (!reduceMotion && cards.length > 1) {

      autoplayId = window.setInterval(() => {

        goTo((activeIndex + 1) % cards.length);

      }, 5200);

      [track, prevButton, nextButton, dotsContainer].forEach(element => {

        element?.addEventListener(
          'pointerdown',
          stopAutoplay,
          { once: true }
        );

        element?.addEventListener(
          'focusin',
          stopAutoplay,
          { once: true }
        );

      });

    }

    setActiveDot();

  }


  // 10. RECALCULAR ACORDEONES AL CAMBIAR EL TAMAÑO DE PANTALLA

  window.addEventListener('resize', () => {

    $$('.accordion-trigger.is-open').forEach(trigger => {

      const panel = trigger.nextElementSibling;

      if (
        panel?.classList.contains('accordion-panel')
      ) {

        panel.style.maxHeight =
          `${panel.scrollHeight}px`;

      }

    });

  });


  // MENSAJE DE CONFIRMACIÓN EN LA CONSOLA

  console.info(
    'FuturoLab EC: interacciones listas.'
  );

});