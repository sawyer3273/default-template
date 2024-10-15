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
  isControl: {
    type: Boolean,
    default: true
  }, 
  isPlayMode: {
    type: Boolean,
    default: true
  }, 
  isBig: {
    type: Boolean,
    default: false
  }, 
  playText: {
    type: String,
    default: ''
  },
})
const emit = defineEmits(['onEnd', 'onTimeUpdate'])

const playerButton = ref(null),
      playerButton2 = ref(null),
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
      emit('onEnd')
      audio.value.pause();
      playerIcon.value = playIcon;
  }
}

const audioContext = ref(null)

let timout = ref(null)
onMounted(() => {
  if (props.isControl) {
    playerButton.value.addEventListener('click', toggleAudio);
  }
  if (props.isPlayMode) {
    playerButton2.value.addEventListener('click', toggleAudio);
  }
  audio.value.ontimeupdate = changeTimelinePosition;
  audio.value.onended = audioEnded;
  if (props.url) {
     visualizeAudio(props.url)
  }
  if (props.isAutoStart) {
    let audioPosition = localStorage.getItem('audioPosition')
    if (audioPosition) {
      audio.value.currentTime = audioPosition
    }
    audio.value.play();
    playerIcon.value = pauseIcon;
  }
  try{
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    audioContext.value = new AudioContext();
  }catch(e) {
      alert('Web Audio API is not supported in this browser')
  }
})

onUnmounted(() => {
  clearTimeout(timout.value)
}) 

function changeTimelinePosition () {
  emit('onTimeUpdate', audio.value.currentTime)
  const percentagePosition = (100*audio.value.currentTime) / audio.value.duration;
  timelineValue.value = percentagePosition
  localStorage.setItem('audioPosition', audio.value.currentTime)
}

function audioEnded () {
  emit('onEnd')
}

function moveTo (i) {
  if (props.isControl) {
    const time = ((i * (props.isBig ? 1 : 2)) * audio.value.duration) / 100;
    audio.value.currentTime = time;
  }
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
  const samples = props.isBig ? 100 : 50; // Number of samples we want to have in our final data set
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

  <div :class='class' class="audio-player flex items-end">
    <audio ref='audio' :src="url"></audio>
    <div class="controls">
      <button v-if='isControl' class='w-6 mr-4' ref="playerButton">
        <img :src='playerIcon' />
      </button>
    </div>
    <div :class='class' class='w-full waves flex '>
      <div :class='isControl ? (isBig ? "waveBig": "wave" ):  (isBig ? "waveBig-nohover": "wave-nohover" )' class='h-full flex items-end' v-for='(data, i) in audioData' @click='moveTo(i)'>
        <div :class='isControl ? "cursor-pointer": ""' class='w-full wave-outside' :style="`height:${data * 100}%`"> 
          <div class='wave-inside h-full w-full' :class='timelineValue > (i*(isBig ? 1 : 2)) ? "wave-colored": ""'> </div>
        </div>
      </div>

 
    </div>
    
  </div>

    <div class='audio-text flex flex-wrap justify-center mt-2'>
    
    <button v-if='isPlayMode' class='relative flex flex-wrap justify-center' ref="playerButton2">
        <span class='w-full text-2xl text-center mb -2'> Баллы: {{playText}} </span>
        <img class='w-12 ' :src='playerIcon' />
    </button>

    </div>
</template>

<style lang='scss'>
.audio-text {
  font-weight: bold;
  color: #166dc4;
}
.wave {
  width: 2%;
  padding: 0 0.2%;
}
.wave-nohover {
  width: 2%;
  padding: 0 0.2%;
}
.waveBig {
  width: 1%;
  padding: 0 0.2%;
}
.waveBig-nohover {
  width: 1%;
  padding: 0 0.2%;
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
