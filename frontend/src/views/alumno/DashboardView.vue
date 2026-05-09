<template>
  <div class="page-container">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">📚 Mi Desempeño</h1>
      <p class="page-subtitle">Consulta tus calificaciones</p>
    </div>

    <!-- Loading -->
    <div v-if="alumnoStore.loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando...</p>
    </div>

    <!-- Content -->
    <div v-else-if="alumnoStore.resumen">
      <!-- Tarjeta del Alumno -->
      <div class="card info-card">
        <div class="info-content">
          <div class="avatar">
            {{ getInitials() }}
          </div>
          <div class="info-details">
            <h2>{{ getFullName() }}</h2>
            <div class="info-tags">
              <span class="tag">📌 {{ alumnoStore.resumen.alumno.matricula }}</span>
              <span class="tag">🎓 {{ alumnoStore.resumen.alumno.grado }}° Grado</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Períodos en Grid Responsive -->
      <div class="periodos-grid">
        <div 
          v-for="periodo in [1, 2, 3]" 
          :key="periodo"
          class="card periodo-card"
          :class="{ 
            'periodo-selected': selectedPeriodo === periodo,
            'has-data': getPeriodoData(periodo)?.materias_calificadas > 0
          }"
          @click="selectPeriodo(periodo)"
        >
          <div class="periodo-header">
            <h3>{{ periodosNombre[periodo] }}</h3>
            <div 
              v-if="getPeriodoData(periodo)?.materias_calificadas > 0"
              class="promedio-badge"
              :style="{ background: getPromedioColor(getPeriodoData(periodo)?.promedio || 0) }"
            >
              <!-- CORREGIDO: Verificar que promedio existe antes de usar toFixed -->
              {{ getPeriodoData(periodo)?.promedio ? getPeriodoData(periodo).promedio.toFixed(1) : 'N/A' }}
            </div>
            <div v-else class="sin-datos-badge">
              Sin calificaciones
            </div>
          </div>

          <div v-if="getPeriodoData(periodo)" class="periodo-stats">
            <div class="stat">
              <span class="stat-label">Materias</span>
              <span class="stat-value">{{ getPeriodoData(periodo)?.total_materias || 0 }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Calificadas</span>
              <span class="stat-value">{{ getPeriodoData(periodo)?.materias_calificadas || 0 }}</span>
            </div>
            <div v-if="getPeriodoData(periodo)?.materias_calificadas > 0" class="stat">
              <span class="stat-label">Promedio</span>
              <span class="stat-value" :style="{ color: getPromedioColor(getPeriodoData(periodo)?.promedio || 0) }">
                {{ getPeriodoData(periodo)?.promedio ? getPeriodoData(periodo).promedio.toFixed(1) : '0' }}
              </span>
            </div>
          </div>

          <div class="progress-container" v-if="getPeriodoData(periodo)">
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: `${(getPeriodoData(periodo)?.materias_calificadas / getPeriodoData(periodo)?.total_materias) * 100}%` }"
              ></div>
            </div>
            <div class="progress-text">
              {{ getPeriodoData(periodo)?.materias_calificadas || 0 }}/{{ getPeriodoData(periodo)?.total_materias || 0 }} materias calificadas
            </div>
          </div>
          
          <div class="ver-detalle">
            <span>Ver materias</span>
            <span class="arrow">→</span>
          </div>
        </div>
      </div>

      <!-- Detalle del Período -->
      <transition name="slide">
        <div v-if="selectedPeriodo" class="card detalle-card">
          <div class="detalle-header">
            <div>
              <h3>📖 {{ periodosNombre[selectedPeriodo] }}</h3>
              <p class="materias-count">
                {{ materiasCalificadasCount }}/{{ periodMaterias.length }} materias calificadas
              </p>
            </div>
            <button class="close-btn" @click="closeDetalle">✕</button>
          </div>

          <div v-if="loadingDetalle" class="loading-small">
            <div class="loading-spinner-small"></div>
          </div>

          <div v-else class="materias-list">
            <div 
              v-for="(materia, index) in periodMaterias" 
              :key="materia.id || index" 
              class="materia-item"
              :class="{ 'sin-calificacion': !materia.tiene_calificacion }"
              :style="{ animationDelay: `${index * 0.05}s` }"
            >
              <div class="materia-info">
                <div class="materia-nombre">{{ materia.materia }}</div>
                <div class="materia-codigo">{{ materia.codigo || 'Sin código' }}</div>
                <div v-if="materia.maestro && materia.tiene_calificacion" class="materia-maestro">
                  👨‍🏫 {{ materia.maestro }}
                </div>
                <div v-if="!materia.tiene_calificacion" class="materia-sin-calificar">
                  ⏳ Pendiente de calificar
                </div>
              </div>
              
              <div class="materia-calificacion">
                <template v-if="materia.tiene_calificacion && materia.calificacion !== null">
                  <span 
                    class="calificacion-circle"
                    :class="getCalificacionClass(materia.calificacion)"
                  >
                    {{ materia.calificacion.toFixed(1) }}
                  </span>
                  <span class="calificacion-max">/10</span>
                </template>
                <template v-else>
                  <span class="calificacion-pendiente">
                    --
                  </span>
                </template>
              </div>
            </div>
          </div>

          <!-- Resumen del período -->
          <div v-if="periodoResumen && periodoResumen.materias_calificadas > 0" class="periodo-resumen">
            <div class="resumen-item">
              <span class="resumen-label">Promedio General</span>
              <span class="resumen-value" :style="{ color: getPromedioColor(periodoResumen.promedio) }">
                {{ periodoResumen.promedio ? periodoResumen.promedio.toFixed(1) : '0' }}
              </span>
            </div>
            <div class="resumen-item">
              <span class="resumen-label">Estado</span>
              <span class="resumen-badge" :class="getEstadoGeneralClass(periodoResumen.promedio)">
                {{ getEstadoGeneral(periodoResumen.promedio) }}
              </span>
            </div>
            <div class="resumen-item">
              <span class="resumen-label">Materias calificadas</span>
              <span class="resumen-value-small">
                {{ periodoResumen.materias_calificadas }}/{{ periodoResumen.total_materias }}
              </span>
            </div>
          </div>
          
          <div v-else-if="periodoResumen" class="periodo-resumen sin-datos-resumen">
            <p>📭 Aún no hay calificaciones registradas para este período</p>
            <p class="subtext">Las calificaciones aparecerán aquí cuando los maestros las registren</p>
          </div>
        </div>
      </transition>
    </div>

    <!-- Error -->
    <div v-else class="card empty-state">
      <span>⚠️</span>
      <p>No se pudo cargar tu información</p>
      <button class="btn-retry" @click="alumnoStore.fetchResumen()">Reintentar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAlumnoStore } from '@/stores'

const alumnoStore = useAlumnoStore()
const selectedPeriodo = ref(null)
const loadingDetalle = ref(false)

const periodosNombre = {
  1: 'Primer Trimestre',
  2: 'Segundo Trimestre',
  3: 'Tercer Trimestre'
}

// Computed
const periodMaterias = computed(() => {
  return alumnoStore.calificaciones || []
})

const materiasCalificadasCount = computed(() => {
  return periodMaterias.value.filter(m => m.tiene_calificacion).length
})

const periodoResumen = computed(() => {
  if (!selectedPeriodo.value) return null
  return getPeriodoData(selectedPeriodo.value)
})

// Methods
const getInitials = () => {
  const alumno = alumnoStore.resumen?.alumno
  if (!alumno) return '?'
  return `${alumno.nombre?.charAt(0) || ''}${alumno.apellido_paterno?.charAt(0) || ''}`
}

const getFullName = () => {
  const alumno = alumnoStore.resumen?.alumno
  if (!alumno) return ''
  return `${alumno.nombre || ''} ${alumno.apellido_paterno || ''} ${alumno.apellido_materno || ''}`
}

const getPeriodoData = (periodo) => {
  const calificaciones = alumnoStore.resumen?.calificaciones || []
  return calificaciones.find(c => c.periodo === periodo)
}

const selectPeriodo = async (periodo) => {
  if (selectedPeriodo.value === periodo) {
    closeDetalle()
    return
  }
  
  selectedPeriodo.value = periodo
  loadingDetalle.value = true
  
  try {
    await alumnoStore.fetchCalificaciones(periodo)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loadingDetalle.value = false
  }
}

const closeDetalle = () => {
  selectedPeriodo.value = null
}

// Colores y estilos
const getPromedioColor = (promedio) => {
  if (!promedio) return '#6b7280'
  if (promedio >= 9) return '#10b981'
  if (promedio >= 7) return '#f59e0b'
  if (promedio >= 6) return '#f97316'
  return '#ef4444'
}

const getCalificacionClass = (calificacion) => {
  if (!calificacion) return 'circulo-pendiente'
  if (calificacion >= 9) return 'circulo-excelente'
  if (calificacion >= 7) return 'circulo-aprobado'
  if (calificacion >= 6) return 'circulo-suficiente'
  return 'circulo-reprobado'
}

const getEstadoGeneral = (promedio) => {
  if (!promedio) return 'Sin calificaciones'
  if (promedio >= 9) return 'Excelente'
  if (promedio >= 7) return 'Aprobado'
  if (promedio >= 6) return 'Suficiente'
  return 'Reprobado'
}

const getEstadoGeneralClass = (promedio) => {
  if (!promedio) return 'estado-pendiente'
  if (promedio >= 9) return 'estado-excelente'
  if (promedio >= 7) return 'estado-aprobado'
  if (promedio >= 6) return 'estado-suficiente'
  return 'estado-reprobado'
}

// Lifecycle
onMounted(() => {
  alumnoStore.fetchResumen()
})
</script>

<style scoped>
/* Variables para móvil */
:root {
  --primary: #2563eb;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-600: #6b7280;
  --gray-800: #1f2937;
}

* {
  box-sizing: border-box;
}

.page-container {
  min-height: 100vh;
  background: #f9fafb;
  padding: 16px;
  padding-bottom: 32px;
}

/* Header */
.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 14px;
  color: var(--gray-600);
  margin: 0;
}

/* Cards */
.card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.3s ease;
}

/* Info Card */
.info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
}

.info-content {
  display: flex;
  gap: 16px;
  align-items: center;
}

.avatar {
  width: 60px;
  height: 60px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  backdrop-filter: blur(10px);
}

.info-details h2 {
  font-size: 18px;
  margin: 0 0 8px 0;
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: rgba(255,255,255,0.2);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  backdrop-filter: blur(10px);
}

/* Períodos Grid */
.periodos-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 640px) {
  .periodos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .periodos-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.periodo-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid transparent;
}

.periodo-card:active {
  transform: scale(0.98);
}

.periodo-card.has-data:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.periodo-selected {
  border-color: var(--primary);
  background: #eff6ff;
}

.periodo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.periodo-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--gray-800);
}

.promedio-badge {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  color: white;
}

.sin-datos-badge {
  padding: 4px 10px;
  background: var(--gray-200);
  border-radius: 20px;
  font-size: 12px;
  color: var(--gray-600);
}

.periodo-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
  padding: 12px 0;
  border-top: 1px solid var(--gray-100);
  border-bottom: 1px solid var(--gray-100);
}

.stat {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: var(--gray-600);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
}

.stat-value.max {
  color: var(--success);
}

.stat-value.min {
  color: var(--danger);
}

.sin-datos-message {
  text-align: center;
  padding: 20px;
  color: var(--gray-600);
}

.sin-datos-message span {
  font-size: 32px;
  opacity: 0.5;
}

.ver-detalle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--primary);
  margin-top: 12px;
  padding-top: 8px;
}

.arrow {
  transition: transform 0.2s;
}

.periodo-card:active .arrow {
  transform: translateX(4px);
}

/* Detalle Card */
.detalle-card {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  border-radius: 24px 24px 0 0;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 100;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@media (min-width: 768px) {
  .detalle-card {
    position: relative;
    border-radius: 20px;
    max-height: none;
    margin-bottom: 16px;
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
}

.detalle-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--gray-100);
}

.detalle-header h3 {
  font-size: 18px;
  margin: 0 0 4px 0;
}

.materias-count {
  font-size: 12px;
  color: var(--gray-600);
  margin: 0;
}

.close-btn {
  background: var(--gray-100);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-600);
  transition: all 0.2s;
}

.close-btn:active {
  background: var(--gray-200);
  transform: scale(0.95);
}

/* Materias List */
.materias-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.materia-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--gray-100);
  border-radius: 16px;
  animation: fadeIn 0.3s ease backwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.materia-info {
  flex: 1;
}

.materia-nombre {
  font-weight: 600;
  font-size: 15px;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.materia-codigo {
  font-size: 11px;
  color: var(--gray-600);
}

.materia-maestro {
  font-size: 11px;
  color: var(--gray-600);
  margin-top: 4px;
}

.materia-sin-calificar {
  font-size: 11px;
  color: #d97706;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.materia-calificacion {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.calificacion-circle {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  color: white;
}

.circulo-excelente { background: linear-gradient(135deg, #10b981, #059669); }
.circulo-aprobado { background: linear-gradient(135deg, #f59e0b, #d97706); }
.circulo-suficiente { background: linear-gradient(135deg, #f97316, #ea580c); }
.circulo-reprobado { background: linear-gradient(135deg, #ef4444, #dc2626); }
.circulo-pendiente { background: linear-gradient(135deg, #9ca3af, #6b7280); }

.calificacion-pendiente {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  background: #e5e7eb;
  color: #6b7280;
  border: 2px dashed #9ca3af;
}

.calificacion-max {
  font-size: 12px;
  color: var(--gray-600);
}

/* Periodo Resumen */
.periodo-resumen {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  margin-top: 8px;
  border-top: 2px solid var(--gray-100);
}

.resumen-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.resumen-label {
  font-size: 12px;
  color: var(--gray-600);
}

.resumen-value {
  font-size: 24px;
  font-weight: 700;
}

.resumen-value-small {
  font-size: 18px;
  font-weight: 600;
  color: #4b5563;
}

.resumen-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: white;
}

.estado-excelente { background: #10b981; }
.estado-aprobado { background: #f59e0b; }
.estado-suficiente { background: #f97316; }
.estado-reprobado { background: #ef4444; }
.estado-pendiente { background: #9ca3af; }

.sin-datos-resumen {
  text-align: center;
  padding: 20px;
  background: #fef3c7;
  border-radius: 12px;
}

.sin-datos-resumen p {
  margin: 0 0 8px;
  color: #92400e;
}

.sin-datos-resumen .subtext {
  font-size: 12px;
  color: #b45309;
  margin: 0;
}

.progress-container {
  margin: 12px 0 8px;
}

.progress-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 10px;
  color: #6b7280;
  text-align: center;
}

/* Loading */
.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--gray-200);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

.loading-spinner-small {
  width: 32px;
  height: 32px;
  border: 2px solid var(--gray-200);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-state span {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  color: var(--gray-600);
  margin: 0 0 16px 0;
}

.btn-retry {
  background: var(--primary);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-retry:active {
  transform: scale(0.98);
}

/* Slide transition */
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from, .slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (min-width: 768px) {
  .slide-enter-from, .slide-leave-to {
    transform: translateY(20px);
  }
}
</style>