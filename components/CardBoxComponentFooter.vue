<script setup>
defineProps({
  smallPadding: Boolean
})
</script>
<template>
  <footer  :class="{ 'p-6': !smallPadding, 'p-2': smallPadding }">
    <slot />
  </footer>
</template>
