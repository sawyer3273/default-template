<script setup>
import { computed, ref, onMounted } from 'vue'
import { dataService } from '~/utils/services/data.service'
import { useToast } from "vue-toastification";

definePageMeta({
  middleware: 'auth' 
})
const router = useRouter()

onMounted(async () => {
    let roomData = await dataService.getRoom()
    if (roomData.data) {
        router.push(`/quizroom/${roomData.data.token}`);
    } else {
        toast.error('Can`t find room')
    }
})
</script>

<template>
  <div>
    <NuxtLayout name="auth">
    </NuxtLayout>
  </div>
</template>
