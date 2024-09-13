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


const mainStore = useMainStore()
const router = useRouter()

definePageMeta({
  middleware: 'auth' 
})


onMounted(async () => {
  
})
let emptyValue = {
  actor: {id: 0, name: '', avatar: '',},
  text: ''
}
let computedValue = ref([cloneDeep(emptyValue)])

async function getActors(payload) {
  
}

async function deleteActor(payload) {
  await adminService.deleteActor(payload)
}
async function changeActorAvatar(file, id) {
  console.log('ffffffffffff',)
  await adminService.updateActor({avatar: file, id})
}


async function upload() {
  let image = await adminService.uploadImage()
}
let videoPlayer = ref(null)
function play() {
  console.log('videoPlayer,videoPlayer',videoPlayer)
      videoPlayer.value.play();
    }
    function pause() {
      videoPlayer.value.pause();
    }
    function stop() {
      videoPlayer.value.pause();
      videoPlayer.value.currentTime = 0;
     }
  function  setSpeed(speed) {
      videoPlayer.value.playbackRate = speed;
    }
</script>

<template>
  <div>
    <NuxtLayout name="authenticated">
      <SectionMain>
      <!--
      <video width="320" height="240" ref="videoPlayer">
        <source
          src="https://s3.timeweb.cloud/1d66ad34-320f94d0-cbe7-493f-bce7-bfb114c821bb/sample-5s.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div>
        <button @click="play">play</button>
        <button @click="pause">pause</button>
        <button @click="stop">stop</button>
        <button @click="setSpeed(0.5)">0.5x</button>
        <button @click="setSpeed(1)">1x</button>
        <button @click="setSpeed(1.5)">1.5x</button>
        <button @click="setSpeed(2)">2x</button>
      </div>-->
      <div @click='upload'> fff </div>
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
            <div class='col-md-4'> <CropperCust :showbtn='computedValue[i].actor.id' v-model='computedValue[i].actor.avatar' @onUpload='(file) => changeActorAvatar(file, computedValue[i].actor.id)'/> </div>
            <div class='col-md-4'> 
             <b-dropdown id="dropdown-1" text="Dropdown Button" class="m-md-2">
    <b-dropdown-item>First Action</b-dropdown-item>
    <b-dropdown-item>Second Action</b-dropdown-item>
    <b-dropdown-item>Third Action</b-dropdown-item>
    <b-dropdown-divider></b-dropdown-divider>
    <b-dropdown-item active>Active action</b-dropdown-item>
    <b-dropdown-item disabled>Disabled action</b-dropdown-item>
  </b-dropdown>
            </div>
          </div>
      </SectionMain>
    </NuxtLayout>
  </div>
</template>
