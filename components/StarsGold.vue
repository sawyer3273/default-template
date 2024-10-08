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
    default: '4'
  },
})


</script>

<template>
  <div class='flex mr-1'>
    <img v-if='value >= 2' :class='`w-${size} h-${size}`' class='' src='/img/pack/star.png' />
    <img v-else-if='value >= 1' :class='`w-${size} h-${size}`' class='' src='/img/pack/star-half.png' />
    <img v-else :class='`w-${size} h-${size}`' class='' src='/img/pack/star-empty.png' />
    <img v-if='value >= 4' :class='`w-${size} h-${size}`' class='' src='/img/pack/star.png' />
    <img v-else-if='value >= 3' :class='`w-${size} h-${size}`' class='' src='/img/pack/star-half.png' />
    <img v-else :class='`w-${size} h-${size}`' class='' src='/img/pack/star-empty.png' />
    <img v-if='value >= 6' :class='`w-${size} h-${size}`' class='' src='/img/pack/star.png' />
    <img v-else-if='value >= 5' :class='`w-${size} h-${size}`' class='' src='/img/pack/star-half.png' />
    <img v-else :class='`w-${size} h-${size}`' class='' src='/img/pack/star-empty.png' />
    <img v-if='value >= 8' :class='`w-${size} h-${size}`' class='' src='/img/pack/star.png' />
    <img v-else-if='value >= 7' :class='`w-${size} h-${size}`' class='' src='/img/pack/star-half.png' />
    <img v-else :class='`w-${size} h-${size}`' class='' src='/img/pack/star-empty.png' />
    <img v-if='value >= 10' :class='`w-${size} h-${size}`' class='' src='/img/pack/star.png' />
    <img v-else-if='value >= 9' :class='`w-${size} h-${size}`' class='' src='/img/pack/star-half.png' />
    <img v-else :class='`w-${size} h-${size}`' class='' src='/img/pack/star-empty.png' />
  </div>
</template>
