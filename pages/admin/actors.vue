<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import {
  mdiChartPie,
  mdiAccountStar
} from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import LineChart from '@/components/Charts/LineChart.vue'
import { dataService } from '~/utils/services/data.service'
import { adminService } from '~/utils/services/admin.service'


const mainStore = useMainStore()

definePageMeta({
  middleware: 'auth' 
})


onMounted(async () => {
  
})


async function getActors(payload) {
  await dataService.getActors(payload)
}

async function deleteActor(payload) {
  await adminService.deleteActor(payload)
}

const fields = [
  {column: 'id', name: 'ID', type: 'text'},
  {column: 'avatar', name: 'Фото', type: 'text'},
  {column: 'name', name: 'Имя', type: 'text'},
]
</script>

<template>
  <div>
    <NuxtLayout name="admin">
      <SectionMain>
        <SectionTitleLine :icon="mdiAccountStar" title="Актеры" > </SectionTitleLine>
        <CardBox class="mb-6" has-table>
          <TableSampleClients @load-data='getActors' @delete-data='deleteActor' storeModel='actors' :fields='fields' showTitle='name'/>
        </CardBox>
      </SectionMain>
    </NuxtLayout>
  </div>
</template>
