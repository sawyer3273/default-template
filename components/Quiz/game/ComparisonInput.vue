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
onMounted(() => {
    init()
})

function init() {
    data1.value = []
    data2.value = []
    let res = props.variants.split(',')
    res.map((one, i) => {
        if (i % 2 == 0) {
            data1.value.push(one)
        } else {
            data2.value.push(one)
        }
    })
    data1.value = shuffle(data1.value)
    data2.value = shuffle(data2.value)
}

watch(() => props.variants, () => {
    init()
}) 

const choosen = ref('')

function choose(i) {
    choosen.value = i
    emit('onChoose', i)
}
</script>

<template>
<div class='text-center w-full text-gray-500 text-xs mb-2'>Перетащите <span class='border-dashed rounded-lg border-2 p-1 border-gray-400'>блоки</span> на соответсвующие места</div>
    <div v-if='isImage'>
        <div class='row px-6'>
            <div v-for='(one, i) in data1' class="col-md-3 flex justify-center">
                <img :src='one' class='rounded-lg images' />
            </div>

        </div>
        <draggable v-model="data2" class='row' handle=".handle">
            <template #item="{element: item}">
                <div class='col-md-3'>
                    <div class='p-1 handle text-center border-dashed  border-2 border-gray-400 rounded-lg mt-1 cursor-move'> {{item}}</div>
                </div>
            </template>
        </draggable>
    </div>
    <div class='row px-6' v-else>
        <div class="col-md-6">
            <div v-for='(one, i) in data1'>
                <div class='p-1 text-center border-2 border-gray-400 rounded-lg mt-1  '>{{i+1}}. {{one}}</div>
            </div>
        </div>
   <!--     <draggable v-model="data2" handle=".handle">
        <template #item="{element: item}">
        <div class="item">
            <div class="title">{{item}}</div>
            <div class="handle">Sort</div>
        </div>
        </template>
        </draggable>

        -->
        <draggable v-model="data2" class='col-md-6' handle=".handle">
            <template #item="{element: item}">
                <div class='p-1 handle text-center border-dashed  border-2 border-gray-400 rounded-lg mt-1 cursor-move'> {{item}}</div>
            </template>
        </draggable>

    </div>
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
