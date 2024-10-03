<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import { cloneDeep } from 'lodash'
import { libraryOptions, quizTypeOptions } from '~/constants'
import CreateQuiz  from '@/components/Quiz/CreateQuiz'

const mainStore = useMainStore()

definePageMeta({
  middleware: 'auth' 
})


onMounted(async () => {
  mainStore.setBreadCrumbs([{name: 'Квиз', to: '/admin/quiz'}, {name: 'Создать пак'}])
})

</script>

<template>
  <div>
    <NuxtLayout name="admin">
      <CreateQuiz  />
    </NuxtLayout>
  </div>
</template>
