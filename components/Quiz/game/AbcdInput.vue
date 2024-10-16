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
