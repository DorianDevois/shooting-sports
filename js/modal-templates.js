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

export function callbackTemplate() {
  return `
        <!-- Contact Us Form -->
        <div class="callback-form">
          <h2 class="callback-form__title">Contact Us</h2>
          <p class="callback-form__call-to-action">Leave your message and we'll contact you back</p>

          <form class="js-speaker-form callback-form__form" autocomplete="off" data-form="callback">
            <!-- Name Field -->
            <label class="callback-form__field callback-form__field--floating-label">
              <input class="callback-form__input" type="text" name="user-name" placeholder=" " required />
              <span class="callback-form__label">Name</span>
              <svg class="callback-form__icon" width="16px" height="16px">
                <use href="assets/icons/ui/sprite-ui.svg#ui-icon-person"></use>
              </svg>
            </label>

            <!-- Phone Field -->
            <label class="callback-form__field callback-form__field--floating-label">
              <input class="callback-form__input" type="tel" name="user-phone" placeholder=" " required />
              <span class="callback-form__label">Phone</span>
              <svg class="callback-form__icon" width="16px" height="16px">
                <use href="assets/icons/ui/sprite-ui.svg#ui-icon-phone-2"></use>
              </svg>
            </label>

            <!-- Email Field -->
            <label class="callback-form__field callback-form__field--floating-label">
              <input class="callback-form__input" type="email" name="user-email" placeholder=" " required />
              <span class="callback-form__label">Email</span>
              <svg class="callback-form__icon" width="16px" height="16px">
                <use href="assets/icons/ui/sprite-ui.svg#ui-icon-email-2"></use>
              </svg>
            </label>

            <!-- Message Field -->
            <label class="callback-form__field callback-form__field--stacked-label">
              <span class="callback-form__label">Comment</span>
              <textarea class="callback-form__textarea" name="user-comment" placeholder="Message"></textarea>
            </label>

            <!-- Policy Checkbox -->
            <label class="callback-form__field callback-form__field--inline-label">
              <input class="callback-form__checkbox" type="checkbox" name="user-policy" required />
              <span class="callback-form__checkbox-custom"></span>
              <span class="callback-form__checkbox-label">
                I agree to the <a class="callback-form__link" href="">Privacy Policy</a>
              </span>
            </label>

            <button class="button button--primary callback-form__submit" type="submit">Send Message</button>
          </form>
        </div>
  `;
}
