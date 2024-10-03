<script setup>
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { dataService } from '~/utils/services/data.service'
import { containerMaxW } from '@/configs/config'
import { useToast } from "vue-toastification";
import { mdiCircleDouble } from '@mdi/js'

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

let allReady = computed(() => {
  if (quizUsers.value.length) {
    let suc = true
    if (quizUsers.value.map(one => {
      if (!one.isReady) {
        suc = false
      }
    }))
    return suc
  }
  return false
})

onMounted(async () => {
  let roomData = await dataService.getRoom({id: route.params.id})
  if (roomData.data) {
      room.value = roomData.data
  }

  socket.on('welcome', () => { console.log('welcome') })
  socket.emit('connectToRoom', route.params.id, userStore.user.token);
  socket.on('roomChange', (data) => { 
    if (data) {
      waitUsers.value = data.filter(one => !one.isActive)
      quizUsers.value = data.filter(one => one.isActive)
      me.value = data.find(one => one.user_id == userStore.user.id)
    }
  })
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


</script>

<template>
  <div>
    <NuxtLayout name="auth">
      <SectionMain class=''>
      <div> {{quizUsers}} </div>
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
            <div class='border-green-500 border-2 mb-2 min-h-12'>
              
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
        <div class='row '> 
          <div class='flex justify-center'><BaseButton color='info' :disabled='!allReady' label='Начать' /> </div>
        </div>




      </SectionMain>
    </NuxtLayout>
  </div>
</template>
