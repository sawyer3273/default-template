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
})

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

</script>

<template>
  <div v-if='url' :class='class'>
    <video width="320" height="240" ref="videoPlayer">
      <source
        :src="url"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
    <div>
      <button @click="play">play</button>
      <button @click="pause">pause</button>
      <button @click="stop">stop</button>
      <button @click="setSpeed(0.5)">0.5x</button>
      <button @click="setSpeed(1)">1x</button>
      <button @click="setSpeed(1.5)">1.5x</button>
      <button @click="setSpeed(2)">2x</button>
    </div>
  </div>
</template>
