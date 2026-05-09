<template>
  <div class="grupos-container">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Grupos Escolares</h1>
        <p class="page-subtitle">Administra los grupos 1A, 2A y 3A</p>
      </div>
      <button class="btn btn-outline" @click="verTodasInscripciones">
        📋 Ver Todas las Inscripciones
      </button>
    </div>

    <!-- Tarjetas de grupos (1A, 2A, 3A) -->
    <div class="card">
      <div class="grupos-grid">
        <!-- Grupo 1A -->
        <div class="grupo-card" @click="verAlumnosGrupo(1)">
          <div class="grupo-card-header grado-1">
            <span class="grupo-icon">🌟</span>
            <h3 class="grupo-nombre">1° Grupo</h3>
          </div>
          <div class="grupo-card-body">
            <div class="grupo-info-item">
              <span class="info-label">Grado:</span>
              <span class="info-value">1°</span>
            </div>
            <div class="grupo-info-item">
              <span class="info-label">Alumnos inscritos:</span>
              <span class="info-value">{{ contarAlumnosPorGrado(1) }}</span>
            </div>
          </div>
        </div>

        <!-- Grupo 2A -->
        <div class="grupo-card" @click="verAlumnosGrupo(2)">
          <div class="grupo-card-header grado-2">
            <span class="grupo-icon">📚</span>
            <h3 class="grupo-nombre">2° Grupo</h3>
          </div>
          <div class="grupo-card-body">
            <div class="grupo-info-item">
              <span class="info-label">Grado:</span>
              <span class="info-value">2°</span>
            </div>
            <div class="grupo-info-item">
              <span class="info-label">Alumnos inscritos:</span>
              <span class="info-value">{{ contarAlumnosPorGrado(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Grupo 3A -->
        <div class="grupo-card" @click="verAlumnosGrupo(3)">
          <div class="grupo-card-header grado-3">
            <span class="grupo-icon">🎓</span>
            <h3 class="grupo-nombre">3° Grupo</h3>
          </div>
          <div class="grupo-card-body">
            <div class="grupo-info-item">
              <span class="info-label">Grado:</span>
              <span class="info-value">3°</span>
            </div>
            <div class="grupo-info-item">
              <span class="info-label">Alumnos inscritos:</span>
              <span class="info-value">{{ contarAlumnosPorGrado(3) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal lista de alumnos del grado -->
    <div v-if="showAlumnosModal" class="modal-overlay" @click.self="closeAlumnosModal()">
      <div class="modal modal-alumnos">
        <div class="modal-header">
          <div>
            <h3>{{ gradoSeleccionado }}° Grupo</h3>
            <p class="modal-subtitle">{{ alumnosInscritos.length }} alumnos inscritos</p>
          </div>
          <button class="modal-close" @click="closeAlumnosModal()">×</button>
        </div>
        <div class="modal-body">
          <div v-if="cargandoAlumnos" class="loading-small">
            <div class="spinner-small"></div>
            <span>Cargando alumnos...</span>
          </div>
          <div v-else-if="alumnosInscritos.length === 0" class="empty-small">
            <span>📭</span>
            <p>No hay alumnos inscritos en {{ gradoSeleccionado }}°</p>
          </div>
          <div v-else class="alumnos-list">
            <div v-for="alumno in alumnosInscritos" :key="alumno.id" class="alumno-row">
              <div class="alumno-info">
                <div class="alumno-avatar">{{ (alumno.nombre || 'A').charAt(0) }}</div>
                <div class="alumno-details">
                  <div class="alumno-name">
                    {{ alumno.apellido_paterno || '' }} {{ alumno.apellido_materno || '' }} {{ alumno.nombre || '' }}
                  </div>
                  <div class="alumno-meta">
                    <span>📚 Matrícula: {{ alumno.matricula || 'N/A' }}</span>
                    <span>📧 {{ alumno.email || 'N/A' }}</span>
                    <span>🎓 {{ alumno.grado }}°</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeAlumnosModal()">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Modal para ver todas las inscripciones -->
    <div v-if="showTodasInscripcionesModal" class="modal-overlay" @click.self="closeTodasInscripcionesModal()">
      <div class="modal modal-inscripciones">
        <div class="modal-header">
          <h3>📋 Todas las Inscripciones</h3>
          <button class="modal-close" @click="closeTodasInscripcionesModal()">×</button>
        </div>
        <div class="modal-body">
          <!-- Filtros -->
          <div class="filtros-inscripciones">
            <div class="filtro-grupo">
              <label>Filtrar por grado:</label>
              <select v-model="filtroGrado" class="filter-select" @change="filtrarInscripciones">
                <option value="">Todos los grados</option>
                <option value="1">1° Grado</option>
                <option value="2">2° Grado</option>
                <option value="3">3° Grado</option>
              </select>
            </div>
            <div class="filtro-busqueda">
              <label>Buscar alumno:</label>
              <input 
                type="text" 
                v-model="filtroBusqueda" 
                placeholder="Nombre o matrícula..."
                class="filter-input"
                @input="filtrarInscripciones"
              />
            </div>
            <!--<button class="btn-refresh" @click="cargarTodosLosAlumnos" title="Refrescar">🔄</button>-->
          </div>

          <!-- Tabla de alumnos -->
          <div v-if="cargandoAlumnosTotal" class="loading-small">
            <div class="spinner-small"></div>
            <span>Cargando alumnos...</span>
          </div>
          <div v-else-if="alumnosFiltrados.length === 0" class="empty-small">
            <span>📭</span>
            <p>No hay alumnos registrados</p>
          </div>
          <div v-else class="inscripciones-table-container">
            <table class="inscripciones-table">
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Matrícula</th>
                  <th>Grado</th>
                  <th>Estado</th>
                  <!--<th>Acciones</th>-->
                </tr>
              </thead>
              <tbody>
                <tr v-for="alumno in alumnosFiltrados" :key="alumno.id">
                  <td class="alumno-cell">
                    <!--<div class="alumno-mini-avatar">{{ (alumno.nombre || 'A').charAt(0) }}</div>-->
                    {{ alumno.apellido_paterno || '' }} {{ alumno.nombre || '' }}
                  </td>
                  <td>{{ alumno.matricula || 'N/A' }}</td>
                  <td><span class="grado-badge">{{ alumno.grado }}°</span></td>
                  <td>
                    <span :class="alumno.estado === 'activo' ? 'estado-activo' : 'estado-inactivo'">
                      {{ alumno.estado || 'activo' }}
                    </span>
                  </td>
                  <!--<td>
                    <button class="btn-icon-small btn-danger-small" @click="eliminarAlumno(alumno.id, alumno.nombre)">
                      🗑️
                    </button>
                  </td>-->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <div class="inscripciones-stats">
            Total: {{ alumnosFiltrados.length }} alumnos
          </div>
          <button class="btn-secondary" @click="closeTodasInscripcionesModal()">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAdminStore } from '@/stores'
import axios from 'axios'
import Toast from '@/components/Toast.vue'

const adminStore = useAdminStore()

// Estados
const showAlumnosModal = ref(false)
const showTodasInscripcionesModal = ref(false)
const gradoSeleccionado = ref(null)
const alumnosInscritos = ref([])
const todosLosAlumnos = ref([])
const cargandoAlumnos = ref(false)
const cargandoAlumnosTotal = ref(false)
const filtroGrado = ref('')
const filtroBusqueda = ref('')

// Computed para filtrar alumnos
const alumnosFiltrados = computed(() => {
  let filtrados = [...todosLosAlumnos.value]
  
  if (filtroGrado.value) {
    filtrados = filtrados.filter(a => a.grado === parseInt(filtroGrado.value))
  }
  
  if (filtroBusqueda.value) {
    const busqueda = filtroBusqueda.value.toLowerCase()
    filtrados = filtrados.filter(a => 
      (a.nombre || '').toLowerCase().includes(busqueda) ||
      (a.apellido_paterno || '').toLowerCase().includes(busqueda) ||
      (a.matricula || '').toLowerCase().includes(busqueda)
    )
  }
  
  return filtrados
})

// Contar alumnos por grado
const contarAlumnosPorGrado = (grado) => {
  return todosLosAlumnos.value.filter(a => a.grado === grado && a.estado === 'activo').length
}

// Toast
const showToast = (message, type = 'success') => {
  if (window.$toast) {
    window.$toast.addToast(message, type)
  }
}

// Cargar todos los alumnos
const cargarTodosLosAlumnos = async () => {
  cargandoAlumnosTotal.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('/api/admin/alumnos', {
      headers: { Authorization: `Bearer ${token}` }
    })
    todosLosAlumnos.value = response.data
  } catch (error) {
    console.error('Error:', error)
    showToast('Error al cargar alumnos', 'error')
  } finally {
    cargandoAlumnosTotal.value = false
  }
}

// Ver todas las inscripciones (alumnos)
const verTodasInscripciones = async () => {
  showTodasInscripcionesModal.value = true
  await cargarTodosLosAlumnos()
}

const closeTodasInscripcionesModal = () => {
  showTodasInscripcionesModal.value = false
  filtroGrado.value = ''
  filtroBusqueda.value = ''
}

// Ver alumnos de un grado específico
const verAlumnosGrupo = async (grado) => {
  gradoSeleccionado.value = grado
  showAlumnosModal.value = true
  cargandoAlumnos.value = true
  
  try {
    // Filtrar alumnos por grado
    alumnosInscritos.value = todosLosAlumnos.value.filter(a => a.grado === grado && a.estado === 'activo')
  } catch (error) {
    console.error('Error:', error)
    showToast('Error al cargar alumnos', 'error')
    alumnosInscritos.value = []
  } finally {
    cargandoAlumnos.value = false
  }
}

// Eliminar alumno (soft delete - cambiar estado)
const eliminarAlumno = async (id, nombreAlumno) => {
  if (!confirm(`¿Dar de baja al alumno ${nombreAlumno}?`)) return
  
  try {
    const token = localStorage.getItem('token')
    await axios.put(`/api/admin/alumnos/${id}`, {
      estado: 'inactivo'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    showToast(`✅ ${nombreAlumno} dado de baja`, 'success')
    await cargarTodosLosAlumnos()
  } catch (error) {
    showToast('❌ Error al dar de baja', 'error')
  }
}

const closeAlumnosModal = () => {
  showAlumnosModal.value = false
  gradoSeleccionado.value = null
  alumnosInscritos.value = []
}

onMounted(async () => {
  await cargarTodosLosAlumnos()
})
</script>

<style scoped>
/* CONTENEDOR */
.grupos-container {
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
  margin: 0;
}

.page-subtitle {
  font-size: 0.85rem;
  color: #5a6e7c;
  margin: 0.25rem 0 0;
}

/* BOTONES */
.btn-outline {
  background: transparent;
  border: 1px solid #2c7da0;
  color: #2c7da0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: #e3f2fd;
}

/* CARD */
.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

/* GRID DE GRUPOS */
.grupos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.2rem;
}

/* CARD GRUPO */
.grupo-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
}

.grupo-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

/* HEADER CARD */
.grupo-card-header {
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: linear-gradient(135deg, #2c7da0 0%, #1a4a6f 100%);
}

.grupo-icon {
  font-size: 1.3rem;
}

.grupo-nombre {
  color: white;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

/* BODY CARD */
.grupo-card-body {
  padding: 0.8rem 1rem;
}

.grupo-info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
  font-size: 0.75rem;
  border-bottom: 1px solid #edf2f7;
}

.info-label {
  color: #5a6e7c;
  font-weight: 500;
}

.info-value {
  color: #1a2c3e;
  font-weight: 600;
}

/* MODAL BASE */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* MODAL */
.modal {
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

/* VARIANTES MODAL */
.modal-alumnos {
  width: 650px;
  max-width: 95%;
}

.modal-inscripciones {
  width: 900px;
  max-width: 95%;
}

/* HEADER MODAL */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.2rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #1a2c3e;
  font-weight: 600;
}

.modal-subtitle {
  font-size: 0.7rem;
  color: #5a6e7c;
  margin: 0.2rem 0 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.3rem;
  color: #a0aec0;
  cursor: pointer;
}

.modal-close:hover {
  color: #e53e3e;
}

/* BODY */
.modal-body {
  padding: 1rem;
  overflow-y: auto;
}

/* FOOTER */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  padding: 0.8rem 1rem;
  border-top: 1px solid #e2e8f0;
}

/* BOTÓN SECUNDARIO */
.btn-secondary {
  background: #e2e8f0;
  border: none;
  color: #2d3748;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #cbd5e0;
}

/* ALUMNOS LIST */
.alumnos-list {
  max-height: 450px;
  overflow-y: auto;
}

.alumno-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem;
  border-bottom: 1px solid #edf2f7;
}

.alumno-row:hover {
  background: #f7fafc;
}

.alumno-info {
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.alumno-avatar,
.alumno-mini-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2c7da0 0%, #1a4a6f 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.7rem;
  flex-shrink: 0;
  line-height: 1;

}

.alumno-mini-avatar {
  width: 26px;
  height: 26px;
  min-width: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}



.alumno-details {
  flex: 1;
}

.alumno-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a2c3e;
}

.alumno-meta {
  font-size: 0.65rem;
  color: #5a6e7c;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* FILTROS */
.filtros-inscripciones {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.filtro-grupo,
.filtro-busqueda {
  flex: 1;
  min-width: 180px;
}

.filter-select,
.filter-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.75rem;
}

/* TABLA */
.inscripciones-table-container {
  overflow-x: auto;
  max-height: 450px;
}

.inscripciones-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}

.inscripciones-table td {
  padding: 0.45rem 0.6rem;
  vertical-align: middle;
}

.inscripciones-table th {
  background: #f7fafc;
  padding: 0.6rem;
  text-align: left;
  font-weight: 600;
  color: #1a2c3e;
  position: sticky;
  top: 0;
}

.inscripciones-table td {
  padding: 0.6rem;
  border-bottom: 1px solid #edf2f7;
}

.inscripciones-table tbody tr:hover {
  background: #f7fafc;
}

/* BADGES */
.grado-badge {
  background: #e3f2fd;
  color: #2c7da0;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
}

.estado-activo {
  background: #c6f6d5;
  color: #22543d;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
}

.estado-inactivo {
  background: #fed7d7;
  color: #742a2a;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
}

/* LOADING */
.loading-small {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  padding: 2rem;
  color: #2c7da0;
  font-size: 0.75rem;
}

.spinner-small {
  width: 18px;
  height: 18px;
  border: 2px solid #e2e8f0;
  border-top-color: #2c7da0;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* EMPTY */
.empty-small {
  text-align: center;
  padding: 2rem;
  color: #a0aec0;
  font-size: 0.8rem;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .grupos-container {
    padding: 1rem;
  }

  .modal-inscripciones,
  .modal-alumnos {
    width: 95%;
  }

  .alumno-meta {
    flex-direction: column;
    gap: 0.2rem;
  }

.alumno-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1;
  white-space: nowrap;
}

  .filtros-inscripciones {
    flex-direction: column;
  }
}
</style>