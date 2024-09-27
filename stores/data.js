import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDataStore = defineStore('data', () => {

  const actors = ref([])
  const actors_count = ref(0)

  const movies = ref([])
  const movies_count = ref(0)

  const packs_intuition = ref([])
  const packs_intuition_count = ref(0)

  function setActors(payload) {
    if (payload.data) {
      actors.value = payload.data
    }
    if (payload.total) {
      actors_count.value = payload.total
    }
  }

  function setMovies(payload) {
    if (payload.data) {
      movies.value = payload.data
    }
    if (payload.total) {
      movies_count.value = payload.total
    }
  }

  function setPacksIntuition(payload) {
    if (payload.data) {
      packs_intuition.value = payload.data
    }
    if (payload.total) {
      packs_intuition_count.value = payload.total
    }
  }

  return {
    actors,
    actors_count,
    movies,
    movies_count,
    packs_intuition,
    packs_intuition_count,
    setActors,
    setMovies,
    setPacksIntuition
  }
})
