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
    console.log('init()',)
    init()
})

const dataFinal = computed(() => {
    let res = ''
    data.value.map((one, i) => {
        if (i % 2 == 0) {
            if (one.value && !one.value.id && one.value.includes('&&')) {
                let id = one.value.split('&&')[0]
                let image = one.value.split('&&')[1]
                one.value = { id , LibraryImages: [{link: image}]}
                one.image = image
            }
            if (one.value.id && one.image) {
                res = res+(res ? ',' : '')+one.value.id + '&&' + one.image
            } else {
                res = res+(res ? ',' : '')+'%%%'
            }
        } else {
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


function init() {
    let res = []
    if (props.modelValue) {
       props.modelValue.split(',').map((one, i) => {
        if (i % 2 == 0) {
            counter.value.push(i)
        }
        res.push({value: one})
       })
    } else {
        counter.value = [0, 2, 4, 6, 8, 10, 12, 14 ]
        res = [{value: '', image: ''}, {value: false}, {value: '', image: ''}, {value: false}, {value: '', image: ''}, {value: false}, {value: '', image: ''}, {value: false}, {value: '', image: ''}, {value: false}, {value: '', image: ''}, {value: false}, {value: '', image: ''}, {value: false}, {value: '', image: ''}, {value: false}]
    }
    data.value = res
}
function onDelete(i) {
    data.value.splice(i, 1)
    data.value.splice(i-1, 1)
}

function onAdd(i) {
    data.value.push({value: '', image: ''})
    data.value.push({value: false})
}
</script>

<template>
    <div class=' mt-2'>
        <div class='row'>
            <div class='col-md-6 flex flex-wrap mb-3 pb-2 border-b-2 border-gray-200'  v-for='(one, i) in counter'>
                 <!--  <div > <CropperCust :placeholder='"horizon"' :classProp='"mt-2"' :ratio='3/2' folder='manyAnswers' v-model='data[one].value' /></div>  -->
                
                   <div class='w-full'>
                        <div class='flex justify-between'>
                            <FormCheckRadio
                                v-model="data[one+1].value"
                                name="isComparisonImageh"
                                :input-value="true"
                            />
                            <BaseIcon @click='onDelete(i)' class='text-red-500 cursor-pointer' :path='mdiDeleteCircleOutline'/>
                        </div>
                        <div><AutoSelect :key='data[one].value+"auto"+i' v-model="data[one].value" :searchF='"librarySearch"' :library='"all"' placeholder="Ответ"  class='mt-2'/></div>
                    </div>
                 
                 
                    <ImagesUpload  v-if='data[one].value.id' :key='data[one].value.id+"images"+i' class='mt-2' :classImages='"col-md-4"' v-model='data[one].image' :imagesToSelect='data[one].value.LibraryImages' 
                                :folder='data[one].value.type' :libraryId='data[one].value.id'  />

                               

            </div>
            
        </div>
        <div class='flex items-center text-green-500 cursor-pointer' @click='onAdd'><BaseIcon :path='mdiPlusBoxMultiple'/><span class='text-green-500'>Добавить</span></div>
    </div>
</template>
<style scoped>

</style>