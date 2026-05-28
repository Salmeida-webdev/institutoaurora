document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");
  const navLinks = document.querySelectorAll(".site-nav a");
  const revealElements = document.querySelectorAll(".reveal");
  const faqItems = document.querySelectorAll(".faq-item");
  const heroBg = document.querySelector(".hero__bg");
  const heroLights = document.querySelectorAll(".hero__light");
  const whatsappFloat = document.querySelector(".whatsapp-float");
  const heroSection = document.querySelector(".hero");

  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  const prefersReducedMotion = () => reducedMotionQuery.matches;

  const isMobile = () => window.innerWidth <= 640;

  const canUseMotion = () => !prefersReducedMotion() && !isMobile();

  const canUseParallax = () =>
    !prefersReducedMotion() && window.innerWidth >= 1180;

  /* =========================
     Loader
  ========================= */

  const hideLoader = () => {
    if (!loader) return;

    loader.classList.add("hide");
  };

  window.addEventListener(
    "load",
    () => {
      requestAnimationFrame(() => {
        setTimeout(hideLoader, 60);
      });
    },
    { once: true },
  );

  setTimeout(hideLoader, 900);

  /* =========================
     Mobile Menu
  ========================= */

  const closeMenu = () => {
    if (!siteNav || !menuToggle) return;

    siteNav.classList.remove("active");

    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.setAttribute("aria-label", "Abrir menu");
  };

  const openMenu = () => {
    if (!siteNav || !menuToggle) return;

    siteNav.classList.add("active");

    document.body.classList.add("menu-open");

    menuToggle.setAttribute("aria-expanded", "true");

    menuToggle.setAttribute("aria-label", "Fechar menu");
  };

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.contains("active");

      isOpen ? closeMenu() : openMenu();
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      if (!siteNav.classList.contains("active")) return;

      const clickedMenu = siteNav.contains(target);

      const clickedToggle = menuToggle.contains(target);

      if (!clickedMenu && !clickedToggle) {
        closeMenu();
      }
    });
  }

  /* =========================
     Header State
  ========================= */

  const handleHeader = () => {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 18);
  };

  /* =========================
     WhatsApp Reveal
  ========================= */

  const handleWhatsappReveal = () => {
    if (!whatsappFloat) return;

    const heroHeight = heroSection
      ? heroSection.offsetHeight
      : window.innerHeight * 0.85;

    const shouldShow = window.scrollY > heroHeight * 0.68;

    whatsappFloat.classList.toggle("is-visible", shouldShow);
  };

  /* =========================
     Cinematic Parallax
  ========================= */

  const handleParallax = () => {
    if (!canUseParallax()) {
      if (heroBg) {
        heroBg.style.transform = "";
      }

      heroLights.forEach((light) => {
        light.style.transform = "";
      });

      return;
    }

    const scrollY = window.scrollY;

    if (heroBg) {
      const offset = Math.min(scrollY * 0.028, 32);

      heroBg.style.transform = `translate3d(0, ${offset}px, 0)`;
    }

    heroLights.forEach((light, index) => {
      const speed = index === 0 ? 0.014 : 0.02;

      const offset = scrollY * speed;

      light.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  };

  /* =========================
     RAF Scroll Optimization
  ========================= */

  const handleScrollEffects = () => {
    handleHeader();

    handleWhatsappReveal();

    handleParallax();
  };

  let scrollTicking = false;

  const onScroll = () => {
    if (scrollTicking) return;

    scrollTicking = true;

    requestAnimationFrame(() => {
      handleScrollEffects();

      scrollTicking = false;
    });
  };

  /* =========================
     Reveal Animation
  ========================= */

  const revealImmediately = () => {
    revealElements.forEach((element) => {
      element.classList.add("visible");

      element.style.transitionDelay = "0ms";
    });
  };

  if ("IntersectionObserver" in window && canUseMotion()) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const section = entry.target.closest("section");

          const reveals = section
            ? Array.from(section.querySelectorAll(".reveal"))
            : Array.from(revealElements);

          const index = reveals.indexOf(entry.target);

          const stagger = Math.min(Math.max(index, 0) * 52, 180);

          entry.target.style.transitionDelay = `${stagger}ms`;

          entry.target.classList.add("visible");

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealImmediately();
  }

  /* =========================
     FAQ Accordion
  ========================= */

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");

    if (!button) return;

    button.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((faq) => {
        faq.classList.remove("active");

        faq
          .querySelector(".faq-question")
          ?.setAttribute("aria-expanded", "false");
      });

      if (!isActive) {
        item.classList.add("active");

        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* =========================
     Image Loaded State
  ========================= */

  document.querySelectorAll("img").forEach((img) => {
    if (img.complete) {
      img.classList.add("loaded");

      return;
    }

    img.addEventListener(
      "load",
      () => {
        img.classList.add("loaded");
      },
      { once: true },
    );

    img.addEventListener(
      "error",
      () => {
        img.classList.add("loaded");
      },
      { once: true },
    );
  });

  /* =========================
     Resize Optimization
  ========================= */

  let resizeTimer;

  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 920) {
          closeMenu();
        }

        handleWhatsappReveal();

        if (!canUseParallax()) {
          if (heroBg) {
            heroBg.style.transform = "";
          }

          heroLights.forEach((light) => {
            light.style.transform = "";
          });
        }

        if (!canUseMotion()) {
          revealImmediately();
        }
      }, 120);
    },
    { passive: true },
  );

  /* =========================
     Reduced Motion
  ========================= */

  const handleMotionChange = () => {
    if (!prefersReducedMotion()) return;

    revealImmediately();

    if (heroBg) {
      heroBg.style.transform = "";
    }

    heroLights.forEach((light) => {
      light.style.transform = "";
    });
  };

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", handleMotionChange);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(handleMotionChange);
  }

  /* =========================
     Init
  ========================= */

  handleScrollEffects();

  window.addEventListener("scroll", onScroll, {
    passive: true,
  });
});
