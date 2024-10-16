<script setup>
import { computed, useSlots } from 'vue'
import Timer from '@/components/Quiz/Timer'
import { mdiCheck, mdiCheckAll, mdiChatOutline, mdiChatAlertOutline} from '@mdi/js'

const props = defineProps({
  room: Object,
  quizUsers: Object,
  me: Object,
  question: Object,
  timer: Number,
  answerInit: String,
  correctAnswer: Object,
})

const emit = defineEmits(['onAnswer'])

const answer = ref('')
const submited = ref('')
const newScore = ref(1)

onMounted(() => {
  let newScoreStorage = localStorage.getItem('newScore')
  if (newScoreStorage) {
    newScore.value = newScoreStorage
  }
  checkHide()
}) 
watch(() => props.question.number, () => {
  submited.value = ''
  localStorage.removeItem('audioPosition')
  checkHide()
})

watch(() => props.room.isFinished, () => {
  localStorage.removeItem('audioPosition')
})

function checkHide() {
  if (['video', 'audio'].includes(props.question.type)) {
    hideTimer.value = true
  }
}

function trySubmit() {
  submited.value = answer.value
  emit('onAnswer', answer.value, newScore.value)
  answer.value = ''
} 

const hideTimer = ref(false)
function onVideoEnd() {
  hideTimer.value = false
}
function onAudioEnd() {
  hideTimer.value = false
}

const legalUsers = computed(() => {
  return props.quizUsers.filter(one => !one.isAlreadyPassed)
})


const vzUsers = computed(() => {
  return props.quizUsers.filter(one => one.isAlreadyPassed)
})

function changeAudioScore(value) {
  let left = 5 - value 
  if (left > 0) {
    let perc = 100 / 5 * left
    newScore.value = parseInt((props.question.score + (props.question.score * 2 * perc / 100)) * 10) / 10
    if (newScore.value > props.question.score * 3) {
      newScore.value = props.question.score * 3
    }
    localStorage.setItem('newScore', newScore.value)
  }
}

</script>

<template>
  <template v-if='room.isFinished'>
    <div class='h-full-minus-20 text-center flex justify-center items-center'>
        <div class='max-w-80 rounded-lg overflow-hidden' style='background-color: #FFE306'>
          <div class='max-w-80 relative'>
            <div v-if='legalUsers[0]' class='absolute first-image winner flex-wrap'>
              <UserAvatar class="min-w-14 w-14 h-14 " :username="legalUsers[0].user.username" />
              <div class='w-full font-bold'>{{legalUsers[0].user.username}}</div>
              <div class='w-full text-white font-bold'>{{legalUsers[0].score}}</div>
            </div>
            <div v-if='legalUsers[1]' class='absolute second-image winner flex-wrap'>
              <UserAvatar class="min-w-14 w-14 h-14 " :username="legalUsers[1].user.username" />
              <div class='w-full font-bold'>{{legalUsers[1].user.username}}</div>
              <div class='w-full text-white font-bold'>{{legalUsers[1].score}}</div>
            </div>
            <div v-if='legalUsers[2]' class='absolute third-image winner flex-wrap'>
              <UserAvatar class="min-w-14 w-14 h-14 " :username="legalUsers[2].user.username" />
              <div class='w-full font-bold'>{{legalUsers[2].user.username}}</div>
              <div class='w-full text-white font-bold'>{{legalUsers[2].score}}</div>
            </div>
            <img src='/img/board.png' />
          </div>
          <template v-for='(user, i) in legalUsers'>
            <div class=' bg-black overflow-hidden rounded-full mb-2 mx-1 text-white p-1 text-xl flex justify-between'  v-if='i > 2'>
              <div class='flex items-center w-4/5'>
                <div class='rounded-full bg-blue-500 min-w-7 text-center mr-2'> {{i+1}}</div>
                <UserAvatar class="min-w-7 w-7 h-7 mr-2" :username="user.user.username" />
                <div class='w-inherit'>
                  <div class='userName' :class='!user.isReady ? "text-gray-400": (me.id == user.id ? "text-green-600" : "")'>
                    {{user.user.username}} <BaseIcon v-if='user.answerType' class='text-green-600' :path='user.answerType == 2 ? mdiChatAlertOutline : mdiChatOutline' /> 
                  </div>
                </div>
              </div>
              <div class='rounded-full bg-blue-500 w-12 text-center right-0'>{{user.score}}</div>
            </div>
          </template>

          <div class=' bg-black overflow-hidden rounded-full m-1 text-white p-1 text-xl flex justify-between' v-for='(user, i) in vzUsers'>
            <div class='flex items-center w-4/5'>
              <div class='rounded-full bg-blue-500 min-w-7 min-h-7 text-center text-sm pt-1 mr-2'>в/з</div>
              <UserAvatar class="min-w-7 w-7 h-7 mr-2" :username="user.user.username" />
              <div class='w-inherit'>
                <div class='userName' :class='!user.isReady ? "text-gray-400": (me.id == user.id ? "text-green-600" : "")'>
                  {{user.user.username}} <BaseIcon v-if='user.answerType' class='text-green-600' :path='user.answerType == 2 ? mdiChatAlertOutline : mdiChatOutline' /> 
                </div>
              </div>
            </div>
            <div class='rounded-full bg-blue-500 w-12 text-center right-0'>{{user.score}}</div>
          </div>
        </div>
    </div>
  </template>

  <div v-else class='row'> 
    <div class='col-md-3'>
      <div class='mb-2 min-h-12'>
      
        <div class='bg-black overflow-hidden rounded-full m-1 text-white p-1 text-xl flex justify-between' v-for='(user, i) in legalUsers'>
          <div class='flex items-center w-4/5'>
            <div class='rounded-full bg-blue-500 min-w-7 text-center mr-2'> {{i+1}}</div>
            <UserAvatar class="min-w-7 w-7 h-7 mr-2" :username="user.user.username" />
            <div class='w-inherit'>
              <div class='userName' :class='!user.isReady ? "text-gray-400": (me.id == user.id ? "text-green-600" : "")'>
                {{user.user.username}} <BaseIcon v-if='user.answerType' class='text-green-600' :path='user.answerType == 2 ? mdiChatAlertOutline : mdiChatOutline' /> 
              </div>
            </div>
          </div>
          <div class='rounded-full bg-blue-500 w-12 text-center right-0'>{{user.score}}</div>
        </div>

        <div class='bg-black overflow-hidden rounded-full m-1 text-white p-1 text-xl flex justify-between' v-for='(user, i) in vzUsers'>
          <div class='flex items-center w-4/5'>
            <div class='rounded-full bg-blue-500 min-w-7 min-h-7 text-center text-sm pt-1 mr-2'>в/з</div>
            <UserAvatar class="min-w-7 w-7 h-7 mr-2" :username="user.user.username" />
            <div class='w-inherit'>
              <div class='userName' :class='!user.isReady ? "text-gray-400": (me.id == user.id ? "text-green-600" : "")'>
                {{user.user.username}} <BaseIcon v-if='user.answerType' class='text-green-600' :path='user.answerType == 2 ? mdiChatAlertOutline : mdiChatOutline' /> 
              </div>
            </div>
          </div>
          <div class='rounded-full bg-blue-500 w-12 text-center right-0'>{{user.score}}</div>
        </div>


      </div>
    </div>
    <div class='col-md-9'>
      <div class='relative border-2 border-gray-400 rounded-lg min-h-60 game-height bg-gray-200'>
        <div class='h-full-minus-60 p-2 text-lg '>
            <div class='w-full flex justify-center relative'>
              <div class='absolute left-0 bg-blue-500 px-2 h-8 items-center text-center flex justify-center text-white rounded-lg'>
              Вопрос #{{question.number}}
              </div>
              <Timer v-if='timer && !!!question.slide' :hide='hideTimer' :value='timer' :round='question.number' :isStarted='question.number ? true : false' @onEnd='onTimerStop' @onTimeUrpdate='(time) => timerUpdate(time)' />
            </div>
            <template v-if='!Object.keys(correctAnswer).length'>
           
              <template v-if='question.slide'>
              <div class='ql-snow h-full-minus-20 text-center flex justify-center items-center'>
                <div class='ql-editor'>
                  <div v-html='question.slide' > </div>
                </div>
              </div>
             
              </template>
              <template v-else>
                <template v-if='question.type=="text"'>
                  <div class='h-full-minus-20 p-10 text-center flex justify-center items-center'>
                    {{question.text}}
                  </div>
                </template>
                <template v-if='question.type=="video"'>
                  <div class='h-full-minus-20 p-10 text-center flex justify-center items-center'>
                    <div class='h-full'>
                      <div class='text-center flex justify-center items-center'>
                        {{question.text}}
                      </div>
                      <VideoPlayer class='flex justify-center h-full rounded-xl overflow-hidden' :url='question.video' :isAutoStart='true' @onEnd='onVideoEnd' />
                    </div>
                  </div>
                </template>
                <template v-if='question.type=="audio"'>
                  <div class='h-full-minus-20 p-10 text-center flex justify-center items-center'>
                    <div class=' w-full'>
                      <div class='text-center flex justify-center items-center mb-10'>
                        {{question.text}}
                      </div>
                      <AudioPlayer class='w-full h-32 max-h-32' :playText='newScore' :isControl='false' :url='question.audio' :isAutoStart='true' @onEnd='onAudioEnd' @onTimeUpdate='changeAudioScore'/>
                    </div>
                  </div>
                </template>
              </template>
            </template>
            <template v-else>
              <div class='h-full-minus-20 p-10 text-center flex justify-center items-center'>
                <div class='h-full'>
                  <div class='flex justify-center h-full'><img v-if='correctAnswer.image'  :src='correctAnswer.image' /></div>
                  <div class='text-2xl' :class='answerInit == correctAnswer.answer.word ? "text-green-500": "text-red-500"' >{{correctAnswer.answer.word}}</div>
                </div>
              </div>
            </template>
        </div>
        <div class='absolute bottom-0 w-full p-2'>
          <div v-if='submited.word || answerInit'>Ваш ответ: {{submited.word || answerInit}}</div>
          <div class='flex items-center flex-wrap md:!flex-nowrap'>
            <div class='w-full '><AutoSelect  v-model="answer" :searchF='"librarySearch"' :library='question.libraryType' placeholder="Ответ"  /></div> 
            <div class='md:ml-2 w-full md:w-fit'><BaseButton :label="'Подтвердить'"  color="info" @click='trySubmit' class='w-full h-12 md:w-fit ' :class='!answer.id ? "disabled": ""' /></div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<style scoped>
.winner {
  display: flex;
  justify-content: center;
      overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100px;
}
.first-image {
  top: 11px;
  left: 105px;
}
.second-image {
  top: 40px;
  left: 11px;
}
.third-image {
  top: 55px;
  left: 201px;
}
@media (min-width: 500px) {
  .first-image {
    top: 13px;
    left: 110px;
  }
  .second-image {
    top: 42px;
    left: 11px;
  }
  .third-image {
    top: 58px;
    left: 208px;
  }
}


.userName {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 90%;
}
.game-height {
  height: calc(100vh - 100px)
}
.h-full-minus-60 {
  height: calc(100% - 60px)
}
.h-full-minus-20 {
  height: calc(100% - 20px)
}
</style>