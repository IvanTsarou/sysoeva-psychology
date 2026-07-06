(function () {
  "use strict";

  const STORAGE_KEY = "landing-lang";
  const DEFAULT_LANG = "ru";

  function getLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && window.I18N && window.I18N[stored]) return stored;
    return DEFAULT_LANG;
  }

  function setLang(lang) {
    if (!window.I18N || !window.I18N[lang]) return;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const text = window.I18N[lang][key];
      if (text != null) el.textContent = text;
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      const text = window.I18N[lang][key];
      if (text != null) el.setAttribute("alt", text);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const text = window.I18N[lang][key];
      if (text != null) el.setAttribute("placeholder", text);
    });

    const titleEl = document.querySelector("title[data-i18n]");
    if (titleEl) {
      const key = titleEl.getAttribute("data-i18n");
      const text = window.I18N[lang][key];
      if (text) document.title = text;
    }

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function initLangToggle() {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        setLang(btn.getAttribute("data-lang"));
      });
    });
    setLang(getLang());
  }

  function initMobileMenu() {
    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("main-nav");
    if (!toggle || !nav) return;

    const close = () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      nav.classList.toggle("is-open", !open);
      document.body.style.overflow = open ? "" : "hidden";
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", close);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) close();
    });
  }

  function initScrollHeader() {
    const header = document.getElementById("site-header");
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );

    items.forEach((el) => observer.observe(el));
  }

  function initContactForm() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");
    if (!form || !status) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.hidden = false;
      status.classList.remove("is-error");

      const lang = getLang();
      const strings = window.I18N[lang] || window.I18N.ru;

      if (!form.checkValidity()) {
        status.textContent = strings["form.error"];
        status.classList.add("is-error");
        form.reportValidity();
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      try {
        sessionStorage.setItem("demo-contact", JSON.stringify(data));
      } catch (_) {
        /* ignore */
      }

      status.textContent = strings["form.success"];
      form.reset();
    });
  }

  function init() {
    initLangToggle();
    initMobileMenu();
    initScrollHeader();
    initReveal();
    initContactForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
