document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");
  const navLinks = document.querySelectorAll(".site-nav a");
  const revealElements = document.querySelectorAll(".reveal");
  const faqItems = document.querySelectorAll(".faq-item");
  const heroBg = document.querySelector(".hero__bg");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const isMobile = () => window.innerWidth <= 640;

  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add("hide");
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

  setTimeout(hideLoader, 1200);

  const handleHeader = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 20);
  };

  handleHeader();

  let headerTicking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (headerTicking) return;

      headerTicking = true;

      window.requestAnimationFrame(() => {
        handleHeader();
        headerTicking = false;
      });
    },
    { passive: true },
  );

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

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
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

      const clickedInsideMenu = siteNav.contains(target);
      const clickedToggle = menuToggle.contains(target);

      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
      }
    });
  }

  const revealImmediately = () => {
    revealElements.forEach((element) => {
      element.classList.add("visible");
      element.style.transitionDelay = "0ms";
    });
  };

  if (
    "IntersectionObserver" in window &&
    !prefersReducedMotion &&
    !isMobile()
  ) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -48px 0px",
      },
    );

    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index * 28, 180)}ms`;
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

  let parallaxTicking = false;

  const handleParallax = () => {
    if (!heroBg || prefersReducedMotion || window.innerWidth < 1024) return;

    if (parallaxTicking) return;

    parallaxTicking = true;

    window.requestAnimationFrame(() => {
      const offset = Math.min(window.scrollY * 0.045, 36);
      heroBg.style.transform = `translate3d(0, ${offset}px, 0)`;
      parallaxTicking = false;
    });
  };

  window.addEventListener("scroll", handleParallax, { passive: true });

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
        if (window.innerWidth > 920) {
          closeMenu();
        }

        if (window.innerWidth < 1024 && heroBg) {
          heroBg.style.transform = "";
        }
      }, 120);
    },
    { passive: true },
  );
});
