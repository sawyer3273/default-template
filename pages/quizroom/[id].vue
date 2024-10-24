<script setup>
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { dataService } from '~/utils/services/data.service'
import { sortTable } from '~/utils/common'
import { containerMaxW } from '@/configs/config'
import { useToast } from "vue-toastification";
import { mdiCircleDouble } from '@mdi/js'
import QuizGame from '@/components/Quiz/Game'
import _ from 'lodash'

definePageMeta({
  middleware: 'auth' 
})
const userStore = useUserStore()
const { socket } = useSocketIO()
const route = useRoute()

let room = ref({})
let grobStats = ref({})
let waitUsers = ref([])
let quizUsers = ref([])
let betSize = ref(1)
let me = ref({})
let pack = ref({})
let loader = ref(true)
let forbidden = ref(false)

let currentQuestion = ref({})
let timer = ref(30)
let answer = ref('')
let correctAnswer = ref({})
let showChange = ref(false)

function choosePack(item) {
  socket.emit('choosePack', item.id, room.value.id, room.value.token);
  pack.value = item
}

let allReady = computed(() => {
  if (quizUsers.value.length) {
    let suc = true
    if (quizUsers.value.map(one => {
      if (!one.isReady) {
        suc = false
      }
    }))
    if (!pack.value.id) {
      return false
    }
    return suc
  }
  return false
})

let handleDebounce
watch(() => room.value.name, (val) => {
  handleDebounce(val)
})
onMounted(async () => {
  handleDebounce = _.debounce(async function (val) {
    if (val !== null) socket.emit('changeRoomName',room.value, val);
  }, 500);
  let leftSlide = 0
  let roomData = await dataService.getRoom({id: route.params.id, pack_id: route.query.id})
  let currentTime = 0
  if (roomData.data) {
      room.value = roomData.data
      currentTime = roomData.currentTime
      if (roomData.answer) {
        answer.value = roomData.answer.answer ? roomData.answer.answer.word : roomData.answer.answerText
      }
      if (roomData.correctAnswer) {
        correctAnswer.value = roomData.correctAnswer
      }
      leftSlide = roomData.leftSlide
  }
  let isInRoom = roomData.data.RoomUser ? roomData.data.RoomUser.find(one => one.user_id == userStore.user.id): false
  if (isInRoom || !room.value.isActive) {
    
    if (room.value.pack_id) {
      let packData = await dataService.getPacksQuiz({id: room.value.pack_id})
      if (packData.success) {
        pack.value = packData.data[0]
      }
    } else if (route.query.id) {
      let packData = await dataService.getPacksQuiz({id: route.query.id})
      if (packData.success) {
        pack.value = packData.data[0]
      }
    }
    if (pack.value.QuizPackRound) {
      currentQuestion.value = pack.value.QuizPackRound[room.value.question - 1]
      if (leftSlide <= 0) {
        currentQuestion.value.slide = ''
      }
    }
    if (room.value.isActive) {
      timer.value = currentQuestion.value.time
      if (room.value.timeStarted) {
        timer.value = currentQuestion.value.time - (currentTime - room.value.timeStarted)
      }
    }
    socket.emit('connectToRoom', route.params.id, userStore.user.token);
    socket.on('roomChange', (data) => { 
      if (data) {
        waitUsers.value = data.filter(one => !one.isActive)
        quizUsers.value = data.filter(one => one.isActive)
        me.value = data.find(one => one.user_id == userStore.user.id)
        if (room.value.isFinished ) {
          quizUsers.value.sort(sortTable)
        }
      }
    })
    socket.on('updatePack', (data, roomUsers) => { 
      if (data) { pack.value = data, room.value.pack_id = data.id }
      if (roomUsers) {
        waitUsers.value = roomUsers.filter(one => !one.isActive)
        quizUsers.value = roomUsers.filter(one => one.isActive)
        me.value = roomUsers.find(one => one.user_id == userStore.user.id)
      }
    })
    socket.on('statusQuizSuccess', () => { 
      let isQuiz = quizUsers.value.find(one => one.id == me.value.id)
      if (!isQuiz) {
        forbidden.value = true
      }
      currentQuestion.value = pack.value.QuizPackRound[0]
      timer.value = currentQuestion.value.time
      room.value.isActive = true
      room.value.isFinished = false
    })
    socket.on('changeRoomNameSuccess', (roomData) => { 
      room.value.name = roomData.name
    })
    

    socket.on('setQuestion', (questionNumber, question) => { 
      let betSizeSaved = localStorage.getItem('betSize')
      if (betSizeSaved) {
        betSize.value = betSizeSaved
      }
      room.value.question = questionNumber
      currentQuestion.value = question
      timer.value = question.time
      answer.value = ''
      correctAnswer.value = {}
    })

    socket.on('finishSlide', (questionNumber, question) => { 
      currentQuestion.value.slide = ''
    })

    socket.on('finishQuestion', (roomUsers, stats) => { 
      console.log('roomUsers, stats',roomUsers, stats)
      localStorage.removeItem('betSize')
      quizUsers.value = roomUsers
      showChange.value = true
      grobStats.value = stats
      setTimeout(() => {
        showChange.value = false
      }, 5000)
    })

    socket.on('showAnswer', (question) => { 
     correctAnswer.value = question
    })
    

    socket.on('finishAll', (data) => { 
      room.value.isFinished = true
      quizUsers.value.sort(sortTable)
    })

    socket.on('userAnswered', (user, type) => { 
      quizUsers.value.map((one, i) => {
        if (one.user_id == user.user_id) {
          quizUsers.value[i].answerType = type
        }
      })
    })
    

  } else {
    forbidden.value = true
  }
  
  loader.value = false
})



onUnmounted(async () => {
  socket.emit('disconnectFromRoom', route.params.id);
})

function changeUserStatus(user_id, status) {
  socket.emit('changeUserStatusInRoom', room.value, user_id, status, 'isActive');
}
function setReady(status) {
  socket.emit('changeUserStatusInRoom', room.value, userStore.user.id, status, 'isReady');
}

function start() {
  console.log('start!@@@@@@@@@@@@2')
  socket.emit('statusQuiz', room.value);
}

function onAnswer(data, score, type) {
  socket.emit('answerQuiz', data, room.value, userStore.user.id, currentQuestion.value, score, type, betSize.value);
}

function setBetSize(bet) {
  betSize.value = bet
  localStorage.setItem('betSizeSaved', bet)
}
</script>

<template>
  <div>
    <NuxtLayout name="auth">
      <SectionMain :isFull='room.isActive' class='' v-if='!loader'>
        <template v-if='forbidden'>
           <CardBox>
              <div class='text-center f-full'>
                Игра началась, а вас не позвали
              </div>
           </CardBox>
        </template>
        <template v-else-if='!room.isActive'>
          <div class='row'> 
            <div class='col-md-6'>
              <div class='text-lg font-bold mb-2'>Состав на игру</div>
              <div class=' mb-2 min-h-12'>
                <List :data='quizUsers' @onClick='(id) => changeUserStatus(id, false)' @onClickSecond='(status) => setReady(status)' :me='me' :buttonText='me.isAdmin ? "Удалить": ""' :buttonTextSecond='"Готов"'/>
              </div>
              <div class='text-lg font-bold mb-2' v-if='waitUsers.length'>В ожидании</div>
               <List v-if='waitUsers.length' :data='waitUsers' @onClick='(id) => changeUserStatus(id, true)' :me='me' :buttonText='me.isAdmin ? "Добавить" : ""'/>
            </div>
            <div class='col-md-6'>
              <div class='text-lg font-bold mb-2'>Описание</div>
              <div class='mb-2 min-h-12 ' title="Создатель комнаты может выбрать пак">
                <div v-if='me.isAdmin'>
                  <FormControl v-model='room.name' placeholder='Введите описание'/>
                </div>
                <div v-else class='p-2'>
                 {{room.name}} 
                </div>
              </div>
              <div class='mb-2 min-h-12 flex justify-center' title="Создатель комнаты может выбрать пак">
                <div :class='me.isAdmin ? "" : "notclickable"'>
                  <PackSelect @onChoosePack='choosePack' :pack='pack'/>
                </div>
              </div>
              
            </div>
          </div>
          <div class='row mt-2'> 
            <div v-if='me.isAdmin' class='flex justify-center'><BaseButton color='info' :disabled='!allReady' label='Начать' @click='start'/> </div>
          </div>
        </template> 

        <template v-else>
          <QuizGame :grobStats='grobStats' :showChange='showChange' :quizUsers='quizUsers' :me='me' :betSize='betSize' @setBetSize='setBetSize' :question='currentQuestion' :room='room' @onAnswer='onAnswer' :timer='timer' :answerInit='answer' :correctAnswer='correctAnswer'/>
        </template> 
        <BaseButton color='info' class='mt-4' label='рестарт' @click='start'/>
      </SectionMain>
    </NuxtLayout>
  </div>
</template>
