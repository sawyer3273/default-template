<script setup lang='ts'>
import { computed, ref } from 'vue'



const props = defineProps({
  text: {
    type: String,
    required: true
  }
})



</script>

<template>
  <div class='border-gray-300 border-2 my-4 rounded-lg p-6 text-gray-500 shadow-sm text-center'>
    {{text}}
  </div>
</template>
