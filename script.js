document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const header = document.getElementById("siteHeader");

  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");

  const navLinks = document.querySelectorAll(".site-nav a");

  const revealElements = document.querySelectorAll(".reveal");

  const faqItems = document.querySelectorAll(".faq-item");

  /* =========================
     LOADER
  ========================= */

  window.addEventListener(
    "load",
    () => {
      window.setTimeout(() => {
        loader?.classList.add("hide");
      }, 320);
    },
    { once: true },
  );

  /* =========================
     HEADER SCROLL
  ========================= */

  const handleHeader = () => {
    if (!header) return;

    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  handleHeader();

  window.addEventListener("scroll", handleHeader, {
    passive: true,
  });

  /* =========================
     MOBILE MENU
  ========================= */

  const closeMenu = () => {
    if (!siteNav || !menuToggle) return;

    siteNav.classList.remove("active");

    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    if (!siteNav || !menuToggle) return;

    siteNav.classList.add("active");

    document.body.classList.add("menu-open");

    menuToggle.setAttribute("aria-expanded", "true");
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

      const clickedInsideNav = siteNav.contains(target);

      const clickedToggle = menuToggle.contains(target);

      if (!clickedInsideNav && !clickedToggle) {
        closeMenu();
      }
    });
  }

  /* =========================
     REVEAL ANIMATION
  ========================= */

  if ("IntersectionObserver" in window) {
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
        rootMargin: "0px 0px -60px 0px",
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* =========================
     FAQ ACCORDION
  ========================= */

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");

    if (!button) return;

    button.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((faq) => {
        faq.classList.remove("active");

        const faqButton = faq.querySelector(".faq-question");

        faqButton?.setAttribute("aria-expanded", "false");
      });

      if (!isActive) {
        item.classList.add("active");

        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* =========================
     PARALLAX SUAVE HERO
  ========================= */

  const hero = document.querySelector(".hero__bg");

  const handleParallax = () => {
    if (!hero) return;

    const scrollY = window.scrollY;

    hero.style.transform = `translateY(${scrollY * 0.08}px)`;
  };

  window.addEventListener("scroll", handleParallax, {
    passive: true,
  });

  /* =========================
     SAFE IMAGE FADE
  ========================= */

  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      img.addEventListener(
        "load",
        () => {
          img.classList.add("loaded");
        },
        { once: true },
      );
    }
  });
});
