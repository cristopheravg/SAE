<template>
  <div class="maestros-container">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Gestión de Alumnos</h1>
        <p class="page-subtitle">Crea, edita y elimina alumnos del sistema</p>
      </div>
      <button class="btn btn-primary" @click="openModal()">
        + Nuevo Alumno
      </button>
    </div>

    <!-- Tabla -->
    <div class="card">
      <div v-if="adminStore.loading" class="loading-container">
        <div class="loading"></div>
      </div>

      <div v-else-if="adminStore.alumnos.length === 0" class="empty-state">
        No hay alumnos registrados.
      </div>

      <div v-else class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Email</th>
              <th>Matrícula</th>
              <th>Grado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="a in adminStore.alumnos" :key="a.id">
              <td>
                <div class="name-cell">
                  <div class="avatar">
                    {{ a.nombre.charAt(0) }}
                  </div>
                  <span class="name">
                    {{ a.nombre }} {{ a.apellido_paterno }}
                  </span>
                </div>
              </td>

              <td>{{ a.email }}</td>
              <td>{{ a.matricula }}</td>
              <td>{{ a.grado }}°</td>

              <td>
                <span :class="['status-badge', a.estado]">
                  {{ a.estado }}
                </span>
              </td>

              <td>
                <div class="action-buttons">
                  <button class="btn-icon btn-edit" @click="openModal(a)">✏️</button>
                  <button class="btn-icon btn-delete" @click="deleteAlumno(a.id)">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal()">
      <div class="modal">

        <div class="modal-header">
          <h2>{{ isEdit ? 'Editar Alumno' : 'Nuevo Alumno' }}</h2>
          <button class="close-btn" @click="closeModal()">×</button>
        </div>

        <div class="modal-body">

          <div class="form-group">
            <label>Nombre:</label>
            <input v-model="formData.nombre" type="text" />
          </div>

          <div class="form-group">
            <label>Apellido Paterno:</label>
            <input v-model="formData.apellido_paterno" type="text" />
          </div>

          <div class="form-group">
            <label>Apellido Materno:</label>
            <input v-model="formData.apellido_materno" type="text" />
          </div>

          <div class="form-group">
            <label>Email:</label>
            <input v-model="formData.email" type="email" />
          </div>

          <div class="form-group">
            <label>Contraseña:</label>
            <input
              v-model="formData.password"
              type="password"
              :placeholder="isEdit ? 'Dejar en blanco para mantener' : ''"
            />
          </div>

          <div class="form-group">
            <label>Matrícula:</label>
            <input v-model="formData.matricula" type="text" />
          </div>

          <div class="form-group">
            <label>Grado:</label>
            <select v-model.number="formData.grado">
              <option value="1">1°</option>
              <option value="2">2°</option>
              <option value="3">3°</option>
            </select>
          </div>

          <div class="form-group">
            <label>Estado:</label>
            <select v-model="formData.estado">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal()">Cancelar</button>
          <button class="btn btn-primary" @click="saveAlumno" :disabled="saving">
            {{ saving ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/stores'

const adminStore = useAdminStore()

const showModal = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const editingId = ref(null)

const formData = ref({
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  email: '',
  password: '',
  matricula: '',
  grado: 1,
  estado: 'activo'
})

const openModal = (alumno = null) => {
  if (alumno) {
    isEdit.value = true
    editingId.value = alumno.id
    formData.value = {
      nombre: alumno.nombre,
      apellido_paterno: alumno.apellido_paterno,
      apellido_materno: alumno.apellido_materno,
      email: alumno.email,
      password: '',
      matricula: alumno.matricula,
      grado: alumno.grado,
      estado: alumno.estado
    }
  } else {
    isEdit.value = false
    formData.value = {
      nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      email: '',
      password: '',
      matricula: '',
      grado: 1,
      estado: 'activo'
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveAlumno = async () => {
  if (!formData.value.nombre || !formData.value.apellido_paterno || !formData.value.email) {
    alert('Completa los campos requeridos')
    return
  }

  saving.value = true
  try {
    if (isEdit.value) {
      await adminStore.updateAlumno(editingId.value, formData.value)
      alert('Alumno actualizado')
    } else {
      if (!formData.value.password) {
        alert('La contraseña es requerida para nuevos alumnos')
        saving.value = false
        return
      }
      await adminStore.createAlumno(formData.value)
      alert('Alumno creado')
    }
    closeModal()
  } catch (error) {
    alert(error.response?.data?.error || 'Error al guardar')
  } finally {
    saving.value = false
  }
}

const deleteAlumno = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este alumno?')) return

  try {
    await adminStore.deleteAlumno(id)
    alert('Alumno eliminado')
  } catch (error) {
    alert('Error al eliminar')
  }
}

onMounted(() => {
  adminStore.fetchAlumnos()
})
</script>



<style scoped>
/* Contenedor principal */
.maestros-container {
  padding: 1.5rem;
  background: #f0f2f5;
  min-height: 100vh;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a2c3e;
  margin: 0 0 0.25rem 0;
}

.page-subtitle {
  font-size: 0.85rem;
  color: #5a6e7c;
  margin: 0;
}

/* Botones */
.btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #2c7da0 0%, #1a4a6f 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(44, 125, 160, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e2e8f0;
  color: #2d3748;
}

.btn-secondary:hover {
  background: #cbd5e0;
}

/* CARD */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* Tabla */
.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.table thead tr {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.table th {
  text-align: left;
  padding: 0.8rem 1rem;
  font-weight: 600;
  color: #1a2c3e;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table td {
  padding: 0.7rem 1rem;
  border-bottom: 1px solid #edf2f7;
  color: #2d3748;
}

.table tbody tr:hover {
  background: #f7fafc;
}

/* Nombre + avatar */
.name-cell {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.avatar {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #2c7da0 0%, #1a4a6f 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.75rem;
}

.name {
  font-weight: 500;
  font-size: 0.85rem;
}

/* STATUS */
.status-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.activo {
  background: #c6f6d5;
  color: #22543d;
}

.status-badge.inactivo {
  background: #fed7d7;
  color: #742a2a;
}

/* ACTIONS */
.action-buttons {
  display: flex;
  gap: 0.4rem;
}

.btn-icon {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-edit {
  background: #fff3e0;
  color: #ed8936;
}

.btn-edit:hover {
  background: #ffe0b2;
}

.btn-delete {
  background: #fee2e2;
  color: #e53e3e;
}

.btn-delete:hover {
  background: #fecaca;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 450px;
  max-width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.2rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 1.1rem;
  color: #1a2c3e;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: #a0aec0;
}

.close-btn:hover {
  color: #e53e3e;
}

.modal-body {
  padding: 1.2rem;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.7rem;
  padding: 0.8rem 1.2rem;
  border-top: 1px solid #e2e8f0;
}

/* FORM */
.form-group {
  margin-bottom: 0.8rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1a2c3e;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem 0.7rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 0.8rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #2c7da0;
}

/* Estados */
.loading-container {
  text-align: center;
  padding: 1.5rem;
}

.loading {
  width: 24px;
  height: 24px;
  border: 2px solid #e2e8f0;
  border-top-color: #2c7da0;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #a0aec0;
  font-size: 0.85rem;
}
</style>
