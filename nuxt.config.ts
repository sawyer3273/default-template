// https://nuxt.com/docs/api/configuration/nuxt-config 
// @ts-ignore 
export default defineNuxtConfig({
  serverHandlers: [
    // API handlers with express
    // NOTE: If change route, paths in .env, config and lib/url.ts must be changed
    { route: '/api/**', handler: './server-folder/index.ts' },
  ],
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],
  build:{
    // vue-toastification - old commonjs module 
    transpile: ['vue-toastification'],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  plugins: ['@/plugins/persistedState.js'],

  css: [
    '@/assets/css/main.css',
  ],

  runtimeConfig: {
    public: {
      yandexClientId: process.env.yandexClientId,
      yandexClientSecret: process.env.yandexClientSecret
    }
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'ru',
    vueI18n: './i18n.config.ts'
  },

  compatibilityDate: '2024-08-06',
})