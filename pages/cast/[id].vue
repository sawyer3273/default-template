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
})

let pack = ref({})
let movies = ref([])
let totalPoints = ref(0)
let answer = ref('')
let guessed = ref([])




async function getData() {
  let packData = await dataService.getPacksCast({id: route.params.id})
  if (packData.success && packData.data && packData.data.length) {
    pack.value = packData.data[0]
    movies.value = cloneDeep(pack.value.CastPackContent)
    movies.value.map(one => {
      totalPoints.value = totalPoints.value + 5
    })
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
  totalPoints.value--
}

function trySubmit() {
  let isSuccess = false
  movies.value.map((one, i) => {
    if (one.movie_id == answer.value.id) {
      success(i)
      isSuccess = true
    }
  })
  if (!isSuccess) {
    totalPoints.value--
    totalPoints.value--
    totalPoints.value--
    toast.error('Вы ошиблись и потеряли 3 очка');
  }
  answer.value = ''
}

let actorBoxes = ref([])
let actorBoxesMobile = ref([])
function success(i) {
  guessed.value.push(i)
  for (let j = 0; j < 8;j++) {
    if (!actorBoxes.value[i].show.includes(j)) {
      actorBoxes.value[i].open(j, false)
    }
    console.log('actorBoxesMobile.value[i].show,',actorBoxesMobile.value[i].show)
    if (!actorBoxesMobile.value[i].show.includes(j)) {
      actorBoxesMobile.value[i].open(j, false)
    }
  }
}
</script>

<template>
  <div>
    <NuxtLayout name="auth">
      <SectionMain v-if='pack.id' class='relative'>
        <div class='flex justify-between flex-wrap'>
          <h1 class='text-2xl mb-2 w-full md:w-auto'>{{pack.name}}</h1>
        </div>
        <CardBox :smallPadding='true' class='!bg-gray-300 mb-2 px-3'  v-for='(actors, i) in movies'>
          <ActorsBox ref='actorBoxes' :number='i+1' :data='actors' :guessed='guessed.includes(i)' @chooseData='(avatar) => onOpenActor(i ,avatar)' />
        </CardBox>
         
        <div class='bg-gradient-to-r from-blue-start to-blue-end w-full fixed bottom-0 left-0 pt-3 pb-2' >
          <div :class='containerMaxW' class='px-6 flex items-center flex-wrap md:!flex-nowrap'>
            <div class='w-full md:w-48 text-center rounded-md py-0 md:py-2 text-white text-2xl px-6 mb-2' ><span>Очки: {{totalPoints}}</span></div>
            <div class='w-full'><AutoSelect v-model="answer" searchF='getMovies' placeholder="Введите название фильма" /></div> 
            <div class='md:ml-2 w-full md:w-fit'><BaseButton :label="'Подтвердить'"  color="info" @click='trySubmit' class='w-full md:w-fit mb-2' /></div>
          </div>
          
        </div>

      </SectionMain>



    
    </NuxtLayout>
  </div>
</template>
