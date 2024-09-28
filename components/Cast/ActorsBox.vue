<script setup>
import { computed, ref, onMounted } from 'vue'
import { shuffle } from '~/utils/common'
const props = defineProps({
  data: Array,
  number: Number,
  guessed: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['chooseData'])

function clickBlock(data) {
    
}

let actors = ref([])
let show = ref([])
onMounted(async () => {
    actors.value.push(props.data.actor1)
    actors.value.push(props.data.actor2)
    actors.value.push(props.data.actor3)
    actors.value.push(props.data.actor4)
    actors.value.push(props.data.actor5)
    actors.value.push(props.data.actor6)
    actors.value.push(props.data.actor7)
    actors.value.push(props.data.actor8)

    actors.value = shuffle(actors.value)
})

let className = ref('')
let classI = ref([])

const open = useOpenActor(actors, className, classI, show, emit) 

defineExpose({
  open, show
});

</script>

<template>

<div class='row'>
     <div class='col-lg-12'>
        <div class='row items-center'>
            <div class='text-xl'>{{guessed ? data.movie.title : 'Фильм ' + number}}</div>
            <div v-if='guessed' class='col-custom2'><img :class='classI.length > 0 ? "movieOpen" : ""' :src='data.movie.image' /></div>
            <div :class='guessed ? "col-custom2": "col-custom"' v-for='(link, i) in actors'>
                <div :class='classI.includes(i) ? className: classI.length > 0 ? "notclickable" : ""' class=' cursor-pointer yellow-shine-large rounded-lg overflow-hidden' @click='open(i)'><img :src='show.includes(i) ? link: "/img/unknown.jpg"' /></div>
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