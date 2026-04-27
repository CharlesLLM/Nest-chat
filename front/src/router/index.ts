import { createRouter, createWebHistory } from 'vue-router'
import GlobalConversation from '@/page/GlobalConversation.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GlobalConversation,
    },
  ],
})

export default router;
