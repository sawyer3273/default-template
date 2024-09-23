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
        error_required: 'Value is required',
        ForgotPassword: 'Forgot password?',
        Remind: 'Remind password',
        Register: 'Register',
        RegisterNow: 'Register',
        UserName: 'User Name',
        enterUserName: 'Enter User Name',
        HaveAcc: 'Have an account?',
        deleteSure: "Are you sure you want to delete?"
      },
      ru: {
        enterLogin: 'Введите емайл',
        enterPass: 'Введите пароль',
        Login: 'Email',
        Pass: 'Пароль',
        Remember: 'Запомнить меня',
        enter: 'Войти',
        error_email: 'Невалидный email адрес',
        error_minLength: 'Минимальное количество символов {min}',
        error_required: 'Обязательное поле',
        ForgotPassword: 'Потерялся пароль?',
        Remind: 'Напомнить пароль',
        Register: 'Регистрация',
        RegisterNow: 'Зарегистрироваться',
        UserName: 'Имя',
        enterUserName: 'Введите имя',
        HaveAcc: 'У тебя уже есть аккаунт?',
        deleteSure: "Удалить эту запись?"
      }
    }
  }))