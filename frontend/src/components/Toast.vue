<!-- components/Toast.vue -->
<template>
  <div class="toast-container">
    <div 
      v-for="toast in toasts" 
      :key="toast.id"
      :class="['toast', toast.type]"
      @click="removeToast(toast.id)"
    >
      <span class="toast-icon">{{ getIcon(toast.type) }}</span>
      <span class="toast-message">{{ toast.message }}</span>
      <button class="toast-close">×</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const toasts = ref([])
let nextId = 0

const getIcon = (type) => {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  return icons[type] || '📌'
}

const addToast = (message, type = 'info', duration = 3000) => {
  const id = nextId++
  toasts.value.push({ id, message, type })
  
  setTimeout(() => {
    removeToast(id)
  }, duration)
}

const removeToast = (id) => {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

// Exponer métodos globalmente
window.$toast = { addToast }

onMounted(() => {
  window.$toast = { addToast }
})

onUnmounted(() => {
  delete window.$toast
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  animation: slideIn 0.3s ease;
  min-width: 280px;
  max-width: 400px;
  border-left: 4px solid;
}

.toast.success {
  border-left-color: #4caf50;
  background: #f0fff4;
}

.toast.error {
  border-left-color: #f44336;
  background: #fff5f5;
}

.toast.warning {
  border-left-color: #ff9800;
  background: #fff8e1;
}

.toast.info {
  border-left-color: #2196f3;
  background: #e3f2fd;
}

.toast-icon {
  font-size: 1.2rem;
}

.toast-message {
  flex: 1;
  font-size: 0.85rem;
  color: #2d3748;
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #a0aec0;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-close:hover {
  color: #f44336;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>