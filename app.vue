<script setup>
import  {PROJECT_NAME} from '~/constants.js'
import { useMainStore } from '@/stores/main'
const mainStore = useMainStore()

useHead({
  titleTemplate: (titleChunk) => {
    const titleBase = PROJECT_NAME

    return titleChunk ? `${titleChunk} - ${titleBase}` : titleBase
  }
})
</script>

<template>
  <div>
    <LoaderGlobal :show='mainStore.loader' />
    <NuxtPage />
  </div>
</template>