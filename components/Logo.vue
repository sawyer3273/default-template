<script setup>
defineProps({
  class: {
    type: String,
    default: 'w-8'
  },
})
</script>
<template>
  <img :class='class' src='/img/logo.png'/>
</template>
