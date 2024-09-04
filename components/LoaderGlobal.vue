<script setup>

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  },
})
</script>
<template>
    <div style='z-index: 1000000' v-if='show' class='loader-global'>
        <div class='text-center'>
            <img width='60' height='60' src='/img/loader.gif'/>
            <div v-if='text' style='color: white; font-size: 18px; font-weight: bold'>{{text}}</div>
        </div>
    </div>
</template>