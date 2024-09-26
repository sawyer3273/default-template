<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import { userService } from '~/utils/services/user.service'
import { dataService } from '~/utils/services/data.service'
import { cloneDeep } from 'lodash'
import { shuffle } from '~/utils/common'
import 'vue3-carousel/dist/carousel.css'
import { mdiDice3, mdiCheckOutline, mdiCounter, mdiAccount, mdiHelpCircle } from '@mdi/js'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { useToast } from "vue-toastification";
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
  console.log('selectedA',selectedA.value)
  console.log('selectedB',selectedB.value)
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
              @click=""
            />
            <BaseButton
              color="info"
              title='Подсказка "Год выхода"'
              :icon="mdiCounter"
              @click=""
            />
            <BaseButton
              color="info"
              title='Подсказка "Имя персонажа"'
              :icon="mdiAccount"
              @click=""
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
            <CardBox class='!bg-gray-300'>
              <div class='row'>
                <div :class='guessed.includes(actor.id) ? "disabled": ""' class='col-6 col-sm-6 col-md-4 col-lg-3'  v-for='(actor, i) in actors' @click='() => selectedA = actor'>
                  <div class='mb-3 rounded-lg overflow-hidden cursor-pointer relative' :class='selectedA.id == actor.id ? "selectedA": "yellow-shine-large"' >
                    <img :src='actor.avatar' />
                    <img v-if='guessed.includes(actor.id)' class='absolute krest' src="/img/krest.png"  />
                  </div>
                </div>
              </div>
            </CardBox>
          </div>
          <div class='col-12 col-md-5 mb-3'>
            <CardBox class='!bg-gray-300'>
              <div class='row'>
                <div :class='guessed.includes(actor.id) ? "disabled": ""'  class='col-12 relative'  v-for='(actor, i) in descriptions' @click='() => selectedB = actor'>
                  <div class='rounded-lg cursor-pointer text-md border-2 border-gray-500 shadow-md mb-2 py-1 px-2 bg-gray-100' :class='selectedB.id == actor.id ? "selectedB": "yellow-shine"'>
                    {{actor.text}}
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
