<script setup>
import { computed, ref, onMounted } from 'vue'
import { shuffle } from '~/utils/common'
const props = defineProps({
  data: Array,
  showMovie: {
    type: Boolean,
    default: false
  },
  totalPoints: Number,
  roundPoints: Number,
  freePoints: Number,
  round: Number,

})
const emit = defineEmits(['chooseData', 'nextRound'])

function clickBlock(data) {
    
}

const route = useRoute()
let actors = ref([])
let show = ref([])
let disabled = ref([])
onMounted(async () => {
  getRounds()
  let showExist = localStorage.getItem('show'+route.params.id)
  if (showExist) {
    showExist = JSON.parse(showExist)
    actors.value.map((one, i) => {
      if (showExist.includes(one)) {
        show.value.push(i)
      }
    })
  }
})

watch(show, (val) => { 
  let links = val.map(one => {
    return actors.value[one]
  })
  localStorage.setItem('show'+route.params.id, JSON.stringify(links)) 
  
  
}, {deep: true})
watch(() => props.round, async val => {
  getRounds()
})

function getRounds() {
  actors.value = []
  actors.value.push(props.data.actor1)
  actors.value.push(props.data.actor2)
  actors.value.push(props.data.actor3)
  actors.value.push(props.data.actor4)
  actors.value.push(props.data.actor5)
  actors.value.push(props.data.actor6)
  actors.value.push(props.data.actor7)
  actors.value.push(props.data.actor8)

  actors.value = shuffle(actors.value)
}

let className = ref('')
let classI = ref([])

const open = useOpenActor(actors, className, classI, show, emit, disabled) 

function next() {
  show.value = []
  disabled.value = []
  emit('nextRound')
}

defineExpose({
  open, show
});

</script>

<template>
<div class='row '>
  <div class='col-sm-5 col-md-4 col-lg-3'>
    <div class='p-1'>
      <div class='text-2xl mb-2'> <span v-if='!showMovie'>Фильм # {{round + 1}}</span> <span v-else> {{data.movie.title}} </span>   </div>
        <div :class='showMovie ? "": "hidden"' class=' sm:flex'><img :class='classI.length > 0 && showMovie ? "movieOpen" : ""' class='rounded-lg' :src='!showMovie ? "/img/question.png" : data.movie.image' /></div>
        <div v-if='showMovie' class='w-full'><BaseButton :label="round == (total - 1) ? 'Завершить игру': 'Следующий раунд'"  color="info" @click='next' class='w-full  mt-2' /></div>
        <div v-if='showMovie'> Очков за фильм: {{roundPoints}} </div>
        <div v-if='showMovie'> Всего: {{totalPoints}} </div>
        <div v-if='!showMovie' class='bg-gradient-to-r from-blue-start to-blue-end text-white text-sm rounded-md py-1 px-2 mt-2 mr-2 w-full' > 
          <div>Бесплатных открытий: <strong>{{freePoints}}</strong></div>
          <div>Возможные очки за фильм: <strong>{{roundPoints}}</strong></div>
        </div>
        <div v-if='!showMovie' class='bg-gradient-to-r from-blue-start to-blue-end text-white text-2xl rounded-md py-1 px-2 mt-2 items-center flex w-full' > 
          <div>Всего очков: <strong>{{totalPoints}}</strong></div>
        </div>
    </div>
  </div>
  <div class='col-sm-7 col-md-8 col-lg-9'>
    <div class='row'>
        <div class='col-lg-12'>
            <div class='row items-center py-2 px-3'>
                <div :class='"col-6 col-md-4 col-lg-3 my-1 px-2"' v-for='(link, i) in actors'>
                    <div :class='[classI.includes(i) ? className: classI.length > 0  ? "notclickable" : "", disabled.includes(i) ? "notclickable" : ""]' class=' cursor-pointer yellow-shine-large rounded-lg overflow-hidden' @click='open(i)'><img :src='show.includes(i) ? link: "/img/unknown.jpg"' /></div>
                </div>
            </div>
        </div>
    </div>
  </div>
</div>
</template>

<style scoped>


@keyframes openIMage {
  0% {
    transform: rotate3d(0, 1, 0, 0deg);
  }
  50% {
    transform: rotate3d(0, 1, 0, 90deg);
  }
  100% {
    transform: rotate3d(0, 1, 0, 0deg);
  }
}

.elementOpen {
  animation: openIMage 1s ease infinite alternate;
}

@keyframes openMovie {
  0% {
    transform: rotate3d(0, 1, 0, 90deg);
  }
  100% {
    transform: rotate3d(0, 1, 0, 0deg);
  }
}

.movieOpen {
  animation: openMovie 1s ease infinite alternate;
}


.notclickable {
    pointer-events: none;
}

.col-custom {
    flex: 0 0 auto;
    width: 50%;
    margin: 0.5rem 0;
}

@media (min-width: 500px) {
    .col-custom {
        flex: 0 0 auto;
        width: 25%;
        margin: 0.5rem 0;
    }
}

@media (min-width: 992px) {
    .col-custom {
        flex: 0 0 auto;
        width: 12.5%;
        margin: 0.5rem 0;
    
    }
}

@media (min-width: 500px) {
    .col-custom2 {
        flex: 0 0 auto;
        width: 25%;
        margin: 0.5rem 0;
    }
}

@media (min-width: 992px) {
    .col-custom2 {
        flex: 0 0 auto;
        width: 11.1111%;
        margin: 0.5rem 0;
    
    }
}

</style>