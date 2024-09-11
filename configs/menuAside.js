import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiAccountStar,
  mdiLightbulbOn
} from '@mdi/js'

export default [
  {
    to: '/',
    icon: mdiMonitor,
    label: 'Админка'
  },
  {
    to: '/actors',
    icon: mdiAccountStar,
    label: 'Актеры'
  },
  {
    to: '/intuition',
    icon: mdiLightbulbOn,
    label: 'КиноИнтуиция'
  },
  {
    to: '/Dashboard',
    icon: mdiMonitor,
    label: 'Dashboard'
  },
  {
    to: '/TablesView',
    label: 'Tables',
    icon: mdiTable
  },
  {
    to: '/FormsView',
    label: 'Forms',
    icon: mdiSquareEditOutline
  },
  {
    to: '/UiView',
    label: 'UI',
    icon: mdiTelevisionGuide
  },
  {
    to: '/ResponsiveView',
    label: 'Responsive',
    icon: mdiResponsive
  },
  {
    to: '/ProfileView',
    label: 'Profile',
    icon: mdiAccountCircle
  },
  {
    to: '/login',
    label: 'Login',
    icon: mdiLock
  },
  {
    to: '/ErrorView',
    label: 'Error',
    icon: mdiAlertCircle
  },
  {
    label: 'Dropdown',
    icon: mdiViewList,
    menu: [
      {
        label: 'Item One'
      },
      {
        label: 'Item Two'
      }
    ]
  },
  {
    href: 'https://github.com/sawyer3273/default-template.git',
    label: 'GitHub',
    icon: mdiGithub,
    target: '_blank'
  },
]
