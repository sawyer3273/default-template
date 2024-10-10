<script setup>
import { colorsText, colorsBgLight } from '@/configs/colors'
import {
  mdiDeleteCircle, 
} from '@mdi/js'

defineProps({
  class: {
    type: String,
    default: ''
  },
})

const emit = defineEmits(['deleteFuncion'])

const isModalDangerActive = ref(false)

function deleteAction() {
  emit('deleteFuncion')
  isModalDangerActive.value = false
}


</script>

<template>
  <CardBoxModal v-model="isModalDangerActive" :title="$t('deleteSure')" button="danger" has-cancel>
    <BaseButton label="Ok" color="contrast" @click="deleteAction" />
  </CardBoxModal>
  <BaseIcon @click='() => isModalDangerActive = true' :size='36' :class='class' class='absolute right-3 cursor-pointer text-red-500' :path='mdiDeleteCircle' />
</template>
