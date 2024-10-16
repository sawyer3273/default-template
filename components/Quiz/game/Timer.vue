<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  value: Number,
  round: {type: Number, default: -1},
  isStarted: Boolean,
  hide: {type: Boolean, default: false}, 
})

const timerValue = ref(parseInt(props.value))
const timerText = computed(() => {
  if (timerValue.value < 0) {
    timerValue.value = 0
  }
  let mins = Math.floor(timerValue.value / 60)
  let secs = timerValue.value % 60
 return  mins + ":" + (secs < 10 ? "0": "") + secs
})

watch(() => props.round, (val) => {
  timerValue.value = parseInt(props.value)
  runTimer()
})

onMounted(() => {
  if (props.isStarted) {
    runTimer()
  }
}) 

onUnmounted(() => {
  clearTimeout(timout.value)
}) 

let timout = ref(null)
function runTimer() {
  timout.value = setTimeout(() => {
    timerValue.value--
    if (timerValue.value) {
      runTimer()
    }
  }, 1000)
}

</script>

<template>
  <div :class='!hide ? "" :"opacity-0"' class='text-white bg-blue-500 w-16 h-8 items-center text-center flex justify-center rounded-lg'>
    <span>{{timerText}}</span> 
  </div>
</template>
<style scoped>

</style>