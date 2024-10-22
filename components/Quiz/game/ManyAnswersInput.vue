<script setup>
import { computed, useSlots } from 'vue'
import { shuffle } from '~/utils/common'
import { mdiDragVertical, mdiDragHorizontal } from '@mdi/js'

const props = defineProps({
    variants: String,
    correct: String,
    isImage: { type: Boolean, default: false }
})

const emit = defineEmits(['onChoose'])

const data1 = ref([])

const data2 = ref([])
const correctData = ref([])
onMounted(() => {
    init()
})

function init() {
    choosen.value = false
    correctData.value = []
    data1.value = []
    data2.value = []
    let res = props.variants.split(',')
    res.map((one, i) => {
        if (i % 2 == 0) {
            if (one.includes('&&')) {
                data1.value.push(one.split('&&')[1])
            } else {
                data1.value.push(one)
            }
            
            data2.value.push(false)
        } else {
            correctData.value.push(one)
        }
    })
}

watch(() => props.variants, () => {
    init()
}) 

const choosen = ref(false)

function choose() {
    let answer = ''
    let count = 0
    data1.value.map((one, i) => {
            answer = answer + (answer ? ',' : '') + one 
            answer = answer + (answer ? ',' : '') + data2.value[i]
    })
    choosen.value = true
    emit('onChoose', answer)
}
function isTrue(val) {
    return String((val)).toLowerCase() === "true"
}
</script>

<template>
    <div class='row px-10'>
        <div v-for='(one, i) in data1' class="col-md-3">
            <div class='relative text-center bg-gray-100 rounded-lg mt-1 cursor-pointer' @click='() => data2[i] = !data2[i]' :class='data2[i] ? "shadow-2xl opacity-70 p-0 border-6 border-green-700": "border-2 p-1 border-gray-400"'>
                <img :src='one' style='aspect-ratio: 1.6; object-fit: cover;' />
                <img v-if='correct && (isTrue(correctData[i]) || isTrue(data2[i]))' 
                    :src='isTrue(correctData[i]) && isTrue(data2[i]) ? "/img/krest.png" : (isTrue(correctData[i]) ? "/img/krest-gray.png": (isTrue(data2[i]) ? "/img/none.png": ""))' 
                    class='absolute top-0'
                />
            </div>
        </div>
    </div>
    <div class='flex justify-center mt-2' :class='choosen ? "opacity-0": ""'><BaseButton small @click='choose' color="contrast" label='Ответить'/></div>
</template>
<style scoped>

.border-6 {
    border-width: 6px;
}
</style>
