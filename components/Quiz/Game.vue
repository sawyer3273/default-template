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
  correctAnswer: Object
})

const emit = defineEmits(['onAnswer'])

let answer = ref('')
let submited = ref('')

watch(() => props.question.number, () => {
  submited.value = ''
})

function trySubmit() {
  submited.value = answer.value
  emit('onAnswer', answer.value)
  answer.value = ''
} 

const legalUsers = computed(() => {
  return props.quizUsers.filter(one => !one.isAlreadyPassed)
})


const vzUsers = computed(() => {
  return props.quizUsers.filter(one => one.isAlreadyPassed)
})
</script>

<template>
  <div class='row'> 
    <div class='col-md-3'>
      <div class='mb-2 min-h-12'>
      
        <div class='bg-black overflow-hidden rounded-full m-1 text-white p-1 text-xl flex justify-between' v-for='(user, i) in legalUsers'>
          <div class='flex items-center w-4/5'>
            <div class='rounded-full bg-blue-500 min-w-7 text-center mr-2'>{{i+1}}</div>
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
        <div class='p-2'>
          <template v-if='room.isFinished'>
            <div class='p-10 text-center'>
              Игра окончена
            </div>
          </template>
          <template v-else>
            <div class='w-full flex justify-center relative'>
              <div class='absolute left-0 bg-blue-500 w-8 h-8 items-center text-center flex justify-center text-white rounded-lg'>
              #{{question.number}}
              </div>
              <Timer v-if='timer' :value='timer' :round='question.number' :isStarted='question.number ? true : false' @onEnd='onTimerStop' />
            </div>
            <template v-if='!Object.keys(correctAnswer).length'>
              <div class='p-10 text-center'>
                {{question.text}}
              </div>
            </template>
            <template v-else>
              <div class='p-10 text-center'>
                {{correctAnswer.answer.word}}
              </div>
            </template>
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
.userName {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 90%;
}
.game-height {
  height: calc(100vh - 100px)
}
</style>