// =======================================
// build-results.js
// Генерує фінальний results.json
// на основі results.base.json + довідників
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
  results: path.join(SRC, 'results.base.json'),
  output: path.join(OUT, 'results.json'),
};

// Усі залежності (довідники)
const dependencies = {
  competitions: path.join(SRC, 'competitions.base.json'),
  disciplines: path.join(ENTITIES, 'disciplines.json'),
  stages: path.join(ENTITIES, 'stages.json'),
  athletes: path.join(SRC, 'people.json'),
  teams: path.join(SRC, 'teams.json'),
  participantTypes: path.join(ENTITIES, 'participant-types.json'),
  medals: path.join(ENTITIES, 'medals.json'), // 🥇
};

/**
 * ===========================
 * ====== HELPERS ============
 * ===========================
 */

/**
 * 1️⃣ Безпечне читання JSON
 */
function readJSON(filePath) {
  console.log(`📄 Reading: ${filePath}`);

  const raw = fs.readFileSync(filePath, 'utf-8');

  if (!raw.trim()) {
    throw new Error(`❌ File is empty: ${filePath}`);
  }

  return JSON.parse(raw);
}

/**
 * 2️⃣ Array → Map по id
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

/**
 * 3️⃣ Резолв сутності по id
 */
function resolve(map, id, entityName, resultId) {
  if (!id) return null;

  const entity = map[id];

  if (!entity) {
    throw new Error(`❌ ${entityName} with id "${id}" not found (result: ${resultId})`);
  }

  return entity;
}

/**
 * ===========================
 * ====== BUILD ==============
 * ===========================
 */

function buildResults() {
  console.log('📄 Loading reference data...');

  /**
   * 1️⃣ Завантажуємо всі довідники у maps
   */
  const maps = {};
  for (const key in dependencies) {
    const label = key[0].toUpperCase() + key.slice(1);
    maps[key] = toMap(readJSON(dependencies[key]), label);
  }

  /**
   * 2️⃣ Читаємо базові результати
   */
  const resultsBase = readJSON(paths.results);

  /**
   * 3️⃣ Будуємо фінальний results[]
   * Фінальний масив результатів (нормалізований)
   */
  const results = resultsBase.map(item => {
    /**
     * ===========================
     * Для кожного результату зберігаємо:
     * - тільки ID референси до змагання, дисципліни, етапу, спортсмена, команди, типу учасника, медалі
     * - деталі результату (score, rank, shots, series)
     * ===========================
     */
    return {
      id: item.id, // унікальний ID результату

      competitionId: item.competitionId, // посилання на competition
      disciplineId: item.disciplineId, // посилання на дисципліну
      stageId: item.stageId, // посилання на етап
      participantTypeId: item.participantTypeId, // тип учасника (individual / team)
      athleteId: item.athleteId || null, // посилання на спортсмена
      teamId: item.teamId || null, // посилання на команду, якщо є

      // 🏁 Результат
      score: item.score,
      rank: item.rank,
      medalId: item.medalId || null, // посилання на медаль

      /**
       * 📊 Деталі результату
       * shots — ОБОВʼЯЗКОВО
       * series — опціонально
       */
      details: {
        shots: item.details?.shots ?? null,
        series: item.details?.series ?? null,
      },
    };
  });

  /**
   * 4️⃣ Створюємо папку OUT, якщо не існує
   */
  fs.mkdirSync(OUT, { recursive: true });

  /**
   * 5️⃣ Записуємо фінальний файл
   */
  fs.writeFileSync(paths.output, JSON.stringify(results, null, 2), 'utf-8');

  console.log(`✅ results.json згенеровано: ${paths.output}`);
  console.log(`✅ Total results: ${results.length}`);
}

/**
 * ===========================
 * ====== RUN ================
 * ===========================
 */

try {
  buildResults();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
