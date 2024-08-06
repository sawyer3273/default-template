<script setup>
import  CONSTANTS from '~/constants.js'
useHead({
  titleTemplate: (titleChunk) => {
    const titleBase = CONSTANTS.PROJECT_NAME

    return titleChunk ? `${titleChunk} - ${titleBase}` : titleBase
  }
})

</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>