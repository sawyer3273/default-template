<script setup>
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { dataService } from '~/utils/services/data.service'
import { containerMaxW } from '@/configs/config'
import { useToast } from "vue-toastification";

definePageMeta({
  middleware: 'auth' 
})
const userStore = useUserStore()
const { socket } = useSocketIO()
const route = useRoute()


let users = ref([])



onMounted(async () => {
  socket.on('welcome', () => { console.log('welcome') })
  socket.emit('connectToRoom', route.params.id, userStore.user.token);
  socket.on('roomChange', (data) => { 
    users.value = data
  })
})

onUnmounted(async () => {
    socket.emit('disconnectFromRoom', route.params.id);
})


</script>

<template>
  <div>
    <NuxtLayout name="auth">
      <SectionMain class=''>
        <CardBox :smallPadding='true' class='!bg-blue-300 mb-2 '  v-for='user in users'>
          {{user.user.username}}


        </CardBox>
      </SectionMain>
    </NuxtLayout>
  </div>
</template>
