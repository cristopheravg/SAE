<template>
  <div id="app">
    <LoginView v-if="!authStore.isAuthenticated" />

    <template v-else>
      <!-- TOPBAR -->
      <header class="topbar">
        <div class="topbar-content">
          <div class="topbar-left">
            <button class="menu-btn" @click="sidebarOpen = !sidebarOpen" aria-label="Menú">
              <span class="hamburger">
                <i></i>
                <i></i>
                <i></i>
              </span>
            </button>

            <div class="brand">
              <h1 class="brand-name">IEX SAE</h1>
              <!--<span class="brand-sub">Sistema Escolar</span>-->
            </div>
          </div>

          <div class="topbar-center">
            <div class="search-box">
              <input
                type="text"
                class="search-input"
                placeholder="Buscar..."
                aria-label="Buscar"
              />
              <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.2"/>
                <path d="M11 11l3.5 3.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>

          <div class="topbar-right">
            <div class="user-menu">
              <div class="user-avatar">
                {{ authStore.user?.nombre?.charAt(0) || 'U' }}
              </div>

              <div class="user-details">
                <div class="user-name">
                  {{ authStore.user?.nombre }}
                </div>
                <div class="user-role">
                  {{
                    authStore.userRole === 'admin'
                      ? 'Administrador'
                      : authStore.userRole === 'maestro'
                      ? 'Docente'
                      : 'Estudiante'
                  }}
                </div>
              </div>

              <button class="logout-btn" @click="logout" title="Cerrar sesión" aria-label="Cerrar sesión">
                ✕
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- LAYOUT -->
      <div class="app-layout" :class="{ 'sidebar-collapsed': !sidebarOpen }">
        <!-- SIDEBAR -->
        <aside class="sidebar" v-if="authStore.userRole !== 'alumno'" :class="{ 'is-open': sidebarOpen }">
          <nav class="nav-menu">
            <!-- MAESTRO -->
            <template v-if="authStore.userRole === 'maestro'">
              <router-link
                to="/dashboard/maestro"
                class="nav-link"
                :class="{ active: $route.path === '/dashboard/maestro' }"
              >
                <span class="nav-icon">📊</span>
                <span class="nav-label">Inicio</span>
              </router-link>

              <router-link
                to="/maestro/calificaciones"
                class="nav-link"
                :class="{ active: $route.path === '/maestro/calificaciones' }"
              >
                <span class="nav-icon">✓</span>
                <span class="nav-label">Calificaciones</span>
              </router-link>
            </template>

            <!-- ADMIN -->
            <template v-if="authStore.userRole === 'admin'">
              <router-link
                to="/dashboard/admin"
                class="nav-link"
                :class="{ active: $route.path === '/dashboard/admin' }"
              >
                <span class="nav-icon">📊</span>
                <span class="nav-label">Resumen</span>
              </router-link>

              <router-link
                to="/admin/alumnos"
                class="nav-link"
                :class="{ active: $route.path === '/admin/alumnos' }"
              >
                <span class="nav-icon">👤</span>
                <span class="nav-label">Estudiantes</span>
              </router-link>

              <router-link
                to="/admin/maestros"
                class="nav-link"
                :class="{ active: $route.path === '/admin/maestros' }"
              >
                <span class="nav-icon">👨‍🏫</span>
                <span class="nav-label">Docentes</span>
              </router-link>

              <router-link
                to="/admin/grupos"
                class="nav-link"
                :class="{ active: $route.path === '/admin/grupos' }"
              >
                <span class="nav-icon">📋</span>
                <span class="nav-label">Grupos</span>
              </router-link>

              <router-link
                to="/admin/materias"
                class="nav-link"
                :class="{ active: $route.path === '/admin/materias' }"
              >
                <span class="nav-icon">📚</span>
                <span class="nav-label">Materias</span>
              </router-link>
            </template>
          </nav>
        </aside>

        <!-- CONTENT -->
        <main class="main-content">
          <!-- ALERT -->
          <transition name="alert-fade">
            <div v-if="showAlert" class="alert" :class="'alert-' + alertType">
              <span class="alert-dot"></span>
              {{ alertMessage }}
            </div>
          </transition>

          <div class="content-inner">
            <router-view />
          </div>
        </main>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import LoginView from '@/views/LoginView.vue'

const router = useRouter()
const authStore = useAuthStore()

const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref('success')
const sidebarOpen = ref(true)

onMounted(() => {
  authStore.restoreSession()
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const showNotification = (message, type = 'success', duration = 3000) => {
  alertMessage.value = message
  alertType.value = type
  showAlert.value = true

  setTimeout(() => {
    showAlert.value = false
  }, duration)
}

window.$notify = showNotification
</script>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    'Helvetica Neue',
    system-ui,
    sans-serif;

  background: #fafafa;
  color: #2c2c2c;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}

/* TOPBAR */
.topbar {
  height: 56px;
  background: #ffffff;
  border-bottom: 1px solid #ececec;
  position: sticky;
  top: 0;
  z-index: 100;
}

.topbar-content {
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  max-width: 1920px;
  margin: 0 auto;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 0;
}

.menu-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
}

.menu-btn:hover {
  opacity: 0.6;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 20px;
  height: 16px;
}

.hamburger i {
  display: block;
  width: 100%;
  height: 1.5px;
  background: #2c2c2c;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.brand-name {
  margin: 0;
  font-size: 25px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #1a1a1a;
}

.brand-sub {
  font-size: 15px;
  color: #999;
  letter-spacing: 0.2px;
  font-weight: 500;
}

/* SEARCH */
.topbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 480px;
}

.search-input {
  width: 100%;
  height: 36px;
  padding: 0 12px 0 36px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
  font-size: 13px;
  color: #2c2c2c;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  background: #ffffff;
  border-color: #d0d0d0;
  box-shadow: 0 0 0 2px rgba(44, 44, 44, 0.05);
}

.search-input::placeholder {
  color: #bbb;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
}

/* USER MENU */
.topbar-right {
  display: flex;
  align-items: center;
  min-width: 0;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #4f46e5, #6d28d9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.user-name {
  font-size: 12px;
  font-weight: 600;
  color: #2c2c2c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 10px;
  color: #999;
  font-weight: 500;
  white-space: nowrap;
}

.logout-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e0e0e0;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: #999;
  font-size: 16px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
}

.logout-btn:hover {
  border-color: #d0d0d0;
  color: #2c2c2c;
  background: #f5f5f5;
}

/* LAYOUT */
.app-layout {
  display: flex;
  min-height: calc(100vh - 56px);
}

.app-layout.sidebar-collapsed .sidebar {
  transform: translateX(-100%);
}

/* SIDEBAR */
.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #ececec;
  overflow-y: auto;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
}

.nav-menu {
  list-style: none;
  padding: 16px 8px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  text-decoration: none;
  color: #666;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: #2c2c2c;
  background: #f5f5f5;
}

.nav-link.active {
  color: #4f46e5;
  background: #f0f0ff;
}

.nav-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 24px;
  background: #4f46e5;
  border-radius: 0 1px 1px 0;
}

.nav-icon {
  width: 16px;
  text-align: center;
  font-size: 13px;
  flex-shrink: 0;
}

.nav-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* CONTENT */
.main-content {
  flex: 1;
  padding: 32px 40px;
  overflow-y: auto;
  position: relative;
}

.content-inner {
  max-width: 1400px;
  margin: 0 auto;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ALERT */
.alert {
  position: fixed;
  top: 72px;
  right: 40px;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.alert-dot {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.alert-success {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #d1fae5;
}

.alert-success .alert-dot {
  background: #065f46;
}

.alert-error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fee2e2;
}

.alert-error .alert-dot {
  background: #991b1b;
}

.alert-warning {
  background: #fffbeb;
  color: #92400e;
  border: 1px solid #fcd34d;
}

.alert-warning .alert-dot {
  background: #92400e;
}

/* TRANSITIONS */
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .topbar-content {
    padding: 0 16px;
    gap: 16px;
  }

  .topbar-center {
    display: none;
  }

  .sidebar {
    position: fixed;
    left: 0;
    top: 56px;
    height: calc(100vh - 56px);
    z-index: 99;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06);
  }

  .app-layout.sidebar-collapsed .sidebar {
    transform: translateX(-240px);
  }

  .main-content {
    padding: 24px 20px;
  }

  .content-inner {
    max-width: 100%;
  }

  .alert {
    right: 20px;
    top: 64px;
  }
}

@media (max-width: 640px) {
  .topbar-content {
    padding: 0 12px;
  }

  .brand-sub {
    display: none;
  }

  .user-details {
    display: none;
  }

  .logout-btn {
    margin-left: 4px;
  }

  .main-content {
    padding: 16px 12px;
  }

  .content-inner {
    max-width: 100%;
  }

  .alert {
    right: 12px;
    left: 12px;
    top: 62px;
  }

  .sidebar {
    width: 200px;
  }

  .app-layout.sidebar-collapsed .sidebar {
    transform: translateX(-200px);
  }
}
</style>