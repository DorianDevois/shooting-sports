/**
 * LoadMoreGrid - універсальний компонент для пагінації елементів у сітці
 * @param {string} listSelector - CSS-селектор для контейнера з елементами (ul, div)
 * @param {string} buttonSelector - CSS-селектор для кнопки "See More"
 * @param {Object} [options] - додаткові налаштування
 *    options.batchSizes: {mobile: number, tablet: number, desktop: number, large: number}
 */

class LoadMoreGrid {
  constructor(listSelector, buttonSelector, options = {}) {
    this.list = document.querySelector(listSelector);
    this.button = document.querySelector(buttonSelector);
    if (!this.list || !this.button) return;

    this.items = Array.from(this.list.children);

    // стандартні batch size
    this.batchSizes = Object.assign(
      {
        mobile: 4, // <768px
        tablet: 4, // 768-1023px
        desktop: 6, // 1024-1439px
        large: 8, // >=1440px
      },
      options.batchSizes || {}
    );

    // Початковий рендер
    this.updateVisibleCount();

    // Кнопка "See More"
    this.button.addEventListener('click', () => this.showMore());

    // Resize: адаптивно змінюємо видимі картки
    window.addEventListener('resize', () => this.updateVisibleCount());
  }

  getBatchSize() {
    const width = window.innerWidth;
    if (width >= 1440) return this.batchSizes.large;
    if (width >= 1024) return this.batchSizes.desktop;
    if (width >= 768) return this.batchSizes.tablet;
    return this.batchSizes.mobile;
  }

  updateVisibleCount() {
    const targetCount = this.getBatchSize();

    // Показуємо або ховаємо картки залежно від нового розміру
    this.items.forEach((item, index) => {
      item.style.display = index < targetCount ? 'flex' : 'none';
    });

    // Оновлюємо лічильник видимих карток
    this.visibleCount = targetCount;

    // Кнопка "See More"
    if (this.visibleCount >= this.items.length) {
      this.button.style.display = 'none';
    } else {
      this.button.style.display = 'inline-block';
    }
  }

  showMore() {
    const batchSize = this.getBatchSize();
    const nextItems = this.items.slice(this.visibleCount, this.visibleCount + batchSize);

    nextItems.forEach(item => (item.style.display = 'flex'));

    this.visibleCount += nextItems.length;

    // Ховаємо кнопку, якщо всі картки показані
    if (this.visibleCount >= this.items.length) {
      this.button.style.display = 'none';
    }
  }
}

// Ініціалізація для Competitions
new LoadMoreGrid('.competitions__list', '.competitions__load-more');

// new LoadMoreGrid('.news__list', '.news__load-more', {
//   batchSizes: { mobile: 3, tablet: 4, desktop: 5, large: 6 },
// });
