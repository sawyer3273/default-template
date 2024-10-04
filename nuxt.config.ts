// https://nuxt.com/docs/api/configuration/nuxt-config 
// @ts-ignore 
export default defineNuxtConfig({
  serverHandlers: [
    // API handlers with express
    // NOTE: If change route, paths in .env, config and lib/url.ts must be changed
    { route: '/api/**', handler: './server-folder/index.ts' },
  ],
  devtools: { enabled: false },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    'nuxt-socket-io',
    //'vue3-carousel-nuxt',
  ],
  io: {
    // module options
    sockets: [{
      name: 'main',
      url:  process.env.SOCKET_URL ? process.env.SOCKET_URL : "http://localhost:3000"
    }]
  },
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

  plugins: ['@/plugins/persistedState.js', '@/plugins/dayjs.js'],

  css: [
    '@/assets/css/main.css',
  ],

  runtimeConfig: {
    public: {
      PORT: '8000',
      SOCKET_PORT: process.env.SOCKET_PORT ? process.env.SOCKET_PORT : '3000',
      bdUrl: process.env.DATABASE_URL,
      projectName: process.env.projectName,
      yandexToken: process.env.yandexToken,
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