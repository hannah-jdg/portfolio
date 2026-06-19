
// Set current year in footer and initialise small interactions
document.addEventListener("DOMContentLoaded", async () => {
  const yearTargets = document.querySelectorAll("[data-year]");
  const year = new Date().getFullYear();
  yearTargets.forEach((el) => {
    el.textContent = String(year);
  });

  const lenis = await setupSmoothScroll();

  setupNavToggle();
  setupCaseStudyScrollSpy(lenis);
  setupScrollReveal();
  setupAboutAccordion();
  setupHeroPhraseRotate();
  setupDreamHeroVideo();
  setupAboutPhotoStack();
  setupCustomCursor();
});

function setupNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const header = document.querySelector(".site-header");
  const panel = document.getElementById("site-nav-panel");
  if (!toggle || !header || !panel) return;

  function open() {
    header.classList.add("is-open");
    document.body.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }

  function close() {
    header.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  function isOpen() {
    return header.classList.contains("is-open");
  }

  toggle.addEventListener("click", () => {
    if (isOpen()) close();
    else open();
  });

  const overlayClose = header.querySelector(".nav-overlay-close");
  if (overlayClose) {
    overlayClose.addEventListener("click", () => close());
  }

  const panelCloseBtn = header.querySelector(".nav-overlay-close--in-panel");
  if (panelCloseBtn) {
    panelCloseBtn.addEventListener("click", () => close());
  }

  panel.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => close());
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) close();
  });
}

function setupAboutPhotoStack() {
  const stack = document.getElementById("about-photo-stack");
  if (!stack) return;
  const cards = stack.querySelectorAll(".about-hero-photo-card");
  if (cards.length !== 3) return;

  const IMAGES = [
    "images/hannah-contact.png",
    "images/aboutpage-img4.jpeg",
    "images/aboutpage-img3.jpeg",
  ];
  let currentIndex = 0;

  function updateCards() {
    cards.forEach((card, i) => {
      const imageIndex = (currentIndex + (2 - i) + 3) % 3;
      card.style.backgroundImage = `url("${IMAGES[imageIndex]}")`;
      card.setAttribute("data-showing", String(imageIndex));
    });
  }

  updateCards();

  function cycle() {
    currentIndex = (currentIndex + 1) % 3;
    updateCards();
  }

  stack.addEventListener("click", cycle);
  stack.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      cycle();
    }
  });
}

function setupHeroPhraseRotate() {
  const wrap = document.querySelector(".hero-phrase-wrap");
  const el = document.querySelector(".hero-phrase-rotate");
  const iconWrap = wrap?.querySelector(".hero-phrase-icon-wrap");
  const iconImg = iconWrap?.querySelector(".hero-phrase-icon");
  const heading = document.querySelector(".hero-heading");
  if (!wrap || !el) return;
  const raw = el.getAttribute("data-phrases");
  if (!raw) return;
  const phrases = raw.split(",").map((s) => s.trim());
  const cyclePhrases = phrases.slice(1);
  if (cyclePhrases.length < 2) return;

  const ICON_SOURCES = ["images/icon1.png", "images/icon2.png", "images/icon3.png"];
  const DURATION_MS = 600;
  const MOBILE_DURATION_MS = 1900;
  const MOBILE_START_DELAY_MS = 1000;
  const mobileQuery = window.matchMedia("(max-width: 720px)");
  let interval = null;
  let cycleIndex = 0;
  let mobileAutoStarted = false;

  function showPhrase(index) {
    el.textContent = phrases[index];
    if (index === 0) {
      wrap.classList.add("hero-phrase-hide-icon");
    } else {
      wrap.classList.remove("hero-phrase-hide-icon");
      if (iconImg && ICON_SOURCES[index % ICON_SOURCES.length]) {
        iconImg.src = ICON_SOURCES[index % ICON_SOURCES.length];
      }
    }
  }

  function showCycle() {
    el.textContent = cyclePhrases[cycleIndex];
    wrap.classList.remove("hero-phrase-hide-icon");
    if (iconImg && ICON_SOURCES[cycleIndex]) {
      iconImg.src = ICON_SOURCES[cycleIndex];
    }
  }

  function showDefault() {
    el.textContent = phrases[0];
    wrap.classList.add("hero-phrase-hide-icon");
  }

  function tick() {
    if (mobileQuery.matches && mobileAutoStarted) {
      cycleIndex = (cycleIndex + 1) % phrases.length;
      showPhrase(cycleIndex);
    } else {
      cycleIndex = (cycleIndex + 1) % cyclePhrases.length;
      showCycle();
    }
  }

  function start(isMobileAuto = false) {
    if (interval) return;
    wrap.classList.add("is-cycling");
    if (isMobileAuto) {
      mobileAutoStarted = true;
      cycleIndex = 0;
      showPhrase(0);
      interval = setInterval(tick, MOBILE_DURATION_MS);
    } else {
      cycleIndex = 0;
      showCycle();
      interval = setInterval(tick, DURATION_MS);
    }
  }

  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    wrap.classList.remove("is-cycling");
    showDefault();
    mobileAutoStarted = false;
  }

  wrap.classList.add("hero-phrase-hide-icon");

  const trigger = heading || wrap;
  trigger.addEventListener("mouseenter", () => {
    if (!mobileQuery.matches) start(false);
  });
  trigger.addEventListener("mouseleave", () => {
    if (!mobileQuery.matches) stop();
  });

  if (mobileQuery.matches) {
    setTimeout(() => start(true), MOBILE_START_DELAY_MS);
  }
  mobileQuery.addEventListener("change", (e) => {
    if (e.matches && !interval && !mobileAutoStarted) {
      setTimeout(() => start(true), MOBILE_START_DELAY_MS);
    }
  });
}

function setupAboutAccordion() {
  const triggers = document.querySelectorAll(".about-accordion-trigger");
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".about-accordion-item");
      const panel = document.getElementById(trigger.getAttribute("aria-controls"));
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      trigger.setAttribute("aria-expanded", !isOpen);
      item.classList.toggle("is-open", !isOpen);
      if (panel) panel.hidden = isOpen;
    });
  });
}

function setupCaseStudyScrollSpy(lenis) {
  const sidebarLinks = document.querySelectorAll(".case-sidebar-nav a[href^='#']");
  if (!sidebarLinks.length || typeof IntersectionObserver === "undefined") {
    return;
  }

  const sections = [];

  sidebarLinks.forEach((link) => {
    const id = link.getAttribute("href")?.slice(1);
    if (!id) return;
    const section = document.getElementById(id);
    if (section) {
      sections.push({ section, link });
      section.dataset.scrollSection = "true";
    }
  });

  if (!sections.length) return;

  let ignoreObserverUntil = 0;

  function setActiveLink(activeLink) {
    sidebarLinks.forEach((l) => l.classList.remove("is-active"));
    activeLink.classList.add("is-active");
  }

  const linkToSection = new Map(sections.map(({ section, link }) => [link, section]));

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const section = linkToSection.get(link);
      const id = link.getAttribute("href")?.slice(1);
      if (!section || !id) return;
      e.preventDefault();
      setActiveLink(link);
      ignoreObserverUntil = Date.now() + 900;
      if (lenis) {
        lenis.scrollTo(section, { offset: -96, duration: 1.1 });
      } else {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      history.replaceState(null, "", "#" + id);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      if (Date.now() < ignoreObserverUntil) return;
      entries.forEach((entry) => {
        const match = sections.find((item) => item.section === entry.target);
        if (!match) return;

        if (entry.isIntersecting) {
          setActiveLink(match.link);
        }
      });
    },
    {
      root: null,
      rootMargin: "-15% 0px -25% 0px",
      threshold: 0.1,
    }
  );

  sections.forEach(({ section }) => observer.observe(section));
}

/** Eased wheel scrolling for a softer, less abrupt page feel. Uses Lenis when available. */
async function setupSmoothScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }

  try {
    await loadExternalScript("https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js");
  } catch {
    return null;
  }

  if (typeof Lenis === "undefined") {
    return null;
  }

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.85,
    smoothTouch: false,
    touchMultiplier: 1.2,
  });

  function onLenisFrame(time) {
    lenis.raf(time);
    requestAnimationFrame(onLenisFrame);
  }
  requestAnimationFrame(onLenisFrame);

  return lenis;
}

function loadExternalScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
    document.head.appendChild(script);
  });
}

/** Gentle fade-up as key sections scroll into view. Respects reduced motion. */
function setupScrollReveal() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const selectors = [
    ".hero-intro",
    ".project-card",
    ".case-section",
    ".about-hero",
    ".work-page-hero",
    ".footer-content",
  ];

  const elements = [];
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add("scroll-reveal");
      elements.push(el);
    });
  });

  document.querySelectorAll(".project-card").forEach((card, index) => {
    card.style.setProperty("--reveal-delay", `${index * 0.08}s`);
  });

  if (!elements.length) return;

  if (reducedMotion || typeof IntersectionObserver === "undefined") {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.08,
    }
  );

  elements.forEach((el) => observer.observe(el));
}

/** Small circular cursor; flips to white over dark UI / dark text (not “invert cursor” blend—just a contrasting dot). */
function setupCustomCursor() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const dot = document.createElement("div");
  dot.className = "custom-cursor-dot";
  dot.setAttribute("aria-hidden", "true");
  document.body.appendChild(dot);
  document.body.classList.add("has-custom-cursor");

  function parseRgba(str) {
    const m = str.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
    if (!m) return null;
    const a = m[4] !== undefined ? +m[4] : 1;
    return { r: +m[1], g: +m[2], b: +m[3], a };
  }

  function luminance(r, g, b) {
    const chan = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    const R = chan(r);
    const G = chan(g);
    const B = chan(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }

  /** Only true when the pointer is over a noticeably dark *background* (not dark text on white). */
  function isDarkContext(el) {
    if (!el || el === document.documentElement || el === document.body) return false;
    if (el.classList?.contains("custom-cursor-dot")) return false;
    if (el.closest(".project-card")) return false;

    let node = el;
    for (let d = 0; d < 10 && node && node !== document.documentElement; d++) {
      const bgStr = getComputedStyle(node).backgroundColor;
      const bg = parseRgba(bgStr);
      if (bg && bg.a > 0.35 && luminance(bg.r, bg.g, bg.b) < 0.45) return true;
      node = node.parentElement;
    }
    return false;
  }

  let mx = 0;
  let my = 0;
  let raf = 0;

  const DOT_R = 7;

  function tick() {
    raf = 0;
    dot.style.transform = `translate3d(${mx - DOT_R}px, ${my - DOT_R}px, 0)`;
    const el = document.elementFromPoint(mx, my);
    dot.classList.toggle("custom-cursor-dot--light", el ? isDarkContext(el) : false);
  }

  window.addEventListener(
    "mousemove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.classList.remove("custom-cursor-dot--hidden");
      if (!raf) raf = requestAnimationFrame(tick);
    },
    { passive: true }
  );

}

function setupDreamHeroVideo() {
  const video = document.getElementById("dream-hero-video");
  if (!video) return;

  const REPLAY_DELAY_MS = 3000;
  video.loop = false;

  video.addEventListener("ended", () => {
    setTimeout(() => {
      if (!document.body.contains(video)) return;
      if (!video.paused) return;
      try {
        video.currentTime = 0;
        video.play();
      } catch {
        // ignore play errors (e.g. if user paused)
      }
    }, REPLAY_DELAY_MS);
  });
}

