// =====================
// Filters logic
// =====================

// Отримуємо контейнер з фільтрами
const filtersList = document.getElementById('competitionFilters');

// Отримуємо всі кнопки
const filterButtons = filtersList.querySelectorAll('.filters__btn');

// Поточний активний фільтр
let activeFilter = 'all';

// Вішаємо один listener на весь список (event delegation)
filtersList.addEventListener('click', event => {
  const button = event.target.closest('.filters__btn');

  // Якщо клік не по кнопці — нічого не робимо
  if (!button) return;

  const filterValue = button.dataset.filter;

  // Якщо натиснули на вже активний фільтр — нічого не робимо
  if (filterValue === activeFilter) return;

  // 1. Знімаємо активний клас з усіх кнопок
  filterButtons.forEach(btn => btn.classList.remove('is-active'));

  // 2. Додаємо активний клас на поточну
  button.classList.add('is-active');

  // 3. Оновлюємо активний фільтр
  activeFilter = filterValue;

  // 4. Тут буде фільтрація карток
  filterCompetitions(activeFilter);
});

// Filter function
function filterCompetitions(type) {
  console.log('Active filter:', type);

  // Тут:
  // - фільтр масиву даних
  // - або показуюти/сховаюти DOM-елементи
}
