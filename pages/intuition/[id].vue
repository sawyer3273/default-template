<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import { userService } from '~/utils/services/user.service'
import { dataService } from '~/utils/services/data.service'
import { cloneDeep } from 'lodash'
import { shuffle } from '~/utils/common'
import 'vue3-carousel/dist/carousel.css'
import { mdiDice3, mdiCheckOutline, mdiCounter, mdiAccount, mdiHelpCircle, mdiClose } from '@mdi/js'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { useToast } from "vue-toastification";
import { getRandomNumber } from '~/utils/common'

definePageMeta({
  middleware: 'auth' 
})

const mainStore = useMainStore()
const route = useRoute()
const toast = useToast();


onMounted(async () => {
  getData()
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
  } else {
    toast.error('Вы ошиблись');
    lives.value--
  }
  areSure.value = false
  selectedA.value = -1
  selectedB.value = -1 
  if (guessed.value.length == actors.value.length) {
    win.value = true
  }
}

let hintMode = ref('')
let hint1_3 = ref(false)
let hintYear = ref(false)
let hintName = ref(false)
function oneFromThreeLaunch() {
  selectedA.value = -1
  hintMode.value = '1-3'
}
function yearLaunch() {
  selectedA.value = -1
  hintMode.value = 'year'
}
function nameLaunch() {
  selectedA.value = -1
  hintMode.value = 'name'
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
}
</script>

<template>
  <div>
    <NuxtLayout name="auth">
      <div v-if='lives == 0' class='place-content-center h-77 pt-24 pb-24'>
        <div class='flex justify-center'><Looser/></div> 
        <div class='text-center text-blue-700 font-bold mt-3'> 
          <NuxtLink to='/intuition'>
            <BaseButton
              color="info"
              label='Список игр'
              class='mr-2'
            />  
          </NuxtLink>
        </div>
      </div> 


      <div v-else-if='win' class='place-content-center h-77 pt-24 pb-24'>
        <div class='flex justify-center'><Winner :value='lives'/></div> 
        <div class='text-center text-blue-700 font-bold mt-3'> 
          <NuxtLink to='/intuition'>
            <BaseButton
              color="info"
              label='Список игр'
              class='mr-2'
            />  
          </NuxtLink>
        </div>
      </div>

      <SectionMain v-else-if='pack.id'>
        <div class='flex justify-between'>
          <h1 class='text-2xl mb-2'>{{pack.name}}</h1>
          <Stars :value='lives' title='Количество жизней' />
          
          <div>
            <BaseButton
              color="success"
              title='Подтвердить'
              :icon="mdiCheckOutline"
              class='mr-2'
              :disabled='!isSelected'
              @click="confirmation"
            /> 
            <BaseButton
              color="info"
              title='Подсказка "1 из 3"'
              :icon="mdiDice3"
              :disabled='hint1_3'
              @click="oneFromThreeLaunch"
            />
            <BaseButton
              color="info"
              title='Подсказка "Год выхода"'
              :icon="mdiCounter"
              :disabled='hintYear'
              @click="yearLaunch"
            />
            <BaseButton
              color="info"
              title='Подсказка "Имя персонажа"'
              :icon="mdiAccount"
              :disabled='hintName'
              @click="nameLaunch"
              class='mr-2'
            />
            <BaseButton
              color="warning"
              :icon="mdiHelpCircle"
              @click=""
            />

          </div>
        </div>
        <div class='row hidden md:flex'>
          <div class='col-xs-6 col-md-7 mb-3'>
            <CardBox class='!bg-gray-300 relative'>
              <div :class='hintMode ? "disabled": ""' class='row'>
                <div :class='guessed.includes(actor.id) || (hidden.length && !hidden.includes(actor.id)) ? "disabled": ""' class='col-6 col-sm-6 col-md-4 col-lg-3'  v-for='(actor, i) in actors' @click='() => selectedA = actor'>
                  <div class='mb-3 rounded-lg overflow-hidden cursor-pointer relative' :class='selectedA.id == actor.id ? "selectedA": "yellow-shine-large"' >
                    <img :src='actor.avatar' />
                    <img v-if='guessed.includes(actor.id)' class='absolute krest' src="/img/krest.png"  />
                  </div>
                </div>
              </div>
              <div v-if='hintMode' class='absolute top-0 left-0 flex items-center justify-center text-center w-full h-full'>
               
                <div class='bg-green-100 rounded-lg py-2 px-4 shadow-xl relative'>
                  <BaseIcon
                    class='absolute top-1 right-1 cursor-pointer'
                    :path="mdiClose"
                    size='22'
                    @click="closeHint"
                  /> 
                  <template v-if='hintMode == "1-3"'>
                    <h1 class='text-lg font-bold'>Подсказка "1 из 3"</h1>
                    <p class='py-2'> Выберите описание и вам оставят 3 персонажа</p>
                    <BaseButton
                      v-if='selectedB !== -1'
                      color="success"
                      :icon="mdiCheckOutline"
                      class='mr-2'
                      @click="confirmHint"
                    /> 
                  </template>
                  <template v-if='hintMode == "year"'>
                    <h1 class='text-lg font-bold'>Подсказка "Год выхода"</h1>
                    <p class='py-2'> Выберите описание, чтоб узнать год выхода фильма</p>
                    <BaseButton
                      v-if='selectedB !== -1'
                      color="success"
                      :icon="mdiCheckOutline"
                      class='mr-2'
                      @click="confirmHint"
                    /> 
                  </template>
                  <template v-if='hintMode == "name"'>
                    <h1 class='text-lg font-bold'>Подсказка "Имя персонажа"</h1>
                    <p class='py-2'> Выберите описание, чтоб узнать имя персонажа</p>
                    <BaseButton
                      v-if='selectedB !== -1'
                      color="success"
                      :icon="mdiCheckOutline"
                      class='mr-2'
                      @click="confirmHint"
                    /> 
                  </template>
                </div>
              </div>
            </CardBox>
          </div>
          <div class='col-12 col-md-5 mb-3'>
            <CardBox class='!bg-gray-300'>
              <div class='row'>
                <div :class='guessed.includes(actor.id) ? "disabled": ""'  class='col-12 relative'  v-for='(actor, i) in descriptions' @click='() => selectedB = actor'>
                  <div class='rounded-lg cursor-pointer text-md border-2 border-gray-500 shadow-md mb-1 py-1 px-2 bg-gray-100' :class='selectedB.id == actor.id ? "selectedB": "yellow-shine"'>
                    {{actor.text}} <span v-if='showName == actor.id'>- "{{actor.character}}"</span> <span v-if='showYear == actor.id'>({{actor.year}})</span> <span v-if='showFake && actor.id < 0'>(Fake)</span>
                    <div v-if='guessed.includes(actor.id)' class='border-red-700 border-2 w-for-underline absolute'></div>
                  </div>
                </div>
              </div>
            </CardBox>
          </div>
        </div>


        <div class='flex md:hidden relative'>
          <carousel :items-to-show="1.5" itemsToShow='1' snapAlign='start' ref='myCarousel' :wrapAround='true' v-model="currentSlide">
            <slide key="1">
              <CardBox class='!bg-gray-300'>
                <div class='row'>
                  <div class='col-6 col-sm-6 col-md-4 col-lg-3'  v-for='(actor, i) in actors' @click='() => selectedA = actor'>
                    <div class='mb-3 rounded-lg overflow-hidden cursor-pointer' :class='selectedA.id == actor.id ? "selectedA": "yellow-shine-large"'>
                      <img :src='actor.avatar' />
                    </div>
                  </div>
                </div>
              </CardBox>
            </slide>
            <slide key="12">
              <CardBox class='!bg-gray-300'>
                <div class='row'>
                  <div class='col-12'  v-for='(actor, i) in descriptions' @click='() => selectedB = actor'>
                    <div class='rounded-lg cursor-pointer text-md border-2 border-gray-500 shadow-md mb-2 py-1 px-2 bg-gray-100' :class='selectedB.id == actor.id ? "selectedB": "yellow-shine"'>
                      {{actor.text}}
                    </div>
                  </div>
                </div>
              </CardBox>
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
          <BaseButton
            color="info"
            label='Да'
            class='mr-2'
            @click="trySubmit"
          /> 
          <BaseButton
            color="info"
            label='Нет'
            class='mr-2'
            outline
            @click="falseSubmit"
          /> 
        </div>
      </CardBoxModal>

      </SectionMain>
    </NuxtLayout>
  </div>
</template>
