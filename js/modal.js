import {
  competitionsTemplate,
  contactTemplate,
  loginTemplate,
  defaultTemplate,
  callbackTemplate,
} from './modal-templates.js';

(() => {
  // =====================
  // templates map
  // =====================
  const templates = {
    competitions: competitionsTemplate,
    contact: contactTemplate,
    login: loginTemplate,
    callback: callbackTemplate,
  };

  const CLASSES = {
    HIDDEN: 'is-hidden',
    BODY_LOCK: 'modal-open',
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

  // helpers
  // Перевірка наявності класу is-hidden на backdrop (чи відкрито модалку/бекдроп) - return true/false
  function isModalOpen() {
    return !refs.backdrop.classList.contains(CLASSES.HIDDEN);
  }

  function getTemplate(type) {
    const template = templates[type] || defaultTemplate;

    if (typeof template !== 'function') {
      console.error('Modal template must be a function:', template);
      return null;
    }

    return template;
  }

  // render function
  function renderModalContent(type) {
    const template = getTemplate(type);
    if (!template) return;

    refs.content.innerHTML = template();
  }

  // controller
  function openModal(type) {
    if (isModalOpen()) return;

    renderModalContent(type);

    refs.backdrop.classList.remove(CLASSES.HIDDEN);
    refs.body.classList.add(CLASSES.BODY_LOCK);

    // Вивід даних у консоль отриманих з форми зворотнього зв`язку
    document.querySelector('.js-speaker-form').addEventListener('submit', e => {
      e.preventDefault();

      new FormData(e.currentTarget).forEach((value, name) => console.log(`${name}: ${value}`));

      e.currentTarget.reset();
    });
  }

  function closeModal() {
    if (!isModalOpen()) return;

    refs.backdrop.classList.add(CLASSES.HIDDEN);
    refs.body.classList.remove(CLASSES.BODY_LOCK);

    setTimeout(() => {
      refs.content.innerHTML = '';
    }, 300);
  }

  // handlers
  function onDocumentClick(event) {
    const openBtn = event.target.closest('[data-modal-open]');
    const closeBtn = event.target.closest('[data-modal-close]');
    const isBackdropClick = event.target === refs.backdrop;

    if (!openBtn && !closeBtn && !isBackdropClick) return;

    if (openBtn) {
      event.preventDefault();

      const modalType = openBtn.dataset.modalType;

      if (!modalType) {
        console.warn('data-modal-type is missing on:', openBtn);
        return;
      }

      openModal(modalType);

      return;
    }

    if (closeBtn || isBackdropClick) {
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
