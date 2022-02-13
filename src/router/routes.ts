import useUser from 'src/pinia/user'
import { RouteRecordRaw } from 'vue-router'

const goHomeIfLoggedIn = () => {
  const user = useUser()

  if (user) {
    return '/'
  }

  return true
}

const goLoginIfNotLoggedIn = () => {
  const user = useUser()

  if (!user) {
    return '/login'
  }

  return true
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Index.vue') }],
  },

  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Login.vue') }],
    beforeEnter: [goHomeIfLoggedIn],
  },

  {
    path: '/register',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/Register.vue') }],
    beforeEnter: [goHomeIfLoggedIn],
  },

  {
    path: '/link-telegram',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/LinkTelegram.vue'),
      },
    ],
    beforeEnter: [goLoginIfNotLoggedIn],
  },

  {
    path: '/chat',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/Chat.vue'),
      },
    ],
    beforeEnter: [goLoginIfNotLoggedIn],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
]

export default routes
