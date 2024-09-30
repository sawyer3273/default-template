<script setup>
import { containerMaxW } from '@/configs/config'
</script>

<template>
  <section class="p-6" style='min-height: 80vh;' :class="containerMaxW">
    <slot />
  </section>
</template>
