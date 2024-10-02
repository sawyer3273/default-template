<script setup>
import { computed, ref } from 'vue'
import  {uniqueId, debounce} from 'lodash'
import { dataService } from '~/utils/services/data.service'
import { useDebounceFn } from "@vueuse/core"
import { useComponentStore } from '@/stores/component'
import outside from "@venegrad/vue3-click-outside"

const componentStore = useComponentStore()
const props = defineProps({
  placeholder: {
    type: String,
    default: 'Начните вводить...'
  },
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number, Boolean, Array, Object],
    default: ''
  },
  searchF: String,
})

const emit = defineEmits(['update:modelValue'])

let computedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

let handleDebounce
onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
  if (!props.modelValue.value) {
    componentStore.setAutofillData([])
  }
  handleDebounce = debounce(async function (val) {
      if (val && val.length > 1 && !chooseDelay.value) {
        componentStore.setAutofillLoading(true)
        let autofill = await dataService[props.searchF]({key: val})
        componentStore.setAutofillData(autofill.success ? autofill.data : [])
        componentStore.setAutofillLoading(false)
      } else {
        componentStore.setAutofillData([])
      }
  }, 500);
  
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
})

onUpdated(() => {
  if (!isInit.value ) {
    inputValue.value = props.modelValue.name
    isInit.value = true
  }
})

let id = 'autoselect' + uniqueId()

let inputValue = ref(props.modelValue.name)
let chooseDelay = ref(false)
let isFocused = ref(false)
let isInit = ref(false)

watch(inputValue, async val => {
    handleDebounce(val)
})

watch(() => props.modelValue, async val => {
   if (!val) {
    inputValue.value = ''
    componentStore.setAutofillData([])
   }
}, { deep: true })
function hide() {
    if (!props.modelValue.id) {
      inputValue.value = ''
    }
    if (props.modelValue.title) {
      inputValue.value = props.modelValue.title 
    }
    componentStore.setAutofillData([])
}


function choose(data) {
  chooseDelay.value = true
  componentStore.setAutofillData([])
  inputValue.value = data.name ? data.name : data.title 
  emit('update:modelValue', data)
  setTimeout(() => chooseDelay.value = false, 600)
}

function onBLur(data) {
  setTimeout(() => isFocused.value = false, 1000)
}

let mode = ref('bottom')
function handleScroll() {
  let element = document.querySelector('#'+id)
  if (element) {
    const position = element.getBoundingClientRect().bottom
    let viewportBottom =  window.document.documentElement.clientHeight
    if ((position + 200) > viewportBottom) {
      mode.value = 'top'
    } else {
      mode.value = 'bottom'
    }
  }
}
</script>

<template>
<div class='relative'>
  <label v-if='label' :for="id" class="form-label">{{label}}</label>
  <div v-if='mode=="top" && componentStore.autofillData.length' class='shadow-md rounded-md absolute z-30 bg-white bottom-0 mb-14 autofill-content' v-outside="hide" >
    <div class='p-2 hover:bg-gray-100 border-b first:rounded-t-md autofill-odd cursor-pointer' :key='suggest.id' v-for='suggest in componentStore.autofillData' @click='()=>choose(suggest)'> 
      <span v-if='suggest.name'>{{suggest.name}}</span> 
      <template v-else><div>{{suggest.title}} ({{suggest.year}})</div><div class='text-xs text-gray-400'>{{suggest.origin}}</div></template> 
      
    </div>
  </div>
  <FormControl class='mb-2' v-model="inputValue" @focus='isFocused=true' @blur='onBLur' :placeholder="placeholder" :id="id"/>
  
  <div v-if='mode=="bottom" && componentStore.autofillData.length' class='shadow-md rounded-md absolute z-30 bg-white autofill-content' v-outside="hide" >
    <div class='p-2 hover:bg-gray-100  border-b cursor-pointer first:rounded-t-md autofill-odd cursor-pointer' v-for='suggest in componentStore.autofillData' @click='()=>choose(suggest)'> 
    
      <span v-if='suggest.name'>{{suggest.name}}</span> 
      <template v-else><div>{{suggest.title}} ({{suggest.year}})</div><div class='text-xs text-gray-400'>{{suggest.origin}}</div></template> 
      
    </div>
  </div>
</div>
</template>
<style scoped>
.autofill-content {
  max-height: 325px;
  overflow: auto;
}
</style>