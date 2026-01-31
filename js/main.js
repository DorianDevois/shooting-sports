const header = document.querySelector('.page-header');

const updateLayoutVars = () => {
  // 1. Динамічна висота для .mobile-menu__container мобільного меню
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  // 2. Висота header для padding-top: var(--page-header-height); for body
  document.documentElement.style.setProperty('--page-header-height', `${header.offsetHeight}px`);
};

// Викликаємо при завантаженні
updateLayoutVars();

// ResizeObserver для header
new ResizeObserver(updateLayoutVars).observe(header);

// Оновлення при зміні розміру / орієнтації екрану
window.addEventListener('resize', updateLayoutVars);
window.addEventListener('orientationchange', updateLayoutVars);

// =============================================================
// Вивід даних у консоль отриманих з форми зворотнього зв`язку
// (() => {
//   document.querySelector('.js-speaker-form-2').addEventListener('submit', e => {
//     e.preventDefault();

//     new FormData(e.currentTarget).forEach((value, name) => console.log(`${name}: ${value}`));

//     e.currentTarget.reset();
//   });
// })();
