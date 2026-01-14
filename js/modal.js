import { competitionsTemplate, contactTemplate, loginTemplate, defaultTemplate } from './modal-templates.js';

(() => {
  // =====================
  // templates map
  // =====================
  const templates = {
    competitions: competitionsTemplate,
    contact: contactTemplate,
    login: loginTemplate,
  };

  // =====================
  // refs
  // =====================
  const refs = {
    backdrop: document.querySelector('[data-backdrop]'),
    content: document.querySelector('[data-modal-content]'),
    body: document.body,
  };

  // Перевперевірка на наявність обов'язкових атрибутів
  if (!refs.backdrop || !refs.content) {
    console.warn('Required attributes [data-backdrop] or [data-modal-content] not found');
    return;
  }

  // Перевірка наявності класу is-hidden на backdrop (чи відкрито модалку/бекдроп) - return true/false
  function isModalOpen() {
    return !refs.backdrop.classList.contains('is-hidden');
  }

  // render function
  function renderModalContent(type) {
    const template = templates[type] || defaultTemplate;

    if (typeof template !== 'function') {
      console.error('Template is not a function', template);
      return;
    }

    refs.content.innerHTML = template();
  }

  // controller
  function openModal(type) {
    renderModalContent(type);

    refs.backdrop.classList.remove('is-hidden');
    refs.body.classList.add('modal-open');
  }

  function closeModal() {
    refs.backdrop.classList.add('is-hidden');
    refs.body.classList.remove('modal-open');

    setTimeout(() => {
      refs.content.innerHTML = '';
    }, 300);
  }

  // handlers
  function onDocumentClick(event) {
    const openBtn = event.target.closest('[data-modal-open]');
    const closeBtn = event.target.closest('[data-modal-close]');
    const isBackdrop = event.target === refs.backdrop;

    if (!openBtn && !closeBtn && !isBackdrop) return;

    if (openBtn) {
      event.preventDefault();
      openModal(openBtn.dataset.modalType);

      return;
    }

    if (closeBtn || event.target === refs.backdrop) {
      closeModal();
    }
  }

  function onEscPress(event) {
    if (event.key === 'Escape' && isModalOpen()) {
      closeModal();
    }
  }

  // init
  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onEscPress);
})();
