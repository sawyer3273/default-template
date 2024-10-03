import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDataStore = defineStore('data', () => {

  const actors = ref([])
  const actors_count = ref(0)

  const movies = ref([])
  const movies_count = ref(0)

  const packs_intuition = ref([])
  const packs_intuition_count = ref(0)

  const packs_cast = ref([])
  const packs_cast_count = ref(0)

  const packs_quiz = ref([])
  const packs_quiz_count = ref(0)

  const searchData = ref([])
  const searchData_count = ref(0)

  const rooms = ref([])

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

  function setPacksCast(payload) {
    if (payload.data) {
      packs_cast.value = payload.data
    }
    if (payload.total) {
      packs_cast_count.value = payload.total
    }
  }

  function setPacksQuiz(payload) {
    if (payload.data) {
      packs_quiz.value = payload.data
    }
    if (payload.total) {
      packs_quiz_count.value = payload.total
    }
  }

  function setSearchData(payload) {
    if (payload.data) {
      searchData.value = payload.data
    }
    if (payload.total) {
      searchData_count.value = payload.total
    }
  }
  

  function setRooms(payload) {
    if (payload.data) {
      rooms.value = payload.data
    }
  }
  return {
    actors,
    actors_count,
    movies,
    movies_count,
    packs_intuition,
    packs_intuition_count,
    packs_cast,
    packs_cast_count,
    packs_quiz,
    packs_quiz_count,
    searchData,
    searchData_count,
    rooms,
    setActors,
    setMovies,
    setPacksIntuition,
    setPacksCast,
    setPacksQuiz,
    setSearchData,
    setRooms
  }
})
