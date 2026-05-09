<template>
  <div class="dashboard-container">
    <!-- Header -->
    <div class="dashboard-header">
      <div>
        <h1 class="dashboard-title">Mi Panel de Clases</h1>
        <p class="dashboard-subtitle">Visualiza tus grupos, materias y horario semanal</p>
      </div>
      <div class="date-badge">
        <span class="date-day">{{ fechaActual }}</span>
        <span class="date-year">{{ fechaAnio }}</span>
      </div>
    </div>

    <div v-if="maestroStore.loading" class="loading-container">
      <div class="loading-spinner"></div>
      <span>Cargando tu información...</span>
    </div>

    <div v-else>
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <span class="stat-value">{{ maestroStore.grupos.length }}</span>
            <span class="stat-label">Grupos</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📖</div>
          <div class="stat-content">
            <span class="stat-value">{{ totalMateriasUnicas }}</span>
            <span class="stat-label">Materias</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏰</div>
          <div class="stat-content">
            <span class="stat-value">{{ totalHorasSemanales }}</span>
            <span class="stat-label">Horas Semanales</span>
          </div>
        </div>
      </div>

      <!-- Horario Semanal (Tabla estilo profesional) -->
      <div class="card">
        <div class="card-header">
          <h3>📅 Horario Semanal</h3>
          <div class="legend">
            <span class="legend-dot legend-1a"></span> 1° Grado
            <span class="legend-dot legend-2a"></span> 2° Grado
            <span class="legend-dot legend-3a"></span> 3° Grado
          </div>
        </div>
        <div v-if="maestroStore.horarios.length === 0" class="empty-state">
          <span>📭</span>
          <p>No hay horarios programados</p>
        </div>
        <div v-else class="horario-wrapper">
          <table class="horario-table">
            <thead>
              <tr>
                <th class="hora-col">Hora</th>
                <th v-for="dia in diasSemana" :key="dia" class="dia-col">{{ dia }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="hora in horasDelDia" :key="hora.inicio">
                <td class="hora-cell" :class="{ 'receso': hora.esReceso }">
                  {{ hora.inicio }} - {{ hora.fin }}
                </td>
                <td 
                  v-for="dia in diasSemana" 
                  :key="dia" 
                  class="materia-cell"
                  :class="getCellClass(dia, hora.inicio)"
                >
                  <div v-if="getClase(dia, hora.inicio)" class="clase-content">
                    <span class="materia-nombre">{{ getClase(dia, hora.inicio).materia }}</span>
                    <span class="grupo-badge" :class="getGradoClass(getClase(dia, hora.inicio).grado)">
                      {{ getClase(dia, hora.inicio).grupo }}
                    </span>
                  </div>
                  <span v-else-if="!hora.esReceso" class="vacio">—</span>
                  <span v-else class="receso-mark">🍽️</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mis Grupos -->
      <div class="card">
        <div class="card-header">
          <h3>👥 Mis Grupos</h3>
          <span class="header-badge">{{ maestroStore.grupos.length }} grupos</span>
        </div>
        <div v-if="maestroStore.grupos.length === 0" class="empty-state">
          <span>📭</span>
          <p>No tienes grupos asignados</p>
        </div>
        <div v-else class="grupos-grid">
          <div
            v-for="grupo in maestroStore.grupos"
            :key="grupo.id"
            class="grupo-card"
            :class="getGradoClaseCard(grupo.grado)"
          >
            <div class="grupo-card-header">
              <span class="grupo-icon">{{ getGrupoIcon(grupo.grado) }}</span>
              <h4>{{ grupo.nombre }}</h4>
            </div>
            <div class="grupo-card-body">
              <div class="info-row">
                <span class="info-label">Grado</span>
                <span class="info-value">{{ grupo.grado }}°</span>
              </div>
              <div class="info-row">
                <span class="info-label">Turno</span>
                <span class="info-value">{{ grupo.turno === 'matutino' ? 'Matutino' : 'Vespertino' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Sección</span>
                <span class="info-value">{{ grupo.seccion || 'A' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMaestroStore } from '@/stores'

const maestroStore = useMaestroStore()

// Fecha actual
const fechaActual = computed(() => {
  const fecha = new Date()
  return fecha.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
})

const normalizarHora = (hora) => hora?.substring(0, 5)

const fechaAnio = computed(() => {
  return new Date().getFullYear()
})

// Datos para la tabla de horario
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']

const horasDelDia = [
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

// Computed para estadísticas
const totalMateriasUnicas = computed(() => {
  const materias = new Set(maestroStore.horarios.map(h => h.materia))
  return materias.size
})

const totalHorasSemanales = computed(() => {
  return maestroStore.horarios.length
})

// Función para obtener la clase en una celda específica
const getClase = (dia, hora) => {
  return maestroStore.horarios.find(h => 
    h.dia_semana === dia && normalizarHora(h.horario_inicio) === hora
  )
}

// Función para obtener la clase CSS de la celda
const getCellClass = (dia, hora) => {
  const clase = getClase(dia, hora)
  if (!clase) return ''
  
  const grado = clase.grupo?.charAt(0) || '1'
  return `clase-${grado}`
}

// Función para obtener clase CSS del grado
const getGradoClass = (grado) => {
  if (grado === 1 || grado === '1') return 'grado-1'
  if (grado === 2 || grado === '2') return 'grado-2'
  return 'grado-3'
}

const getGradoClaseCard = (grado) => {
  if (grado === 1) return 'grado-1-card'
  if (grado === 2) return 'grado-2-card'
  return 'grado-3-card'
}

const getGrupoIcon = (grado) => {
  if (grado === 1) return '🌟'
  if (grado === 2) return '📚'
  return '🎓'
}

onMounted(() => {
  maestroStore.fetchGrupos()
  maestroStore.fetchMaterias()
  maestroStore.fetchHorarios()
})
</script>

<style scoped>
.dashboard-container {
  padding: 1.5rem;
  background: #f1f5f9;
  min-height: 100vh;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.8rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.dashboard-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
}

.dashboard-subtitle {
  font-size: 0.85rem;
  color: #475569;
  margin: 0;
}

.date-badge {
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.date-day {
  display: block;
  font-size: 0.75rem;
  color: #475569;
  text-transform: capitalize;
}

.date-year {
  display: block;
  font-size: 0.7rem;
  color: #94a3b8;
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.8rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  font-size: 2rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.stat-label {
  font-size: 0.7rem;
  color: #64748b;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* Cards generales */
.card {
  background: white;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #fafbfc;
}

.card-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.header-badge {
  background: #e2e8f0;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  color: #475569;
}

/* Leyenda */
.legend {
  display: flex;
  gap: 0.8rem;
  font-size: 0.7rem;
  color: #64748b;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}

.legend-1a { background: #3b82f6; }
.legend-2a { background: #10b981; }
.legend-3a { background: #f59e0b; }

/* Tabla de horario */
.horario-wrapper {
  overflow-x: auto;
  padding: 0;
}

.horario-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.7rem;
}

.horario-table th,
.horario-table td {
  border: 1px solid #e2e8f0;
  padding: 0.7rem 0.3rem;
  text-align: center;
  vertical-align: middle;
}

.hora-col {
  width: 85px;
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  font-size: 0.7rem;
}

.dia-col {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  min-width: 110px;
  font-size: 0.7rem;
}

.hora-cell {
  background: #fafbfc;
  font-weight: 500;
  color: #334155;
  font-size: 0.65rem;
  white-space: nowrap;
}

.hora-cell.receso {
  background: #fef3c7;
  color: #b45309;
}

.materia-cell {
  background: white;
  transition: background 0.1s;
}

.materia-cell.clase-1 {
  background: #eff6ff;
}

.materia-cell.clase-2 {
  background: #ecfdf5;
}

.materia-cell.clase-3 {
  background: #fffbeb;
}

.clase-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.materia-nombre {
  font-weight: 600;
  font-size: 0.7rem;
  color: #1e293b;
}

.grupo-badge {
  font-size: 0.6rem;
  padding: 0.15rem 0.4rem;
  border-radius: 12px;
  font-weight: 500;
  display: inline-block;
}

.grupo-badge.grado-1 {
  background: #3b82f6;
  color: white;
}

.grupo-badge.grado-2 {
  background: #10b981;
  color: white;
}

.grupo-badge.grado-3 {
  background: #f59e0b;
  color: white;
}

.vacio {
  color: #cbd5e1;
  font-size: 0.8rem;
}

.receso-mark {
  font-size: 1rem;
}

/* Grid de grupos */
.grupos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
}

.grupo-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.grupo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.grupo-card-header {
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.grupo-card-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: white;
}

.grupo-icon {
  font-size: 1.2rem;
}

.grupo-card-body {
  padding: 0.8rem 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  font-size: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

.info-label {
  color: #64748b;
  font-weight: 500;
}

.info-value {
  color: #0f172a;
  font-weight: 500;
}

/* Colores de grados para cards */
.grado-1-card .grupo-card-header {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.grado-2-card .grupo-card-header {
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
}

.grado-3-card .grupo-card-header {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 2.5rem;
  color: #94a3b8;
}

.empty-state span {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 0.8rem;
  margin: 0;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem;
  color: #3b82f6;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .dashboard-title {
    font-size: 1.2rem;
  }
  
  .stats-grid {
    gap: 0.7rem;
  }
  
  .stat-card {
    padding: 0.7rem;
  }
  
  .stat-icon {
    font-size: 1.5rem;
  }
  
  .stat-value {
    font-size: 1.2rem;
  }
  
  .horario-table {
    font-size: 0.6rem;
  }
  
  .dia-col {
    min-width: 80px;
  }
  
  .materia-nombre {
    font-size: 0.6rem;
  }
  
  .grupos-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}
</style>