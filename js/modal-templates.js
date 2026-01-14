export function competitionsTemplate() {
  return `
    <h2 class="modal__title">All competitions</h2>

    <p class="modal__text">
      Browse all available competitions by category and status.
    </p>

    <a
      href="pages/competitions/"
      class="link-button link-button--primary"
    >
      Go to competitions
    </a>
  `;
}

export function contactTemplate() {
  return `
    <h2 class="modal__title">Contact us</h2>

    <form class="form">
      <div class="form__field">
        <label class="form__label" for="name">Name</label>
        <input id="name" type="text" class="form__input" required />
      </div>

      <div class="form__field">
        <label class="form__label" for="message">Message</label>
        <textarea id="message" class="form__textarea" required></textarea>
      </div>

      <button type="submit" class="button button--primary">
        Send message
      </button>
    </form>
  `;
}

export function loginTemplate() {
  return `
    <h2 class="modal__title">Login</h2>

    <form class="form">
      <div class="form__field">
        <label class="form__label" for="email">Email</label>
        <input id="email" type="email" class="form__input" required />
      </div>

      <div class="form__field">
        <label class="form__label" for="password">Password</label>
        <input id="password" type="password" class="form__input" required />
      </div>

      <button type="submit" class="button button--primary">
        Login
      </button>
    </form>
  `;
}

export function defaultTemplate() {
  return `
    <p class="modal__text">Template not found</p>
  `;
}
