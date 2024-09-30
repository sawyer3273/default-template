<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import { userService } from '~/utils/services/user.service'
import { dataService } from '~/utils/services/data.service'
import { cloneDeep } from 'lodash'
import { containerMaxW } from '@/configs/config'
import { shuffle } from '~/utils/common'
import 'vue3-carousel/dist/carousel.css'
import { mdiDice3, mdiCounter, mdiAccount, mdiHelpCircle } from '@mdi/js'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { useToast } from "vue-toastification";
import { getRandomNumber } from '~/utils/common'
import { statsService } from '~/utils/services/stats.service'
import ActorsBox from '@/components/Cast/ActorsBox.vue'


definePageMeta({
  middleware: 'auth' 
})

const mainStore = useMainStore()
const route = useRoute()
const toast = useToast();


let log = ref({})

onMounted(async () => {
  getData()
  let logExist = localStorage.getItem('cast'+route.params.id)
  if (logExist) {
    log.value = JSON.parse(logExist)
  } else {
    log.value = [{type: 'start', date: new Date().getTime()}]
    localStorage.setItem('cast'+route.params.id, JSON.stringify(log.value))
  }
  let totalPointsExist = localStorage.getItem('totalPoints'+route.params.id)
  if (totalPointsExist) {
    totalPoints.value = parseInt(totalPointsExist)
  }
  let answerExist = localStorage.getItem('answer'+route.params.id)
  if (answerExist) {
    answer.value = answerExist
  }
  let showMovieExist = localStorage.getItem('showMovie'+route.params.id)
  if (showMovieExist) {
    showMovie.value = showMovieExist == 'true'
  }
  let roundExist = localStorage.getItem('round'+route.params.id)
  if (roundExist) {
    round.value = parseInt(roundExist)
  }
  let roundPointsExist = localStorage.getItem('roundPoints'+route.params.id)
  if (roundPointsExist) {
    roundPoints.value = parseInt(roundPointsExist)
  }
  let freePointsExist = localStorage.getItem('freePoints'+route.params.id)
  if (freePointsExist) {
    freePoints.value = parseInt(freePointsExist)
  }
})

let pack = ref({})
let movies = ref([])

let totalPoints = ref(0)
let answer = ref('')
let showMovie = ref(false)
let round = ref(0)
let roundPoints = ref(3)
let freePoints = ref(2)
let finalPoints = ref(false)

watch(totalPoints, (val) => { localStorage.setItem('totalPoints'+route.params.id, JSON.stringify(val)) })
watch(answer, (val) => { localStorage.setItem('answer'+route.params.id, JSON.stringify(val)) })
watch(showMovie, (val) => { localStorage.setItem('showMovie'+route.params.id, val) })
watch(round, (val) => { localStorage.setItem('round'+route.params.id, JSON.stringify(val)) })
watch(roundPoints, (val) => { localStorage.setItem('roundPoints'+route.params.id, JSON.stringify(val)) })
watch(freePoints, (val) => { localStorage.setItem('freePoints'+route.params.id, JSON.stringify(val)) })

function nextRound() {
  round.value++
  showMovie.value = false
  if (round.value == movies.value.length) {
    setTimeout(() => {
      localStorage.removeItem('round'+route.params.id)
      localStorage.removeItem('freePoints'+route.params.id)
      localStorage.removeItem('totalPoints'+route.params.id)
      localStorage.removeItem('answer'+route.params.id)
      localStorage.removeItem('showMovie'+route.params.id)
      localStorage.removeItem('roundPoints'+route.params.id)
      localStorage.removeItem('show'+route.params.id)
      localStorage.removeItem('cast'+route.params.id)
    }, 1000)
    finalPoints.value = cloneDeep(totalPoints.value)
    totalPoints.value = 0
    statsService.saveCast({
      value: finalPoints.value,
      log: JSON.stringify(log.value),
      pack_id: pack.value.id,
    })
  }
}

async function getData() {
  let packData = await dataService.getPacksCast({id: route.params.id})
  if (packData.success && packData.data && packData.data.length) {
    pack.value = packData.data[0]
    movies.value = cloneDeep(pack.value.CastPackContent)
  }
}



let currentSlide = ref(0)
const myCarousel = ref(null);  

function next() {
  myCarousel.value.next()
}
function prev() {
  myCarousel.value.prev()
}

function onOpenActor(i, avatar) {
  log.value.push({type: 'open', value: avatar,date: new Date().getTime()})
  localStorage.setItem('cast'+route.params.id, JSON.stringify(log.value))
  if (freePoints.value) {
    freePoints.value--
  } else {
    if (roundPoints.value == 1) {
      roundPoints.value = 0.5
    } else if (roundPoints.value == 0.5) {
      roundPoints.value = 0.25
    } else if (roundPoints.value == 0.25) {
      roundPoints.value = 0.1
    } else if (roundPoints.value == 0.1) {
      roundPoints.value = 0.1
    } else {
      roundPoints.value--
    }
  }
}

function trySubmit() {
  log.value.push({type: 'answer', value: answer.value.title,date: new Date().getTime()})
  localStorage.setItem('cast'+route.params.id, JSON.stringify(log.value))
  scrollTo(0, 150)
  if (movies.value[round.value].movie_id == answer.value.id) {
    totalPoints.value = totalPoints.value + roundPoints.value
    toast.success('Верно');
  } else {
    toast.error('Вы ошиблись');
  }
  roundPoints.value = 3
  freePoints.value = 2
  openMovies()
  answer.value = ''
  showMovie.value = true
}

let actorBoxes = ref([])
function openMovies() {
  for (let j = 0; j < 8;j++) {
    if (!actorBoxes.value.show.includes(j)) {
      actorBoxes.value.open(j, false)
    }
  }
}
</script>

<template>
  <div>
    <NuxtLayout name="auth">
      <SectionMain v-if='pack.id' class='relative'>
        <div class='flex justify-between flex-wrap'>
          <h1 class='text-2xl mb-2 w-full md:w-auto flex items-center'><div>{{pack.name}}</div></h1>
          <div class='flex '>
            
          </div>
        </div>
        <CardBox :smallPadding='true' class='!bg-gray-300 mb-2 ' >
          <div v-if='round == movies.length' class='place-content-center h-77 pt-24 pb-24'>
            <div class='flex justify-center'> <span class='mr-1'>Вы набрали </span><strong>{{finalPoints}}</strong> <span class='ml-1'>баллов</span></div> 
            <div class='text-center text-blue-700 font-bold mt-3'> 
              <NuxtLink to='/cast'>
                <BaseButton color="info"  label='Список игр' class='mr-2' />  
              </NuxtLink>
            </div>
          </div>
          <ActorsBox v-else ref='actorBoxes' :total='movies.length' :showMovie='showMovie' :round='round' :freePoints='freePoints' :roundPoints='roundPoints' :totalPoints='totalPoints' :data='movies[round]' @nextRound='nextRound'  @chooseData='(avatar) => onOpenActor(i ,avatar)' />
        </CardBox>
         
        <div class='bg-gradient-to-r from-blue-start to-blue-end w-full fixed bottom-0 left-0 pt-3 pb-2' >
          <div :class='containerMaxW' class='px-6 flex items-center flex-wrap md:!flex-nowrap'>
            <div class='w-full'><AutoSelect v-model="answer" searchF='getMovies' placeholder="Введите название фильма" /></div> 
            <div class='md:ml-2 w-full md:w-fit'><BaseButton :label="'Подтвердить'"  color="info" @click='trySubmit' class='w-full md:w-fit mb-2' :class='showMovie || !answer.id ? "disabled": ""' /></div>
          </div>
          
        </div>

      </SectionMain>



    
    </NuxtLayout>
  </div>
</template>
