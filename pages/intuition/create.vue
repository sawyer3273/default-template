<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import {
  mdiNoteEdit,
  mdiPlusBoxMultiple
} from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import LineChart from '@/components/Charts/LineChart.vue'
import { userService } from '~/utils/services/user.service'
import { adminService } from '~/utils/services/admin.service'
import { cloneDeep } from 'lodash'
import { yandexService } from '~/utils/services/yandex.service'


const mainStore = useMainStore()
const router = useRouter()

definePageMeta({
  middleware: 'auth' 
})


onMounted(async () => {
  
})
let emptyValue = {
  actor: {id: 0, name: ''},
  avatar: '',
  text: ''
}
let computedValue = ref([cloneDeep(emptyValue)])

async function getActors(payload) {
  
}

async function deleteActor(payload) {
  await adminService.deleteActor(payload)
}
async function getFile() {
  await yandexService.getFile('/MovieQuiz/img/c2afc1bd-43ea-41f5-b473-3de1f4abdb54.jpeg')
}


</script>

<template>
  <div>
    <NuxtLayout name="authenticated">
      <SectionMain>
        <SectionTitleLineWithButton :icon="mdiNoteEdit" title="Редактор">
          <BaseButton
            @click='computedValue.push(cloneDeep(emptyValue))'
            :icon="mdiPlusBoxMultiple"
            label="Добавить данные"
            color="contrast"
            rounded-full
            small
          />
        </SectionTitleLineWithButton>
          <div class='row' v-for='(data, i) in computedValue' :key='"auto"+i'>
              <div class='col-md-4'> <AutoSelect  v-model="computedValue[i].actor" label='Актер' searchF='getActors'  /> </div>
              <div class='col-md-4'> <CropperCust v-model='computedValue[i].avatar'/> </div>
              <div class='col-md-4'> zxczxcz </div>
          </div>
      


      </SectionMain>
    </NuxtLayout>
  </div>
</template>
