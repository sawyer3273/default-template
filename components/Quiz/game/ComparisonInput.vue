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
            data1.value.push(one)
        } else {
            correctData.value.push(one)
            data2.value.push(one)
        }
    })
    data2.value = shuffle(data2.value)
}

watch(() => props.variants, () => {
    init()
}) 

const choosen = ref(false)

function choose() {
    let answer = ''
    data1.value.map((one, i) => {
        answer = answer + (answer ? ',' : '') + one 
        answer = answer + (answer ? ',' : '') + data2.value[i] 
    })
    choosen.value = true
    emit('onChoose', answer)
}
</script>

<template>
<div v-if='!choosen' class='text-center w-full text-gray-500 text-xs mb-2'>Перетащите <span class='border-dashed rounded-lg border-2 p-1 border-gray-400 bg-gray-100'>блоки</span> на соответсвующие места</div>
    <div v-if='isImage'>
        <div class='row px-6'>
            <div v-for='(one, i) in data1' class="col-md-3 flex flex-wrap justify-center">
                <img :src='one' class='rounded-lg images' />
                <div v-if='correct' class='w-full text-center'> {{correctData[i]}} </div>
            </div>
        </div>
        <div v-if='choosen' class="row">
            <div v-for='(one, i) in data2' class='col-md-3'>
                <div class='p-1 text-center border-2 border-gray-400 bg-gray-100 rounded-lg mt-1' :class='choosen && correct ? (correctData[i] == data2[i] ? "bg-green-400 border-white text-white" : "bg-red-400 border-white text-white") : ""'>
                    {{one}}
                </div>
            </div>
        </div>
        <draggable v-else v-model="data2" class='row' handle=".handle">
            <template #item="{element: item}">
                <div class='col-md-3'>
                    <div :class='choosen ? "notclickable": "border-dashed"' class='p-1 handle text-center border-2 border-gray-400 bg-gray-100 rounded-lg mt-1 cursor-move'> {{item}}</div>
                </div>
            </template>
        </draggable>
    </div>
    <div class='row px-6' v-else>
        <div class="col-md-6">
            <div v-for='(one, i) in data1'>
                <div class='p-1 text-center border-2 border-gray-400 bg-gray-100 rounded-lg mt-1' >
                    {{one}} <span v-if='correct'> ({{correctData[i]}}) </span>
                </div>
            </div>
        </div>
        <div v-if='choosen' class="col-md-6">
            <div v-for='(one, i) in data2'>
                <div class='p-1 text-center border-2 border-gray-400 bg-gray-100 rounded-lg mt-1' :class='choosen && correct ? (correctData[i] == data2[i] ? "bg-green-400 border-white text-white"  : "bg-red-400 border-white text-white") : ""'>{{one}}</div>
            </div>
        </div>
        <draggable v-else v-model="data2" class='col-md-6' handle=".handle">
            <template #item="{element: item}">
                <div :class='choosen ? "notclickable": "border-dashed"' class='p-1 handle text-center border-2 border-gray-400 bg-gray-100 rounded-lg mt-1 cursor-move'> {{item}}</div>
            </template>
        </draggable>
    </div>
    <div class='flex justify-center mt-2' :class='choosen ? "opacity-0": ""'><BaseButton small @click='choose' color="contrast" label='Ответить'/></div>
</template>
<style scoped>
.images {
    max-height: calc(40vh - 50px);
}
.btn-grad {
    background-image: linear-gradient(to right, #3b82f6 0%, #485279  51%, #3b82f6  100%);
    margin: 10px;
    padding: 15px 45px;
    text-align: center;
    text-transform: uppercase;
    transition: 0.5s;
    background-size: 200% auto;
    color: white;            
    box-shadow: 0 0 20px #eee;
    border-radius: 10px;
    display: block;
}

.btn-grad:hover {
    background-position: right center; /* change the direction of the change here */
    color: #fff;
    text-decoration: none;
} 
.choosen {
    background-image: linear-gradient(to right, #696969 0%, #cacaca  51%, #696969  100%);
}
.correct {
    background-image: linear-gradient(to right, #005e07 0%, #73f63b  51%, #005e07  100%);
}
.false {
    background-image: linear-gradient(to right, #f63b3b 0%, #f2f12f  51%, #f63b3b  100%);
}
</style>
