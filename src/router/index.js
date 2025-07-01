import { createRouter, createWebHistory } from 'vue-router'
import RegisterPage from '../views/RegisterPage.vue'
import ArticlesPage from '@/views/ArticlesPage.vue'
import ArticleFormPage from '../views/ArticleFormPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import { getToken } from '@/utils/auth'

const routes = [
  {
    path: '/',
    redirect: '/articles'
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/articles',
    name: 'articles',
    component: ArticlesPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/articles/page/:page',
    name: 'articles-page',
    component: ArticlesPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/articles/create',
    name: 'NewArticle',
    component: ArticleFormPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/articles/edit/:slug',
    name: 'EditArticle',
    component: ArticleFormPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !getToken()) {
    next('/login')
  } else {
    next()
  }
})

export default router 