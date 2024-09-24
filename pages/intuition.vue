<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import { userService } from '~/utils/services/user.service'
import { containerMaxW } from '@/configs/config'
definePageMeta({
  middleware: 'auth' 
})
const mainStore = useMainStore()


onMounted(() => {
})



</script>

<template>
  <div>
    <NuxtLayout name="auth">
        
    </NuxtLayout>
  </div>
</template>
