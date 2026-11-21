
"use strict";

/* ============================================================
   FUTUROLAB EC
   Sistema principal de interactividad
   Vanilla JavaScript | Sin React | Sin MongoDB
   Compatible con GitHub Pages
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ==========================================================
     0. CONFIGURACIÓN GENERAL
  ========================================================== */

  const SELECT = (selector, parent = document) =>
    parent.querySelector(selector);

  const SELECT_ALL = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const isReducedMotion = () => reducedMotion.matches;

  console.info(
    "%cFuturoLab EC",
    "color:#16B8AD;font-size:20px;font-weight:bold;"
  );

  console.info(
    "Sistema de interactividad inicializado."
  );


  /* ==========================================================
     1. BARRA DE PROGRESO DE LECTURA
  ========================================================== */

  const progressBar = SELECT("#scrollProgress");

  function updateReadingProgress() {

    if (!progressBar) return;

    const documentHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const progress = documentHeight > 0
      ? (window.scrollY / documentHeight) * 100
      : 0;

    const safeProgress = Math.min(
      100,
      Math.max(0, progress)
    );

    progressBar.style.width = safeProgress + "%";

    progressBar.setAttribute(
      "aria-valuenow",
      Math.round(safeProgress)
    );
  }

  window.addEventListener(
    "scroll",
    updateReadingProgress,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    updateReadingProgress
  );

  updateReadingProgress();


  /* ==========================================================
     2. MENÚ DE NAVEGACIÓN RESPONSIVE
  ========================================================== */

  const navToggle = SELECT("#navToggle");
  const mainNav = SELECT("#mainNav");

  function openMenu() {

    if (!navToggle || !mainNav) return;

    mainNav.classList.add("is-open");

    navToggle.classList.add("is-active");

    navToggle.setAttribute(
      "aria-expanded",
      "true"
    );

    navToggle.setAttribute(
      "aria-label",
      "Cerrar menú"
    );
  }

  function closeMenu() {

    if (!navToggle || !mainNav) return;

    mainNav.classList.remove("is-open");

    navToggle.classList.remove("is-active");

    navToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    navToggle.setAttribute(
      "aria-label",
      "Abrir menú"
    );
  }

  function toggleMenu() {

    if (!mainNav) return;

    const isOpen = mainNav.classList.contains("is-open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (navToggle && mainNav) {

    navToggle.addEventListener(
      "click",
      toggleMenu
    );

    SELECT_ALL(".main-nav a", mainNav).forEach(link => {

      link.addEventListener("click", closeMenu);

    });

    document.addEventListener("keydown", event => {

      if (event.key === "Escape") {
        closeMenu();
      }

    });

    document.addEventListener("click", event => {

      const clickedInsideMenu =
        mainNav.contains(event.target);

      const clickedToggle =
        navToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
      }

    });

    window.addEventListener("resize", () => {

      if (window.innerWidth > 860) {
        closeMenu();
      }

    });

  }


  /* ==========================================================
     3. AVISO DE AYUDA
  ========================================================== */

  const crisisBar = SELECT("#crisisBar");
  const crisisClose = SELECT("#crisisClose");

  if (crisisBar && crisisClose) {

    crisisClose.addEventListener("click", () => {

      crisisBar.classList.add("is-hidden");

      crisisBar.setAttribute(
        "aria-hidden",
        "true"
      );

    });

  }


  /* ==========================================================
     4. NAVEGACIÓN ACTIVA POR SECCIONES
  ========================================================== */

  const sections = SELECT_ALL("main section[id]");

  const navigationLinks = SELECT_ALL(
    ".main-nav a[data-nav]"
  );

  if (
    "IntersectionObserver" in window &&
    sections.length > 0 &&
    navigationLinks.length > 0
  ) {

    const navigationObserver = new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          const sectionId = entry.target.id;

          navigationLinks.forEach(link => {

            const isActive =
              link.dataset.nav === sectionId;

            link.classList.toggle(
              "is-active",
              isActive
            );

            if (isActive) {

              link.setAttribute(
                "aria-current",
                "location"
              );

            } else {

              link.removeAttribute("aria-current");

            }

          });

        });

      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach(section => {

      navigationObserver.observe(section);

    });

  }


  /* ==========================================================
     5. ACORDEONES
  ========================================================== */

  SELECT_ALL(".accordion").forEach(accordion => {

    const triggers = SELECT_ALL(
      ".accordion-trigger",
      accordion
    );

    triggers.forEach(trigger => {

      const panel = trigger.nextElementSibling;

      if (!panel) return;

      trigger.setAttribute(
        "aria-expanded",
        "false"
      );

      panel.style.overflow = "hidden";

      panel.style.maxHeight = "0px";

      panel.style.transition =
        isReducedMotion()
          ? "none"
          : "max-height 0.3s ease";

      function closeAccordion() {

        trigger.classList.remove("is-open");

        trigger.setAttribute(
          "aria-expanded",
          "false"
        );

        panel.style.maxHeight = "0px";

      }

      function openAccordion() {

        trigger.classList.add("is-open");

        trigger.setAttribute(
          "aria-expanded",
          "true"
        );

        panel.style.maxHeight =
          panel.scrollHeight + "px";

      }

      trigger.addEventListener("click", () => {

        const isOpen =
          trigger.classList.contains("is-open");

        // Cerrar los demás acordeones.
        triggers.forEach(otherTrigger => {

          if (otherTrigger === trigger) return;

          const otherPanel =
            otherTrigger.nextElementSibling;

          otherTrigger.classList.remove("is-open");

          otherTrigger.setAttribute(
            "aria-expanded",
            "false"
          );

          if (otherPanel) {
            otherPanel.style.maxHeight = "0px";
          }

        });

        if (isOpen) {
          closeAccordion();
        } else {
          openAccordion();
        }

      });

    });

  });


  /* ==========================================================
     6. SISTEMA DE PESTAÑAS
  ========================================================== */

  SELECT_ALL(".tab-group").forEach(group => {

    const buttons = SELECT_ALL(
      ".tab-btn",
      group
    );

    const panels = SELECT_ALL(
      ".tab-panel",
      group
    );

    function activateTab(button) {

      const target = button.dataset.tab;

      if (!target) return;

      buttons.forEach(item => {

        const active = item === button;

        item.classList.toggle(
          "is-active",
          active
        );

        item.setAttribute(
          "aria-selected",
          String(active)
        );

        item.setAttribute(
          "tabindex",
          active ? "0" : "-1"
        );

      });

      panels.forEach(panel => {

        const active =
          panel.dataset.panel === target;

        panel.classList.toggle(
          "is-active",
          active
        );

        panel.hidden = !active;

      });

    }

    buttons.forEach((button, index) => {

      button.addEventListener("click", () => {

        activateTab(button);

      });

      button.addEventListener("keydown", event => {

        let nextIndex = index;

        if (event.key === "ArrowRight") {
          nextIndex = (index + 1) % buttons.length;
        }

        if (event.key === "ArrowLeft") {
          nextIndex =
            (index - 1 + buttons.length) % buttons.length;
        }

        if (event.key === "Home") {
          nextIndex = 0;
        }

        if (event.key === "End") {
          nextIndex = buttons.length - 1;
        }

        if (nextIndex !== index) {

          event.preventDefault();

          buttons[nextIndex].focus();

          activateTab(buttons[nextIndex]);

        }

      });

    });

    // Inicializar pestaña activa.
    const initialTab =
      buttons.find(button =>
        button.classList.contains("is-active")
      ) || buttons[0];

    if (initialTab) {
      activateTab(initialTab);
    }

  });


  /* ==========================================================
     7. TARJETAS INTERACTIVAS: MITO Y REALIDAD
  ========================================================== */

  SELECT_ALL(".flip-card").forEach(card => {

    function toggleCard() {

      const flipped =
        card.classList.toggle("is-flipped");

      card.setAttribute(
        "aria-pressed",
        String(flipped)
      );

    }

    card.setAttribute(
      "aria-pressed",
      "false"
    );

    card.addEventListener("click", toggleCard);

    card.addEventListener("keydown", event => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();

        toggleCard();

      }

    });

  });


  /* ==========================================================
     8. STEPPER: NAVEGACIÓN POR PASOS
  ========================================================== */

  SELECT_ALL(".stepper").forEach(stepper => {

    const buttons = SELECT_ALL(
      ".stepper-dot",
      stepper
    );

    const panels = SELECT_ALL(
      ".stepper-panel",
      stepper
    );

    const progressFill = SELECT(
      ".stepper-line span",
      stepper
    );

    if (!buttons.length || !panels.length) return;

    function goToStep(stepNumber) {

      const target = String(stepNumber);

      const activeIndex = buttons.findIndex(
        button => button.dataset.step === target
      );

      if (activeIndex === -1) return;

      buttons.forEach(button => {

        const active =
          button.dataset.step === target;

        button.classList.toggle(
          "is-active",
          active
        );

        if (active) {

          button.setAttribute(
            "aria-current",
            "step"
          );

        } else {

          button.removeAttribute("aria-current");

        }

      });

      panels.forEach(panel => {

        const active =
          panel.dataset.panel === target;

        panel.classList.toggle(
          "is-active",
          active
        );

        panel.hidden = !active;

      });

      if (progressFill) {

        const percentage =
          ((activeIndex + 1) / buttons.length) * 100;

        progressFill.style.width =
          percentage + "%";

      }

    }

    buttons.forEach(button => {

      button.addEventListener("click", () => {

        goToStep(button.dataset.step);

      });

    });

    const initialButton =
      buttons.find(button =>
        button.classList.contains("is-active")
      ) || buttons[0];

    goToStep(initialButton.dataset.step);

  });


  /* ==========================================================
     9. GRÁFICOS ANIMADOS
  ========================================================== */

  const charts = SELECT_ALL(".bar-chart");

  function animateChart(chart) {

    const bars = SELECT_ALL(
      ".bar-fill",
      chart
    );

    bars.forEach(bar => {

      const rawValue = Number(
        bar.dataset.value
      );

      if (!Number.isFinite(rawValue)) return;

      const value = Math.min(
        100,
        Math.max(0, rawValue)
      );

      bar.style.width = value + "%";

      bar.setAttribute(
        "role",
        "progressbar"
      );

      bar.setAttribute(
        "aria-valuemin",
        "0"
      );

      bar.setAttribute(
        "aria-valuemax",
        "100"
      );

      bar.setAttribute(
        "aria-valuenow",
        String(value)
      );

    });

  }

  if ("IntersectionObserver" in window) {

    const chartObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          animateChart(entry.target);

          observer.unobserve(entry.target);

        });

      },
      {
        threshold: 0.25
      }
    );

    charts.forEach(chart => {

      chartObserver.observe(chart);

    });

  } else {

    charts.forEach(animateChart);

  }


  /* ==========================================================
     10. CARRUSEL PRINCIPAL
  ========================================================== */

  const carouselTrack = SELECT("#carouselTrack");

  const carouselPrev = SELECT("#carouselPrev");

  const carouselNext = SELECT("#carouselNext");

  const carouselDots = SELECT("#carouselDots");

  if (carouselTrack) {

    const slides = SELECT_ALL(
      ".slide",
      carouselTrack
    );

    if (slides.length > 0) {

      let currentIndex = 0;

      let autoplayTimer = null;

      let isInteracting = false;

      const autoplayDelay = 5000;

      const totalSlides = slides.length;

      function getSlidePosition(index) {

        const slide = slides[index];

        return slide.offsetLeft -
          carouselTrack.offsetLeft;

      }

      function getCurrentIndex() {

        const currentPosition =
          carouselTrack.scrollLeft +
          carouselTrack.clientWidth / 2;

        let closestIndex = 0;

        let closestDistance = Infinity;

        slides.forEach((slide, index) => {

          const slideCenter =
            slide.offsetLeft +
            slide.clientWidth / 2;

          const distance = Math.abs(
            slideCenter - currentPosition
          );

          if (distance < closestDistance) {

            closestDistance = distance;

            closestIndex = index;

          }

        });

        return closestIndex;

      }

      function updateCarouselDots() {

        if (!carouselDots) return;

        const dots = SELECT_ALL(
          "button",
          carouselDots
        );

        dots.forEach((dot, index) => {

          const active = index === currentIndex;

          dot.classList.toggle(
            "is-active",
            active
          );

          dot.setAttribute(
            "aria-current",
            active ? "true" : "false"
          );

        });

      }

      function goToSlide(index) {

        currentIndex =
          (index + totalSlides) % totalSlides;

        const position =
          getSlidePosition(currentIndex);

        carouselTrack.scrollTo({

          left: position,

          behavior: isReducedMotion()
            ? "auto"
            : "smooth"

        });

        updateCarouselDots();

      }

      function createDots() {

        if (!carouselDots) return;

        carouselDots.replaceChildren();

        slides.forEach((slide, index) => {

          const dot = document.createElement("button");

          dot.type = "button";

          dot.setAttribute(
            "aria-label",
            "Ir a la diapositiva " + (index + 1)
          );

          dot.addEventListener("click", () => {

            stopAutoplay();

            goToSlide(index);

          });

          carouselDots.appendChild(dot);

        });

        updateCarouselDots();

      }

      function startAutoplay() {

        stopAutoplay();

        if (
          isReducedMotion() ||
          totalSlides <= 1 ||
          isInteracting ||
          document.hidden
        ) {
          return;
        }

        autoplayTimer = window.setInterval(() => {

          const nextIndex =
            (getCurrentIndex() + 1) % totalSlides;

          goToSlide(nextIndex);

        }, autoplayDelay);

      }

      function stopAutoplay() {

        if (autoplayTimer !== null) {

          window.clearInterval(autoplayTimer);

          autoplayTimer = null;

        }

      }

      function pauseCarousel() {

        isInteracting = true;

        stopAutoplay();

      }

      function resumeCarousel() {

        isInteracting = false;

        startAutoplay();

      }

      // Botón anterior.
      if (carouselPrev) {

        carouselPrev.addEventListener("click", () => {

          pauseCarousel();

          goToSlide(getCurrentIndex() - 1);

        });

      }

      // Botón siguiente.
      if (carouselNext) {

        carouselNext.addEventListener("click", () => {

          pauseCarousel();

          goToSlide(getCurrentIndex() + 1);

        });

      }

      // Actualizar indicador al desplazar manualmente.
      let scrollTimeout = null;

      carouselTrack.addEventListener(
        "scroll",
        () => {

          if (scrollTimeout !== null) {
            window.clearTimeout(scrollTimeout);
          }

          scrollTimeout = window.setTimeout(() => {

            currentIndex = getCurrentIndex();

            updateCarouselDots();

          }, 100);

        },
        { passive: true }
      );

      // Pausar al interactuar.
      carouselTrack.addEventListener(
        "mouseenter",
        pauseCarousel
      );

      carouselTrack.addEventListener(
        "mouseleave",
        resumeCarousel
      );

      carouselTrack.addEventListener(
        "focusin",
        pauseCarousel
      );

      carouselTrack.addEventListener(
        "focusout",
        event => {

          if (
            !carouselTrack.contains(event.relatedTarget)
          ) {
            resumeCarousel();
          }

        }
      );

      carouselTrack.addEventListener(
        "touchstart",
        pauseCarousel,
        { passive: true }
      );

      // Pausar cuando la pestaña no está visible.
      document.addEventListener(
        "visibilitychange",
        () => {

          if (document.hidden) {
            stopAutoplay();
          } else {
            startAutoplay();
          }

        }
      );

      // Cambios en preferencias de movimiento.
      if (reducedMotion.addEventListener) {

        reducedMotion.addEventListener(
          "change",
          () => {

            if (isReducedMotion()) {
              stopAutoplay();
            } else {
              startAutoplay();
            }

          }
        );

      }

      createDots();

      startAutoplay();

    }

  }


  /* ==========================================================
     11. BOTÓN VOLVER ARRIBA
  ========================================================== */

  const backToTop = SELECT("#backToTop");

  if (backToTop) {

    backToTop.addEventListener("click", () => {

      window.scrollTo({

        top: 0,

        behavior: isReducedMotion()
          ? "auto"
          : "smooth"

      });

    });

  }


  /* ==========================================================
     12. AÑO AUTOMÁTICO DEL FOOTER
  ========================================================== */

  const currentYear = SELECT("#currentYear");

  if (currentYear) {

    currentYear.textContent =
      new Date().getFullYear();

  }


  /* ==========================================================
     13. ENLACES INTERNOS
  ========================================================== */

  SELECT_ALL('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const destination = SELECT(href);

      if (!destination) return;

      event.preventDefault();

      destination.scrollIntoView({

        behavior: isReducedMotion()
          ? "auto"
          : "smooth",

        block: "start"

      });

      if (destination.id) {

        history.replaceState(
          null,
          "",
          "#" + destination.id
        );

      }

    });

  });


  /* ==========================================================
     14. CONTROL DE ELEMENTOS OCULTOS
  ========================================================== */

  SELECT_ALL("[hidden]").forEach(element => {

    element.setAttribute(
      "aria-hidden",
      "true"
    );

  });

  // Asegurar que los elementos visibles no queden
  // marcados como ocultos para lectores de pantalla.
  SELECT_ALL(".tab-panel, .stepper-panel").forEach(element => {

    if (!element.hidden) {

      element.removeAttribute("aria-hidden");

    }

  });


  /* ==========================================================
     15. VALIDACIÓN DE ENLACES EXTERNOS
  ========================================================== */

  SELECT_ALL('a[target="_blank"]').forEach(link => {

    const relValues = new Set(
      (link.getAttribute("rel") || "")
        .split(/\s+/)
        .filter(Boolean)
    );

    relValues.add("noopener");
    relValues.add("noreferrer");

    link.setAttribute(
      "rel",
      Array.from(relValues).join(" ")
    );

  });


  /* ==========================================================
     16. ESTADO FINAL
  ========================================================== */

  document.documentElement.classList.add(
    "js-ready"
  );

  document.dispatchEvent(
    new CustomEvent("futurolab:ready")
  );

  console.info(
    "%c✓ FuturoLab EC está listo.",
    "color:#16B8AD;font-weight:bold;"
  );

});
