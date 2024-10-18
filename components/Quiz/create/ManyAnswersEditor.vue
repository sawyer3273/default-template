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
const counter = ref([])
onMounted(() => {
    let res = []
    if (props.modelValue) {
       props.modelValue.split(',').map((one, i) => {
        if (i % 2 == 0) {
            counter.value.push(i)
        }
        res.push({value: one})
       })
    } else {
        res = [{value: ''}, {value: false}, {value: ''}, {value: false}, {value: ''}, {value: false}, {value: ''}, {value: false}, {value: ''}, {value: false}, {value: ''}, {value: false}, {value: ''}, {value: false}, {value: ''}, {value: false}]
    }
    data.value = res
})

const dataFinal = computed(() => {
    let res = ''
    data.value.map((one, i) => {
        if (i % 2 == 0) {
            if (one.value) {
                res = res+(res ? ',' : '')+one.value
            } else {
                res = res+(res ? ',' : '')+'%%%'
            }
        } else {
            console.log('one.value',one.value)
            if (String(one.value).toLowerCase() === 'true') {
                res = res+(res ? ',' : '')+true
            } else {
                res = res+(res ? ',' : '')+false
            }
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
            <div class='col-md-3 flex items-center'  v-for='(one, i) in counter'>
                <div > <CropperCust :placeholder='"horizon"' :classProp='"mt-2"' :ratio='3/2' folder='manyAnswers' v-model='data[one].value' /></div>
                <FormCheckRadio
                    v-model="data[one+1].value"
                    name="isComparisonImageh"
                    :input-value="true"
                />
                <BaseIcon @click='onDelete(i)' class='text-red-500 cursor-pointer' :path='mdiDeleteCircleOutline'/>
            </div>
            
        </div>
        <div class='flex items-center text-green-500 cursor-pointer' @click='onAdd'><BaseIcon :path='mdiPlusBoxMultiple'/><span class='text-green-500'>Добавить</span></div>
    </div>
</template>
<style scoped>

</style>