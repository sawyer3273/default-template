<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  rounds: Object,
})

let textCount = computed(() => {
  return props.rounds.filter(one => one.type == 'text').length
})

let photoCount = computed(() => {
  return props.rounds.filter(one => one.type == 'photo').length
})

let videoCount = computed(() => {
  return props.rounds.filter(one => one.type == 'image').length
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
  </div>
</template>

<style scoped>

</style>