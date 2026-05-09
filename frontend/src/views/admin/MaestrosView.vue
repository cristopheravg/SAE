<template>
  <div class="maestros-container">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Gestión de Maestros</h1>
        <p class="page-subtitle">Administra el personal docente y sus horarios de clase</p>
      </div>
      <button class="btn btn-primary" @click="openModal()">
        + Nuevo Maestro
      </button>
    </div>

    <!-- Tabla de maestros -->
    <div class="card">
      <div v-if="adminStore.loading" class="loading-container">
        <div class="loading"></div>
      </div>
      <div v-else class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Maestro</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in adminStore.maestros" :key="m.id">
              <td>
                <div class="name-cell">
                  <div class="avatar">{{ m.nombre.charAt(0) }}</div>
                  <span class="name">{{ m.nombre }}</span>
                </div>
              </td>
              <td>{{ m.email }}</td>
              <td>
                <span :class="['status-badge', m.estado]">{{ m.estado }}</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon btn-schedule" @click="verHorario(m)" title="Ver horario">📅</button>
                  <button class="btn-icon btn-edit" @click="openModal(m)" title="Editar">✏️</button>
                  <button class="btn-icon btn-delete" @click="deleteMaestro(m.id)" title="Eliminar">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal crear/editar maestro -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal()">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ isEdit ? 'Editar Maestro' : 'Nuevo Maestro' }}</h2>
          <button class="close-btn" @click="closeModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nombre Completo:</label>
            <input v-model="formData.nombre" type="text" placeholder="Ej: Juan Pérez" />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="formData.email" type="email" placeholder="juan@escuela.edu" />
          </div>
          <div class="form-group">
            <label>Contraseña:</label>
            <input v-model="formData.password" type="password" :placeholder="isEdit ? 'Dejar en blanco para mantener' : 'Ingrese contraseña'" />
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
          <button class="btn btn-primary" @click="saveMaestro" :disabled="saving">
            {{ saving ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal horario -->
    <div v-if="showHorarioModal" class="modal-overlay" @click.self="closeHorarioModal()">
      <div class="modal modal-large">
        <div class="modal-header">
          <h2>Horario - {{ maestroSeleccionado?.nombre }}</h2>
          <button class="close-btn" @click="closeHorarioModal()">×</button>
        </div>
        <div class="modal-body">
          <!-- Selector de grupo -->
          <div class="selector-grupo">
            <label>📋 Seleccionar Grupo:</label>
            <select v-model="grupoId" class="form-control" @change="cargarAsignaciones">
              <option value="">-- Seleccione un grupo --</option>
              <option v-for="g in adminStore.grupos" :key="g.id" :value="g.id">
                {{ g.nombre }} 
              </option>
            </select>
          </div>

          <!-- Tabla de horario -->
          <div v-if="grupoId" class="tabla-container">
            <div v-if="cargando" class="loading-container">
              <div class="loading"></div>
              <span>Cargando horario...</span>
            </div>
            <div v-else class="table-responsive">
              <table class="horario-table">
                <thead>
                  <tr>
                    <th class="hora-col">Horario</th>
                    <th v-for="dia in dias" :key="dia" class="dia-col">{{ dia }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="hora in horas" :key="hora.inicio">
                    <td class="hora-cell" :class="{ receso: hora.esReceso }">
                      {{ hora.inicio }} - {{ hora.fin }}
                    </td>
                    <td 
                      v-for="dia in dias" 
                      :key="dia" 
                      class="materia-cell"
                      :class="{ 
                        ocupado: getMateriaEnCelda(dia, hora.inicio),
                        receso: hora.esReceso
                      }"
                      @click="!hora.esReceso && abrirAsignar(dia, hora.inicio)"
                    >
                      <div v-if="getMateriaEnCelda(dia, hora.inicio)" class="materia-content">
                        <span class="materia-nombre">{{ getMateriaEnCelda(dia, hora.inicio).materia }}</span>
                        <button 
                          class="btn-eliminar" 
                          @click.stop="eliminarAsignacion(getMateriaEnCelda(dia, hora.inicio).id)"
                        >
                          ✕
                        </button>
                      </div>
                      <span v-else-if="!hora.esReceso" class="mas">+</span>
                      <span v-else class="receso-text">☕</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="empty-state">Seleccione un grupo para ver el horario</div>

          <!-- Leyenda -->
          <div class="leyenda">
            <div class="leyenda-item">
              <span class="color-box ocupado"></span> Materia Asignada
            </div>
            <div class="leyenda-item">
              <span class="color-box disponible"></span> Disponible
            </div>
            <div class="leyenda-item">
              <span class="color-box receso"></span> Receso
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeHorarioModal()">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Modal asignar materia -->
    <div v-if="showAsignarModal" class="modal-overlay" @click.self="closeAsignarModal()">
      <div class="modal modal-small">
        <div class="modal-header">
          <h2>Asignar Materia</h2>
          <button class="close-btn" @click="closeAsignarModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="info-celda">
            <span>📅 {{ celda.dia }}</span>
            <span>⏰ {{ celda.hora }} - {{ calcularFinClase(celda.hora) }}</span>
          </div>
          <div class="form-group">
            <label>Materia:</label>
            <select v-model="materiaId" class="form-control" autofocus>
              <option value="">-- Seleccionar materia --</option>
              <option v-for="m in adminStore.materias" :key="m.id" :value="m.id">
                {{ m.nombre }} ({{ m.codigo }})
              </option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeAsignarModal()">Cancelar</button>
          <button class="btn btn-primary" @click="guardarAsignacion" :disabled="!materiaId || guardando">
            {{ guardando ? 'Asignando...' : 'Asignar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Component -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/stores'
import axios from 'axios'
import Toast from '@/components/Toast.vue'

const adminStore = useAdminStore()

// Estados
const showModal = ref(false)
const showHorarioModal = ref(false)
const showAsignarModal = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const guardando = ref(false)
const editingId = ref(null)
const maestroSeleccionado = ref(null)
const grupoId = ref('')
const asignaciones = ref([])
const cargando = ref(false)

const formData = ref({ nombre: '', email: '', password: '', estado: 'activo' })
const celda = ref({ dia: '', hora: '' })
const materiaId = ref('')

// Datos de horario
const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
const horas = [
  { inicio: '07:00', fin: '07:50', esReceso: false },
  { inicio: '07:50', fin: '08:40', esReceso: false },
  { inicio: '08:40', fin: '09:30', esReceso: false },
  { inicio: '09:30', fin: '10:00', esReceso: true },
  { inicio: '10:00', fin: '10:50', esReceso: false },
  { inicio: '10:50', fin: '11:40', esReceso: false },
  { inicio: '11:40', fin: '12:30', esReceso: false },
  { inicio: '12:30', fin: '13:20', esReceso: false },
  { inicio: '13:20', fin: '14:10', esReceso: false }
]

// Helpers
const normalizarHora = (hora) => hora?.substring(0, 5)

const calcularFinClase = (horaInicio) => {
  const hora = horas.find(h => h.inicio === horaInicio)
  return hora ? hora.fin : ''
}

const getMateriaEnCelda = (dia, hora) => {
  return asignaciones.value.find(a => 
    a.dia_semana === dia && normalizarHora(a.horario_inicio) === hora
  )
}

// Toast
const showToast = (message, type = 'success') => {
  if (window.$toast) {
    window.$toast.addToast(message, type)
  }
}

// Cargar asignaciones
const cargarAsignaciones = async () => {
  if (!grupoId.value || !maestroSeleccionado.value) return
  
  cargando.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`/api/admin/maestros/${maestroSeleccionado.value.id}/asignaciones`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    let filtradas = response.data.filter(a => a.grupo_id == grupoId.value)
    filtradas = filtradas.map(a => ({
      ...a,
      horario_inicio: normalizarHora(a.horario_inicio),
      horario_fin: normalizarHora(a.horario_fin)
    }))
    
    asignaciones.value = filtradas
  } catch (error) {
    console.error('Error:', error)
    showToast('Error al cargar el horario', 'error')
    asignaciones.value = []
  } finally {
    cargando.value = false
  }
}

// Asignar materia
const abrirAsignar = (dia, hora) => {
  celda.value = { dia, hora }
  materiaId.value = ''
  showAsignarModal.value = true
}

const guardarAsignacion = async () => {
  if (!materiaId.value) {
    showToast('Selecciona una materia', 'warning')
    return
  }
  
  guardando.value = true
  try {
    const token = localStorage.getItem('token')
    
    // Verificar si ya existe una materia en esa celda
    const existe = getMateriaEnCelda(celda.value.dia, celda.value.hora)
    if (existe) {
      showToast('Ya hay una materia asignada en este horario', 'warning')
      guardando.value = false
      return
    }
    
    await axios.post('/api/admin/asignaciones', {
      maestro_id: maestroSeleccionado.value.id,
      grupo_id: parseInt(grupoId.value),
      materia_id: parseInt(materiaId.value),
      dia_semana: celda.value.dia,
      horario_inicio: celda.value.hora,
      horario_fin: calcularFinClase(celda.value.hora)
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    await new Promise(resolve => setTimeout(resolve, 500))
    await cargarAsignaciones()
    closeAsignarModal()
    showToast('✅ Materia asignada correctamente', 'success')
  } catch (error) {
    showToast(error.response?.data?.error || '❌ Error al asignar materia', 'error')
  } finally {
    guardando.value = false
  }
}

const eliminarAsignacion = async (id) => {
  if (!confirm('¿Eliminar esta asignación?')) return
  
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`/api/admin/asignaciones/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    await cargarAsignaciones()
    showToast('✅ Asignación eliminada', 'success')
  } catch (error) {
    showToast('❌ Error al eliminar', 'error')
  }
}

// CRUD Maestros
const openModal = (maestro = null) => {
  if (maestro) {
    isEdit.value = true
    editingId.value = maestro.id
    formData.value = { ...maestro, password: '' }
  } else {
    isEdit.value = false
    formData.value = { nombre: '', email: '', password: '', estado: 'activo' }
  }
  showModal.value = true
}

const closeModal = () => { showModal.value = false }

const verHorario = (maestro) => {
  maestroSeleccionado.value = maestro
  grupoId.value = ''
  asignaciones.value = []
  showHorarioModal.value = true
}

const closeHorarioModal = () => {
  showHorarioModal.value = false
  maestroSeleccionado.value = null
  grupoId.value = ''
  asignaciones.value = []
}

const closeAsignarModal = () => {
  showAsignarModal.value = false
  celda.value = { dia: '', hora: '' }
  materiaId.value = ''
}

const saveMaestro = async () => {
  if (!formData.value.nombre || !formData.value.email) {
    showToast('Complete los campos requeridos', 'warning')
    return
  }
  
  saving.value = true
  try {
    if (isEdit.value) {
      await adminStore.updateMaestro(editingId.value, formData.value)
      showToast('✅ Maestro actualizado correctamente', 'success')
    } else {
      if (!formData.value.password) {
        showToast('La contraseña es requerida', 'warning')
        saving.value = false
        return
      }
      await adminStore.createMaestro(formData.value)
      showToast('✅ Maestro creado correctamente', 'success')
    }
    closeModal()
    await adminStore.fetchMaestros()
  } catch (error) {
    showToast(error.response?.data?.error || '❌ Error al guardar', 'error')
  } finally {
    saving.value = false
  }
}

const deleteMaestro = async (id) => {
  if (!confirm('¿Eliminar este maestro?')) return
  try {
    await adminStore.deleteMaestro(id)
    showToast('✅ Maestro eliminado', 'success')
    await adminStore.fetchMaestros()
  } catch (error) {
    showToast('❌ Error al eliminar', 'error')
  }
}

onMounted(async () => {
  await Promise.all([
    adminStore.fetchMaestros(),
    adminStore.fetchMaterias(),
    adminStore.fetchGrupos()
  ])
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
  transform: none;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e2e8f0;
  color: #2d3748;
}

.btn-secondary:hover {
  background: #cbd5e0;
}

/* Tabla maestros */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

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
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-schedule {
  background: #e3f2fd;
  color: #2c7da0;
}

.btn-schedule:hover {
  background: #bbdef5;
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

/* Modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
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

.modal-large {
  width: 1100px;
  max-width: 95%;
}

.modal-small {
  width: 380px;
  max-width: 90%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.2rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a2c3e;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: #a0aec0;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #e53e3e;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.2rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.7rem;
  padding: 0.8rem 1.2rem;
  border-top: 1px solid #e2e8f0;
}

/* Formulario */
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
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #2c7da0;
}

/* Selector grupo */
.selector-grupo {
  margin-bottom: 1.2rem;
  padding: 0.8rem;
  background: #f7fafc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.selector-grupo label {
  font-weight: 600;
  font-size: 0.75rem;
  color: #1a2c3e;
}

.form-control {
  flex: 1;
  min-width: 200px;
  padding: 0.5rem 0.7rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 0.8rem;
}

/* Tabla horario */
.horario-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.7rem;
}

.horario-table th,
.horario-table td {
  border: 1px solid #e2e8f0;
  padding: 0.5rem 0.3rem;
  text-align: center;
  vertical-align: middle;
}

.hora-col {
  width: 100px;
  background: #1a2c3e;
  color: white;
  font-weight: 600;
  font-size: 0.7rem;
}

.dia-col {
  background: #2c7da0;
  color: white;
  font-weight: 600;
  min-width: 90px;
  font-size: 0.7rem;
}

.hora-cell {
  background: #e8f0f5;
  font-weight: 600;
  color: #1a2c3e;
  font-size: 0.7rem;
  white-space: nowrap;
}

.hora-cell.receso {
  background: #fef5e7;
  color: #c05621;
}

.materia-cell {
  cursor: pointer;
  background: white;
  transition: all 0.2s;
  height: 42px;
}

.materia-cell:hover:not(.receso) {
  background: #e3f2fd;
}

.materia-cell.ocupado {
  background: #c6f6d5;
}

.materia-cell.receso {
  background: #fef5e7;
  cursor: default;
}

.materia-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.3rem;
}

.materia-nombre {
  font-size: 0.65rem;
  font-weight: 600;
  color: #2d3748;
  flex: 1;
  text-align: left;
  white-space: normal;
  word-break: break-word;
  line-height: 1.2;
  max-width: 85px;
}

.btn-eliminar {
  background: #fc8181;
  border: none;
  color: white;
  font-size: 0.6rem;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;
}

.btn-eliminar:hover {
  background: #f56565;
}

.mas {
  font-size: 1rem;
  color: #cbd5e0;
  font-weight: bold;
}

.receso-text {
  font-size: 0.9rem;
}

/* Leyenda */
.leyenda {
  margin-top: 1.2rem;
  padding: 0.6rem 0.8rem;
  background: #f7fafc;
  border-radius: 8px;
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
  font-size: 0.65rem;
}

.leyenda-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.color-box {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.color-box.ocupado {
  background: #c6f6d5;
  border: 1px solid #9ae6b4;
}

.color-box.disponible {
  background: white;
  border: 1px solid #cbd5e0;
}

.color-box.receso {
  background: #fef5e7;
  border: 1px solid #fbd38d;
}

/* Info celda */
.info-celda {
  display: flex;
  justify-content: space-between;
  background: #e3f2fd;
  padding: 0.6rem;
  border-radius: 6px;
  margin-bottom: 0.8rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #1565c0;
}

/* Estados */
.loading-container {
  text-align: center;
  padding: 1.5rem;
}

.loading {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 2px solid #e2e8f0;
  border-top-color: #2c7da0;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #a0aec0;
  font-size: 0.8rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .maestros-container {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.2rem;
  }
  
  .modal-large {
    width: 98%;
  }
  
  .hora-col {
    width: 75px;
  }
  
  .dia-col {
    min-width: 70px;
  }
  
  .materia-nombre {
    max-width: 55px;
    font-size: 0.6rem;
  }
}
</style>