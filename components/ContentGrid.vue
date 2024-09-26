<script setup lang='ts'>
import { computed, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiEye, mdiTrashCan } from '@mdi/js'
const dayjs = inject('dayjs')
const { locale } = useI18n()

const router = useRouter()

interface Props {
  checkable?: Boolean
  size?: Number
  storeModel?: String
  openLink?: String
}

const props = withDefaults(defineProps<Props>(), {
  checkable: false,
  size: 50,
  storeModel: '',
})

const emit = defineEmits(['load-data', 'delete-data'])


onMounted(async () => {
  openPage(1)
})



const mainStore = useMainStore()

const items = computed(() => mainStore[props.storeModel] ? mainStore[props.storeModel] : [])
const total = computed(() => mainStore[props.storeModel] ? mainStore[props.storeModel+'_count'] : 0)
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
  }
}

</script>

<template>
  <div class='row'>
    <div v-for="pack in items" :key="pack.id" class='col-md-3 mb-3 '>
      <div class='rounded-lg overflow-hidden shadow-lg cursor-pointer relative' @click='() => showItem(pack.id)'>
        <img :src='pack.logo' :class='pack.IntuitionResult && pack.IntuitionResult.length ? "opacity-65": ""'/>
        <div class='p-1'>
          <div class='font-medium text-lg'>{{pack.name}}</div>
          <div class='text-xs text-gray-400 text-capitalize'>{{ dayjs(pack.createdAt).locale(locale).format('MMMM D, HH:mm, YYYY') }}</div>
          <div v-if='pack.IntuitionResult && pack.IntuitionResult.length' class='bg-gray-300 absolute top-0 left-0 w-full flex justify-center'>
            <Stars :value='pack.IntuitionResult[0].value'/>
          </div>
        </div>
      </div>
    </div>
  </div>
 

  
</template>
