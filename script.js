
"use strict";

/* =========================================================
   FUTUROLAB EC — INTERACTIVIDAD
   Vanilla JavaScript | Sin React | Sin MongoDB
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) =>
    Array.from(context.querySelectorAll(selector));

  /* =======================================================
     1. BARRA DE PROGRESO DE LECTURA
  ======================================================= */

  const scrollProgress = $("#scrollProgress");

  const updateScrollProgress = () => {
    if (!scrollProgress) return;

    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress =
      scrollableHeight > 0
        ? (window.scrollY / scrollableHeight) * 100
        : 0;

    scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };

  window.addEventListener("scroll", updateScrollProgress, {
    passive: true
  });

  window.addEventListener("resize", updateScrollProgress);
  updateScrollProgress();


  /* =======================================================
     2. MENÚ RESPONSIVE
  ======================================================= */

  const navToggle = $("#navToggle");
  const mainNav = $("#mainNav");

  const closeMenu = () => {
    if (!navToggle || !mainNav) return;

    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
  };

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");

      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menú" : "Abrir menú"
      );
    });

    $$(".main-nav a", mainNav).forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeMenu();
    });
  }


  /* =======================================================
     3. BARRA DE AYUDA / CRISIS
  ======================================================= */

  const crisisBar = $("#crisisBar");
  const crisisClose = $("#crisisClose");

  if (crisisBar && crisisClose) {
    crisisClose.addEventListener("click", () => {
      crisisBar.classList.add("is-hidden");
    });
  }


  /* =======================================================
     4. DETECTAR SECCIÓN ACTIVA
  ======================================================= */

  const sections = $$("main section[id]");
  const navLinks = $$(".main-nav a[data-nav]");

  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const currentId = entry.target.id;

          navLinks.forEach(link => {
            const isActive = link.dataset.nav === currentId;

            link.classList.toggle("is-active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0
      }
    );

    sections.forEach(section => sectionObserver.observe(section));
  }


  /* =======================================================
     5. ACORDEONES
  ======================================================= */

  $$(".accordion").forEach(accordion => {
    const triggers = $$(".accordion-trigger", accordion);

    triggers.forEach(trigger => {
      const panel = trigger.nextElementSibling;

      if (!panel) return;

      trigger.setAttribute("aria-expanded", "false");

      trigger.addEventListener("click", () => {
        const wasOpen = trigger.classList.contains("is-open");

        triggers.forEach(otherTrigger => {
          const otherPanel = otherTrigger.nextElementSibling;

          otherTrigger.classList.remove("is-open");
          otherTrigger.setAttribute("aria-expanded", "false");

          if (otherPanel) {
            otherPanel.style.maxHeight = null;
          }
        });

        if (!wasOpen) {
          trigger.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
          panel.style.maxHeight = `${panel.scrollHeight}px`;
        }
      });
    });
  });


  /* =======================================================
     6. PESTAÑAS / TABS
  ======================================================= */

  $$(".tab-group").forEach(group => {
    const buttons = $$(".tab-btn", group);
    const panels = $$(".tab-panel", group);

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        const target = button.dataset.tab;

        buttons.forEach(item => {
          const active = item === button;

          item.classList.toggle("is-active", active);
          item.setAttribute("aria-selected", String(active));
        });

        panels.forEach(panel => {
          const active = panel.dataset.panel === target;

          panel.classList.toggle("is-active", active);
          panel.hidden = !active;
        });
      });
    });
  });


  /* =======================================================
     7. TARJETAS MITO / REALIDAD
  ======================================================= */

  $$(".flip-card").forEach(card => {
    const toggleCard = () => {
      const flipped = card.classList.toggle("is-flipped");

      card.setAttribute("aria-pressed", String(flipped));
    };

    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");

    card.addEventListener("click", toggleCard);

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleCard();
      }
    });
  });


  /* =======================================================
     8. STEPPER — CUATRO PASOS
  ======================================================= */

  $$(".stepper").forEach(stepper => {
    const dots = $$(".stepper-dot", stepper);
    const panels = $$(".stepper-panel", stepper);
    const fill = $(".stepper-line span", stepper);

    if (!dots.length || !panels.length) return;

    const goToStep = step => {
      const stepValue = String(step);

      dots.forEach(dot => {
        const active = dot.dataset.step === stepValue;

        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", active ? "step" : "false");
      });

      panels.forEach(panel => {
        const active = panel.dataset.panel === stepValue;

        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });

      if (fill) {
        const percentage = (Number(step) / dots.length) * 100;
        fill.style.width = `${percentage}%`;
      }
    };

    dots.forEach(dot => {
      dot.addEventListener("click", () => {
        goToStep(dot.dataset.step);
      });
    });

    const firstStep = dots[0].dataset.step || "1";
    goToStep(firstStep);
  });


  /* =======================================================
     9. GRÁFICOS DE BARRAS
  ======================================================= */

  const barCharts = $$(".bar-chart");

  const animateChart = chart => {
    $$(".bar-fill", chart).forEach(bar => {
      const value = Number(bar.dataset.value);

      if (!Number.isFinite(value)) return;

      const safeValue = Math.min(100, Math.max(0, value));

      bar.style.width = `${safeValue}%`;
    });
  };

  if ("IntersectionObserver" in window) {
    const chartObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forforEach(entry => {
          if (!entry.isIntersecting) return;

          animateChart(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.25 }
    );

    barCharts.forEach(chart => chartObserver.observe(chart));
  } else {
    barCharts.forEach(animateChart);
  }


  /* =======================================================
     10. CARRUSEL
  ======================================================= */

  const track = $("#carouselTrack");
  const prevButton = $("#carouselPrev");
  const nextButton = $("#carouselNext");
  const dotsContainer = $("#carouselDots");

  if (track) {
    const slides = Array.from(track.children).filter(slide =>
      slide.classList.contains("slide")
    );

    if (slides.length) {
      let autoplay = null;
      let currentSlide = 0;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const scrollToSlide = index => {
        currentSlide = Math.max(0, Math.min(slides.length - 1, index));

        const slide = slides[currentSlide];

        track.scrollTo({
          left: slide.offsetLeft - track.offsetLeft,
          behavior: prefersReducedMotion ? "auto" : "smooth"
        });

        updateDots();
      };

      const updateDots = () => {
        if (!dotsContainer) return;

        Array.from(dotsContainer.children).forEach((dot, index) => {
          const active = index === currentSlide;

          dot.classList.toggle("is-active", active);
          dot.setAttribute("aria-current", active ? "true" : "false");
        });
      };

      if (dotsContainer) {
        dotsContainer.innerHTML = "";

        slides.forEach((_, index) => {
          const dot = document.createElement("button");

          dot.type = "button";
          dot.setAttribute(
            "aria-label",
            `Ir a la diapositiva ${index + 1}`
          );

          dot.addEventListener("click", () => {
            stopAutoplay();
            scrollToSlide(index);
          });

          dotsContainer.appendChild(dot);
        });
      }

      const getCurrentSlide = () => {
        const center = track.scrollLeft + track.clientWidth / 2;

        let closestIndex = 0;
        let smallestDistance = Infinity;

        slides.forEach((slide, index) => {
          const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
          const distance = Math.abs(slideCenter - center);

          if (distance < smallestDistance) {
            smallestDistance = distance;
            closestIndex = index;
          }
        });

        return closestIndex;
      };

      const stopAutoplay = () => {
        if (autoplay) {
          window.clearInterval(autoplay);
          autoplay = null;
        }
      };

      const startAutoplay = () => {
        stopAutoplay();

        if (prefersReducedMotion || slides.length <= 1) return;

        autoplay = window.setInterval(() => {
          const nextIndex = (getCurrentSlide() + 1) % slides.length;
          scrollToSlide(nextIndex);
        }, 5000);
      };

      if (prevButton) {
        prevButton.addEventListener("click", () => {
          stopAutoplay();
          scrollToSlide(getCurrentSlide() - 1);
        });
      }

      if (nextButton) {
        nextButton.addEventListener("click", () => {
          stopAutoplay();
          scrollToSlide(getCurrentSlide() + 1);
        });
      }

      track.addEventListener(
        "scroll",
        () => {
          currentSlide = getCurrentSlide();
          updateDots();
        },
        { passive: true }
      );

      track.addEventListener("mouseenter", stopAutoplay);
      track.addEventListener("mouseleave", startAutoplay);
      track.addEventListener("focusin", stopAutoplay);
      track.addEventListener("focusout", startAutoplay);
      track.addEventListener("touchstart", stopAutoplay, { passive: true });

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
      });

      updateDots();
      startAutoplay();
    }
  }


  /* =======================================================
     11. BOTÓN VOLVER ARRIBA
  ======================================================= */

  const backToTop = $("#backToTop");

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth"
      });
    });
  }


  /* =======================================================
     12. AÑO AUTOMÁTICO
     Añade id="currentYear" en el footer si quieres usarlo.
  ======================================================= */

  const currentYear = $("#currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  /* =======================================================
     13. ESTADO DE CARGA
  ===================================================== */

  document.documentElement.classList.add("js-ready");

  console.info("FuturoLab EC: interactividad cargada correctamente.");
});

const chartObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      animateChart(entry.target);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.25 }
);
