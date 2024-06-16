import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue';
import AuthComponent from '@/views/AuthComponent.vue';
import Profile from '@/views/Profile.vue';
import ValidateOtp from '@/views/ValidateOtp.vue';

import { useAuthStore } from '@/stores/auth'; // Adjust the path as needed

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login/',
      component: AuthComponent,
      props: { defaultTab: 'signIn' }
    },
    {
      path: '/register/',
      component: AuthComponent,
      props: { defaultTab: 'register' }
    },
    {
      path: '/login/validateOtp',
      component: ValidateOtp,
    },
    {
      path: '/profile/',
      component: Profile,
      meta: { requiresAuth: true },
    },
  ]
})


// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Check if the user is logged in
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.loggedIn) {
      // Redirect to login page if not authenticated
      next({
        path: '/login/',
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
