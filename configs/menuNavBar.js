import {
  mdiMenu,
  mdiClockOutline,
  mdiCloud,
  mdiCrop,
  mdiAccount,
  mdiCogOutline,
  mdiEmail,
  mdiLogout,
  mdiThemeLightDark,
  mdiGithub,
  mdiReact
} from '@mdi/js'

export default [
  {
    isCurrentUser: true,
    menu: [
      {
        icon: mdiAccount,
        label: 'Мой профиль',
        to: '/ProfileView'
      },
      {
        icon: mdiCogOutline,
        label: 'Настройки'
      },
      {
        isDivider: true
      },
      {
        icon: mdiLogout,
        label: 'Выход',
        isLogout: true
      }
    ]
  },
  {
    icon: mdiThemeLightDark,
    label: 'Light/Dark',
    isDesktopNoLabel: true,
    isToggleLightDark: true
  },
  {
    icon: mdiLogout,
    label: 'Выход',
    isDesktopNoLabel: true,
    isLogout: true
  }
]
