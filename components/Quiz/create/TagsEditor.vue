<script setup>
import { computed, useSlots } from 'vue'
import { adminService } from '~/utils/services/admin.service'
import {
  mdiPlusBoxMultiple, mdiDeleteCircleOutline
} from '@mdi/js'

const props = defineProps({
     modelValue: {
        type: [String, Number, Boolean, Array, Object],
        default: ''
    },
})

const emit = defineEmits(['update:modelValue'])

const data = ref([])
const form = ref('')
onMounted(() => {
    init()
})

function init() {
    let res = []
    if (props.modelValue) {
       res = JSON.parse(props.modelValue)
    } else {
        res = []
    }
    data.value = res
}


const dataFinal = computed(() => {
    return JSON.stringify(data.value)
})

watch(() => dataFinal.value, (val) => {
    emit('update:modelValue', val)
})

watch(() => props.modelValue, (val) => {
    init()
})
function onDelete(i) {
    data.value.splice(i, 1)
}

function onAdd() {
    if (form.value.id) {
        data.value.push({id: form.value.id, word: form.value.word})
    }
    form.value = ''
}
</script>

<template>
    <label class='mt-2'>Теги</label>
    <div><AutoSelect v-model="form" :searchF='"librarySearch"' :library='"all"' placeholder="Введите тег"  class='mt-2'/></div>
    <div class=' mt-2 flex'>
        <div v-for='(one, i) in data' class='flex items-center ml-1'>
            <div> {{one.word}} </div>
            <BaseIcon @click='onDelete(i)' class='text-red-500 cursor-pointer' :path='mdiDeleteCircleOutline'/>
        </div>
    </div>
    <div class='flex items-center text-green-500 cursor-pointer' @click='onAdd'><BaseIcon :path='mdiPlusBoxMultiple'/><span class='text-green-500'>Добавить тег</span></div>
</template>
<style scoped>

</style>