<script setup>
import { computed, ref, onMounted } from 'vue'
defineProps({
  hintMode: String,
  hidden: Array,
  selectedA: Object,
  guessed: Array,
  actors: Array
})
const emit = defineEmits(['chooseData'])

function clickBlock(data) {
    emit('chooseData', data)
}
</script>

<template>

<CardBox class='!bg-gray-300'>
    <div :class='hintMode ? "disabled": ""' class='row'>
        <div :class='guessed.includes(actor.id) || (hidden.length && !hidden.includes(actor.id)) ? "disabled": ""' class='col-6 col-sm-6 col-md-4 col-lg-3'  v-for='(actor, i) in actors' @click='() =>  clickBlock(actor)'>
        <div class='mb-3 rounded-lg overflow-hidden cursor-pointer relative' :class='selectedA.id == actor.id ? "selectedA": "yellow-shine-large"' >
            <img :src='actor.avatar' />
            <img v-if='guessed.includes(actor.id)' class='absolute krest' src="/img/krest.png"  />
            <div v-if='guessed.includes(actor.id)' class='absolute bottom-0 text-xs text-white z-100 text-center bg-black w-full' > {{actor.movie}}</div>
        </div>
        </div>
    </div>
</CardBox>

</template>