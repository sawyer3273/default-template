import {
  mdiAccount,
  mdiCogOutline,
  mdiLogout,
} from '@mdi/js'

export default [
  {
    label: 'Паки',
    to: '/quiz-packs',
  },
  /*{
    label: 'Угадай по касту',
    to: '/cast',
  },*/
  {
    label: 'КиноИнтуиция',
    to: '/intuition',
  },
  {
    style: 'min-w-40',
    isCurrentUser: true,
    menu: [
      {
        icon: mdiAccount,
        label: 'Мой профиль',
        to: '/account'
      },
      {
        icon: mdiCogOutline,
        label: 'Настройки'
      },
      {
        isDivider: true
      },
    ]
  },
  {
    icon: mdiLogout,
    label: 'Выход',
    isDesktopNoLabel: true,
    isLogout: true
  }
]
