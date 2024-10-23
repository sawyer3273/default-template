<script setup>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import ImageUploader from "quill-image-uploader";
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array, Object],
    default: ''
  },
})

const emit = defineEmits(['update:modelValue'])

const content = ref(props.modelValue);
const modules = [
{
    name: "imageUploader",
    module: ImageUploader,
    options: {
        upload: (file) => {
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append("image", file);
                console.log(file);
                $fetch("/api/post/post", {
                    method: "POST",
                    body: formData,
                }).then((res) => {
                    console.log(res);
                    resolve(`/uploads/${res}`);
                });
            //   .catch((err) => {
            //     reject("Upload failed");
            //     console.error("Error:", err);
            //   });
            });
        },
    },
},
{
    name: "blotFormatter",
    module: BlotFormatter,
    options: {
    /* options */
    },
},
];
watch(() => props.modelValue, (val) => {
    content.value = val
})
watch(content, (val) => {
    emit('update:modelValue', val)
})
</script>
<template>
<ClientOnly>
    <div class="mb-8">
        <QuillEditor
            theme="snow"
            v-model:content="content"
            toolbar="full"
            :modules="modules"
            content-type="html"
        />
    </div>
    </ClientOnly>
</template>