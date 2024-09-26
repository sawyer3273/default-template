<script setup>
import { ref } from 'vue'
import { getRandomNumber } from '~/utils/common'

let gifNumber = ref(Math.floor(getRandomNumber(1, 5)))


</script>

<template>
  <div class='text-center'>
    <h1 class='text-2xl'>Вы проиграли</h1>
    <img :src='`/img/looser/${gifNumber}.gif`' width='300'/>
  </div>
</template>
