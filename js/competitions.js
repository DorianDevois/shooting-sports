import { fetchCompetitions } from './competition-api.js';

// Формат DD MMM → 26 Jul
function formatShortDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

// Формат DD MMM YYYY → 05 Aug 2024
// function formatLongDate(dateStr) {
//   const date = new Date(dateStr);
//   return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
// }

// Формат DD MMM YYYY → 05 Aug 2024
function formatLongDate(dateStr) {
  const date = new Date(dateStr);
  const [month, day, year] = date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .split(' ');

  return `${day} ${month}, ${year}`;
}

function renderCompetitionCards(data, containerSelector) {
  const container = document.querySelector(containerSelector);
  console.log(container);
  console.log(data);
  if (!container || !Array.isArray(data)) return;

  container.innerHTML = data.map(event => createMarkup(event)).join('');
}

/**
 * createMarkup
 * -----------------------------
 * Створює HTML картку події через шаблонні рядки, просто підставляючи значення з JSON.
 * @param {Object} event — об’єкт події
 * @returns {string} — HTML картки
 */
function createMarkup(event) {
  return `<li class="section__card-item">
<article class="competition-card" data-status="${event.statusId}" data-types="${event.typeId}">
  <div class="competition-card__media">
    <img
      class="competition-card__image"
      src="${event.image}"
      alt="${event.title}"
      width="180"
      loading="lazy"
    />

    <div class="competition-card__overlay">
      <a class="competition-card__overlay-link" href="${event.link}">View event</a>
    </div>

    <ul class="badges badges--top-right" aria-label="Competition categories">

      <li>
        <a class="badges__link" href="pages/competitions/?type=${event.type.id}" data-type="${event.type.id}">
          ${event.type.name}
        </a>
      </li>

    </ul>

    <ul class="badges badges--bottom-right" aria-label="Competition status">
      <li>
        <a class="badges__link" href="pages/competitions/?status=${event.status.id}" data-status="${event.status.id}">
          ${event.status.name}
        </a>
      </li>
    </ul>
  </div>

  <div class="competition-card__meta">
    <h3 class="competition-card__title">
      <a class="competition-card__title-link" href="${event.link}">
        ${event.title}
      </a>
    </h3>

    <p class="competition-card__location">
      <a
        class="competition-card__location-link"
        href="pages/competitions/?city=${event.location.city}&country=${event.location.country.id}"
        data-city="${event.location.city}"
        data-country="${event.location.country.id}">
        ${event.location.city}, ${event.location.country.name}
      </a>
    </p>

    <p class="competition-card__date">
      <time datetime="${event.startDate}">${formatShortDate(event.startDate)}</time> -
      <time datetime="${event.endDate}">${formatLongDate(event.endDate)}</time>
    </p>
  </div>
</article></li>
  `;
}

// Приклад використання
const data = await fetchCompetitions();
console.log('Competitions data loaded:', data);
renderCompetitionCards(data, '.test-container');
