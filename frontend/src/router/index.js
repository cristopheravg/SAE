import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores'

// Lazy loading de componentes
const LoginView = () => import('@/views/LoginView.vue')
const AlumnoDashboard = () => import('@/views/alumno/DashboardView.vue')
const MaestroDashboard = () => import('@/views/maestro/DashboardView.vue')
const MaestroCalificaciones = () => import('@/views/maestro/CalificacionesView.vue')
const AdminDashboard = () => import('@/views/admin/DashboardView.vue')
const AdminAlumnos = () => import('@/views/admin/AlumnosView.vue')
const AdminMaestros = () => import('@/views/admin/MaestrosView.vue')
const AdminGrupos = () => import('@/views/admin/GruposView.vue')
const AdminMaterias = () => import('@/views/admin/MateriasView.vue')

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: AlumnoDashboard,
        meta: { roles: ['alumno'] }
      },
      {
        path: 'maestro',
        component: MaestroDashboard,
        meta: { roles: ['maestro', 'admin'] }
      },
      {
        path: 'admin',
        component: AdminDashboard,
        meta: { roles: ['admin'] }
      }
    ]
  },
  {
    path: '/maestro',
    meta: { requiresAuth: true, roles: ['maestro', 'admin'] },
    children: [
      {
        path: 'calificaciones',
        name: 'Calificaciones',
        component: MaestroCalificaciones
      }
    ]
  },
  {
    path: '/admin',
    meta: { requiresAuth: true, roles: ['admin'] },
    children: [
      {
        path: 'alumnos',
        name: 'AdminAlumnos',
        component: AdminAlumnos
      },
      {
        path: 'maestros',
        name: 'AdminMaestros',
        component: AdminMaestros
      },
      {
        path: 'grupos',
        name: 'AdminGrupos',
        component: AdminGrupos
      },
      {
        path: 'materias',
        name: 'AdminMaterias',
        component: AdminMaterias
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth === false) {
    next()
    return
  }

  if (!authStore.isAuthenticated) {
    next('/login')
    return
  }

  if (to.meta.roles && !to.meta.roles.includes(authStore.userRole)) {
    next('/dashboard')
    return
  }

  next()
})

export default router
