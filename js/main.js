// const header = document.querySelector('.page-header');

// const updateHeaderOffset = () => {
//   document.documentElement.style.setProperty('--page-header-height', `${header.offsetHeight}px`);
// };

// updateHeaderOffset();

// new ResizeObserver(updateHeaderOffset).observe(header);

const header = document.querySelector('.page-header');

const updateLayoutVars = () => {
  // 1. Динамічна висота для .mobile-menu__container мобільного меню
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--view-height', `${vh}px`);

  // 2. Висота header
  document.documentElement.style.setProperty('--page-header-height', `${header.offsetHeight}px`);
};

// Викликаємо при завантаженні
updateLayoutVars();

// ResizeObserver для header
new ResizeObserver(updateLayoutVars).observe(header);

// Оновлення при зміні розміру / орієнтації екрану
window.addEventListener('resize', updateLayoutVars);
window.addEventListener('orientationchange', updateLayoutVars);

// Вивід даних у консоль отриманих з форми зворотнього зв`язку
(() => {
  document.querySelector('.js-speaker-form').addEventListener('submit', e => {
    e.preventDefault();

    new FormData(e.currentTarget).forEach((value, name) => console.log(`${name}: ${value}`));

    e.currentTarget.reset();
  });
})();
