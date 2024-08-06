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
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  css: [
    '@/assets/css/main.css',
  ],


  compatibilityDate: '2024-08-06',
})