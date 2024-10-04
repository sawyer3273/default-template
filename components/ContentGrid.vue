<script setup lang='ts'>
import { computed, ref } from 'vue'
import { useDataStore } from '@/stores/data'
import { mdiEye, mdiTrashCan } from '@mdi/js'
const dayjs = inject('dayjs')
const { locale } = useI18n()

const router = useRouter()

interface Props {
  checkable?: Boolean
  size?: Number
  storeModel?: String
  openLink?: String
  openFunc?: String
}

const props = withDefaults(defineProps<Props>(), {
  checkable: false,
  size: 50,
  storeModel: '',
})

const emit = defineEmits(['load-data', 'delete-data', 'onChoosePack'])


onMounted(async () => {
  openPage(1)
})



const dataStore = useDataStore()

const items = computed(() => dataStore[props.storeModel] ? dataStore[props.storeModel] : [])
const total = computed(() => dataStore[props.storeModel] ? dataStore[props.storeModel+'_count'] : 0)
const numPages = computed(() => Math.ceil(total.value / perPage.value))
const perPage = ref(props.size)
const currentPage = ref(1)


function openPage(page) {
  currentPage.value = page
  emit('load-data', {
    size: perPage.value,
    page: page
  })
}

function showItem(id) {
  if (props.openLink) {
    router.push(props.openLink.replace('{id}', id));
  } else {
    let item = items.value.find(one => one.id == id)
    emit('onChoosePack', item)
  }
}

</script>

<template>
  <div class='row'>
    <div v-for="pack in items" :key="pack.id" class='col-md-3 mb-3 '>
      <div class='rounded-lg overflow-hidden shadow-lg cursor-pointer relative' @click='() => showItem(pack.id)'>
        <img :src='pack.logo' :class='pack.IntuitionResult && pack.IntuitionResult.length || pack.CastResult && pack.CastResult.length ? "opacity-65": ""'/>
        <div class='p-1 absolute bottom-0'>
          <div class='font-medium text-lg textWithShadow text-white'>{{pack.name}}</div>
          <div class='text-xs text-gray-300 text-capitalize textWithShadow'>{{ dayjs(pack.createdAt).locale(locale).format('MMMM D, YYYY') }}</div>
        </div>
        <div v-if='pack.IntuitionResult && pack.IntuitionResult.length' class='bg-gradient-to-r from-blue-start to-blue-end absolute top-0 left-0 w-full flex justify-center'>
          <Stars :value='pack.IntuitionResult[0].value'/>
        </div>
        <div v-if='pack.CastResult && pack.CastResult.length' class='bg-gradient-to-r from-blue-start to-blue-end absolute top-0 left-0 w-full flex justify-center text-white'>
          {{pack.CastResult[0].value}}
        </div>
      </div>
    </div>
  </div>
 

  
</template>
