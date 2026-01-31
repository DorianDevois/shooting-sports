// =======================================
// build-competitions.js
// Скрипт для генерації фінального competitions.json
// з усіх source файлів та першорівневих сутностей
// =======================================

import fs from 'fs';
import path from 'path';

/**
 * ===========================
 * ====== PATHS =============
 * ===========================
 */

const SRC = 'data/sources';
const ENTITIES = 'data/sources/first-level-entities';
const OUT = 'data/generated';

const paths = {
  competitions: path.join(SRC, 'competitions.base.json'),
  output: path.join(OUT, 'competitions.json'),
};

// ===========================
// Мапа усіх довідників
// Сюди додаємо всі довідники, які будемо резолвити
// ===========================
const dependencies = {
  countries: path.join(ENTITIES, 'countries.json'),
  venues: path.join(SRC, 'venues.json'),
  types: path.join(ENTITIES, 'competition-types.json'),
  statuses: path.join(ENTITIES, 'competition-statuses.json'),
  disciplines: path.join(SRC, 'disciplines.base.json'),
  participantTypes: path.join(ENTITIES, 'participant-types.json'),
  weapons: path.join(ENTITIES, 'weapons.json'),
  distances: path.join(ENTITIES, 'distances.json'),
  genders: path.join(ENTITIES, 'genders.json'),
  // сюди можна додати будь-які нові файли: teams, people, results
};

/**
 * ===========================
 * ====== HELPERS ============
 * ===========================
 */

// 1️⃣ Читаємо JSON файл
/**
 * Read JSON file safely
 */
function readJSON(filePath) {
  console.log(`📄 Reading: ${filePath}`);

  const raw = fs.readFileSync(filePath, 'utf-8');

  if (!raw.trim()) {
    throw new Error(`❌ File is empty: ${filePath}`);
  }

  return JSON.parse(raw);
}

// 2️⃣ Перетворюємо масив у map для швидкого lookup { id: obj }
/**
 * Convert array → map by id
 * [{ id: "x" }] → { x: {...} }
 */
function toMap(arr, label) {
  const map = {};

  for (const item of arr) {
    if (!item.id) {
      throw new Error(`❌ ${label} item without id`);
    }
    map[item.id] = item;
  }

  return map;
}

// 3️⃣ Резолв залежності по id, з помилкою - якщо не знайдено
/**
 * Resolve entity by id with clear error
 */
function resolve(map, id, entityName, competitionId) {
  if (!id) return null; // Деякі поля можуть бути опціональні

  const entity = map[id];

  if (!entity) {
    throw new Error(`❌ ${entityName} with id: "${id}" not found (competition: ${competitionId})`);
  }

  return entity;
}

/**
 * ===========================
 * ====== BUILD ==============
 * ===========================
 */

function buildCompetitions() {
  /**
   * ===========================
   * ====== LOAD SOURCE DATA ===
   * ===========================
   */
  console.log('📄 Читаємо базові дані...');

  // 1️⃣ Резолвимо довідники у map
  const maps = {};
  for (const key in dependencies) {
    const label = key[0].toUpperCase() + key.slice(1);
    maps[key] = toMap(readJSON(dependencies[key]), label);
  }

  // 2️⃣ Додаємо country всередину кожного venue
  // venue.countryId → venue.country (об'єкт)
  for (const venueId in maps.venues) {
    const venue = maps.venues[venueId];
    venue.country = resolve(maps.countries, venue.countryId, 'Country', venue.id);
    // Тепер venue має country.id, country.name тощо
  }

  // 3️⃣ Читаємо базові competitions
  const competitionsBase = readJSON(paths.competitions);

  // 4️⃣ Створюємо фінальний масив
  const competitions = competitionsBase.map(item => {
    const venue = resolve(maps.venues, item.venueId, 'Venue', item.id);

    // Створюємо "чистий" location для UI/фільтрів
    const location = {
      city: venue.city,
      country: {
        id: venue.country.id,
        name: venue.country.name,
      },
    };

    // Резолв дисциплін
    const disciplines = (item.disciplineIds || []).map(id => {
      const d = resolve(maps.disciplines, id, 'Discipline', item.id);

      // 🔹 Додаємо повний об'єкт weapon
      d.weapon = resolve(maps.weapons, d.weaponId, 'Weapon', item.id);

      // 🔹 Додаємо повний об'єкт distance (опціонально)
      d.distance = d.distanceId ? resolve(maps.distances, d.distanceId, 'Distance', item.id) : null;

      // 🔹 Додаємо повний об'єкт gender
      d.gender = resolve(maps.genders, d.genderId, 'Gender', item.id);

      // 🔹 Додаємо participantType
      d.participantType = resolve(maps.participantTypes, d.participantTypeId, 'Participant Type', item.id);

      return d;
    });

    return {
      id: item.id,
      title: item.title,

      // Резолв залежностей
      type: resolve(maps.types, item.typeId, 'Type', item.id),
      participantTypes: (item.participantTypeIds || []).map(id =>
        resolve(maps.participantTypes, id, 'Participant Type', item.id)
      ),
      status: resolve(maps.statuses, item.statusId, 'Status', item.id),
      venue, // повний об'єкт venue з country
      disciplines, // резолвнуті дисципліни

      // location для UI/фільтрів
      location,

      // Інші поля без резолву
      startDate: item.startDate,
      endDate: item.endDate,
      image: item.image,
      link: item.link,
    };
  });

  // 5️⃣ Створюємо папку OUT, якщо не існує
  // Ensure output directory exists
  fs.mkdirSync(OUT, { recursive: true });

  // 6️⃣ Записуємо фінальний JSON
  // Write result
  /**
   * ===========================
   * ====== WRITE FILE =========
   * ===========================
   */
  fs.writeFileSync(paths.output, JSON.stringify(competitions, null, 2), 'utf-8');

  console.log(`✅ competitions.json успішно згенеровано: ${paths.output}`);
  console.log(`✅ Generated ${competitions.length} competitions`);
}

/**
 * ===========================
 * ====== Run ================
 * ===========================
 */
try {
  buildCompetitions();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
