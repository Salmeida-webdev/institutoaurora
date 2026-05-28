document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");
  const navLinks = document.querySelectorAll(".site-nav a");
  const revealElements = document.querySelectorAll(".reveal");
  const faqItems = document.querySelectorAll(".faq-item");
  const heroBg = document.querySelector(".hero__bg");
  const whatsappFloat = document.querySelector(".whatsapp-float");
  const heroSection = document.querySelector(".hero");

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersReducedMotion = () => motionQuery.matches;

  const isMobile = () => window.innerWidth <= 640;
  const canUseMotion = () => !prefersReducedMotion() && !isMobile();
  const canUseParallax = () =>
    !prefersReducedMotion() && window.innerWidth >= 1024;

  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add("hide");
  };

  const revealImmediately = () => {
    revealElements.forEach((element) => {
      element.classList.add("visible");
      element.style.transitionDelay = "0ms";
    });
  };

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

  const handleHeader = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 20);
  };

  const handleWhatsappVisibility = () => {
    if (!whatsappFloat) return;

    const heroHeight = heroSection
      ? heroSection.offsetHeight
      : window.innerHeight * 0.82;

    whatsappFloat.classList.toggle(
      "is-visible",
      window.scrollY > heroHeight * 0.72,
    );
  };

  const handleParallax = () => {
    if (!heroBg) return;

    if (!canUseParallax()) {
      heroBg.style.transform = "";
      return;
    }

    const offset = Math.min(window.scrollY * 0.045, 36);
    heroBg.style.transform = `translate3d(0, ${offset}px, 0)`;
  };

  const handleScrollWork = () => {
    handleHeader();
    handleWhatsappVisibility();
    handleParallax();
  };

  let scrollTicking = false;

  const onScroll = () => {
    if (scrollTicking) return;

    scrollTicking = true;

    window.requestAnimationFrame(() => {
      handleScrollWork();
      scrollTicking = false;
    });
  };

  window.addEventListener(
    "load",
    () => {
      window.requestAnimationFrame(() => {
        setTimeout(hideLoader, 80);
      });
    },
    { once: true },
  );

  setTimeout(hideLoader, 1100);

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.contains("active");
      isOpen ? closeMenu() : openMenu();
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof Element)) return;
      if (!siteNav.classList.contains("active")) return;

      const clickedInsideMenu = siteNav.contains(target);
      const clickedToggle = menuToggle.contains(target);

      if (!clickedInsideMenu && !clickedToggle) closeMenu();
    });
  }

  if ("IntersectionObserver" in window && canUseMotion()) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const section = entry.target.closest("section");
          const sectionReveals = section
            ? Array.from(section.querySelectorAll(".reveal"))
            : Array.from(revealElements);

          const index = sectionReveals.indexOf(entry.target);
          const delay = Math.min(Math.max(index, 0) * 70, 280);

          entry.target.style.transitionDelay = `${delay}ms`;
          entry.target.classList.add("visible");

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -56px 0px",
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealImmediately();
  }

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");

    if (!button) return;

    button.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((faq) => {
        const faqButton = faq.querySelector(".faq-question");

        faq.classList.remove("active");
        faqButton?.setAttribute("aria-expanded", "false");
      });

      if (!isActive) {
        item.classList.add("active");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

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

  let resizeTimer;

  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 920) closeMenu();

        if (!canUseParallax() && heroBg) {
          heroBg.style.transform = "";
        }

        if (!canUseMotion()) {
          revealImmediately();
        }

        handleWhatsappVisibility();
      }, 120);
    },
    { passive: true },
  );

  const handleMotionChange = () => {
    if (!prefersReducedMotion()) return;

    revealImmediately();

    if (heroBg) {
      heroBg.style.transform = "";
    }
  };

  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", handleMotionChange);
  } else if (typeof motionQuery.addListener === "function") {
    motionQuery.addListener(handleMotionChange);
  }

  handleScrollWork();

  window.addEventListener("scroll", onScroll, { passive: true });
});
