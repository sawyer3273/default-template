<script setup>
import { computed } from 'vue'
import { mdiStar, mdiStarOutline } from '@mdi/js'

const props = defineProps({
  value: {
    type: Number,
    default: 3
  },
  size: {
    type: String,
    default: '24'
  },
})


</script>

<template>
  <div class='flex'>
    <BaseIcon :size='size' :path="value < 3 ? mdiStarOutline: mdiStar" :class='value < 3 ? "text-gray-500" : "text-yellow-500"' />
    <BaseIcon :size='size' :path="value < 2 ? mdiStarOutline: mdiStar" :class='value < 2 ? "text-gray-500" : "text-yellow-500"' />
    <BaseIcon :size='size' :path="value < 1 ? mdiStarOutline: mdiStar" :class='value < 1 ? "text-gray-500" : "text-yellow-500"'  />
  </div>
</template>
