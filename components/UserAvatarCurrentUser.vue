<script setup>
let userStore = useUserStore()
</script>

<template>
  <UserAvatar :username="userStore.user.username" :avatar="userStore.user.avatar">
    <slot />
  </UserAvatar>
</template>
