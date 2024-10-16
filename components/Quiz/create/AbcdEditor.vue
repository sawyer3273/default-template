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
onMounted(() => {
    let res = []
    if (props.modelValue) {
       props.modelValue.split(',').map(one => {
        res.push({value: one})
       })
    } else {
        res = [{value: ''}, {value: ''}, {value: ''}, {value: ''}]
    }
    data.value = res
})

const dataFinal = computed(() => {
    let res = ''
    data.value.map(one => {
        if (one.value) {
            res = res+(res ? ',' : '')+one.value
        } else {
            res = res+(res ? ',' : '')+'%%%'
        }
    })
    return res
})

watch(() => dataFinal.value, (val) => {
    emit('update:modelValue', val)
})

function onDelete(i) {
    data.value.splice(i, 1)
}

function onAdd(i) {
    data.value.push({value: ''})
}
</script>

<template>
    <div class=' mt-2'>
        <div v-for='(one, i) in data'>
            <label v-if='!i'>Правильный ответ</label>
            <label v-if='i==1' class='mt-2'>Неправильные ответы</label>
            <div class='flex items-center'>
                <FormControl class='mt-1 w-full' v-model='one.value' placeholder="Введите вариант ответа" />
                <BaseIcon v-if='i' @click='onDelete(i)' class='text-red-500 cursor-pointer' :path='mdiDeleteCircleOutline'/>
            </div>
        </div>
        <div class='flex items-center text-green-500 cursor-pointer' @click='onAdd'><BaseIcon :path='mdiPlusBoxMultiple'/><span class='text-green-500'>Добавить</span></div>
    </div>
</template>
<style scoped>

</style>