<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import {
  mdiNoteEdit,
  mdiPlusBoxMultiple, mdiAccountPlusOutline
} from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import LineChart from '@/components/Charts/LineChart.vue'
import { userService } from '~/utils/services/user.service'
import { adminService } from '~/utils/services/admin.service'
import { cloneDeep } from 'lodash'
import { useToast } from "vue-toastification";
const toast = useToast();

const mainStore = useMainStore()
const router = useRouter()

definePageMeta({
  middleware: 'auth' 
})


onMounted(async () => {
  mainStore.setBreadCrumbs([{name: 'Каст', to: '/admin/cast'}, {name: 'Создать пак'}])
})

let emptyValue = {
  movie: {id: 0, name: '', image: '',},
  actor1: {id: 0, name: '', avatar: '',},
  actor2: {id: 0, name: '', avatar: '',},
  actor3: {id: 0, name: '', avatar: '',},
  actor4: {id: 0, name: '', avatar: '',},
  actor5: {id: 0, name: '', avatar: '',},
  actor6: {id: 0, name: '', avatar: '',},
  actor7: {id: 0, name: '', avatar: '',},
  actor8: {id: 0, name: '', avatar: '',},
}
let computedValue = ref([cloneDeep(emptyValue)])
let packData = ref({
  logo: '',
  text: '',
})

async function changeActorAvatar(file, id) {
  await adminService.updateActor({avatar: file, id})
}
async function changeMovieAvatar(file, id) {
  await adminService.updateMovie({image: file, id})
}

async function save() {
  let errors = []
  computedValue.value.map((one, i) => {
    if (!one.movie.id || !one.actor1.id || !one.actor2.id|| !one.actor3.id|| !one.actor4.id|| !one.actor5.id|| !one.actor6.id|| !one.actor7.id|| !one.actor8.id) {
      errors.push(i+1)
    }
  })
  if (!packData.value.logo) {
    toast.error('Загрузите главную картинку'); return
  }
  if (!packData.value.text) {
    toast.error('Введите название'); return
  }
  if (errors.length) {
     toast.error('Не хватает данных у фильмов под этими номерами: '+ errors.join()); return
  } else {
    let item = JSON.parse(JSON.stringify(computedValue.value))
    let data = await adminService.addCastPack({pack: item, data: packData.value})
    if (data.success) {
      router.push('/admin/cast');
    }
  }
}

</script>

<template>
  <div>
    <NuxtLayout name="admin">
      <SectionMain>
        <SectionTitleLine :icon="mdiNoteEdit" title="Данные пака"> </SectionTitleLine>
        <CardBox class='mb-4 shadow-sm '>
          <div class='row'>
              <div class='col-md-2'>
                <CropperCust :placeholder='"horizon"' :classProp='"inline-grid"' :ratio='14/9' v-model='packData.logo' /> 
              </div>
              <div class='col-md-10'>
                <FormControl class='mt-1' v-model='packData.text'  placeholder="Введите название пака" />
              </div>
            </div>
        </CardBox>
        <SectionTitleLine :icon="mdiNoteEdit" title="Список Фильмов"> </SectionTitleLine>
        <div class='mb-2'> Добавьте минимум 6 фильмов  </div>
        <div class='row'>
          <div class='col-md-12' v-for='(data, i) in computedValue' :key='"auto"+i'>
          <CardBox class='mb-4 shadow-sm relative'>
           <div class='row'>
              <div class='col-md-2'>
                <div class='mb-2 justify-center flex flex-wrap'>
                  <AutoSelect v-model="computedValue[i].movie" searchF='getMovies' placeholder="Выберите фильм" />
                  <CropperCust :classProp='"inline-grid"' folder='movies' :ratio='9/12' :showbtn='computedValue[i].movie.id' v-model='computedValue[i].movie.image' @onUpload='(file) => changeMovieAvatar(file, computedValue[i].movie.id)'/> 
                </div>
              </div>
              <div class='col-md-2'> 
                <div class='mb-2 justify-center flex flex-wrap'>
                  <AutoSelect v-model="computedValue[i].actor2" searchF='getActors' placeholder="Выберите актера" />
                  <CropperCust :classProp='"inline-grid"' folder='actors' :showbtn='!!computedValue[i].actor2.avatar || !!computedValue[i].actor2.id' v-model='computedValue[i].actor2.avatar' @onUpload='(file) => changeActorAvatar(file, computedValue[i].actor2.id)'/> 
                </div>
                <div class='mb-2 justify-center flex flex-wrap'>
                  <AutoSelect v-model="computedValue[i].actor3" searchF='getActors' placeholder="Выберите актера" />
                  <CropperCust :classProp='"inline-grid"' folder='actors' :showbtn='!!computedValue[i].actor3.avatar || !!computedValue[i].actor3.id' v-model='computedValue[i].actor3.avatar' @onUpload='(file) => changeActorAvatar(file, computedValue[i].actor3.id)'/> 
                </div>
              </div>
              <div class='col-md-2'> 
                <div class='mb-2 justify-center flex flex-wrap'>
                  <AutoSelect v-model="computedValue[i].actor4" searchF='getActors' placeholder="Выберите актера" />
                  <CropperCust :classProp='"inline-grid"' folder='actors' :showbtn='!!computedValue[i].actor4.avatar || !!computedValue[i].actor4.id' v-model='computedValue[i].actor4.avatar' @onUpload='(file) => changeActorAvatar(file, computedValue[i].actor4.id)'/> 
                </div>
                <div class='mb-2 justify-center flex flex-wrap'>
                  <AutoSelect v-model="computedValue[i].actor5" searchF='getActors' placeholder="Выберите актера" />
                  <CropperCust :classProp='"inline-grid"' folder='actors' :showbtn='!!computedValue[i].actor5.avatar || !!computedValue[i].actor5.id' v-model='computedValue[i].actor5.avatar' @onUpload='(file) => changeActorAvatar(file, computedValue[i].actor5.id)'/> 
                </div>
              </div>
              <div class='col-md-2'> 
                <div class='mb-2 justify-center flex flex-wrap'>
                  <AutoSelect v-model="computedValue[i].actor6" searchF='getActors' placeholder="Выберите актера" />
                  <CropperCust :classProp='"inline-grid"' folder='actors' :showbtn='!!computedValue[i].actor6.avatar || !!computedValue[i].actor6.id' v-model='computedValue[i].actor6.avatar' @onUpload='(file) => changeActorAvatar(file, computedValue[i].actor6.id)'/> 
                </div>
                 <div class='mb-2 justify-center flex flex-wrap'>
                  <AutoSelect v-model="computedValue[i].actor1" searchF='getActors' placeholder="Выберите актера" />
                  <CropperCust :classProp='"inline-grid"' folder='actors' :showbtn='!!computedValue[i].actor1.avatar || !!computedValue[i].actor1.id' v-model='computedValue[i].actor1.avatar' @onUpload='(file) => changeActorAvatar(file, computedValue[i].actor1.id)'/> 
                </div>
              </div>
              <div class='col-md-2'> 
                <div class='mb-2 justify-center flex flex-wrap'>
                  <AutoSelect v-model="computedValue[i].actor7" searchF='getActors' placeholder="Выберите актера" />
                  <CropperCust :classProp='"inline-grid"' folder='actors' :showbtn='!!computedValue[i].actor7.avatar || !!computedValue[i].actor7.id' v-model='computedValue[i].actor7.avatar' @onUpload='(file) => changeActorAvatar(file, computedValue[i].actor7.id)'/> 
                </div>
                <div class='mb-2 justify-center flex flex-wrap'>
                  <AutoSelect v-model="computedValue[i].actor8" searchF='getActors' placeholder="Выберите актера" />
                  <CropperCust :classProp='"inline-grid"' folder='actors' :showbtn='!!computedValue[i].actor8.avatar || !!computedValue[i].actor8.id' v-model='computedValue[i].actor8.avatar' @onUpload='(file) => changeActorAvatar(file, computedValue[i].actor8.id)'/> 
                </div>
              </div>
              <div class='col-md-2'> 
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
              label="Добавить фильм"
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
