<script setup lang='ts'>
import { computed, ref } from 'vue'
import { useDataStore } from '@/stores/data'
import { mdiEye, mdiTrashCan } from '@mdi/js'
import { dataService } from '~/utils/services/data.service'
const dayjs = inject('dayjs')
const { locale } = useI18n()

const router = useRouter()

const props = defineProps({
  pack: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['onChoosePack'])


onMounted(async () => {
  
})


const isModalActive = ref(false)

function showItem() {
    getData()
    isModalActive.value = true
}


async function getData(payload) {
  await dataService.getPacksQuiz(payload)
}
async function choosePack(pack) {
  emit('onChoosePack', pack)
  isModalActive.value = false
}

</script>

<template>
  <CardBoxModal size='xl' v-model="isModalActive"  title='Выберите пак'>
    <ContentGrid @load-data='getData' @onChoosePack='choosePack' storeModel='packs_quiz'/>
  </CardBoxModal>
  <div v-if='props.pack.id' class='rounded-lg max-w-52 overflow-hidden shadow-lg cursor-pointer relative' @click='() => showItem()'>
    <img :src='pack.logo'/>
    <div class='p-1 absolute bottom-0'>
      <div class='font-medium text-lg textWithShadow text-white'>{{props.pack.name}}</div>
      <div class='text-xs text-gray-300 text-capitalize textWithShadow'>{{ dayjs(props.pack.createdAt).locale(locale).format('MMMM D, YYYY') }}</div>
    </div>
  </div>
  <div v-else class='rounded-lg max-w-52 overflow-hidden shadow-lg cursor-pointer relative'  @click='() => showItem()'>
    <img src='/img/choose.jpg'/>
    <div class=' absolute bottom-0 text-center w-full'>
      <div class='font-medium text-lg textWithShadow text-white '>Выберите пак</div>
    </div>
  </div>

 

  
</template>
