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

const playerButton = ref(null),
      audio = ref(null),
      timelineValue = ref(0),
      playIcon = '/img/player/play.png',
      pauseIcon = '/img/player/stop.png',
      soundIcon = '',
      muteIcon = '';
let playerIcon = ref(playIcon)

function toggleAudio () {
  if (audio.value.paused) {
    audio.value.play();
    playerIcon.value = pauseIcon;
  } else {
    audio.value.pause();
    playerIcon.value = playIcon;
  }
}

const audioContext = ref(null)

onMounted(() => {
  playerButton.value.addEventListener('click', toggleAudio);
  audio.value.ontimeupdate = changeTimelinePosition;
  audio.value.onended = audioEnded;
  if (props.url) {
     visualizeAudio(props.url)
  }
  try{
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    audioContext.value = new AudioContext();
  }catch(e) {
      alert('Web Audio API is not supported in this browser')
  }
})

function changeTimelinePosition () {
  const percentagePosition = (100*audio.value.currentTime) / audio.value.duration;
  timelineValue.value = percentagePosition
}

function audioEnded () {
  playerButton.value.innerHTML = playIcon;
}

function moveTo (i) {
  const time = ((i * 2) * audio.value.duration) / 100;
  audio.value.currentTime = time;
}

watch(() => props.url, (val) => {
  if (val) {
    visualizeAudio(val)
  }
})

const audioData = ref([])

async function visualizeAudio(url) {
  fetch(url, { mode: 'cors',})
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.value.decodeAudioData(arrayBuffer))
    .then(audioBuffer => normalizeData(filterData(audioBuffer)));
};

function filterData(audioBuffer) {
  const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
  const samples = 50; // Number of samples we want to have in our final data set
  const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
  const filteredData = [];
  for (let i = 0; i < samples; i++) {
    let blockStart = blockSize * i; // the location of the first sample in the block
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
    }
    filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
  }
  return filteredData;
};

function normalizeData(filteredData) {
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    audioData.value = filteredData.map(n => n * multiplier)
    const min = Math.min(...audioData.value ) - 0.05
    audioData.value = audioData.value.map(n => n - min)
    return audioData.value;
}
</script>

<template>

  <div class="audio-player flex items-end">
    <audio ref='audio' :src="url"></audio>
    <div class="controls">
      <button class='w-6 mr-4' ref="playerButton">
        <img :src='playerIcon' />
      </button>
    </div>
    <div :class='props.class ? props.class : "h-8" ' class='waves flex '>
      <div class='wave h-full flex items-end' v-for='(data, i) in audioData' @click='moveTo(i)'>
        <div class='w-full cursor-pointer wave-outside' :style="`height:${data * 100}%`"> 
          <div class='wave-inside h-full w-full' :class='timelineValue > (i*2) ? "wave-colored": ""'> </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style lang='scss'>
.wave {
  width: 2%;
  padding: 0 0.2%;
  cursor: pointer;
}
.wave-inside {
  background: #aacced;
}
.wave:hover {
  .wave-inside {
    background: #166dc4;
  }
}
.wave-colored {
  background: #3390ec;
}
</style>
