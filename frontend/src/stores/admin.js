import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAdminStore = defineStore('admin', () => {
  const alumnos = ref([])
  const maestros = ref([])
  const grupos = ref([])
  const materias = ref([])
  const asignaciones = ref([])
  const loading = ref(false)

  const fetchAlumnos = async () => {
    try {
      loading.value = true
      const response = await axios.get('/api/admin/alumnos')
      alumnos.value = response.data
    } catch (err) {
      console.error('Error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchMaestros = async () => {
    try {
      const response = await axios.get('/api/admin/maestros')
      maestros.value = response.data
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const fetchGrupos = async () => {
    try {
      const response = await axios.get('/api/admin/grupos')
      grupos.value = response.data
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const fetchMaterias = async () => {
    try {
      const response = await axios.get('/api/admin/materias')
      materias.value = response.data
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const createAlumno = async (data) => {
    try {
      const response = await axios.post('/api/admin/alumnos', data)
      await fetchAlumnos()
      return response.data
    } catch (err) {
      throw err
    }
  }

  const updateAlumno = async (id, data) => {
    try {
      const response = await axios.put(`/api/admin/alumnos/${id}`, data)
      await fetchAlumnos()
      return response.data
    } catch (err) {
      throw err
    }
  }

  const deleteAlumno = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/alumnos/${id}`)
      await fetchAlumnos()
      return response.data
    } catch (err) {
      throw err
    }
  }

  const createMaestro = async (data) => {
    try {
      const response = await axios.post('/api/admin/maestros', data)
      await fetchMaestros()
      return response.data
    } catch (err) {
      throw err
    }
  }

  const updateMaestro = async (id, data) => {
    try {
      const response = await axios.put(`/api/admin/maestros/${id}`, data)
      await fetchMaestros()
      return response.data
    } catch (err) {
      throw err
    }
  }

  const deleteMaestro = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/maestros/${id}`)
      await fetchMaestros()
      return response.data
    } catch (err) {
      throw err
    }
  }

  const createGrupo = async (data) => {
    try {
      const response = await axios.post('/api/admin/grupos', data)
      await fetchGrupos()
      return response.data
    } catch (err) {
      throw err
    }
  }

  const updateGrupo = async (id, data) => {
    try {
      const response = await axios.put(`/api/admin/grupos/${id}`, data)
      await fetchGrupos()
      return response.data
    } catch (err) {
      throw err
    }
  }

  const deleteGrupo = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/grupos/${id}`)
      await fetchGrupos()
      return response.data
    } catch (err) {
      throw err
    }
  }

  const createMateria = async (data) => {
    try {
      const response = await axios.post('/api/admin/materias', data)
      await fetchMaterias()
      return response.data
    } catch (err) {
      throw err
    }
  }

  const updateMateria = async (id, data) => {
    try {
      const response = await axios.put(`/api/admin/materias/${id}`, data)
      await fetchMaterias()
      return response.data
    } catch (err) {
      throw err
    }
  }

  const deleteMateria = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/materias/${id}`)
      await fetchMaterias()
      return response.data
    } catch (err) {
      throw err
    }
  }

// FUNCIONES PARA ASIGNACIONES:
  const fetchAsignaciones = async (maestroId = null) => {
    try {
      const url = maestroId 
        ? `/api/admin/maestros/${maestroId}/asignaciones`
        : '/api/admin/asignaciones'
      const response = await axios.get(url)
      return response.data
    } catch (err) {
      console.error('Error:', err)
      throw err
    }
  }

  const fetchAsignacionesPorMaestro = async (maestroId) => {
    try {
      console.log('Fetching asignaciones for maestro:', maestroId); // Debug
      const response = await axios.get(`/api/admin/maestros/${maestroId}/asignaciones`)
      console.log('Asignaciones recibidas:', response.data); // Debug
      return response.data
    } catch (err) {
      console.error('Error detallado:', err)
      console.error('Response:', err.response?.data)
      throw err
    }
  }



  const fetchTodasAsignaciones = async () => {
    try {
      const response = await axios.get('/api/admin/asignaciones')
      return response.data
    } catch (err) {
      console.error('Error:', err)
      throw err
    }
  }  

  const createAsignacion = async (data) => {
    try {
      const response = await axios.post('/api/admin/asignaciones', data)
      return response.data
    } catch (err) {
      throw err
    }
  }

  const deleteAsignacion = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/asignaciones/${id}`)
      return response.data
    } catch (err) {
      throw err
    }
  }

  const fetchMateriasDisponibles = async (maestroId) => {
    try {
      const response = await axios.get(`/api/admin/maestros/${maestroId}/materias-disponibles`)
      return response.data
    } catch (err) {
      console.error('Error:', err)
      throw err
    }
  }



  // FUNCIONES PARA LISTAS DE ALUMNOS ISNCRITOS EN GRUPOS

  const fetchAlumnosPorGrupo = async (grupoId) => {
    try {
      const response = await axios.get(`/api/admin/grupos/${grupoId}/alumnos`)
      return response.data
    } catch (err) {
      console.error('Error:', err)
      throw err
    }
  }

  const inscribirAlumno = async (alumno_id, grupo_id) => {
    try {
      const response = await axios.post('/api/admin/inscripciones', { alumno_id, grupo_id })
      return response.data
    } catch (err) {
      // Mejorar el mensaje de error
      if (err.response?.data?.error) {
        throw new Error(err.response.data.error)
      }
      throw err
    }
  }

  const eliminarInscripcion = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/inscripciones/${id}`)
      return response.data
    } catch (err) {
      throw err
    }
  }

  const fetchAlumnosDisponibles = async (grupoId) => {
    try {
      const response = await axios.get(`/api/admin/grupos/${grupoId}/alumnos-disponibles`)
      return response.data
    } catch (err) {
      console.error('Error:', err)
      throw err
    }
  }


  // En useAdminStore
  const fetchTodasInscripciones = async () => {
    try {
      const response = await axios.get('/api/admin/inscripciones')
      return response.data
    } catch (err) {
      console.error('Error:', err)
      throw err
    }
  }







  return {
    alumnos,
    maestros,
    grupos,
    materias,
    asignaciones,
    loading,
    fetchAlumnos,
    fetchMaestros,
    fetchGrupos,
    fetchMaterias,
    createAlumno,
    updateAlumno,
    deleteAlumno,
    createMaestro,
    updateMaestro,
    deleteMaestro,
    createGrupo,
    updateGrupo,
    deleteGrupo,
    createMateria,
    updateMateria,
    deleteMateria,


    //fetchCalificaciones,  // Esta ahora usa la versión mejorada
    fetchAsignaciones,
    fetchTodasAsignaciones,
    fetchAsignacionesPorMaestro,
    createAsignacion,
    deleteAsignacion,
    fetchMateriasDisponibles,

    fetchAlumnosPorGrupo,
    inscribirAlumno,
    eliminarInscripcion,
    fetchAlumnosDisponibles,
    fetchTodasInscripciones

  }
})