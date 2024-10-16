<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import { useDataStore } from '@/stores/data'
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
import SaveSlide from '~/components/Quiz/create/SaveSlide'
import AbcdEditor from '~/components/Quiz/create/AbcdEditor'
import ComparisonEditor from '~/components/Quiz/create/ComparisonEditor'
const toast = useToast();

const mainStore = useMainStore()
const dataStore = useDataStore()
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
    adminService.getSlides()
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
const videoFile = ref('')
const audioFile = ref('')
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
  answerImage: "",
  pack_id: "",
  slide: "",
}
let packRounds = ref([cloneDeep(emptyValue)])
let packData = ref({
  logo: '',
  text: '',
})

function addSlide(i) {
  packRounds.value[i].slide = 'Введите текст слайда'
  packRounds.value[i].slideTime = 10
}

function removeSlide(i) {
  packRounds.value[i].slide = ''
  packRounds.value[i].slideTime = 0
}

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
    if (one.type == 'audio') {
      if (!one.type.id || !one.answer.id || !one.audio) {
        errors.push(i+1)
      }
    }
    if (one.type == 'video') {
      if (!one.type.id || !one.answer.id || !one.video) {
        errors.push(i+1)
      }
    }
    if (one.libraryType.id == 'abcd') {
      if (!one.abcd || one.abcd.includes('%%%')) {
        errors.push(i+1)
      }
    } else if (one.libraryType.id == 'comparison') {
      if (!one.comparison || one.comparison.includes('%%%')) {
        errors.push(i+1)
      }
    } else {
      if (!one.answer_id ) {
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
function onUploadVideo(data, i) {
  packRounds.value[i].video = ''
  setTimeout(() => {
    packRounds.value[i].video = data.file
  }, 500) 
}
function onUploadAudio(data, i) {
  packRounds.value[i].audio = ''
  setTimeout(() => {
    packRounds.value[i].audio = data.file
  }, 500) 
}

</script>

<template>
 <ClientOnly fallback-tag="span">
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
                <div v-if='data.slide' class='col-md-12 mt-1'>
                  <SaveSlide v-model='data.slide' :slideTime='data.slideTime' :slides='dataStore.slides' :content='data.slide' @changeTime='(v) => data.slideTime = v'/>
                  <Editor v-model='data.slide' />
                </div>
                <div class='col-md-12'>
                  <div class='flex justify-between my-1'>
                    <label>Тип вопроса</label>
                    <BaseButton
                      v-if='!data.slide'
                      @click='addSlide(i)'
                      :icon="mdiPlusBoxMultiple"
                      label="Добавить слайд"
                      color="contrast"
                      rounded-full
                      small
                    />
                    <BaseButton
                      v-else
                      @click='removeSlide(i)'
                      :icon="mdiPlusBoxMultiple"
                      label="Удалить слайд"
                      color="contrast"
                      rounded-full
                      small
                    />
                  </div>
                  <FormControl v-model="data.type" :options="quizTypeOptions" />
                </div>
                <div class='col-md-12'>
                <!--  Text -->
                  <template v-if='data.type && data.type.id=="text"' >
                    <label class='mt-2' >Описание вопроса</label>
                    <FormControl type="textarea" v-model='data.text' placeholder="Введите текст вопроса" />
                  </template>
                <!--  Video -->
                  <template v-if='data.type && data.type.id=="video"' >
                    <FormControl class='mt-2' type="textarea" v-model='data.text' placeholder="Введите oписание" />
                    <VideoPlayer class='mt-2 max-w-72' :url='data.video' />
                    <FormFilePicker class='mt-2' v-model="videoFile" :url='data.video' accept='video/*' label="Загрузите видео" @onUpload='(file) => onUploadVideo(file, i)' />
                  </template>
                <!--  Audio -->
                  <template v-if='data.type && data.type.id=="audio"' >
                    <FormControl class='mt-2' type="textarea" v-model='data.text' placeholder="Введите oписание" />
                    <AudioPlayer class='mt-2 w-72 h-16' :url='data.audio' :isPlayMode='false'/>
                    <FormFilePicker class='mt-2' v-model="audioFile" :url='data.audio' accept='audio/*' type='audio' label="Загрузите аудио" @onUpload='(file) => onUploadAudio(file, i)' />
                  </template>

                <!--  Longintude -->
                  <label class='mt-2' >Длительность</label>
                  <FormControl type="number" v-model='data.time' placeholder="Длительность" />

                <!--  Answer -->
                  <label class='mt-4'>Ответ</label>
                  <div class='row'>
                    <div :class='data.libraryType.id == "comparison" ? "col-md-6": "col-md-12"'>
                      <FormControl v-model="data.libraryType" :options="libraryOptions"  />
                    </div>
                    <div v-if='data.libraryType.id == "comparison"' :class='"col-md-6"'>
                      <FormCheckRadio
                        v-model="data.isComparisonImage"
                        name="isComparisonImageh"
                        :label="'Картинка - Текст'"
                        :input-value="true"
                      />
                    </div>
                  </div>
                  
                  <template v-if='data.libraryType.id == "abcd"'>
                    <div class='row'>
                      <div class='col-md-6'>
                        <AbcdEditor v-model='packRounds[i].abcd' />
                      </div>
                      <div class='col-md-6'>
                        <CropperCust :placeholder='"horizon"' :classProp='"mt-4"' :ratio='0' folder='answer' v-model='packRounds[i].answerImage' /> 
                      </div>
                    </div>
                  </template>
                  <template v-if='data.libraryType.id == "comparison"'>
                    <ComparisonEditor v-model='packRounds[i].comparison' :isComparisonImage='data.isComparisonImage'/>
                  </template>
                  <template v-else>
                    <AutoSelect :key='packRounds[i].answer_id+"auto"+i' v-model="packRounds[i].answer_id" :searchF='"librarySearch"' :library='data.libraryType.id' placeholder="Ответ"  class='mt-2'/>
                    <ImagesUpload :key='packRounds[i].answer_id+"images"+i' class='mt-2' v-model='packRounds[i].image' :imagesToSelect='packRounds[i].answer_id.LibraryImages' :folder='data.libraryType.id' :libraryId='packRounds[i].answer_id.id'  />
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

     
</ClientOnly>

</template>
