<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import {
  mdiPackageVariantClosed,
  mdiPlusBoxMultiple
} from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import LineChart from '@/components/Charts/LineChart.vue'
import { dataService } from '~/utils/services/data.service'
import { adminService } from '~/utils/services/admin.service'


const mainStore = useMainStore()
const router = useRouter()

definePageMeta({
  middleware: 'auth' 
})


onMounted(async () => {
  mainStore.setBreadCrumbs([{name: 'Квиз'}])
})


async function getData(payload) {
  await dataService.getPacksQuiz(payload)
}

async function deleteData(payload) {
  await adminService.deleteQuizPack(payload)
}

const fields = [
  {column: 'id', name: 'ID', type: 'text'},
  {column: 'logo', name: 'Фото', type: 'img'},
  {column: 'name', name: 'Название', type: 'text'},
]
</script>

<template>
  <div>
    <NuxtLayout name="admin">
      <SectionMain>
        <SectionTitleLineWithButton :icon="mdiPackageVariantClosed" title="Список паков" >
          <BaseButton
            @click='router.push("/admin/quiz/create")'
            :icon="mdiPlusBoxMultiple"
            label="Создать"
            color="contrast"
            rounded-full
            small
          />
        </SectionTitleLineWithButton>
        <CardBox class="mb-6" has-table>
          <TableSampleClients @load-data='getData' @delete-data='deleteData' showLink='/admin/quiz/{id}' storeModel='packs_quiz' :fields='fields' showTitle='name'/>
        </CardBox>
      </SectionMain>
    </NuxtLayout>
  </div>
</template>
