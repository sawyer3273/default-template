<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import {
  mdiPackageVariantClosed,
  mdiPlusBoxMultiple
} from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import LineChart from '@/components/Charts/LineChart.vue'
import { userService } from '~/utils/services/user.service'
import { adminService } from '~/utils/services/admin.service'


const mainStore = useMainStore()
const router = useRouter()

definePageMeta({
  middleware: 'auth' 
})


onMounted(async () => {
  
})


async function getActors(payload) {
  
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
    <NuxtLayout name="authenticated">
      <SectionMain>
        <SectionTitleLineWithButton :icon="mdiPackageVariantClosed" title="Список паков" >
          <BaseButton
            @click='router.push("/intuition/create")'
            :icon="mdiPlusBoxMultiple"
            label="Создать"
            color="contrast"
            rounded-full
            small
          />
        </SectionTitleLineWithButton>
        <CardBox class="mb-6" has-table>
          <TableSampleClients @load-data='getActors' @delete-data='deleteActor' storeModel='actors' :fields='fields' showTitle='name'/>
        </CardBox>
      </SectionMain>
    </NuxtLayout>
  </div>
</template>
