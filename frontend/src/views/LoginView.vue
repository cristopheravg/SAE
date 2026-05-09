<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="login-icon">📚</div>
        <h1>IEX SAE</h1>
        <p>Sistema de Administración Escolar</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="correo@escuela.edu"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          class="btn-login"
          :disabled="authStore.loading"
        >
          <span v-if="authStore.loading" class="loading"></span>
          <span v-else>Iniciar Sesión</span>
        </button>

        <div v-if="authStore.error" class="alert">
          {{ authStore.error }}
        </div>
      </form>
    </div>
  </div>
</template>



<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  const success = await authStore.login(
    form.value.email,
    form.value.password
  )

  if (success) {
    switch (authStore.userRole) {
      case 'admin':
        router.push('/dashboard/admin')
        break

      case 'maestro':
        router.push('/dashboard/maestro')
        break

      default:
        router.push('/dashboard')
    }
  }
}
</script>



<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background:
    radial-gradient(circle at top left, rgba(44, 125, 160, 0.18), transparent 28%),
    radial-gradient(circle at bottom right, rgba(26, 74, 111, 0.20), transparent 30%),
    linear-gradient(135deg, #eef2f7 0%, #dfe8f1 45%, #cfdbe8 100%);
  position: relative;
  overflow: hidden;
  min-height: 100dvh;
}

/* Glow decorativo */
.login-container::before,
.login-container::after {
  content: '';
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.25;
  z-index: 0;
}

.login-container::before {
  background: #2c7da0;
  top: -140px;
  left: -120px;
}

.login-container::after {
  background: #1a4a6f;
  bottom: -160px;
  right: -120px;
}

.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 430px;
  padding: 2.2rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 20px 50px rgba(15, 23, 42, 0.15),
    0 6px 20px rgba(44, 125, 160, 0.08);
  animation: fadeIn 0.35s ease;
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-icon {
  width: 74px;
  height: 74px;
  margin: 0 auto 1rem;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: linear-gradient(135deg, #2c7da0 0%, #1a4a6f 100%);
  color: white;
  box-shadow:
    0 12px 28px rgba(44, 125, 160, 0.3),
    inset 0 1px 0 rgba(255,255,255,0.25);
}

.login-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #1a2c3e;
}

.login-header p {
  margin-top: 0.45rem;
  color: #5a6e7c;
  font-size: 0.92rem;
}

/* Form */
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.45rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #1a2c3e;
}

.form-group input {
  width: 100%;
  height: 50px;
  padding: 0 1rem;
  border-radius: 12px;
  border: 1px solid #cbd5e0;
  background: rgba(255,255,255,0.9);
  font-size: 0.9rem;
  color: #1a2c3e;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #2c7da0;
  background: white;
  box-shadow: 0 0 0 4px rgba(44, 125, 160, 0.12);
}

.form-group input::placeholder {
  color: #94a3b8;
}

/* Selector de roles */
.role-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}

.role-btn {
  height: 50px;
  border-radius: 12px;
  border: 1px solid #dbe4ee;
  background: #f8fafc;
  color: #334155;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-btn:hover {
  transform: translateY(-1px);
  border-color: #2c7da0;
  background: #eef6fb;
}

.role-btn.active {
  background: linear-gradient(135deg, #2c7da0 0%, #1a4a6f 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 10px 24px rgba(44, 125, 160, 0.25);
}

/* Botón */
.btn-login {
  margin-top: 0.6rem;
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #2c7da0 0%, #1a4a6f 100%);
  color: white;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 12px 28px rgba(44, 125, 160, 0.28);
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 16px 34px rgba(44, 125, 160, 0.35);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Loading */
.loading {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* Alert */
.alert {
  margin-top: 0.5rem;
  padding: 0.9rem 1rem;
  border-radius: 12px;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  color: #c53030;
  font-size: 0.84rem;
  font-weight: 500;
}

/* Animaciones */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
    min-height: 100vh;
    min-height: 100dvh;
  }

  .login-card {
    padding: 1.5rem;
    border-radius: 18px;
  }

  .login-header h1 {
    font-size: 1.7rem;
  } 

  .login-icon {
    width: 66px;
    height: 66px;
    font-size: 1.8rem;
  }

  .role-selector {
    grid-template-columns: 1fr;
  }
}
</style>