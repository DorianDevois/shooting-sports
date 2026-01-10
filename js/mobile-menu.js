// START Mobile MENU
(() => {
  const mobileMenuContainer = document.querySelector('.js-mobile-menu-container');
  const openMenuBtn = document.querySelector('.js-open-mobile-menu');
  const closeMenuBtn = document.querySelector('.js-close-mobile-menu');

  const openMobileMenu = () => {
    if (mobileMenuContainer.classList.contains('is-open')) return;

    document.body.classList.add('mobile-menu-open');
    mobileMenuContainer.classList.add('is-open');
    openMenuBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMobileMenu = () => {
    document.body.classList.remove('mobile-menu-open');
    mobileMenuContainer.classList.remove('is-open');
    openMenuBtn.setAttribute('aria-expanded', 'false');
    openMenuBtn.focus();
  };

  openMenuBtn.addEventListener('click', openMobileMenu);
  closeMenuBtn.addEventListener('click', closeMobileMenu);

  // ✅ Close on ESC
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!mobileMenuContainer.classList.contains('is-open')) return;

    closeMobileMenu();
  });

  // Close the mobile menu on wider screens if the device orientation changes
  window.matchMedia('(min-width: 768px)').addEventListener('change', e => {
    if (e.matches) closeMobileMenu();
  });
})();
// END Mobile MENU
