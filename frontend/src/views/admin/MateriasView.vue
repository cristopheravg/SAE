<template>
  <div class="maestros-container">

    <!-- HEADER -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Gestión de Materias</h1>
        <p class="page-subtitle">Administra el catálogo de materias</p>
      </div>
      <button class="btn btn-primary" @click="openModal()">
        + Nueva Materia
      </button>
    </div>

    <!-- TABLE -->
    <div class="card">

      <div v-if="adminStore.loading" class="loading-container">
        <div class="loading"></div>
      </div>

      <div v-else-if="adminStore.materias.length === 0" class="empty-state">
        No hay materias registradas.
      </div>

      <div v-else class="table-responsive">
        <table class="table">

          <thead>
            <tr>
              <th>Materia</th>
              <th>Código</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="m in adminStore.materias" :key="m.id">

              <td>
                <div class="name-cell">
                  <div class="avatar">
                    {{ m.nombre.charAt(0) }}
                  </div>
                  <span class="name">
                    {{ m.nombre }}
                  </span>
                </div>
              </td>

              <td>
                <span class="status-badge activo">
                  {{ m.codigo }}
                </span>
              </td>

              <td>
                {{ m.descripcion || '-' }}
              </td>

              <td>
                <div class="action-buttons">
                  <button class="btn-icon btn-edit" @click="openModal(m)">
                    ✏️
                  </button>
                  <button class="btn-icon btn-delete" @click="deleteMateria(m.id)">
                    🗑️
                  </button>
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
          <h2>{{ isEdit ? 'Editar Materia' : 'Nueva Materia' }}</h2>
          <button class="close-btn" @click="closeModal()">×</button>
        </div>

        <div class="modal-body">

          <div class="form-group">
            <label>Nombre:</label>
            <input v-model="formData.nombre" type="text" placeholder="Ej: Matemáticas" />
          </div>

          <div class="form-group">
            <label>Código:</label>
            <input v-model="formData.codigo" type="text" placeholder="Ej: MAT101" />
          </div>


          <div class="form-group">
            <label>Grado:</label>

            <select v-model="formData.grado">
              <option value="">Selecciona grado</option>
              <option :value="1">1°</option>
              <option :value="2">2°</option>
              <option :value="3">3°</option>
            </select>
          </div>


          <div class="form-group">
            <label>Descripción:</label>
            <textarea
              v-model="formData.descripcion"
              style="min-height: 100px;"
            ></textarea>
          </div>

        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal()">Cancelar</button>
          <button class="btn btn-primary" @click="saveMateria" :disabled="saving">
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
  codigo: '',
  descripcion: '',
  grado: ''
})

const openModal = (materia = null) => {
  if (materia) {
    isEdit.value = true
    editingId.value = materia.id
    formData.value = { ...materia }
  } else {
    isEdit.value = false
    formData.value = { nombre: '', codigo: '', descripcion: '' }
  }
  showModal.value = true
}

const closeModal = () => showModal.value = false

const saveMateria = async () => {

  if (
    !formData.value.nombre ||
    !formData.value.codigo ||
    !formData.value.grado
  ) {
    alert('Completa todos los campos')
    return
  }


  saving.value = true
  try {
    if (isEdit.value) {
      await adminStore.updateMateria(editingId.value, formData.value)
    } else {
      await adminStore.createMateria(formData.value)
    }
    alert('Materia guardada')
    closeModal()
  } catch (error) {
    alert(error.response?.data?.error || 'Error')
  } finally {
    saving.value = false
  }
}

const deleteMateria = async (id) => {
  if (!confirm('¿Estás seguro?')) return
  try {
    await adminStore.deleteMateria(id)
    alert('Materia eliminada')
  } catch (error) {
    alert('Error')
  }
}

onMounted(() => adminStore.fetchMaterias())
</script>



<style scoped>
/* Contenedor principal */
.maestros-container {
  padding: 1.5rem;
  background: #f0f2f5;
  min-height: 100vh;
}

/* HEADER */
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

/* BOTONES */
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

/* TABLA */
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

/* IDENTIDAD (nombre + avatar) */
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

/* BADGE (código materia) */
.status-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  background: #e3f2fd;
  color: #1a4a6f;
}

/* ACCIONES */
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
.form-group textarea {
  width: 100%;
  padding: 0.5rem 0.7rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 0.8rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2c7da0;
}

/* ESTADOS */
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