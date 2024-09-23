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
  handleDebounce = debounce(async function (val) {
      if (val.length > 1 && !chooseDelay.value) {
        componentStore.setAutofillLoading(true)
        let autofill = await dataService[props.searchF]({key: val})
        componentStore.setAutofillData(autofill.success ? autofill.data : [])
        componentStore.setAutofillLoading(false)
      } else {
        componentStore.setAutofillData([])
      }
  }, 500);
  
})

let id = 'autoselect' + uniqueId()

let inputValue = ref(props.modelValue.name)
let chooseDelay = ref(false)
let isFocused = ref(false)

watch(inputValue, async val => {
    handleDebounce(val)
})
function hide() {
  componentStore.setAutofillData([])
}


function choose(data) {
  chooseDelay.value = true
  componentStore.setAutofillData([])
  inputValue.value = data.name
  emit('update:modelValue', data)
  setTimeout(() => chooseDelay.value = false, 600)
}

function onBLur(data) {
  setTimeout(() => isFocused.value = false, 100)
}

</script>

<template>
  <label v-if='label' :for="id" class="form-label">{{label}}</label>
  <FormControl v-model="inputValue" @focus='isFocused=true' @blur='onBLur' :placeholder="placeholder" :id="id"/>
  <div v-if='isFocused' class='shadow-md rounded-md absolute z-30 bg-white' v-outside="hide">
    <div class='p-2 hover:bg-gray-100 cursor-pointer' v-for='suggest in componentStore.autofillData' @click='()=>choose(suggest)'> {{suggest.name}} </div>
  </div>
</template>
