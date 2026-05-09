// stores/alumno.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAlumnoStore = defineStore('alumno', () => {
  const calificaciones = ref([])
  const resumen = ref(null)
  const loading = ref(false)

  const fetchResumen = async () => {
    try {
      loading.value = true
      const response = await axios.get('/api/alumno/resumen')
      
      // Convertir BigInt a Number usando parseFloat/Number como en el store de maestro
      const data = response.data
      resumen.value = {
        alumno: {
          id: Number(data.alumno.id),
          nombre: data.alumno.nombre,
          apellido_paterno: data.alumno.apellido_paterno,
          apellido_materno: data.alumno.apellido_materno,
          matricula: data.alumno.matricula,
          grado: Number(data.alumno.grado)
        },
        calificaciones: data.calificaciones.map(cal => ({
          periodo: Number(cal.periodo),
          total_materias: Number(cal.total_materias),
          materias_calificadas: Number(cal.materias_calificadas || 0),
          promedio: parseFloat(cal.promedio) || 0,
          calificacion_minima: parseFloat(cal.calificacion_minima) || 0,
          calificacion_maxima: parseFloat(cal.calificacion_maxima) || 0
        }))
      }
    } catch (err) {
      console.error('Error fetching resumen:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchCalificaciones = async (periodo) => {
    try {
      loading.value = true
      const response = await axios.get(`/api/alumno/calificaciones/${periodo}`)
      
      // Convertir valores como en el store de maestro
      calificaciones.value = response.data.map(c => ({
        id: c.id ? Number(c.id) : null,
        materia: c.materia,
        codigo: c.codigo,
        calificacion: c.calificacion !== null ? parseFloat(c.calificacion) : null,
        observaciones: c.observaciones,
        periodo: Number(c.periodo),
        maestro: c.maestro,
        tiene_calificacion: c.tiene_calificacion || false
      }))
    } catch (err) {
      console.error('Error fetching calificaciones:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    calificaciones,
    resumen,
    loading,
    fetchResumen,
    fetchCalificaciones
  }
})