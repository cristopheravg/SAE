<template>
  <div class="calificaciones-container">

    <!-- HEADER -->
    <div class="page-header">
      <h1 class="page-title">Calificaciones</h1>
      <p class="page-subtitle">
        Ingresa y gestiona calificaciones de tus alumnos
      </p>
    </div>

    <!-- FILTROS -->
    <div class="card">
      <div class="filtros-grid">

        <!-- MATERIA -->
        <div class="form-group">
          <label>📖 Materia:</label>

          <select
            v-model="selectedMateriaId"
            class="form-control"
            @change="onFiltersChange"
          >
            <option value="">Selecciona una materia</option>

            <option
              v-for="materia in maestroStore.materias"
              :key="materia.id"
              :value="materia.id"
            >
              {{ materia.nombre }}
            </option>

          </select>
        </div>

        <!-- PERIODO -->
        <div class="form-group">
          <label>📅 Período:</label>

          <select
            v-model.number="selectedPeriodo"
            class="form-control"
            :disabled="!selectedMateriaId"
            @change="onFiltersChange"
          >
            <option :value="1">Primer Trimestre</option>
            <option :value="2">Segundo Trimestre</option>
            <option :value="3">Tercer Trimestre</option>
          </select>

        </div>

      </div>
    </div>

    <!-- TABLA -->
    <div class="card" v-if="selectedMateriaId">

      <div class="card-header">
        <h3>📊 {{ periodoNombre }}</h3>

        <div class="header-info">
          <span class="badge badge-materia">
            {{ nombreMateria }} - {{ gradoMateria }}°
          </span>
        </div>
      </div>

      <!-- LOADING -->
      <div v-if="maestroStore.loading" class="loading-container">
        <div class="loading-spinner"></div>
        <span>Cargando alumnos...</span>
      </div>

      <!-- EMPTY -->
      <div v-else-if="alumnosLista.length === 0" class="empty-state">
        <span>📭</span>
        <p>No hay alumnos en este grupo</p>
      </div>

      <!-- TABLE -->
      <div v-else class="table-responsive">

        <table class="calificaciones-table">

          <thead>
            <tr>
              <th>#</th>
              <th>Alumno</th>
              <th>Matrícula</th>
              <th>Calificación</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>

            <tr
              v-for="(alumno, index) in alumnosLista"
              :key="alumno.alumno_id"
            >

              <td>{{ index + 1 }}</td>

              <td class="alumno-cell">
                <div class="alumno-avatar">
                  {{ (alumno.nombre || 'A').charAt(0) }}
                </div>

                <div>
                  <div class="alumno-nombre">
                    {{ alumno.apellido_paterno }}
                    {{ alumno.apellido_materno }}
                    {{ alumno.nombre }}
                  </div>
                  <div class="alumno-matricula">
                    {{ alumno.matricula }}
                  </div>
                </div>
              </td>

              <td>{{ alumno.matricula }}</td>

              <td>
                <input
                  v-model="alumno.calificacion"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  class="input-calificacion-inline"
                  @blur="autoGuardar(alumno)"
                />
              </td>

              <td>
                <span
                  v-if="alumno.guardando"
                  class="estado-badge guardando"
                >
                  Guardando...
                </span>

                <span
                  v-else
                  :class="['estado-badge', getEstadoClass(alumno.calificacion)]"
                >
                  {{ getEstadoTexto(alumno.calificacion) }}
                </span>
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>

    <!-- EMPTY GLOBAL -->
    <div v-else class="card empty-state">
      <span>📋</span>
      <p>Selecciona una materia y período para comenzar</p>
    </div>

    <Toast />

  </div>
</template>




<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useMaestroStore } from '@/stores'
import Toast from '@/components/Toast.vue'

const maestroStore = useMaestroStore()

// STATE
const selectedMateriaId = ref('')
const selectedPeriodo = ref(1)

const alumnosLista = ref([])

// TOAST
const showToast = (msg, type = 'success') => {
  window.$toast?.addToast(msg, type)
}

// COMPUTED
const materiaSeleccionada = computed(() => {
  return maestroStore.materias.find(
    x => x.id === parseInt(selectedMateriaId.value)
  )
})

const nombreMateria = computed(() => {
  return materiaSeleccionada.value?.nombre || ''
})

const gradoMateria = computed(() => {
  return materiaSeleccionada.value?.grado || ''
})

const periodoNombre = computed(() => ({
  1: 'Primer Trimestre',
  2: 'Segundo Trimestre',
  3: 'Tercer Trimestre'
}[selectedPeriodo.value]))

// CARGAR DATOS
const cargarCalificaciones = async () => {
  if (!selectedMateriaId.value) return

  const materia = materiaSeleccionada.value
  if (!materia) return

  try {
    alumnosLista.value = await maestroStore.fetchAlumnosPorMateria(
      materia.id,
      selectedPeriodo.value  // ¡Aquí estaba el error! faltaba el período
    )
  } catch (err) {
    console.error(err)
    showToast('Error al cargar alumnos', 'error')
  }
}

// WATCHERS
watch([selectedMateriaId, selectedPeriodo], () => {
  cargarCalificaciones()
})

// AUTO SAVE
const autoGuardar = async (alumno) => {
  const cal = parseFloat(alumno.calificacion)

  if (isNaN(cal) || cal < 0 || cal > 10) {
    return showToast('Calificación inválida', 'warning')
  }

  alumno.guardando = true

  try {
    await maestroStore.saveCalificacion({
      alumno_id: alumno.alumno_id,
      materia_id: selectedMateriaId.value,
      periodo: selectedPeriodo.value,
      calificacion: cal
    })
    
    showToast('Calificación guardada', 'success')
    
  } catch (e) {
    console.error(e)
    showToast('Error al guardar', 'error')
  } finally {
    alumno.guardando = false
  }
}


const getEstadoClass = (calificacion) => {
  if (calificacion === null || calificacion === '') {
    return 'pendiente'
  }

  if (calificacion >= 7) {
    return 'aprobado'
  }

  return 'reprobado'
}

const getEstadoTexto = (calificacion) => {
  if (calificacion === null || calificacion === '') {
    return 'Pendiente'
  }

  if (calificacion >= 9) {
    return 'Excelente'
  }

  if (calificacion >= 7) {
    return 'Aprobado'
  }

  return 'Reprobado'
}


// INIT
onMounted(async () => {
  await Promise.all([
    maestroStore.fetchGrupos(),
    maestroStore.fetchMaterias()
  ])
})
</script>






<style scoped>
.calificaciones-container {
  padding: 1.5rem;
  min-height: 100vh;
}

/* HEADER */
.page-header {
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.page-subtitle {
  margin-top: 0.3rem;
  color: #6b7280;
  font-size: 0.92rem;
}

/* CARD */
.card {
  background: white;
  border-radius: 22px;
  padding: 1.4rem;
  margin-bottom: 1.5rem;

  border: 1px solid #e5e7eb;

  box-shadow:
    0 1px 2px rgba(0,0,0,0.03),
    0 10px 30px rgba(0,0,0,0.03);
}

/* FILTROS */
.filtros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #374151;
}

.form-control {
  height: 46px;

  border: 1px solid #dbe3ec;
  border-radius: 12px;

  padding: 0 14px;

  font-size: 0.85rem;

  transition: 0.2s;
}

.form-control:focus {
  outline: none;

  border-color: #2563eb;

  box-shadow:
    0 0 0 4px rgba(37, 99, 235, 0.08);
}

/* HEADER CARD */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 1.2rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1rem;
}

.header-info {
  display: flex;
  gap: 0.5rem;
}

.badge {
  padding: 0.45rem 0.8rem;

  border-radius: 999px;

  font-size: 0.72rem;
  font-weight: 600;
}



.badge-materia {
  background: #dcfce7;
  color: #15803d;
}

/* TABLA */
.table-responsive {
  overflow-x: auto;
}

.calificaciones-table {
  width: 100%;
  border-collapse: collapse;
}

.calificaciones-table th {
  background: #f9fafb;

  padding: 1rem;

  text-align: left;

  font-size: 0.76rem;
  font-weight: 700;
  color: #374151;

  border-bottom: 1px solid #e5e7eb;
}

.calificaciones-table td {
  padding: 1rem;

  border-bottom: 1px solid #f1f5f9;
}

.calificaciones-table tbody tr:hover {
  background: #fafcff;
}

/* ALUMNO */
.alumno-cell {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.alumno-avatar {
  width: 38px;
  height: 38px;

  border-radius: 50%;

  background: linear-gradient(
    135deg,
    #2563eb,
    #1d4ed8
  );

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 700;

  flex-shrink: 0;
}

.alumno-nombre {
  font-weight: 600;
  color: #111827;
}

.alumno-matricula {
  font-size: 0.72rem;
  color: #6b7280;
}

.matricula-cell {
  font-size: 0.8rem;
  color: #4b5563;
}

/* INPUT */
.input-calificacion-inline {
  width: 90px;
  height: 42px;

  border: 1px solid #dbe2ea;
  border-radius: 12px;

  text-align: center;

  font-size: 0.9rem;
  font-weight: 700;

  transition: all 0.2s;
}

.input-calificacion-inline:focus {
  outline: none;

  border-color: #2563eb;

  background: #f8fbff;

  box-shadow:
    0 0 0 4px rgba(37, 99, 235, 0.08);
}

/* ESTADOS */
.estado-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 100px;

  padding: 0.45rem 0.8rem;

  border-radius: 999px;

  font-size: 0.72rem;
  font-weight: 700;
}

.estado-badge.aprobado {
  background: #dcfce7;
  color: #166534;
}

.estado-badge.reprobado {
  background: #fee2e2;
  color: #991b1b;
}

.estado-badge.pendiente {
  background: #fef3c7;
  color: #92400e;
}

.estado-badge.guardando {
  background: #ffedd5;
  color: #c2410c;
}

/* EMPTY */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-state span {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #6b7280;
}

/* LOADING */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 3rem;

  gap: 1rem;
}

.loading-spinner {
  width: 34px;
  height: 34px;

  border-radius: 50%;

  border: 3px solid #e5e7eb;
  border-top-color: #2563eb;

  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* RESPONSIVE */
@media (max-width: 768px) {

  .calificaciones-container {
    padding: 1rem;
  }

  .filtros-grid {
    grid-template-columns: 1fr;
  }

  .calificaciones-table {
    font-size: 0.75rem;
  }

  .calificaciones-table th,
  .calificaciones-table td {
    padding: 0.7rem;
  }

  .alumno-avatar {
    width: 32px;
    height: 32px;
  }

  .alumno-matricula {
    display: none;
  }

  .input-calificacion-inline {
    width: 75px;
  }
}
</style>
<style scoped>
.calificaciones-container {
  padding: 1.5rem;
  min-height: 100vh;
}

/* HEADER */
.page-header {
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.page-subtitle {
  margin-top: 0.3rem;
  color: #6b7280;
  font-size: 0.92rem;
}

/* CARD */
.card {
  background: white;
  border-radius: 22px;
  padding: 1.4rem;
  margin-bottom: 1.5rem;

  border: 1px solid #e5e7eb;

  box-shadow:
    0 1px 2px rgba(0,0,0,0.03),
    0 10px 30px rgba(0,0,0,0.03);
}

/* FILTROS */
.filtros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #374151;
}

.form-control {
  height: 46px;

  border: 1px solid #dbe3ec;
  border-radius: 12px;

  padding: 0 14px;

  font-size: 0.85rem;

  transition: 0.2s;
}

.form-control:focus {
  outline: none;

  border-color: #2563eb;

  box-shadow:
    0 0 0 4px rgba(37, 99, 235, 0.08);
}

/* HEADER CARD */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 1.2rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1rem;
}

.header-info {
  display: flex;
  gap: 0.5rem;
}

.badge {
  padding: 0.45rem 0.8rem;

  border-radius: 999px;

  font-size: 0.72rem;
  font-weight: 600;
}



.badge-materia {
  background: #dcfce7;
  color: #15803d;
}

/* TABLA */
.table-responsive {
  overflow-x: auto;
}

.calificaciones-table {
  width: 100%;
  border-collapse: collapse;
}

.calificaciones-table th {
  background: #f9fafb;

  padding: 1rem;

  text-align: left;

  font-size: 0.76rem;
  font-weight: 700;
  color: #374151;

  border-bottom: 1px solid #e5e7eb;
}

.calificaciones-table td {
  padding: 1rem;

  border-bottom: 1px solid #f1f5f9;
}

.calificaciones-table tbody tr:hover {
  background: #fafcff;
}

/* ALUMNO */
.alumno-cell {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.alumno-avatar {
  width: 38px;
  height: 38px;

  border-radius: 50%;

  background: linear-gradient(
    135deg,
    #2563eb,
    #1d4ed8
  );

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 700;

  flex-shrink: 0;
}

.alumno-nombre {
  font-weight: 600;
  color: #111827;
}

.alumno-matricula {
  font-size: 0.72rem;
  color: #6b7280;
}

.matricula-cell {
  font-size: 0.8rem;
  color: #4b5563;
}

/* INPUT */
.input-calificacion-inline {
  width: 90px;
  height: 42px;

  border: 1px solid #dbe2ea;
  border-radius: 12px;

  text-align: center;

  font-size: 0.9rem;
  font-weight: 700;

  transition: all 0.2s;
}

.input-calificacion-inline:focus {
  outline: none;

  border-color: #2563eb;

  background: #f8fbff;

  box-shadow:
    0 0 0 4px rgba(37, 99, 235, 0.08);
}

/* ESTADOS */
.estado-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 100px;

  padding: 0.45rem 0.8rem;

  border-radius: 999px;

  font-size: 0.72rem;
  font-weight: 700;
}

.estado-badge.aprobado {
  background: #dcfce7;
  color: #166534;
}

.estado-badge.reprobado {
  background: #fee2e2;
  color: #991b1b;
}

.estado-badge.pendiente {
  background: #fef3c7;
  color: #92400e;
}

.estado-badge.guardando {
  background: #ffedd5;
  color: #c2410c;
}

/* EMPTY */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-state span {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #6b7280;
}

/* LOADING */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 3rem;

  gap: 1rem;
}

.loading-spinner {
  width: 34px;
  height: 34px;

  border-radius: 50%;

  border: 3px solid #e5e7eb;
  border-top-color: #2563eb;

  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* RESPONSIVE */
@media (max-width: 768px) {

  .calificaciones-container {
    padding: 1rem;
  }

  .filtros-grid {
    grid-template-columns: 1fr;
  }

  .calificaciones-table {
    font-size: 0.75rem;
  }

  .calificaciones-table th,
  .calificaciones-table td {
    padding: 0.7rem;
  }

  .alumno-avatar {
    width: 32px;
    height: 32px;
  }

  .alumno-matricula {
    display: none;
  }

  .input-calificacion-inline {
    width: 75px;
  }
}
</style>