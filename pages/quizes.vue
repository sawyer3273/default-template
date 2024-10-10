<script setup>
import { computed, ref, onMounted } from 'vue'
import { dataService } from '~/utils/services/data.service'
import { useToast } from "vue-toastification";
import { mdiPlay } from '@mdi/js'

definePageMeta({
  middleware: 'auth' 
})
const router = useRouter()
const dataStore = useDataStore()
const { socket } = useSocketIO()

onMounted(async () => {
    socket.emit('joinRoom', 'quizeslist');
    getRooms()
    socket.on('updateQuizlist', (data) => { 
      getRooms()
    })
})
onUnmounted(async () => {
  socket.emit('leaveRoom', 'quizeslist');
})

async function getRooms() {
  await dataService.getRooms({available: true})
}
</script>

<template>
  <div>
    <NuxtLayout name="auth">
      <SectionMain class=''>
        <template v-if='dataStore.roomsActive.length'> 
          <NuxtLink :to='"/quizroom/"+room.token' v-for='room in dataStore.roomsActive' >
            <CardBox :smallPadding='true' class='!bg-blue-300 mb-2 shadow-lg'  >
              <div class='flex justify-between items-center'>
                <div class='flex items-center'>
                  <img width='60' class='rounded-lg' :src='room.pack && room.pack.logo ? room.pack.logo  : "/img/choose.jpg"' />
                  <div class='mx-3'> {{room.name ? room.name : "Игра #" + room.id}} ({{JSON.parse(room.info).username}})</div>
                </div>
                <div class='mx-3'> Игроки: {{ room.RoomUser.length}} </div>
              </div>
            </CardBox>
          </NuxtLink>
        </template>
        <template v-else> 
          <NuxtLink to='/quizroom'><BaseButton :label="'Создать игру'" :icon='mdiPlay' iconSize='24' :small='true' class='mb-4' color="info"  /> </NuxtLink>
          <NuxtLink :to='"/quizroom/"+room.token' v-for='room in dataStore.rooms' >
            <CardBox :smallPadding='true' class='!bg-blue-300 mb-2 shadow-lg'  >
              <div class='flex justify-between items-center'>
                <div class='flex items-center'>
                  <img width='60' class='rounded-lg' :src='room.pack && room.pack.logo ? room.pack.logo  : "/img/choose.jpg"' />
                  <div class='mx-3'> {{room.name ? room.name : "Игра #" + room.id}} </div>
                </div>
                <div class='mx-3'> Игроки: {{ room.RoomUser.length}} </div>
              </div>
            </CardBox>
          </NuxtLink>
          <div v-if='!dataStore.rooms.length'>
            <NoContent :text='"В данный момент игр нет, создайте свою"' />
          </div>
        </template>

        
      </SectionMain>
    </NuxtLayout>
  </div>
</template>
