<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  rounds: Object,
})

let textCount = computed(() => {
  return props.rounds.filter(one => one.type == 'text' && !one.abcd && !one.order && !one.comparison).length
})

let photoCount = computed(() => {
  return props.rounds.filter(one => one.type == 'photo' && !one.abcd && !one.order && !one.comparison).length
})

let videoCount = computed(() => {
  return props.rounds.filter(one => one.type == 'video' && !one.abcd && !one.order && !one.comparison).length
})

let audioCount = computed(() => {
  return props.rounds.filter(one => one.type == 'audio' && !one.abcd && !one.order && !one.comparison).length
})

let abcdCount = computed(() => {
  return props.rounds.filter(one => one.abcd).length
})

let orderCount = computed(() => {
  return props.rounds.filter(one => one.order).length
})

let comparisonCount = computed(() => {
  return props.rounds.filter(one => one.comparison).length
})

let hint = computed(() => {
  let hint = ''
  if (textCount.value) {
    hint = hint + textCount.value + ' текст'
  }
  if (photoCount.value) {
    hint = hint + (hint ? ", ": " ") + photoCount.value + ' фото'
  }
  if (videoCount.value) {
    hint = hint + (hint ? ", ": " ") + videoCount.value + ' видео'
  }
  if (audioCount.value) {
    hint = hint + (hint ? ", ": " ") + audioCount.value + ' аудио'
  }
  if (abcdCount.value) {
    hint = hint + (hint ? ", ": " ") + abcdCount.value + ' абвг'
  }
  if (orderCount.value) {
    hint = hint + (hint ? ", ": " ") + orderCount.value + ' порядок'
  }
  if (comparisonCount.value) {
    hint = hint + (hint ? ", ": " ") + comparisonCount.value + ' сопоставление'
  }
  return hint
})
</script>

<template>
  <div class='' :title="hint">
    <div v-if='textCount' class='flex items-center'>
      <img class='w-4 h-4 mx-1' src='/img/pack/text.png' />
      {{textCount}}
    </div>
    <div v-if='photoCount' class='flex items-center'>
      <img class='w-4 h-4 mx-1' src='/img/pack/photo.png' />
      {{photoCount}}
    </div>
    <div v-if='videoCount' class='flex items-center'>
      <img class='w-4 h-4 mx-1' src='/img/pack/video.png' />
      {{videoCount}}
    </div>
    <div v-if='audioCount' class='flex items-center'>
      <img class='w-4 h-4 mx-1' src='/img/pack/speaker.svg' />
      {{audioCount}}
    </div>
    <div v-if='abcdCount' class='flex items-center'>
      <img class='w-4 h-4 mx-1' src='/img/pack/abcd.png' />
      {{abcdCount}}
    </div>
    <div v-if='orderCount' class='flex items-center'>
      <img class='w-4 h-4 mx-1' src='/img/pack/order.png' />
      {{orderCount}}
    </div>
    <div v-if='comparisonCount' class='flex items-center'>
      <img class='w-4 h-4 mx-1' src='/img/pack/comparison.png' />
      {{comparisonCount}}
    </div>
  </div>
</template>

<style scoped>

</style>