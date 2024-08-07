export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    messages: {
      en: {
        enterLogin: 'Please enter your login',
        enterPass: 'Please enter your password',
        Login: 'Login',
        Pass: 'Password',
        Remember: 'Remember me',
        enter: 'Login',
        error_email: 'Value is not a valid email address',
        error_minLength: 'This field should be at least {min} characters long',
        error_required: 'Value is required'
      },
      ru: {
        enterLogin: 'Введите логин',
        enterPass: 'Введите пароль',
        Login: 'Email',
        Pass: 'Пароль',
        Remember: 'Запомнить меня',
        enter: 'Войти',
        error_email: 'Невалидный email адрес',
        error_minLength: 'Минимальное количество символов {min}',
        error_required: 'Обязательное поле'
      }
    }
  }))