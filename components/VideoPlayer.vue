<script setup>
import { mdiUpload } from '@mdi/js'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  url: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: ''
  },
  isAutoStart: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits(['onEnd'])

let videoPlayer = ref(null)
function play() {
  videoPlayer.value.play();
}

function pause() {
  videoPlayer.value.pause();
}

function stop() {
  videoPlayer.value.pause();
  videoPlayer.value.currentTime = 0;
}

function  setSpeed(speed) {
  videoPlayer.value.playbackRate = speed;
}

function onEnd() {
  emit('onEnd')
}

onMounted(() => {
  videoPlayer.value.addEventListener('onended', onEnd,false);
  videoPlayer.value.onended = onEnd
  if (props.isAutoStart) {
    play()
  }
})
</script>

<template>

  <div v-if='url' :class='class' class='relative'>
    <video controls class='w-full' ref="videoPlayer">
      <source
        :src="url"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
  </div>
</template>
