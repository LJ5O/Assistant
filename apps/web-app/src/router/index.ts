import { createRouter, createWebHistory } from 'vue-router'
import { getStoredToken } from '../API/Utils'

import Login from '../views/Login.vue'
import Control from '../views/Control.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },{
      path: '/control',
      name: 'control',
      component: Control,
      meta: { requiresAuth: true }
    }/*,
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },*/
  ],
})

router.beforeEach((to, from, next) => {
  const token = getStoredToken()

  if(to.meta.requiresAuth && !token){
    next('/'); // Token is not available => login
  }else{
    next(); // Token is available, OK
  }
});

export default router
