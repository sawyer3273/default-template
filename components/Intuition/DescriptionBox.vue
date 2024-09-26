<script setup>
import { mdiCheckOutline, mdiClose } from '@mdi/js'
import { computed, ref, onMounted } from 'vue'
defineProps({
  hintMode: String,
  selectedB: Object,
  guessed: Array,
  descriptions: Array,
  showName: Boolean,
  showYear: Boolean
})
const emit = defineEmits(['chooseData', 'confirmHint', 'closeHint' ])

function clickBlock(data) {
    emit('chooseData', data)
}
function confirmHint() {
    emit('confirmHint', )
}
function closeHint() {
    emit('closeHint', )
}
</script>





<template>

    <CardBox class='!bg-gray-300'>
        <div v-if='hintMode' class='mb-2 bg-green-100 rounded-lg py-2 px-4 shadow-xl relative'>
            <BaseIcon
            class='absolute top-1 right-1 cursor-pointer'
            :path="mdiClose"
            size='22'
            @click="closeHint"
            /> 
            <template v-if='hintMode == "1-3"'>
            <h1 class='text-lg font-bold'>Подсказка "1 из 3"</h1>
            <p class='py-1'> Выберите описание, программа оставит только 3 персонажа</p>
            <BaseButton
                v-if='selectedB !== -1'
                color="success"
                label='Подтвердить'
                :icon="mdiCheckOutline"
                class='mr-2'
                @click="confirmHint"
            /> 
            </template>
            <template v-if='hintMode == "year"'>
            <h1 class='text-lg font-bold'>Подсказка "Год выхода"</h1>
            <p class='py-1'> Выберите описание, чтоб узнать год выхода фильма</p>
            <BaseButton
                v-if='selectedB !== -1'
                color="success"
                label='Подтвердить'
                :icon="mdiCheckOutline"
                class='mr-2'
                @click="confirmHint"
            /> 
            </template>
            <template v-if='hintMode == "name"'>
            <h1 class='text-lg font-bold'>Подсказка "Имя персонажа"</h1>
            <p class='py-1'> Выберите описание, чтоб узнать имя персонажа</p>
            <BaseButton
                v-if='selectedB !== -1'
                color="success"
                label='Подтвердить'
                :icon="mdiCheckOutline"
                class='mr-2'
                @click="confirmHint"
            /> 
            </template>
        </div>
        <div class='row'>
            <div :class='guessed.includes(actor.id) ? "disabled": ""'  class='col-12 relative'  v-for='(actor, i) in descriptions' @click='() => clickBlock(actor)'>
            <div class='rounded-lg cursor-pointer text-md border-2 border-gray-500 shadow-md mb-1 py-1 px-2 bg-gray-100' :class='selectedB.id == actor.id ? "selectedB": "yellow-shine"'>
                {{actor.text}} <span v-if='showName == actor.id'>- "{{actor.character}}"</span> <span v-if='showYear == actor.id'>({{actor.year}})</span> <span v-if='showFake && actor.id < 0'>(Fake)</span>
                <div v-if='guessed.includes(actor.id)' class='border-red-700 border-2 w-for-underline absolute'></div>
            </div>
            </div>
        </div>
    </CardBox>

</template>