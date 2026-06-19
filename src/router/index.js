import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Calendar from '../views/Calendar.vue'
import Volunteers from '../views/Volunteers.vue'
import About from '../views/About.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: Calendar
    },
    {
      path: '/volunteers',
      name: 'volunteers',
      component: Volunteers
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})

export default router