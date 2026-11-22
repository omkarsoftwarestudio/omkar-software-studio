/* ==========================================================================
   Omkar Software Studio — main.js
   Vanilla JavaScript only. Every feature is initialised after the DOM loads.
   ========================================================================== */
(function () {
  "use strict";

  var reducedMotionQuery = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  var reducedMotion = reducedMotionQuery ? reducedMotionQuery.matches : false;

  /* ------------------------------------------------------------------
     1. Dark mode (localStorage is wrapped in try/catch for private mode)
     ------------------------------------------------------------------ */
  function readStoredTheme() {
    try {
      return window.localStorage.getItem("oe-theme");
    } catch (error) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      window.localStorage.setItem("oe-theme", theme);
    } catch (error) {
      /* Storage unavailable — the theme still works for this page view. */
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      var label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
      toggle.setAttribute("aria-label", label);
      toggle.setAttribute("title", label);
    }
  }

  function initTheme() {
    var stored = readStoredTheme();
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(stored === "dark" || stored === "light" ? stored : (prefersDark ? "dark" : "light"));

    var toggle = document.querySelector(".theme-toggle");
    if (!toggle) {
      return;
    }
    toggle.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      storeTheme(next);
    });
  }

  /* ------------------------------------------------------------------
     2. Mobile menu and dropdowns
     ------------------------------------------------------------------ */
  function isMenuOpen(nav) {
    return Boolean(nav && nav.classList.contains("nav--open"));
  }

  function setDropdown(item, open) {
    if (!item) {
      return;
    }
    item.classList.toggle("nav__item--expanded", open);
    var button = item.querySelector(".nav__subtoggle");
    if (button) {
      button.setAttribute("aria-expanded", String(open));
    }
  }

  function closeAllDropdowns(except) {
    document.querySelectorAll(".nav__item").forEach(function (item) {
      if (item !== except) {
        setDropdown(item, false);
      }
    });
  }

  function getFocusableInNav(nav, closeButton) {
    var elements = Array.prototype.slice.call(nav.querySelectorAll("a[href], button:not([disabled])"));
    return elements.filter(function (element) {
      return element === closeButton || element.offsetParent !== null;
    });
  }

  function closeMobileMenu(restoreFocus, force) {
    var nav = document.querySelector(".nav");
    var toggle = document.querySelector(".nav-toggle");
    if (!nav || (!isMenuOpen(nav) && !force)) {
      return;
    }
    nav.classList.remove("nav--open");
    document.body.classList.remove("menu-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
    closeAllDropdowns();
    if (restoreFocus && toggle) {
      toggle.focus();
    }
  }

  function initMobileMenu() {
    var nav = document.querySelector(".nav");
    var toggle = document.querySelector(".nav-toggle");
    var closeButton = document.querySelector(".nav__close");
    var desktopQuery = window.matchMedia && window.matchMedia("(min-width: 1024px)");
    if (!nav || !toggle) {
      return;
    }

    function openMenu() {
      if (desktopQuery && desktopQuery.matches) {
        return;
      }
      nav.classList.add("nav--open");
      document.body.classList.add("menu-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      closeAllDropdowns();
      window.setTimeout(function () {
        (closeButton || nav.querySelector("a[href]") || toggle).focus();
      }, 0);
    }

    toggle.addEventListener("click", function () {
      if (isMenuOpen(nav)) {
        closeMobileMenu(true);
      } else {
        openMenu();
      }
    });

    if (closeButton) {
      closeButton.addEventListener("click", function () {
        closeMobileMenu(true);
      });
    }

    document.querySelectorAll(".nav__subtoggle").forEach(function (button) {
      button.addEventListener("click", function () {
        var item = button.closest(".nav__item");
        if (!item) {
          return;
        }
        var open = button.getAttribute("aria-expanded") !== "true";
        closeAllDropdowns(item);
        setDropdown(item, open);
      });
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMobileMenu(false);
      });
    });

    document.addEventListener("click", function (event) {
      if (isMenuOpen(nav) && !nav.contains(event.target) && !toggle.contains(event.target)) {
        closeMobileMenu(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (!isMenuOpen(nav)) {
        return;
      }
      if (event.key === "Escape") {
        var openItem = document.querySelector(".nav__item--expanded");
        if (openItem) {
          setDropdown(openItem, false);
          var subtoggle = openItem.querySelector(".nav__subtoggle");
          if (subtoggle) {
            subtoggle.focus();
          }
        } else {
          closeMobileMenu(true);
        }
        return;
      }
      if (event.key === "Tab") {
        var focusable = getFocusableInNav(nav, closeButton);
        if (!focusable.length) {
          return;
        }
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    function onDesktopChange(event) {
      if (event.matches) {
        closeMobileMenu(false, true);
      }
    }

    if (desktopQuery && desktopQuery.addEventListener) {
      desktopQuery.addEventListener("change", onDesktopChange);
    } else if (desktopQuery && desktopQuery.addListener) {
      desktopQuery.addListener(onDesktopChange);
    }
  }

  /* ------------------------------------------------------------------
     3. Sticky header, active links and back-to-top visibility
     ------------------------------------------------------------------ */
  function currentFileName() {
    var path = window.location.pathname.split("/").pop();
    return !path || path === "" ? "index.html" : decodeURIComponent(path).toLowerCase();
  }

  function linkFileName(link) {
    try {
      var path = new URL(link.getAttribute("href") || "", window.location.href).pathname.split("/").pop();
      return !path || path === "" ? "index.html" : decodeURIComponent(path).toLowerCase();
    } catch (error) {
      var fallback = (link.getAttribute("href") || "").split("?")[0].split("#")[0].split("/").pop();
      return !fallback ? "index.html" : fallback.toLowerCase();
    }
  }

  function initNavigationState() {
    var current = currentFileName();

    document.querySelectorAll(".nav__link, .nav__sublink").forEach(function (link) {
      var linkName = linkFileName(link);
      if (linkName === current || (current === "" && linkName === "index.html")) {
        link.classList.add(link.classList.contains("nav__sublink") ? "nav__sublink--active" : "nav__link--active");
        link.setAttribute("aria-current", "page");
        var parent = link.closest(".nav__item");
        if (parent && link.classList.contains("nav__sublink")) {
          var parentLink = parent.querySelector(".nav__link");
          if (parentLink) {
            parentLink.classList.add("nav__link--active");
          }
        }
      }
    });

    var ticking = false;
    function updateScrollState() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      var header = document.querySelector(".site-header");
      var top = document.querySelector(".back-to-top");
      if (header) {
        header.classList.toggle("site-header--scrolled", y > 12);
      }
      if (top) {
        top.classList.toggle("back-to-top--visible", y > 400);
      }
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    }, { passive: true });
    updateScrollState();
  }

  function initBackToTop() {
    var button = document.querySelector(".back-to-top");
    if (!button) {
      return;
    }
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  /* ------------------------------------------------------------------
     4. Scroll-reveal animations
     ------------------------------------------------------------------ */
  function initReveal() {
    var elements = document.querySelectorAll(".reveal");
    if (!elements.length) {
      return;
    }
    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach(function (element) {
        element.classList.add("reveal--visible");
      });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    elements.forEach(function (element) {
      observer.observe(element);
    });
  }

  /* ------------------------------------------------------------------
     5. Animated counters
     ------------------------------------------------------------------ */
  function animateCounter(element) {
    var target = parseInt(element.getAttribute("data-counter"), 10);
    var suffix = element.getAttribute("data-counter-suffix") || "";
    if (isNaN(target) || reducedMotion) {
      element.textContent = (isNaN(target) ? "0" : target) + suffix;
      return;
    }
    var start = null;
    var duration = 1600;
    function step(timestamp) {
      if (!start) {
        start = timestamp;
      }
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = target + suffix;
      }
    }
    window.requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) {
      return;
    }
    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  /* ------------------------------------------------------------------
     6. Testimonial slider (dots, autoplay, pause on hover / focus)
     ------------------------------------------------------------------ */
  function initTestimonials() {
    var slider = document.querySelector(".testimonials");
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".testimonial__slide"));
    var dotsContainer = slider.querySelector(".testimonial__dots");
    var rating = slider.querySelector(".testimonial__rating");

    slider.classList.toggle("testimonials--single", slides.length < 2);

    if (rating) {
      var rawRating = (rating.getAttribute("data-rating") || "").trim();
      var ratingMatch = rawRating.match(/^(\d+(?:\.\d+)?)(?:\/5)?$/);
      var stars = rating.querySelector(".testimonial__rating-stars");
      var ratingValue = rating.querySelector(".testimonial__rating-value");
      if (ratingMatch && stars && ratingValue) {
        var score = Math.max(0, Math.min(5, Number(ratingMatch[1])));
        var filledStars = Math.round(score);
        stars.textContent = new Array(filledStars + 1).join("★") + new Array(6 - filledStars).join("☆");
        ratingValue.textContent = score + "/5";
        rating.setAttribute("aria-label", "Client rating: " + score + "/5");
      }
    }

    if (slides.length < 2 || !dotsContainer) {
      return;
    }

    var index = 0;
    var timer = null;
    var interval = 6500;
    var autoplay = slider.getAttribute("data-autoplay") !== "false";

    slides.forEach(function (slide, i) {
      slide.hidden = i !== 0;
    });

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "testimonial__dot";
      dot.setAttribute("aria-label", "Show testimonial " + (i + 1) + " of " + slides.length);
      dot.setAttribute("aria-pressed", String(i === 0));
      if (i === 0) {
        dot.classList.add("testimonial__dot--active");
      }
      dot.addEventListener("click", function () {
        show(i);
        stop();
        start();
      });
      dotsContainer.appendChild(dot);
    });

    var dots = Array.prototype.slice.call(dotsContainer.querySelectorAll(".testimonial__dot"));

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.hidden = i !== index;
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("testimonial__dot--active", i === index);
        dot.setAttribute("aria-pressed", String(i === index));
      });
    }

    function start() {
      if (!autoplay || reducedMotion || timer) {
        return;
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, interval);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusin", stop);
    slider.addEventListener("focusout", start);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    });

    start();
  }

  /* ------------------------------------------------------------------
     7. FAQ accordion
     ------------------------------------------------------------------ */
  function initFaq() {
    var questions = document.querySelectorAll(".faq__question");
    questions.forEach(function (question) {
      question.addEventListener("click", function () {
        var item = question.closest(".faq__item");
        if (!item) {
          return;
        }
        var isOpen = question.getAttribute("aria-expanded") === "true";
        document.querySelectorAll(".faq__item").forEach(function (other) {
          other.classList.remove("faq__item--open");
          var otherButton = other.querySelector(".faq__question");
          if (otherButton) {
            otherButton.setAttribute("aria-expanded", "false");
          }
        });
        if (!isOpen) {
          item.classList.add("faq__item--open");
          question.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     8. Contact form validation and success state

     Form submissions should go to omkarenterprises1330@gmail.com.
     To connect this form to a backend:
     - Formspree: set the form's action to your Formspree endpoint and method="POST",
       then let the library-free fallback submit normally.
     - EmailJS: include their SDK, and inside the success branch below send the
       payload with your service and template IDs before showing the success message.
     Until a backend is connected, submission is intercepted and only validated
     locally so the page never breaks or reloads.
     ------------------------------------------------------------------ */
  function initContactForm() {
    var form = document.querySelector("#contact-form");
    if (!form) {
      return;
    }

    var rules = {
      name: function (value) {
        if (!value.trim()) {
          return "Please enter your name.";
        }
        if (value.trim().length < 2) {
          return "Please enter at least 2 characters.";
        }
        return "";
      },
      email: function (value) {
        if (!value.trim()) {
          return "Please enter your email address.";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) {
          return "Please enter a valid email address.";
        }
        return "";
      },
      phone: function (value) {
        if (!value.trim()) {
          return "";
        }
        if (!/^[+\d][\d\s()-]{6,}$/.test(value.trim())) {
          return "Please enter a valid phone number or leave this blank.";
        }
        return "";
      },
      service: function (value) {
        return value ? "" : "Please choose a service.";
      },
      budget: function (value) {
        return value ? "" : "Please choose a budget range.";
      },
      message: function (value) {
        if (!value.trim()) {
          return "Please tell us about your project.";
        }
        if (value.trim().length < 10) {
          return "Please write at least 10 characters.";
        }
        return "";
      }
    };

    function showError(field, message) {
      var error = document.getElementById(field.name + "-error");
      if (error) {
        error.textContent = message;
      }
      field.classList.toggle("form-input--error", Boolean(message));
      field.setAttribute("aria-invalid", String(Boolean(message)));
    }

    function validateField(field) {
      var rule = rules[field.name];
      if (!rule) {
        return true;
      }
      var message = rule(field.value);
      showError(field, message);
      return message === "";
    }

    Object.keys(rules).forEach(function (name) {
      var field = form.elements[name];
      if (!field) {
        return;
      }
      field.addEventListener("blur", function () {
        validateField(field);
      });
      field.addEventListener("input", function () {
        if (field.classList.contains("form-input--error")) {
          validateField(field);
        }
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var valid = true;
      var firstInvalid = null;

      Object.keys(rules).forEach(function (name) {
        var field = form.elements[name];
        if (field && !validateField(field)) {
          valid = false;
          if (!firstInvalid) {
            firstInvalid = field;
          }
        }
      });

      if (!valid) {
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      /* Connect a backend here (see the Formspree / EmailJS note above). */
      var success = document.querySelector(".form-success");
      if (success) {
        success.classList.add("form-success--visible");
        success.setAttribute("role", "status");
        success.focus();
      }
      form.reset();
      Object.keys(rules).forEach(function (name) {
        showError(form.elements[name], "");
      });
    });
  }

  /* ------------------------------------------------------------------
     9. Footer year
     ------------------------------------------------------------------ */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (element) {
      element.textContent = String(new Date().getFullYear());
    });
  }

  /* ------------------------------------------------------------------
     Bootstrap
     ------------------------------------------------------------------ */
  function init() {
    function onMotionChange(event) {
      reducedMotion = event.matches;
      if (reducedMotion) {
        document.querySelectorAll(".reveal").forEach(function (element) {
          element.classList.add("reveal--visible");
        });
      }
    }

    if (reducedMotionQuery && reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener("change", onMotionChange);
    } else if (reducedMotionQuery && reducedMotionQuery.addListener) {
      reducedMotionQuery.addListener(onMotionChange);
    }

    document.body.classList.remove("menu-open");
    initTheme();
    initMobileMenu();
    initNavigationState();
    initBackToTop();
    initReveal();
    initCounters();
    initTestimonials();
    initFaq();
    initContactForm();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
