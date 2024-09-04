<script setup>
import  {PROJECT_NAME} from '~/constants.js'
useHead({
  titleTemplate: (titleChunk) => {
    const titleBase = PROJECT_NAME

    return titleChunk ? `${titleChunk} - ${titleBase}` : titleBase
  }
})
</script>

<template>
  <div>
      <NuxtPage />
  </div>
</template>