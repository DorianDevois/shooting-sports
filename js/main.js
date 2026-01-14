const header = document.querySelector('.page-header');

const updateHeaderOffset = () => {
  document.documentElement.style.setProperty('--page-header-height', `${header.offsetHeight}px`);
};

updateHeaderOffset();

new ResizeObserver(updateHeaderOffset).observe(header);

// Вивід даних у консоль отриманих з форми зворотнього зв`язку
(() => {
  document.querySelector('.js-speaker-form').addEventListener('submit', e => {
    e.preventDefault();

    new FormData(e.currentTarget).forEach((value, name) => console.log(`${name}: ${value}`));

    e.currentTarget.reset();
  });
})();
