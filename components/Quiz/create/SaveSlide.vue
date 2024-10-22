<script setup>
import { computed, useSlots } from 'vue'
import { adminService } from '~/utils/services/admin.service'

const props = defineProps({
     modelValue: {
        type: [String, Number, Boolean, Array, Object],
        default: ''
    },
    slides: [Object],
    slideTime: Number,
    isSlideBtn: Boolean,
    content: String
})

const emit = defineEmits(['update:modelValue'])

const isSlideBtn = ref(props.isSlideBtn)
const time = ref(props.slideTime)
const isModal = ref(false)
const form = ref({
    select: {id: "new",  label: 'Новое название'},
    name: '',
})

function action() {
    let data = {
        name: form.value.select.id == 'new' ? form.value.name : form.value.name,
        content: props.content,
        id: form.value.select.id == 'new' ?  null : form.value.select.id
    }
  adminService.addSlide(data)
  isModal.value = false
}

function deleteAction() {
  adminService.deleteSlide({id: form.value.select.id})
  isModal.value = false
}

const options = computed(() => {
    let res = [{id: "new",  label: 'Новое название'}]
    if (props.slides) {
        props.slides.map(one => {
            res.push({
                id: one.id, label: one.name
            })
        })
    }
    return res
})
const slidesOption = computed(() => {
    let res = []
    if (props.slides) {
        props.slides.map(one => {
            res.push({
                id: one.id, label: one.name
            })
        })
    }
    return res
})

watch(() => form.value.select, (val) => {
    if (form.value.select.label == 'Новое название') {
        form.value.name = ''
    } else {
        form.value.name = form.value.select.label
    }
})


const slideSelect = ref('')

watch(() => slideSelect.value, (val) => {
  let f = props.slides.find(one => one.id == val.id)
  emit('update:modelValue', f.content)
})
watch(time, (val) => {
  emit('changeTime', {slideTime: val, isSlideBtn: isSlideBtn.value})
})
watch(isSlideBtn, (val) => {
  emit('changeTime', {slideTime: time.value, isSlideBtn: val})
})


</script>

<template>
    <div class='flex justify-between'>
        <FormControl class='mb-1' v-model="slideSelect" placeholder='Выбрать слайд' :options="slidesOption"  />
        <FormControl type="number" v-model='time' placeholder="Длительность" />
        <FormCheckRadio
            label='Баллы'
            v-model="isSlideBtn"
            :input-value="true"
            />
        <CardBoxModal v-model="isModal" title="Выберите название" button="danger" has-cancel>
            <FormControl v-model="form.select" :options="options"  />
            <FormControl v-model="form.name" placeholder='Введите название слайда'/>
            <div class='flex justify-between'>
                <BaseButton label="Ok" color="contrast" @click="action" />
                <BaseButton v-if='form.select.id != "new"' label="Удалить" color="contrast" @click="deleteAction" />
            </div>
        </CardBoxModal>
        <div @click='isModal=true' class='cursor-pointer text-blue-500 mx-2'> Сохранить слайд </div>
    </div>
</template>
<style scoped>

</style>