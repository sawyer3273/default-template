<script setup>
import { containerMaxW } from '@/configs/config'

const props = defineProps({
  isFull: {
    type: Boolean,
    default: false
  }
})


</script>

<template>
  <section class="p-6" style='min-height: 80vh;' :class="isFull ? '' : containerMaxW">
    <slot />
  </section>
</template>
