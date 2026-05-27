document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");
  const navLinks = document.querySelectorAll(".site-nav a");
  const revealElements = document.querySelectorAll(".reveal");
  const faqItems = document.querySelectorAll(".faq-item");
  const heroBg = document.querySelector(".hero__bg");

  window.addEventListener(
    "load",
    () => {
      setTimeout(() => loader?.classList.add("hide"), 320);
    },
    { once: true },
  );

  const handleHeader = () => {
    header?.classList.toggle("scrolled", window.scrollY > 20);
  };

  handleHeader();
  window.addEventListener("scroll", handleHeader, { passive: true });

  const closeMenu = () => {
    siteNav?.classList.remove("active");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  };

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.contains("active");
      siteNav.classList.toggle("active", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      if (!siteNav.contains(target) && !menuToggle.contains(target)) {
        closeMenu();
      }
    });
  }

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

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

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

  let ticking = false;

  const handleParallax = () => {
    if (!heroBg || window.innerWidth < 768) return;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        heroBg.style.transform = `translateY(${window.scrollY * 0.08}px)`;
        ticking = false;
      });

      ticking = true;
    }
  };

  window.addEventListener("scroll", handleParallax, { passive: true });

  document.querySelectorAll("img").forEach((img) => {
    if (img.complete) {
      img.classList.add("loaded");
      return;
    }

    img.addEventListener("load", () => img.classList.add("loaded"), {
      once: true,
    });
  });
});
