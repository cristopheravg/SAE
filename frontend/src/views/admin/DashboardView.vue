<template>
  <div class="dashboard-container">
    
    <!-- HEADER -->
    <div class="dashboard-header">
      <div>
        <h1 class="title">Panel de Administración</h1>
        <p class="subtitle">Resumen general del sistema escolar</p>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="loading-container">
      <div class="loading"></div>
    </div>

    <!-- CONTENT -->
    <div v-else class="dashboard-content">

      <!-- STATS GRID -->
      <div class="stats-grid">

        <div class="stat-card alumnos">
          <div class="stat-top">
            <span class="icon">👥</span>
            <span class="tag">Alumnos</span>
          </div>
          <div class="stat-value">{{ adminStore.alumnos.length }}</div>
          <div class="stat-desc">Registrados en el sistema</div>
        </div>

        <div class="stat-card maestros">
          <div class="stat-top">
            <span class="icon">👨‍🏫</span>
            <span class="tag">Maestros</span>
          </div>
          <div class="stat-value">{{ adminStore.maestros.length }}</div>
          <div class="stat-desc">Docentes activos</div>
        </div>

        <div class="stat-card grupos">
          <div class="stat-top">
            <span class="icon">🏫</span>
            <span class="tag">Grupos</span>
          </div>
          <div class="stat-value">{{ adminStore.grupos.length }}</div>
          <div class="stat-desc">Grupos académicos</div>
        </div>

        <div class="stat-card materias">
          <div class="stat-top">
            <span class="icon">📚</span>
            <span class="tag">Materias</span>
          </div>
          <div class="stat-value">{{ adminStore.materias.length }}</div>
          <div class="stat-desc">Asignaturas activas</div>
        </div>

      </div>

      <!-- INFO PANEL -->
      <div class="info-panel">
        <h3>Estado del sistema</h3>
        <p>
          Bienvenido al panel de administración. Desde aquí puedes gestionar alumnos, maestros,
          grupos y materias del sistema escolar.
        </p>

        <div class="info-grid">
          <div class="info-item">
            <span>📌</span>
            <p>Gestión centralizada</p>
          </div>
          <div class="info-item">
            <span>⚡</span>
            <p>Operaciones rápidas</p>
          </div>
          <div class="info-item">
            <span>🔒</span>
            <p>Control seguro</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>




<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/stores'

const adminStore = useAdminStore()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  await Promise.all([
    adminStore.fetchAlumnos(),
    adminStore.fetchMaestros(),
    adminStore.fetchGrupos(),
    adminStore.fetchMaterias()
  ])
  loading.value = false
})
</script>



<style scoped>
/* CONTAINER */
.dashboard-container {
  padding: 2rem;
  background: #f6f8fb;
  min-height: 100vh;
}

/* HEADER */
.dashboard-header {
  margin-bottom: 2rem;
}

.title {
  font-size: 1.9rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin: 0;
}

.subtitle {
  font-size: 0.95rem;
  color: #64748b;
  margin-top: 0.3rem;
}

/* LOADING */
.loading-container {
  display: flex;
  justify-content: center;
  padding: 4rem 0;
}

.loading {
  width: 42px;
  height: 42px;
  border: 3px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* GRID */
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* STATS GRID */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

/* CARD BASE */
.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.4rem;
  border: 1px solid #e5eaf2;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
}

/* TOP */
.stat-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon {
  font-size: 1.5rem;
}

.tag {
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
}

/* VALUE */
.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin-top: 0.8rem;
}

/* DESC */
.stat-desc {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.3rem;
}

/* ACCENT LINES */
.stat-card.alumnos::before,
.stat-card.maestros::before,
.stat-card.grupos::before,
.stat-card.materias::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 4px;
  width: 100%;
}

.stat-card.alumnos::before { background: #3b82f6; }
.stat-card.maestros::before { background: #10b981; }
.stat-card.grupos::before { background: #f59e0b; }
.stat-card.materias::before { background: #8b5cf6; }

/* INFO PANEL */
.info-panel {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e5eaf2;
}

.info-panel h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #0f172a;
}

.info-panel p {
  margin-top: 0.5rem;
  color: #64748b;
  font-size: 0.9rem;
}

/* INFO GRID */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-top: 1.2rem;
}

.info-item {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  background: #f8fafc;
  padding: 0.8rem;
  border-radius: 10px;
  font-size: 0.85rem;
  color: #334155;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 1.2rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .stat-value {
    font-size: 1.6rem;
  }
}
</style>