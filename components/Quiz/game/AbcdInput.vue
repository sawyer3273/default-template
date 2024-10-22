<script setup>
import { computed, useSlots } from 'vue'
import { shuffle } from '~/utils/common'

const props = defineProps({
    variants: String,
    correct: String
})

const emit = defineEmits(['onChoose'])

const data = ref([])
onMounted(() => {
    init()
})

watch(() => props.variants, () => {
    init()
}) 

function init() {
    let res = props.variants.split(',')
    res = shuffle(res)
    data.value = res
}

const choosen = ref('')

function choose(i) {
    choosen.value = i
    emit('onChoose', i)
}
</script>

<template>
    <div v-for='(one, i) in data' :class='data.length <= 2 ? "col-md-12": ( data.length <= 4  ? "col-md-6" : (data.length <= 6 ? "col-md-4": "col-md-3"))' @click='choose(one)'>
        <div class='p-1 text-center btn-grad rounded-lg mt-1 cursor-pointer' :class='choosen == one ? (correct == one ? "correct" : (correct ? "false" : "choosen")): ""'>{{one}}</div>
    </div>
</template>
<style scoped>

</style>
