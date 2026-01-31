/**
 * LoadMoreGrid
 * -----------------------------
 * Клас для реалізації "Load More" на сітці карток.
 *
 * Основні принципи роботи:
 * 1. На старті показується базовий ряд карток для поточного breakpoint.
 * 2. При кліку на кнопку "Load More" показується ще один ряд.
 * 3. Кількість карток, які користувач вже відкрив, **ніколи не зменшується** при зміні розміру екрану.
 * 4. При зміні breakpoint'ів:
 *    - якщо користувач ще не натискав Load More → показуємо базовий ряд для нового breakpoint
 *    - якщо користувач натискав Load More → зберігаємо всі відкриті картки
 */
class LoadMoreGrid {
  /**
   * @param {string} listSelector   CSS-селектор контейнера з картками (ul, div тощо)
   * @param {string} buttonSelector CSS-селектор кнопки "Load more"
   * @param {Object} options        Об’єкт налаштувань (наприклад batchSizes)
   */
  constructor(listSelector, buttonSelector, options = {}) {
    // 1. Вибираємо контейнер карток
    this.list = document.querySelector(listSelector);

    // 2. Вибираємо кнопку "Load More"
    this.button = document.querySelector(buttonSelector);

    // Якщо одного з елементів нема — виходимо
    if (!this.list || !this.button) return;

    // 3. Отримуємо всі картки всередині контейнера
    this.items = Array.from(this.list.children);

    // 4. Налаштування кількості карток у ряд для різних breakpoint’ів
    this.batchSizes = {
      mobile: 2, // < 768px — 2 картки в ряд
      tablet: 2, // 768–1023px — 2 картки
      laptop: 3, // 1024–1439px — 3 картки
      desktop: 4, // 1440px+ — 4 картки
      ...options.batchSizes, // дозволяємо перезапис користувацьких налаштувань
    };

    // 5. visibleCount — скільки карток показано користувачу
    this.visibleCount = 0;

    // 6. currentBase — скільки карток в ряд для поточного breakpoint
    this.currentBase = this.getBatchSize();

    // 7. Відстежуємо, чи користувач натискав кнопку Load More
    this.userClicked = false;

    // 8. Приховуємо всі картки на старті
    this.items.forEach(item => item.classList.add('is-hidden'));

    // 9. Показуємо базовий ряд карток
    this.showInitial();

    // 10. Додаємо обробник кліку кнопки "Load More"
    this.button.addEventListener('click', () => this.showMore());

    // 11. Ініціалізація обробника resize / orientation
    this.initResizeHandler();
  }

  /**
   * Визначає кількість карток в ряд залежно від ширини екрану
   * @returns {number} кількість карток у ряд для поточного breakpoint
   */
  getBatchSize() {
    const w = window.innerWidth;

    if (w >= 1440) return this.batchSizes.desktop;
    if (w >= 1024) return this.batchSizes.laptop;
    if (w >= 768) return this.batchSizes.tablet;

    return this.batchSizes.mobile;
  }

  /**
   * Початковий показ карток — показуємо перший ряд
   */
  showInitial() {
    this.currentBase = this.getBatchSize(); // актуальний breakpoint
    this.visibleCount = this.currentBase; // показуємо 1 ряд
    this.updateView(); // оновлюємо UI
  }

  /**
   * Клік по кнопці "Load More"
   * → додаємо ще один ряд карток
   */
  showMore() {
    this.userClicked = true; // користувач почав довантажувати картки
    this.visibleCount += this.currentBase; // додаємо ще один ряд
    this.updateView(); // оновлюємо UI
  }

  /**
   * Оновлення UI
   * - ховає/показує картки
   * - ховає/показує кнопку Load More
   */
  updateView() {
    this.items.forEach((item, index) => {
      // Якщо індекс картки >= visibleCount → ховаємо її
      item.classList.toggle('is-hidden', index >= this.visibleCount);
    });

    // Якщо всі картки показані — ховаємо кнопку
    if (this.visibleCount >= this.items.length) {
      this.button.classList.add('is-hidden');
    } else {
      this.button.classList.remove('is-hidden');
    }
  }

  /**
   * Обробка resize / orientation
   * - якщо користувач нічого не довантажував → показуємо базовий ряд для нового breakpoint
   * - якщо користувач вже натискав Load More → зберігаємо всі відкриті картки
   */
  initResizeHandler() {
    let timeout;

    const onResize = () => {
      clearTimeout(timeout);

      // debounce — обробник викликається через 150ms після останньої зміни розміру
      timeout = setTimeout(() => {
        const newBase = this.getBatchSize();

        // Якщо breakpoint не змінився — нічого не робимо
        if (newBase === this.currentBase) return;

        if (!this.userClicked) {
          // Користувач ще нічого не завантажував → показуємо базовий ряд для нового breakpoint
          this.visibleCount = newBase;
        } else {
          // Користувач вже довантажував → зберігаємо всі відкриті картки
          // і показуємо хоча б 1 ряд для нового breakpoint
          this.visibleCount = Math.max(this.visibleCount, newBase);
        }

        // Оновлюємо поточний breakpoint
        this.currentBase = newBase;

        // Оновлюємо UI
        this.updateView();
      }, 150);
    };

    // Звичайний resize
    window.addEventListener('resize', onResize);

    // Для мобільних браузерів з virtual viewport (iOS Safari, Chrome)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onResize);
    }
  }
}

/* =========================
   ІНІЦІАЛІЗАЦІЯ
========================= */

// Ініціалізація для Our Team Section
new LoadMoreGrid('.our-team__list', '.our-team__btn', {
  batchSizes: { mobile: 2, tablet: 3, laptop: 4, desktop: 5 },
});

// Ініціалізація для Competitions
new LoadMoreGrid('.competitions__list', '.competitions__btn', {
  batchSizes: { mobile: 2, tablet: 2, laptop: 3, desktop: 4 },
});

// Ініціалізація для News
new LoadMoreGrid('.news__list', '.news__btn', {
  batchSizes: { mobile: 2, tablet: 2, laptop: 3, desktop: 4 },
});

// new LoadMoreGrid('.news__list', '.news__load-more', {
//   batchSizes: { mobile: 3, tablet: 4, laptop: 5, desktop: 6 },
// });
