<script setup>
import { computed, ref, onMounted } from 'vue'
import { dataService } from '~/utils/services/data.service'
import { useToast } from "vue-toastification";

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
  await dataService.getRooms()
}
</script>

<template>
  <div>
    <NuxtLayout name="auth">
      <SectionMain class=''>
        <NuxtLink :to='"/quizroom/"+room.token' v-for='room in dataStore.rooms' >
          <CardBox :smallPadding='true' class='!bg-blue-300 mb-2 '  >
            {{room}}


          </CardBox>
        </NuxtLink>
      </SectionMain>
    </NuxtLayout>
  </div>
</template>
