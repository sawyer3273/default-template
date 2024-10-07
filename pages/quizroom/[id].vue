<script setup>
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { dataService } from '~/utils/services/data.service'
import { containerMaxW } from '@/configs/config'
import { useToast } from "vue-toastification";
import { mdiCircleDouble } from '@mdi/js'
import QuizGame from '@/components/Quiz/Game'
import  { debounce} from 'lodash'

definePageMeta({
  middleware: 'auth' 
})
const userStore = useUserStore()
const { socket } = useSocketIO()
const route = useRoute()

let room = ref({})
let waitUsers = ref([])
let quizUsers = ref([])
let me = ref({})
let pack = ref({})
let loader = ref(true)
let forbidden = ref(false)


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
  handleDebounce = debounce(async function (val) {
    if (val !== null) socket.emit('changeRoomName',room.value, val);
  }, 500);
  let roomData = await dataService.getRoom({id: route.params.id})
  if (roomData.data) {
      room.value = roomData.data
  }
  let isInRoom = roomData.data.RoomUser ? roomData.data.RoomUser.find(one => one.user_id == userStore.user.id): false
  console.log('isInRoom,isInRoom',isInRoom)
  console.log('isInRoom,oom.value',room.value)
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
    socket.emit('connectToRoom', route.params.id, userStore.user.token);
    socket.on('roomChange', (data) => { 
      if (data) {
        waitUsers.value = data.filter(one => !one.isActive)
        quizUsers.value = data.filter(one => one.isActive)
        me.value = data.find(one => one.user_id == userStore.user.id)
      }
    })
    socket.on('updatePack', (data) => { 
      if (data) { pack.value = data }
    })
    socket.on('statusQuizSuccess', () => { 
      let isQuiz = quizUsers.value.find(one => one.id == me.value.id)
      console.log('isQuiz',isQuiz)
      if (!isQuiz) {
        forbidden.value = true
      }
      room.value.isActive = true
    })
    socket.on('changeRoomNameSuccess', (roomData) => { 
      console.log('roomData',roomData)
      room.value.name = roomData.name
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
  socket.emit('statusQuiz', room.value);
}

</script>

<template>
  <div>
    <NuxtLayout name="auth">
      <SectionMain :isFull='true' class='' v-if='!loader'>
        <template v-if='forbidden'>
           <CardBox>
              <div class='text-center f-full'>
                Игра началась, а вас не позвали
              </div>
           </CardBox>
        </template>
        <template v-else-if='!room.isActive'>
          <div class='row'> 
            <div class='col-md-3'>
              <div>Пользователи</div>
              <div class='border-green-500 border-2 mb-2 min-h-12'>
                <CardBox :smallPadding='true' class='!bg-blue-300 m-1 '  v-for='user in waitUsers'>
                  <div class='flex items-center justify-between'>
                    <div>{{user.user.username}}</div><BaseButton @click='changeUserStatus(user.user.id, true)' v-if='me.isAdmin' :small='true' label='Добавить' />   
                  </div>
                </CardBox>
              </div>
            </div>
            <div class='col-md-9'>
              <div>Выбрать пак</div>
              <div class='border-green-500 border-2 mb-2 min-h-12' title="Создатель комнаты может выбрать пак">
                <div :class='me.isAdmin ? "" : "notclickable"'>
                  <PackSelect @onChoosePack='choosePack' :pack='pack'/>
                </div>
              </div>
              <div>Описание</div>
              <div class='border-green-500 border-2 mb-2 min-h-12 ' title="Создатель комнаты может выбрать пак">
                <div v-if='me.isAdmin'>
                  <FormControl v-model='room.name' placeholder='Введите описание'/>
                </div>
                <div v-else class='p-2'>
                 {{room.name}} 
                </div>
              </div>
              <div>Игроки</div>
              <div class='border-green-500 border-2 mb-2 min-h-12'>
                <CardBox :smallPadding='true' class='!bg-blue-300 m-1'  v-for='user in quizUsers'>
                  <div class='flex items-center justify-between'>
                    <div>{{user.user.username}}</div>
                    <div class='flex items-center'>
                      <BaseButton @click='changeUserStatus(user.user.id, false)' v-if='me.isAdmin' :small='true' label='Удалить' />   
                      <div class='ml-2 flex items-center'>
                        
                        <div v-if='user.user.id == userStore.user.id' @click='setReady(!user.isReady)' class=' text-blue-600 underline cursor-pointer'> {{user.isReady ? "Готов" : "Не готов" }} </div>
                        <div v-else> {{user.isReady ? "Готов" : "Не готов" }}</div>
                        <BaseIcon :class='user.isReady ? "text-green-500" : "text-red-500"' :path='mdiCircleDouble' />
                      </div>
                    </div>
                  </div>
                </CardBox>
              </div>
            </div>
          </div>
          <div class='row'> 
            <div v-if='me.isAdmin' class='flex justify-center'><BaseButton color='info' :disabled='!allReady' label='Начать' @click='start'/> </div>
          </div>
        </template> 


        <template v-else>
          
          <QuizGame :quizUsers='quizUsers' :me='me' />




        </template> 

     


{{room}}
      {{pack}}
{{quizUsers}}
      </SectionMain>
    </NuxtLayout>
  </div>
</template>
