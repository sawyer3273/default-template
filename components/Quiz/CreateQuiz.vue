<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import {
  mdiNoteEdit,
  mdiPlusBoxMultiple, mdiAccountPlusOutline, mdiDeleteCircleOutline
} from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import LineChart from '@/components/Charts/LineChart.vue'
import { userService } from '~/utils/services/user.service'
import { adminService } from '~/utils/services/admin.service'
import { dataService } from '~/utils/services/data.service'
import { cloneDeep } from 'lodash'
import { useToast } from "vue-toastification";
import { libraryOptions, quizTypeOptions } from '~/constants'
const toast = useToast();

const mainStore = useMainStore()
const router = useRouter()
const route = useRoute()

const props = defineProps({
  isUpdate: {
    type: Boolean,
    default: false
  },

})

onMounted(async () => {
  mainStore.setBreadCrumbs([{name: 'Квиз', to: '/admin/quiz'}, {name: 'Создать пак'}])
})

onBeforeMount(async () => {
  try {
    if (props.isUpdate) {

      let data = await dataService.getPacksQuiz({id: route.params.id})
      if (data.data) {
        packData.value = {
          logo: data.data[0].logo,
          text: data.data[0].name,
          enable: data.data[0].enable,
          id: data.data[0].id,
        }
        packRounds.value = []
        data.data[0].QuizPackRound.map(one => {
          one.type = quizTypeOptions.find(l => l.id ==  one.type)
          one.libraryType = libraryOptions.find(l => l.id ==  one.libraryType)
          if (one.answer) {
            one.answer_id = {id: one.answer_id, LibraryImages: one.answer.LibraryImages, name: one.answer.word ? one.answer.word : (one.answer.title ? one.answer.title : one.answer.name)}
          }
          console.log('one',one)
          packRounds.value.push(one)
        })
      }
    }
  } catch (err) {
    console.log('err',err)
    router.push('/admin/quiz');
  }

});

let emptyValue = {
  number: 1,    
  score: 1,     
  time: 30,      
  text: "",      
  image: "",     
  audio: "",     
  video: "",     
  type: quizTypeOptions[0],      
  libraryType: libraryOptions[0],  
  answer_id: "",
  pack_id: "",
}
let packRounds = ref([cloneDeep(emptyValue)])
let packData = ref({
  logo: '',
  text: '',
})

function addNew() {
  packRounds.value.push(cloneDeep(emptyValue))
  updateNumber()
}

function updateNumber() {
  packRounds.value.map((one, i) => {
    one.number = (i + 1)
  })
}

const toDeleteId = ref(0)
const isModalDangerActive = ref(false)
async function deleteAction() {
  isModalDangerActive.value = false
  let toDeleteObj = packRounds.value[toDeleteId.value]
  if (toDeleteId.value > -1) { 
    packRounds.value.splice(toDeleteId.value, 1); 
  }
  if (toDeleteObj && toDeleteObj.id && props.isUpdate) {
   await adminService.deleteQuizItemPack({id: toDeleteObj.id}) 
  }
}

async function save() {
  let errors = []
  packRounds.value.map((one, i) => {
    if (one.type == 'text') {
      if (!one.type.id || !one.answer.id || !one.text) {
        errors.push(i+1)
      }
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
    let item = JSON.parse(JSON.stringify(packRounds.value))
    let data = await adminService.addQuizPack({pack: item, data: packData.value})
    if (data.success) {
      router.push('/admin/quiz');
    }
  }
}
</script>

<template>
 
      <CardBoxModal v-model="isModalDangerActive" :title="$t('deleteSure')" button="danger" has-cancel>
        <BaseButton label="Ok" color="contrast" @click="deleteAction" />
      </CardBoxModal>
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
        <SectionTitleLine :icon="mdiNoteEdit" title="Список вопросов"> </SectionTitleLine>
        
         <div class='row'>
          <div class='col-md-12' v-for='(data, i) in packRounds' :key='"auto"+i'>
            <CardBox class='mb-4 shadow-sm relative'>
              <div class='top-0 left-0 ml-6 mt-1 absolute font-bold'>#{{data.number}}</div>
              <BaseIcon class='cursor-pointer text-red-500 absolute top-1 right-5' :path="mdiDeleteCircleOutline"  @click="() => {toDeleteId = i; isModalDangerActive = true}" />
              <div class='row'>
                <div class='col-md-12'>
                  <label>Тип вопроса</label>
                  <FormControl v-model="data.type" :options="quizTypeOptions" />
                </div>
                <div class='col-md-12'>
                  <template v-if='data.type && data.type.id=="text"' >
                    <label class='mt-2' >Описание вопроса</label>
                    <FormControl type="textarea" v-model='data.text' placeholder="Введите текст вопроса" />
                  </template>

                  <FormControl type="number" v-model='data.time' placeholder="Длительность" />

                  <template v-if='data.type && ["text"].includes(data.type.id)'>
                    <label class='mt-4'>Ответ</label>
                    <FormControl v-model="data.libraryType" :options="libraryOptions"  />
                    <AutoSelect :key='packRounds[i].answer_id+"auto"+i' v-model="packRounds[i].answer_id" :searchF='"librarySearch"' :library='data.libraryType.id' placeholder="Ответ"  class='mt-2'/>
                
                    <ImagesUpload :key='packRounds[i].answer_id.id+i' class='mt-2' v-model='packRounds[i].image' :imagesToSelect='packRounds[i].answer_id.LibraryImages' :folder='data.libraryType.id' :libraryId='packRounds[i].answer_id.id'  />
                  </template>
                </div>
              </div>
            </CardBox>
          </div>
        </div>


      
         <SectionTitleLineWithButton  title="">
          <div>
            <BaseButton
              @click='addNew'
              :icon="mdiAccountPlusOutline"
              label="Добавить вопрос"
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
</template>
