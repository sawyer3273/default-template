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
        res = [{value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}]
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
    data.value.splice(i-1, 1)
}

function onAdd(i) {
    data.value.push({value: ''})
    data.value.push({value: ''})
}
</script>

<template>
    <div class=' mt-2'>
        <div class='row'>
            <div class='col-md-6 flex items-center'  v-for='(one, i) in data'>
                <FormControl class='mt-1 w-full' v-model='one.value' :placeholder="(i % 2 == 1) ? 'Введите ответ ' + (i/2 + 0.5) : 'Введите вариант ' + (i/2 + 1)" />
                <BaseIcon v-if='i % 2 == 1' @click='onDelete(i)' class='text-red-500 cursor-pointer' :path='mdiDeleteCircleOutline'/>
            </div>
            
        </div>
        <div class='flex items-center text-green-500 cursor-pointer' @click='onAdd'><BaseIcon :path='mdiPlusBoxMultiple'/><span class='text-green-500'>Добавить</span></div>
    </div>
</template>
<style scoped>

</style>