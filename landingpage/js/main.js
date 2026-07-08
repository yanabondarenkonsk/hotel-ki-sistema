// =============================================
// main.js — Hotel KI landing
// =============================================

// Плавный скролл по якорям
document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;

  const href = link.getAttribute("href");
  if (!href || href === "#") return;

  const target = document.querySelector(href);
  if (!target) return;

  event.preventDefault();

  // Закрываем мобильное меню при переходе по якорю
  closeMobileNav();

  target.scrollIntoView({ behavior: "smooth", block: "start" });
});

// =============================================
// Бургер-меню (мобильная навигация)
// =============================================

function initBurgerMenu() {
  // Создаём кнопку-бургер
  const burger = document.createElement("button");
  burger.className = "burger";
  burger.setAttribute("aria-label", "Открыть меню");
  burger.setAttribute("aria-expanded", "false");
  burger.innerHTML = `
    <span class="burger__line"></span>
    <span class="burger__line"></span>
    <span class="burger__line"></span>
  `;

  // Создаём мобильный nav-дровер
  const mobileNav = document.createElement("nav");
  mobileNav.className = "mobile-nav";
  mobileNav.setAttribute("aria-label", "Мобильная навигация");
  mobileNav.innerHTML = `
    <div class="mobile-nav__backdrop"></div>
    <div class="mobile-nav__panel">
      <a href="https://hotel-ki.ru/sistema_dlia_otelia.html#features" class="mobile-nav__link">Преимущества</a>
      <a href="https://hotel-ki.ru/sistema_dlia_otelia.html#functional" class="mobile-nav__link">Функционал</a>
      <a href="https://hotel-ki.ru/sistema_dlia_otelia.html#about" class="mobile-nav__link">О нас</a>
      <a href="https://hotel-ki.ru/sistema_dlia_otelia.html#faq" class="mobile-nav__link">FAQ</a>
      <a href="https://hotel-ki.ru/sistema_dlia_otelia.html#contacts" class="mobile-nav__link">Контакты</a>
      <a href="https://lk.hotel-ki.ru/" class="mobile-nav__link">Вход</a>
      <a href="https://hotel-ki.ru/sistema_dlia_otelia.html#demo" class="mobile-nav__cta">Демо-доступ</a>
      <div class="mobile-nav__phone">
        Отдел продаж
        <a href="tel:+79137842018">+7 913 784‑20‑18</a>
      </div>
    </div>
  `;

  // Вставляем бургер в самый конец .header__inner — будет крайним правым
  const headerInner = document.querySelector(".header__inner");
  if (headerInner) {
    headerInner.appendChild(burger);
  }

  // Вставляем дровер перед </body>
  document.body.appendChild(mobileNav);
  // Сразу показываем элемент (display управляется через class)
  mobileNav.style.display = "block";

  // Открыть / закрыть
  burger.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("mobile-nav--open");
    burger.classList.toggle("burger--open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  // Закрыть по backdrop
  mobileNav.querySelector(".mobile-nav__backdrop").addEventListener("click", closeMobileNav);

  // Закрыть по Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileNav();
  });

  function closeMobileNavInternal() {
    mobileNav.classList.remove("mobile-nav--open");
    burger.classList.remove("burger--open");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  // Экспортируем во внешнюю функцию
  window._closeMobileNav = closeMobileNavInternal;
}

function closeMobileNav() {
  if (typeof window._closeMobileNav === "function") {
    window._closeMobileNav();
  }
}

// Инициализируем бургер
initBurgerMenu();

// =============================================
// Аккордеон FAQ
// =============================================

const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  const header = item.querySelector(".faq-item__header");
  const body = item.querySelector(".faq-item__body");
  if (!header || !body) return;

  const setMaxHeight = (open) => {
    if (open) {
      body.style.maxHeight = body.scrollHeight + "px";
    } else {
      body.style.maxHeight = "0";
    }
  };

  setMaxHeight(false);

  header.addEventListener("click", () => {
    const isOpen = item.classList.toggle("faq-item--open");
    setMaxHeight(isOpen);

    // Закрываем остальные
    faqItems.forEach((other) => {
      if (other !== item && other.classList.contains("faq-item--open")) {
        other.classList.remove("faq-item--open");
        const otherBody = other.querySelector(".faq-item__body");
        if (otherBody) otherBody.style.maxHeight = "0";
      }
    });
  });
});

// =============================================
// Год в футере
// =============================================

const yearEl = document.getElementById("js-year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

// =============================================
// Функционал системы: вкладки и карусели
// =============================================

const functionalTabs = document.querySelectorAll(".functional__tab");
const functionalPanels = document.querySelectorAll(".functional__content");

functionalTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    if (!target) return;

    functionalTabs.forEach((t) => {
      t.classList.remove("functional__tab--active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("functional__tab--active");
    tab.setAttribute("aria-selected", "true");

    functionalPanels.forEach((panel) => {
      const isActive = panel.dataset.panel === target;
      panel.classList.toggle("functional__content--active", isActive);
    });

    // На мобиле — скроллим к панели
    if (window.innerWidth <= 768) {
      const panel = document.querySelector(".functional__panel");
      if (panel) {
        setTimeout(() => {
          panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 50);
      }
    }
  });
});

document.querySelectorAll(".functional__carousel").forEach((carousel) => {
  const slides = carousel.querySelectorAll(".functional__slide");
  const dotsContainer = carousel.querySelector(".functional__carousel-dots");
  if (!slides.length || !dotsContainer) return;

  let current = 0;

  const goTo = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("functional__slide--active", i === current);
    });
    dotsContainer.querySelectorAll(".functional__carousel-dot").forEach((dot, i) => {
      dot.classList.toggle("functional__carousel-dot--active", i === current);
    });
  };

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "functional__carousel-dot" + (i === 0 ? " functional__carousel-dot--active" : "");
    dot.setAttribute("aria-label", "Слайд " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  carousel.querySelectorAll(".functional__carousel-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      goTo(current + (btn.dataset.direction === "next" ? 1 : -1));
    });
  });

  // Свайп на мобиле
  let touchStartX = 0;
  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  carousel.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      goTo(current + (diff > 0 ? 1 : -1));
    }
  }, { passive: true });
});
