
// Set current year in footer and initialise small interactions
document.addEventListener("DOMContentLoaded", () => {
  const yearTargets = document.querySelectorAll("[data-year]");
  const year = new Date().getFullYear();
  yearTargets.forEach((el) => {
    el.textContent = String(year);
  });

  setupNavToggle();
  setupCaseStudyScrollSpy();
  setupAboutAccordion();
  setupHeroPhraseRotate();
  setupDreamHeroVideo();
  setupAboutPhotoStack();
  setupCaseStudyCardCursor();
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

function setupCaseStudyScrollSpy() {
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
      ignoreObserverUntil = Date.now() + 500;
      section.scrollIntoView({ behavior: "smooth", block: "start" });
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

function setupCaseStudyCardCursor() {
  const cursorEl = document.querySelector(".cursor-hover-effect");
  if (!cursorEl) return;
  const cards = document.querySelectorAll(".project-card");
  if (!cards.length) return;

  function handleMove(event) {
    cursorEl.style.left = event.clientX + "px";
    cursorEl.style.top = event.clientY + "px";
  }

  document.addEventListener("mousemove", handleMove);

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      cursorEl.classList.add("visible");
    });
    card.addEventListener("mouseleave", () => {
      cursorEl.classList.remove("visible");
    });
  });
}
