<script setup>
import { computed, ref, onMounted } from 'vue'
import { dataService } from '~/utils/services/data.service'
import { useToast } from "vue-toastification";

definePageMeta({
  middleware: 'auth' 
})
const router = useRouter()
const route = useRoute()

onMounted(async () => {
    let roomData = await dataService.getRoom(route.query.id ? {pack_id: route.query.id}: {})
    if (roomData.data) {
        router.push(`/quizroom/${roomData.data.token}${route.query.id ? '?id=' + route.query.id : ''}`);
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
