<script setup>
import { computed, ref, onBeforeMount } from 'vue'
import { useMainStore } from '@/stores/main'
import CreateQuiz  from '@/components/Quiz/CreateQuiz'

const mainStore = useMainStore()

definePageMeta({
  middleware: 'auth' 
})

onMounted(async () => {
  mainStore.setBreadCrumbs([{name: 'Каст', to: '/admin/cast'}, {name: 'Редактировать пак'}])
})

</script>

<template>
  <div>
    <NuxtLayout name="admin">
       <CreateQuiz :isUpdate='true' />
    </NuxtLayout>
  </div>
</template>

