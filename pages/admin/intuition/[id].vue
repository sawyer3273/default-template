<script setup>
import { computed, ref, onBeforeMount } from 'vue'
import { useMainStore } from '@/stores/main'
import {
  mdiNoteEdit, mdiPlusBoxMultiple, mdiDeleteCircleOutline, mdiAccountPlusOutline
} from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import LineChart from '@/components/Charts/LineChart.vue'
import { dataService } from '~/utils/services/data.service'
import { adminService } from '~/utils/services/admin.service'
import { cloneDeep } from 'lodash'
import { useToast } from "vue-toastification";
const toast = useToast();

const mainStore = useMainStore()
const router = useRouter()
const route = useRoute()

definePageMeta({
  middleware: 'auth' 
})


onBeforeMount(async () => {
  try {
    let data = await dataService.getPacksIntuition({id: route.params.id})
    if (data.data) {
      packData.value = {
        logo: data.data[0].logo,
        text: data.data[0].name,
        fakeActor: data.data[0].fakeActor,
        id: data.data[0].id,
      }
      computedValue.value = []
      data.data[0].IntuitionPackContent.map(one => {
        computedValue.value.push({
          actor: {id: one.actor_id, name: one.actorName, avatar: one.avatar},
          year: one.year,
          character: one.character,
          text: one.text,
          movie: one.movie,
          id: one.id,
        })
      })
      
    }
  } catch (err) {
    router.push('/admin/intuition');
  }

});


let emptyValue = {
  actor: {id: 0, name: '', avatar: '',},
  year: '',
  character: '',
  movie: '',
  text: '',
  id: 0
}
let computedValue = ref([cloneDeep(emptyValue)])
let packData = ref({
  logo: '',
  text: '',
  fakeActor: '',
  id: 0
})


const toDeleteId = ref(0)
const isModalDangerActive = ref(false)
async function deleteAction() {
  isModalDangerActive.value = false
  let toDeleteObj = computedValue.value[toDeleteId.value]
  if (toDeleteId.value > -1) { 
    computedValue.value.splice(toDeleteId.value, 1); 
  }
  if (toDeleteObj && toDeleteObj.id) {
   await adminService.deleteIntuitionItemPack({id: toDeleteObj.id}) 
  }
}

async function changeActorAvatar(file, id) {
  await adminService.updateActor({avatar: file, id})
}


async function upload() {
  let image = await adminService.uploadImage()
}

async function save() {
  if (computedValue.value.length < 12) {
   // toast.error('Недостаточно актеров'); return
  }
  let errors = []
  computedValue.value.map((one, i) => {
    if (!one.actor.id || !one.actor.avatar || !one.year || !one.character || !one.text) {
      errors.push(i+1)
    }
  })
  if (errors.length) {
     toast.error('Не хватает данных у актеров под этими номерами: '+ errors.join()); return
  } else {
    let item = JSON.parse(JSON.stringify(computedValue.value))
    let data = await adminService.addIntuitionPack({pack: item, data: packData.value})
    if (data.success) {
      router.push('/admin/intuition');
    }
  }
}


</script>

<template>
  <div>
    <NuxtLayout name="admin">
      <CardBoxModal v-model="isModalDangerActive" :title="$t('deleteSure')" button="danger" has-cancel>
        <BaseButton label="Ok" color="contrast" @click="deleteAction" />
      </CardBoxModal>
      <SectionMain>
        <SectionTitleLine :icon="mdiNoteEdit" title="Данные пака"></SectionTitleLine>
        <CardBox class='mb-4 shadow-sm '>
          <div class='row'>
              <div class='col-md-2'>
                <CropperCust :placeholder='"horizon"' :classProp='"inline-grid"' :ratio='14/9' v-model='packData.logo' /> 
              </div>
              <div class='col-md-10'>
                <FormControl class='mt-1' v-model='packData.text'  placeholder="Введите название пака" />
                <FormControl class='mt-1' v-model='packData.fakeActor'  placeholder="Введите несуществующего персонажа" />
              </div>
            </div>
        </CardBox>
        <SectionTitleLine :icon="mdiNoteEdit" title="Список актеров"></SectionTitleLine>
        <div class='mb-2'> Введите минимум 12 актеров  </div>
        <div class='row'>
          <div class='col-md-6' v-for='(data, i) in computedValue' :key='"auto"+i'>

          <CardBox class='mb-4 shadow-sm relative pt-1'>
             <BaseIcon class='cursor-pointer text-red-500 absolute top-1 right-1' :path="mdiDeleteCircleOutline"  @click="() => {toDeleteId = i; isModalDangerActive = true}" />
            <div class='row'>
              <div class='col-md-4'>
                <CropperCust :classProp='"inline-grid"' folder='actors' :showbtn='computedValue[i].actor.id' v-model='computedValue[i].actor.avatar' @onUpload='(file) => changeActorAvatar(file, computedValue[i].actor.id)'/> 
              </div>
              <div class='col-md-8'> 
                <AutoSelect v-model="computedValue[i].actor" searchF='getActors' placeholder="Выберите актера" />
                <FormControl class='mt-1' v-model='computedValue[i].text' type="textarea" placeholder="Введите описание роли" />
                <FormControl class='mt-1' v-model='computedValue[i].year' placeholder="Введите год выхода фильма" />
                <FormControl class='mt-1' v-model='computedValue[i].character' placeholder="Введите имя персонажа" />
                <FormControl class='mt-1' v-model='computedValue[i].movie' placeholder="Введите название фильма" />
                <div class='top-0 left-0 ml-3 mt-1 absolute font-bold'>{{i+1}}</div>
              </div>
            </div>
          </CardBox>

          </div>
        </div>

         <SectionTitleLineWithButton  title="">
         <div>
          <BaseButton
              @click='computedValue.push(cloneDeep(emptyValue))'
              :icon="mdiAccountPlusOutline"
              label="Добавить актера"
              color="contrast"
              rounded-full
              small
            />
          <BaseButton
            @click='save'
            :icon="mdiPlusBoxMultiple"
            label="Сохранить"
            color="contrast"
            rounded-full
            small
          />
          </div>
        </SectionTitleLineWithButton>
      </SectionMain>
    </NuxtLayout>
  </div>
</template>

