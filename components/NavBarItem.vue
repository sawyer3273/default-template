<script setup>
import { mdiChevronUp, mdiChevronDown } from '@mdi/js'
import { NuxtLink } from '#components'
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useMainStore } from '@/stores/main.js'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['menu-click'])

const is = computed(() => {
  if (props.item.href) {
    return 'a'
  }

  if (props.item.to) {
    return NuxtLink
  }

  return 'div'
})
const componentClass = computed(() => {
  const base = [
    isDropdownActive.value
      ? `navbar-item-label-active dark:text-slate-400 `
      : `navbar-item-label dark:text-white dark:hover:text-slate-400`,
    props.item.menu ? 'lg:px-3' : 'py-2 px-3',
    props.item.style ? props.item.style : ''
  ]

  if (props.item.isDesktopNoLabel) {
    base.push('lg:w-16', 'lg:justify-center')
  }

  return base
})
let userStore = useUserStore()
let mainStore = useMainStore()
let userLabel = mainStore ? `${userStore.user.username}` : 'Guest'
const itemLabel = computed(() =>
  props.item.isCurrentUser ? userLabel : props.item.label
)

const isDropdownActive = ref(false)

const menuClick = (event) => {
  emit('menu-click', event, props.item)

  if (props.item.menu) {
    isDropdownActive.value = !isDropdownActive.value
  }
}

const menuClickDropdown = (event, item) => {
  emit('menu-click', event, item)
}

const root = ref(null)

const forceClose = (event) => {
  if (root.value && !root.value.contains(event.target)) {
    isDropdownActive.value = false
  }
}

onMounted(() => {
  if (props.item.menu) {
    window.addEventListener('click', forceClose)
  }
})

onBeforeUnmount(() => {
  if (props.item.menu) {
    window.removeEventListener('click', forceClose)
  }
})
</script>

<template>
  <BaseDivider v-if="item.isDivider" nav-bar />
  <component
    :is="is"
    v-else
    ref="root"
    class="block lg:flex items-center relative cursor-pointer lg:bg-none bg-gradient-to-r from-blue-start to-blue-end"
    :class="componentClass"
    :to="item.to ?? null"
    :target="item.target ?? null"
    @click="menuClick"
  >
    <div
      class="flex items-center hover:text-blue-500 lg:bg-none bg-gradient-to-r from-blue-start to-blue-end"
      :class="{
        'bg-gray-100 dark:bg-slate-800 lg:bg-transparent lg:dark:bg-transparent p-3 lg:p-0':
          item.menu
      }"
    >
      <UserAvatarCurrentUser v-if="item.isCurrentUser" class="w-6 h-6 mr-3 inline-flex" />
      <BaseIcon v-if="item.icon" :path="item.icon" class="transition-colors" />
      <span
        class="px-2 transition-colors"
        :class="{ 'lg:hidden': item.isDesktopNoLabel && item.icon }"
        >{{ itemLabel }}</span
      >
      <BaseIcon
        v-if="item.menu"
        :path="isDropdownActive ? mdiChevronUp : mdiChevronDown"
        class="hidden lg:inline-flex transition-colors"
      />
    </div>
    <div
      v-if="item.menu"
      class="text-sm border-b border-gray-100 lg:border min-w-44 lg:bg-blue-end lg:absolute lg:top-full lg:left-0 lg:z-20 lg:rounded-lg lg:shadow-lg dark:border-slate-700"
      :class="{ 'lg:hidden': !isDropdownActive }"
    >
      <NavBarMenuList :menu="item.menu" @menu-click="menuClickDropdown" />
    </div>
  </component>
</template>
