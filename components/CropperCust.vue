<script setup>
import { computed, ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';
import {
  mdiUploadCircle, mdiContentSave
} from '@mdi/js'
import { adminService } from '~/utils/services/admin.service'

const mainStore = useMainStore()
const componentStore = useComponentStore()
const props = defineProps({
  modelValue: {
    type: [String],
    default: ''
  },
  width: {
    type: String,
    default: '166'
  },
  showbtn: {
    type: Boolean,
    default: true
  }
})
useHead({
  script: [{ src: "https://unpkg.com/vue-advanced-cropper@^2.0.0/dist/index.umd.js" }],
});

const emit = defineEmits(['update:modelValue', 'onUpload'])

onMounted(async () => {
  
})

let isModalActive = ref(false)
watch(isModalActive, async val => {
  if (!val) {
    imageData.value =  { name: "", type: "image/png", src: "" }
  } else {
    chooseFiles()
  }
}) 

let img = ref('/img/logo.png')
let imageData = ref( { name: "", type: "image/png", src: "" } )
let errorText = ref('')
const cropperRef = ref(null)

function chooseFiles() {
  document.getElementById("inputImage").click()
}

function fileChanged() {
  let file = document.getElementById("inputImage").files[0]
  if (file) {
    let formats = ["image/png", "image/jpg", "image/jpeg"]
    let size = file.size / 10 ** 6
    let isFormat = formats.includes(file.type)
    if (FileReader && isFormat && size <= 5) {
      imageData.value.name = file.name
      imageData.value.type = file.type
      let reader = new FileReader()
      reader.onload = () => {
        imageData.value.src = reader.result
      }
      reader.readAsDataURL(file)
    }
  }
}

async function cropSave() {
  const { canvas } = cropperRef.value.getResult()
  
  const form = new FormData()
  if (canvas) {
    await new Promise((resolve) => {
      canvas.toBlob((blob) => {
        form.append("file", blob, imageData.value.name)
        form.append("type", 'actors')
        resolve()
      }, imageData.value.type)
    })
  }
  mainStore.setLoader(true)
  let image = await adminService.uploadImage(form, 'actors')
  mainStore.setLoader(false)
  if (image.success) {
    emit('update:modelValue', image.data.file)
    console.log('image.data.file',image.data.file)
    emit('onUpload', image.data.file)
  } else {
    errorText.value = 'Failed to upload'
  }
  
  isModalActive.value = false
}
</script>

<template>
  <img class='mb-1' :src="modelValue ? modelValue : '/img/card_placeholder.png'" :width='width'/>
  <BaseButton
    v-if='showbtn'
    @click='isModalActive = true'
    :icon="mdiUploadCircle"
    label="Загрузить фото"
    color="contrast"
    rounded-full
    small
  />
  <CardBoxModal v-model="isModalActive" classProp='max-w-96'>
    <Cropper
      ref="cropperRef"
      class="cropper"
      :src="imageData.src"
      :stencil-props="{
        aspectRatio: 10/12
      }"
    ></Cropper>
  
      <input
        @change="fileChanged()"
        id="inputImage"
        type="file"
        accept=".png, .jpg, .jpeg"
        hidden
      />
        <div class="mb-2 flex justify-center">
          <BaseButton
            @click='cropSave()'
            :icon="mdiContentSave"
            label="Сохранить фото"
            color="contrast"
            rounded-full
            small
          />  
        </div>
    <div class='text-red' v-if='errorText'>{{errorText}}</div>
  </CardBoxModal>
</template>
<style>
.cropper {
  width: 100%;
}
</style>