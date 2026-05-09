import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.rol || null)

  const setAuthHeader = () => {
    if (token.value) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    }
  }

  const saveSession = (response) => {
    token.value = response.data.token
    user.value = response.data.user

    localStorage.setItem('token', token.value)
    localStorage.setItem('user', JSON.stringify(user.value))

    setAuthHeader()
  }

  // LOGIN AUTOMÁTICO
  const login = async (email, password) => {
    loading.value = true
    error.value = null

    try {

      // Intentar login maestro/admin
      try {
        const response = await axios.post('/api/auth/maestro/login', {
          email,
          password
        })

        saveSession(response)
        return true

      } catch (err) {
        console.log('No es maestro/admin, intentando alumno...')
      }

      // Intentar login alumno
      try {
        const response = await axios.post('/api/auth/alumno/login', {
          email,
          password
        })

        saveSession(response)
        return true

      } catch (err) {
        error.value =
          err.response?.data?.error || 'Credenciales incorrectas'

        return false
      }

    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null

    localStorage.removeItem('token')
    localStorage.removeItem('user')

    delete axios.defaults.headers.common['Authorization']
  }

  const restoreSession = () => {
    const savedUser = localStorage.getItem('user')

    if (token.value && savedUser) {
      user.value = JSON.parse(savedUser)
      setAuthHeader()
      return true
    }

    return false
  }

  if (token.value) {
    setAuthHeader()
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    userRole,
    login,
    logout,
    restoreSession
  }
})