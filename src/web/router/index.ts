import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/search',
    name: 'search',
    component: () => import(/* webpackChunkName: "about3" */ '../views/search/index.vue')
  },
  {
    path: '/down',
    name: 'down',
    component: () => import(/* webpackChunkName: "about3" */ '../views/down/index.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/down'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export default router
