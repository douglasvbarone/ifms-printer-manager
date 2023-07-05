// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    component: () => import('@/layouts/simple/Default.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () =>
          import(/* webpackChunkName: "login" */ '@/views/Login.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "home" */ '@/views/Home.vue')
      },

      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () =>
          import(/* webpackChunkName: "notfound" */ '@/views/404.vue')
      }
    ]
  },
  {
    path: '/printer/:serialNumber',
    component: () => import('@/layouts/single/Default.vue'),
    children: [
      {
        path: '',
        name: 'Printer',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "home" */ '@/views/Printer.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
