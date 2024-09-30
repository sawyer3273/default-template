<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import { userService } from '~/utils/services/user.service'
import { dataService } from '~/utils/services/data.service'
import { cloneDeep } from 'lodash'
import { shuffle } from '~/utils/common'
import 'vue3-carousel/dist/carousel.css'
import { mdiDice3, mdiCounter, mdiAccount, mdiHelpCircle } from '@mdi/js'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { useToast } from "vue-toastification";
import { getRandomNumber } from '~/utils/common'
import { statsService } from '~/utils/services/stats.service'
import ActorsBox from '@/components/Intuition/ActorsBox.vue'
import DescriptionBox from '@/components/Intuition/DescriptionBox.vue'


definePageMeta({
  middleware: 'auth' 
})

const mainStore = useMainStore()
const route = useRoute()
const toast = useToast();


let log = ref({})

onMounted(async () => {
  getData()
    
  let logExist = localStorage.getItem('intuition'+route.params.id)
  if (logExist) {
    log.value = JSON.parse(logExist)
  } else {
    log.value = [{type: 'start', date: new Date().getTime()}]
    localStorage.setItem('intuition'+route.params.id, JSON.stringify(log.value))
  }
  let hintModeExist = localStorage.getItem('intuition_hintMode'+route.params.id)
  let hiddenExist = localStorage.getItem('intuition_hidden'+route.params.id)
  let showYearExist = localStorage.getItem('intuition_showYear'+route.params.id)
  
  let hint1_3Exist = localStorage.getItem('intuition_hint1_3'+route.params.id)
  let hintYearExist = localStorage.getItem('intuition_hintYear'+route.params.id)
  let showNameExist = localStorage.getItem('intuition_showName'+route.params.id)
  let hintNameExist = localStorage.getItem('intuition_hintName'+route.params.id)
  let guessedExist = localStorage.getItem('intuition_guessed'+route.params.id)
  let livesExist = localStorage.getItem('intuition_lives'+route.params.id)

  if (hintModeExist) {
    hintMode.value = JSON.parse(hintModeExist)
  }
  if (hiddenExist) {
    hidden.value = JSON.parse(hiddenExist)
  }
  if (showYearExist) {
    showYear.value = JSON.parse(showYearExist)
  }
  if (hint1_3Exist) {
    hint1_3.value = JSON.parse(hint1_3Exist)
  }
  if (hintYearExist) {
    hintYear.value = JSON.parse(hintYearExist)
  }
  if (showNameExist) {
    showName.value = JSON.parse(showNameExist)
  }
  if (hintNameExist) {
    hintName.value = JSON.parse(hintNameExist)
  }
  if (guessedExist) {
    guessed.value = JSON.parse(guessedExist)
  }
  if (livesExist) {
    lives.value = JSON.parse(livesExist)
  }

})

let pack = ref({})
let actors = ref([])
let descriptions = ref([])
let currentSlide = ref(0)
const myCarousel = ref(null);  


async function getData() {
  let packData = await dataService.getPacksIntuition({id: route.params.id})
  if (packData.success && packData.data && packData.data.length) {
    pack.value = packData.data[0]
    actors.value = cloneDeep(pack.value.IntuitionPackContent)
    if (packData.data[0].fakeActor) {
      pack.value.IntuitionPackContent.push({ "id": -1, "text":  packData.data[0].fakeActor })
    }
    descriptions.value = shuffle(pack.value.IntuitionPackContent)
  }
}



let selectedA = ref(-1)
let selectedB = ref(-1)
let isSelected = computed(() => {
  return selectedA.value !== -1 && selectedB.value !== -1
})

function next() {
  myCarousel.value.next()
}
function prev() {
  myCarousel.value.prev()
}

watch(selectedA, () => {
  if (isSelected.value) {
    confirmation()
  }
})
watch(selectedB, () => {
  if (isSelected.value) {
    confirmation()
  }
})


let areSure = ref(false)
function confirmation() {
  areSure.value = true
}

function falseSubmit() {
  areSure.value = false
  selectedA.value = -1
  selectedB.value = -1 
}


let lives = ref(3)
let guessed = ref([])
let win = ref(false)
function trySubmit() {
  hidden.value = []
  if (selectedA.value.id == selectedB.value.id) {
    guessed.value.push(selectedB.value.id)
    log.value.push({type: 'answer', value: {actor: selectedA.value.character, descr: selectedB.value.character, success: true},date: new Date().getTime()})
    localStorage.setItem('intuition'+route.params.id, JSON.stringify(log.value))
    localStorage.setItem('intuition_guessed'+route.params.id, JSON.stringify(guessed.value))
  } else {
    toast.error('Вы ошиблись');
    lives.value--
    log.value.push({type: 'answer'+route.params.id, value: {actor: selectedA.value.character, descr: selectedB.value.character, success: false},date: new Date().getTime()})
    localStorage.setItem('intuition'+route.params.id, JSON.stringify(log.value))
  }
  areSure.value = false
  selectedA.value = -1
  selectedB.value = -1 
  localStorage.setItem('intuition_lives'+route.params.id, JSON.stringify(lives.value))
  let finish = false
  if (guessed.value.length == actors.value.length) {
    finish = true
    win.value = true
    log.value.push({type: 'end', date: new Date().getTime()})
    statsService.saveIntuition({
      value: lives.value,
      log: JSON.stringify(log.value),
      pack_id: pack.value.id,
    })
  }
  if (lives.value == 0) {
    log.value.push({type: 'end', date: new Date().getTime()})
    statsService.saveIntuition({
      value: 0 - actors.value.length + guessed.value.length,
      log: JSON.stringify(log.value),
      pack_id: pack.value.id,
    })
  }
  if (finish) {
    localStorage.removeItem('intuition_hintMode'+route.params.id)
    localStorage.removeItem('intuition_hidden'+route.params.id)
    localStorage.removeItem('intuition_showYear'+route.params.id)
    localStorage.removeItem('intuition_hintYear'+route.params.id)
    localStorage.removeItem('intuition_showName'+route.params.id)
    localStorage.removeItem('intuition_hintName'+route.params.id)
    localStorage.removeItem('intuition_guessed'+route.params.id)
    localStorage.removeItem('intuition_lives'+route.params.id)
    localStorage.removeItem('intuition'+route.params.id)
  }
}

let hintMode = ref('')
let hint1_3 = ref(false)
let hintYear = ref(false)
let hintName = ref(false)
function oneFromThreeLaunch() {
  selectedA.value = -1
  hintMode.value = '1-3'
  myCarousel.value.slideTo(1)
}
function yearLaunch() {
  selectedA.value = -1
  hintMode.value = 'year'
  myCarousel.value.slideTo(1)
}
function nameLaunch() {
  selectedA.value = -1
  hintMode.value = 'name'
  myCarousel.value.slideTo(1)
}
function closeHint() {
  selectedA.value = -1
  selectedB.value = -1 
  hintMode.value = ''
}

let hidden = ref([])
let showYear = ref(null)
let showName = ref(null)
let showFake= ref(false)


function confirmHint() {
  let isFake = false
  if (selectedB.value.id < 0) {
    showFake.value = true
    guessed.value.push(selectedB.value.id)
    isFake = true
    selectedB.value = -1
  }
  if (hintMode.value == '1-3') {
    if (!isFake) {
      let arr = []
      actors.value.map(one => {
        if (!guessed.value.includes(one.id) && one.id !== selectedB.value.id) {
          arr.push(one.id)
        }
      })

      let rand1 = Math.floor(getRandomNumber(0, arr.length-1))
      let rand2 = Math.floor(getRandomNumber(0, arr.length-2))
      hidden.value = [selectedB.value.id]
      hidden.value.push(arr[rand1])
      arr.splice(rand1, 1)
      hidden.value.push(arr[rand2])
      myCarousel.value.prev()
    }
    hint1_3.value = true
  } else if (hintMode.value == 'year') {
    if (!isFake) {
      showYear.value = selectedB.value.id
    }
    hintYear.value = true
  } else {
    if (!isFake) {
      showName.value = selectedB.value.id
    }
    hintName.value = true
  }
  selectedA.value = -1
  hintMode.value = ''


  log.value.push({type: 'hint', value: {hint: hintMode.value, descr: selectedB.value.character},date: new Date().getTime()})
  localStorage.setItem('intuition'+route.params.id, JSON.stringify(log.value))
  localStorage.setItem('intuition_hintMode'+route.params.id, JSON.stringify(hintMode.value))
  localStorage.setItem('intuition_hidden'+route.params.id, JSON.stringify(hidden.value))
  localStorage.setItem('intuition_showYear'+route.params.id, JSON.stringify(showYear.value))
  localStorage.setItem('intuition_hintYear'+route.params.id, JSON.stringify(hintYear.value))
  localStorage.setItem('intuition_showName'+route.params.id, JSON.stringify(showName.value))
  localStorage.setItem('intuition_hintName'+route.params.id, JSON.stringify(hintName.value))
  localStorage.setItem('intuition_hint1_3'+route.params.id, JSON.stringify(hint1_3.value))
  
}
function selectA(actor) {
  selectedA.value = actor
  if (!isSelected.value) {
    myCarousel.value.next()
  }
}
function selectB(actor) {
  selectedB.value = actor
  if (!isSelected.value && !hintMode.value) {
    myCarousel.value.prev()
  }
}
function refresh() {
  lives.value = 100
}
</script>

<template>
  <div>
    <NuxtLayout name="auth">
      <div v-if='lives == 0' class='place-content-center h-77 pt-24 pb-24'>
        <div class='flex justify-center'><Looser/></div> 
        <div class='text-center text-blue-700 font-bold mt-3'> 
          <NuxtLink to='/intuition'>
            <BaseButton color="info"  label='Список игр' class='mr-2' />  
          </NuxtLink>
           <BaseButton color="info" label='Продолжить игру'  class='mr-2' @click='refresh' />  
        </div>
      </div> 


      <div v-else-if='win' class='place-content-center h-77 pt-24 pb-24'>
        <div class='flex justify-center'><Winner :value='lives'/></div> 
        <div class='text-center text-blue-700 font-bold mt-3'> 
          <NuxtLink to='/intuition'>
            <BaseButton color="info"  label='Список игр' class='mr-2' />  
          </NuxtLink>
        </div>
      </div>

      <SectionMain v-else-if='pack.id'>
        <div class='flex justify-between flex-wrap'>
          <h1 class='text-2xl mb-2 w-full md:w-auto'>{{pack.name}}</h1>
          <Stars :value='lives' title='Количество жизней' />
          
          <div class='mb-2'>
            <BaseButton color="info" title='Подсказка "1 из 3"' :icon="mdiDice3" :disabled='hint1_3' @click="oneFromThreeLaunch" />
            <BaseButton color="info" title='Подсказка "Год выхода"' :icon="mdiCounter" :disabled='hintYear' @click="yearLaunch" />
            <BaseButton color="info" title='Подсказка "Имя персонажа"' :icon="mdiAccount" :disabled='hintName' @click="nameLaunch" class='mr-2' />
            <BaseButton color="warning" :icon="mdiHelpCircle" @click="" />
          </div>
        </div>
        <div class='row hidden md:flex'>
          <div class='col-xs-6 col-md-7 mb-3'>
            <ActorsBox :actors='actors' :hidden='hidden' :guessed='guessed' :selectedA='selectedA' :hintMode='hintMode' @chooseData='selectA' />
          </div>
          <div class='col-12 col-md-5 mb-3 relative'>
            <DescriptionBox :showName='showName' :showYear='showYear' :descriptions='descriptions' :guessed='guessed' :selectedB='selectedB' :hintMode='hintMode' @chooseData='selectB' @confirmHint='confirmHint' @closeHint='closeHint' />
          </div>
        </div>

        <div class='flex md:hidden relative'>
          <carousel :items-to-show="1.5" itemsToShow='1' snapAlign='start' ref='myCarousel' :wrapAround='true' v-model="currentSlide">
            <slide key="1">
              <ActorsBox :actors='actors' :hidden='hidden' :guessed='guessed' :selectedA='selectedA' :hintMode='hintMode' @chooseData='selectA' />
            </slide>
            <slide key="2">
              <DescriptionBox :showName='showName' :showYear='showYear' :descriptions='descriptions' :guessed='guessed' :selectedB='selectedB' :hintMode='hintMode' @chooseData='selectB' @confirmHint='confirmHint' @closeHint='closeHint' />
            </slide>
          </carousel>
          <div @click="next" class='arrow-css right absolute'></div>
          <div @click="prev" class='arrow-css left absolute'></div>
        </div>
        
      <CardBoxModal v-model="areSure" >
        <div class='w-full flex justify-center'>
          <img class='w-50' :src='selectedA.avatar' /> 
        </div>
        <p>Вы уверены что это <span class='text-lowercase text-slate-600'> {{selectedB.text}} </span>?</p>
        <div class='w-full flex justify-end'>
          <BaseButton color="info" label='Да' class='mr-2'  @click="trySubmit" /> 
          <BaseButton color="info" label='Нет' class='mr-2'  outline  @click="falseSubmit" /> 
        </div>
      </CardBoxModal>

      </SectionMain>
    </NuxtLayout>
  </div>
</template>
