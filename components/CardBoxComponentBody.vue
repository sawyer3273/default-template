<script setup>
defineProps({
  noPadding: Boolean,
  smallPadding: Boolean
})
</script>

<template>
  <div class="flex-1" :class="{ 'p-6': !noPadding && !smallPadding, 'p-2': smallPadding }">
    <slot />
  </div>
</template>
