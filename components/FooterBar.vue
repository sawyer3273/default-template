<script setup>
import { containerMaxW } from '@/configs/config'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="py-2 px-6" :class="containerMaxW">
    <BaseLevel>
      <div class="text-center md:text-left">
        <b class='mr-1'>&copy;{{ year }} </b>
        <slot />
      </div>
      <div class="md:py-2">
        <a>
          <Logo />
        </a>
      </div>
    </BaseLevel>
  </footer>
</template>
