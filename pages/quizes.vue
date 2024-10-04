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

        <NuxtLink to='/quizroom'><BaseButton :label="'Создать игру'" :icon='mdiPlay' iconSize='24' :small='true' class='mt-6' color="info"  /> </NuxtLink>
        <NuxtLink :to='"/quizroom/"+room.token' v-for='room in dataStore.rooms' >
          <CardBox :smallPadding='true' class='!bg-blue-300 mb-2 '  >
            {{room}}
          </CardBox>
        </NuxtLink>
        <div v-if='!dataStore.rooms.length'>
          <NoContent :text='"В данный момент запущенных игр нет, создайте свою"' />
        </div>
      </SectionMain>
    </NuxtLayout>
  </div>
</template>
