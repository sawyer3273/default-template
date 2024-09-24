<script setup>
import { ref } from 'vue'
import { mdiClose, mdiDotsVertical } from '@mdi/js'
import { containerMaxW } from '@/configs/config'
const route = useRoute()

defineProps({
  menu: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['menu-click'])

const menuClick = (event, item) => {
  emit('menu-click', event, item)
}
const isMainPage = computed(() => {
 return route.path == '/' ? true : false
})

const isMenuNavBarActive = ref(false)
</script>

<template>
  <nav class="top-0 inset-x-0 bg-gradient-to-r from-blue-start to-blue-end h-18 z-30 transition-position w-screen lg:w-auto dark:bg-slate-800" :class='isMainPage ? "transparent": ""'>
    <div class="flex lg:items-stretch" :class="containerMaxW">
      <NuxtLink to='/'><div class='absolute flex justify-center items-center text-slate-100 px-3 py-4 font-bold' ><Logo size='20' /><div>MovieQuiz</div></div></NuxtLink>
      <div class="flex flex-1 items-stretch h-18">
        <slot />
      </div>
      <div class="flex-none items-stretch flex h-18 lg:hidden z-50 text-slate-100">
        <NavBarItemPlain @click.prevent="isMenuNavBarActive = !isMenuNavBarActive">
          <BaseIcon :path="isMenuNavBarActive ? mdiClose : mdiDotsVertical" size="24" />
        </NavBarItemPlain>
      </div>
      <div
        class="max-h-screen-menu lg:overflow-visible absolute w-screen top-14 left-0 text-slate-100 md:shadow-lg lg:w-auto lg:flex lg:static lg:shadow-none z-50"
        :class="[isMenuNavBarActive ? 'block' : 'hidden']"
      >
        <NavBarMenuList :menu="menu" @menu-click="menuClick" />
      </div>
    </div>
  </nav>
</template>
