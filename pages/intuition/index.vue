<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import { userService } from '~/utils/services/user.service'
import { dataService } from '~/utils/services/data.service'

definePageMeta({
  middleware: 'auth' 
})

const mainStore = useMainStore()


onMounted(async () => {
  
})

async function getData(payload) {
  await dataService.getPacksIntuition(payload)
}

</script>

<template>
  <div>
    <NuxtLayout name="auth">
      <SectionMain>
        <ContentGrid @load-data='getData' openLink='/intuition/{id}' storeModel='packs_intuition' />
      </SectionMain>
    </NuxtLayout>
  </div>
</template>
