import dayjs from 'dayjs'

import dayjs_en from 'dayjs/locale/en'
import dayjs_ru from 'dayjs/locale/ru'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide('dayjs', dayjs);

  nuxtApp.hook('i18n:localeSwitched', ({ newLocale }) => {
    dayjs.locale(newLocale === 'ru' ? dayjs_ru : dayjs_en)
  })
});