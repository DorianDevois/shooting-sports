// =======================================
// build-disciplines.js
// Генерує фінальний disciplines.json
// з резолвом усіх залежностей
// =======================================

import fs from 'fs';
import path from 'path';

/**
 * ===========================
 * ====== PATHS ==============
 * ===========================
 */

// Папка з сирими даними
const SRC = 'data/sources';
// Папка з довідниками (first-level entities)
const ENTITIES = 'data/sources/first-level-entities';
// Папка, куди пишемо результат
const OUT = 'data/generated';

const paths = {
  disciplines: path.join(SRC, 'disciplines.base.json'),
  output: path.join(OUT, 'disciplines.json'),
};

// Усі довідники, від яких залежать дисципліни
const dependencies = {
  distances: path.join(ENTITIES, 'distances.json'),
  weapons: path.join(ENTITIES, 'weapons.json'),
  genders: path.join(ENTITIES, 'genders.json'),
  participantTypes: path.join(ENTITIES, 'participant-types.json'),
  positions: path.join(ENTITIES, 'positions.json'),
};

/**
 * ===========================
 * ====== HELPERS ============
 * ===========================
 */

// 1️⃣ Читаємо JSON файл
/**
 * 1️⃣ Безпечне читання JSON
 * - читає файл
 * - перевіряє, що він не пустий
 * - парсить у JS-обʼєкт
 */
function readJSON(filePath) {
  console.log(`📄 Reading: ${filePath}`);

  const raw = fs.readFileSync(filePath, 'utf-8');

  if (!raw.trim()) {
    throw new Error(`❌ File is empty: ${filePath}`);
  }

  return JSON.parse(raw);
}

// 2️⃣ Перетворюємо масив у map { id → object }
/**
 * 2️⃣ Array → Map по id
 *
 * [{ id: "x", ... }] →
 * {
 *   x: { id: "x", ... }
 * }
 *
 * Навіщо:
 * - O(1) доступ
 * - зручно резолвити залежності
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
 * 3️⃣ Резолвимо залежність(Resolve) по id
 *
 * map       - мапа довідника;
 * id        - айді, який шукаємо;
 * entity    - назва сутності (для помилки);
 * parentId  - айді дисципліни (щоб знати де проблема);
 */
function resolve(map, id, entityName, disciplineId) {
  if (!id) return null;

  const entity = map[id];

  if (!entity) {
    throw new Error(`❌ ${entityName} with id "${id}" not found (discipline: ${disciplineId})`);
  }

  return entity;
}

/**
 * ====== BUILD ==============
 */

function buildDisciplines() {
  /**
   * ===========================
   * ====== LOAD SOURCE DATA ===
   * ===========================
   */
  console.log('📄 Building disciplines...');

  /**
   * 1️⃣ Завантажуємо всі довідники і робимо з них map
   */
  const maps = {};
  for (const key in dependencies) {
    const label = key[0].toUpperCase() + key.slice(1);
    maps[key] = toMap(readJSON(dependencies[key]), label);
  }

  /**
   * 2️⃣ Читаємо source disciplines
   */
  const disciplinesBase = readJSON(paths.disciplines);

  /**
   * 3️⃣ Будуємо фінальний масив дисциплін
   */
  const disciplines = disciplinesBase.map(discipline => ({
    // Базові поля
    id: discipline.id,
    name: discipline.name,

    // Резолв обовʼязкових залежностей
    distance: resolve(maps.distances, discipline.distanceId, 'Distance', discipline.id),

    weapon: resolve(maps.weapons, discipline.weaponId, 'Weapon', discipline.id),

    gender: resolve(maps.genders, discipline.genderId, 'Gender', discipline.id),

    participantType: resolve(maps.participantTypes, discipline.participantTypeId, 'ParticipantType', discipline.id),

    // Позиції (може бути порожній масив або null)
    /**
     * 🔑 КЛЮЧОВИЙ МОМЕНТ
     *
     * positionIds є ТІЛЬКИ там,
     * де реально існують позиції (наприклад 3pos)
     *
     * ❌ Немає positionIds → немає поля positions
     * ✅ Є positionIds → додаємо positions
     */
    ...(discipline.positionIds && discipline.positionIds.length > 0
      ? {
          positions: discipline.positionIds.map(positionId =>
            resolve(maps.positions, positionId, 'Position', discipline.id)
          ),
        }
      : {}),
  }));

  // Створюємо папку, якщо її ще немає
  /**
   * 4️⃣ Гарантуємо, що папка generated існує
   */
  fs.mkdirSync(OUT, { recursive: true });

  // Пишемо результат
  /**
   * 5️⃣ Записуємо фінальний файл
   */
  fs.writeFileSync(paths.output, JSON.stringify(disciplines, null, 2), 'utf-8');

  console.log(`✅ disciplines.json згенеровано: ${paths.output}`);
  console.log(`✅ Generated ${disciplines.length} disciplines`);
}

/**
 * ===========================
 * ====== RUN ================
 * ===========================
 */

try {
  buildDisciplines();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
