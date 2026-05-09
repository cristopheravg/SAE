    import { defineStore } from 'pinia'
    import { ref, computed } from 'vue'
    import axios from 'axios'

    export const useMaestroStore = defineStore('maestro', () => {
    const grupos = ref([])
    const materias = ref([])
    const horarios = ref([])
    const alumnos = ref([])
    const calificaciones = ref([])
    const loading = ref(false)

    const fetchGrupos = async () => {
        try {
        loading.value = true
        const response = await axios.get('/api/maestro/grupos')
        grupos.value = response.data
        } catch (err) {
        console.error('Error:', err)
        } finally {
        loading.value = false
        }
    }

    const fetchMaterias = async () => {
        try {
        const response = await axios.get('/api/maestro/materias')
        materias.value = response.data
        } catch (err) {
        console.error('Error:', err)
        }
    }

    const fetchHorarios = async () => {
        try {
        const response = await axios.get('/api/maestro/horarios')
        horarios.value = response.data
        } catch (err) {
        console.error('Error:', err)
        }
    }

    const fetchAlumnos = async (grupoId) => {
        try {
        const response = await axios.get(`/api/maestro/grupo/${grupoId}/alumnos`)
        alumnos.value = response.data
        } catch (err) {
        console.error('Error:', err)
        }
    }

    const saveCalificacion = async (data) => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.post('/api/maestro/calificaciones', data, {
        headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    } catch (err) {
        console.error('Error saving calificacion:', err)
        throw err
    }
    }

    const fetchCalificacionesConAlumnos = async (grupoId, materiaId, periodo) => {
    try {
        loading.value = true
        
        // 1. Obtener alumnos del grupo
        const token = localStorage.getItem('token')
        const alumnosResponse = await axios.get(`/api/admin/grupos/${grupoId}/alumnos`, {
        headers: { Authorization: `Bearer ${token}` }
        })
        const alumnos = alumnosResponse.data
        
        // 2. Obtener calificaciones existentes
        const califResponse = await axios.get(`/api/maestro/calificaciones/${grupoId}/${materiaId}/${periodo}`, {
        headers: { Authorization: `Bearer ${token}` }
        })
        const calificacionesExistentes = califResponse.data
        
        // 3. Combinar datos
        const resultado = alumnos.map(alumno => {
        const existente = calificacionesExistentes.find(c => c.alumno_id === alumno.id)
        return {
            alumno_id: alumno.id,
            nombre: alumno.nombre,
            apellido_paterno: alumno.apellido_paterno,
            apellido_materno: alumno.apellido_materno,
            matricula: alumno.matricula,
            email: alumno.email,
            calificacion: existente ? parseFloat(existente.calificacion) : null,
            calificacion_id: existente ? existente.id : null
        }
        })
        
        calificaciones.value = resultado
        return resultado
    } catch (err) {
        console.error('Error:', err)
        throw err
    } finally {
        loading.value = false
    }
    }

    const fetchCalificaciones = async (grupoId, materiaId, periodo) => {
    return fetchCalificacionesConAlumnos(grupoId, materiaId, periodo)
    }




const fetchAlumnosPorMateria = async (materiaId, periodo) => {
  try {
    loading.value = true
    
    const token = localStorage.getItem('token')
    
    // Primero obtener la materia para saber su grado
    const materiasResponse = await axios.get('/api/maestro/materias', {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    const materia = materiasResponse.data.find(m => m.id === materiaId)
    if (!materia) {
      throw new Error('Materia no encontrada')
    }
    
    const grado = materia.grado
    
    // Ahora obtener alumnos por grado con sus calificaciones
    const response = await axios.get(
      `/api/maestro/grado/${grado}/alumnos-calificaciones?materiaId=${materiaId}&periodo=${periodo}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    
    return response.data
    
  } catch (err) {
    console.error('Error fetching alumnos:', err)
    throw err
  } finally {
    loading.value = false
  }
}







    
    return {
        grupos,
        materias,
        horarios,
        alumnos,
        calificaciones,
        loading,
        fetchGrupos,
        fetchMaterias,
        fetchHorarios,
        fetchAlumnos,
        fetchCalificaciones,
        saveCalificacion,
        fetchAlumnosPorMateria,
        fetchCalificacionesConAlumnos
    }
    })