<script setup>
import { ref } from 'vue'
import { getRandomNumber } from '~/utils/common'

const props = defineProps({
  value: {
    type: Number,
    default: 3
  },
})

let gifNumber = ref(Math.floor(getRandomNumber(1, 5)))

</script>

<template>
  <div class='text-center'>
    <h1 class='text-2xl'>Вы победили</h1>
    <div class='flex justify-center mb-4'><Stars :value='value' title='Количество жизней' /></div>
    <img :src='`/img/winner/${gifNumber}.gif`' width='300'/>
  </div>
</template>
