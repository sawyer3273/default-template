<script setup lang='ts'>
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { mdiCircleDouble } from '@mdi/js'
const userStore = useUserStore()


const props = defineProps({
  data: Array,
  buttonTextSecond: String,
  buttonText: String,
})

const emit = defineEmits(['onClick', 'onClickSecond'])

onMounted(async () => {
 
})

function onClick(id) {
  emit('onClick', id)
}

function onClickSecond(id) {
  emit('onClickSecond', id)
}
</script>

<template>
 
<main class="leaderboard__profiles">
  <div class='rounded-lg p-2 text-gray-500 flex justify-center leaderboard-shadow' v-if='!data.length'> 
    <img class='w-18' src='/img/empty.gif' />
  </div> 
  <article v-else class="leaderboard__profile" v-for='user in data'>
    <UserAvatar :username='user.user.username' :avatar='user.user.avatar' class="leaderboard__picture" />
    <span class="leaderboard__name">{{user.user.username}}<span v-if='user.isAlreadyPassed' class='text-gray-500 text-sm'> (Вне зачета)</span></span>
    <div class='flex'>
      <div v-if='buttonTextSecond' class='whitespace-nowrap flex items-center ml-1'>
        <div v-if='user.user.id == userStore.user.id' @click='onClickSecond(!user.isReady)' class=' text-blue-600 cursor-pointer'> {{user.isReady ? "Готов" : "Не готов" }} </div>
        <div v-else> {{user.isReady ? "Готов" : "Не готов" }}</div>
        <BaseIcon :class='user.isReady ? "text-green-500" : "text-red-500"' :path='mdiCircleDouble' />
      </div>
      <button v-if='buttonText' class='button-39 mr-1' @click='onClick(user.user_id)'>{{buttonText}}</button>
    </div>
  </article>
  
</main>

  
</template>


<style scoped lang='scss'>
.leaderboard-shadow {
  background-color: #fff;
  box-shadow: 0 5px 7px -1px rgba(51, 51, 51, 0.23);
}
.leaderboard {
  max-width: 490px;
  width: 100%;
  border-radius: 12px;

  &__profiles {
    display: grid;
    row-gap: 8px;
  }
  
  &__profile {
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    align-items: center;
    padding: 10px 20px 10px 10px;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 5px 7px -1px rgba(51, 51, 51, 0.23);
    transition: transform .25s cubic-bezier(.7,.98,.86,.98), box-shadow .25s cubic-bezier(.7,.98,.86,.98);
    background-color: #fff;
    
    &:hover {
      transform: scale(1.02);
      box-shadow: 0 9px 47px 11px rgba(51, 51, 51, 0.18);
    }
  }
  
  &__picture {
    max-width: 100%;
    width: 30px;
    border-radius: 50%;
    box-shadow: 0 0 0 10px #ebeef3, 0 0 0 22px #f3f4f6;
  }
  
  &__name {
    color: #979cb0;
    font-weight: 600;
    font-size: 20px;
    letter-spacing: 0.64px;
  }
  
  &__value {
    color: #35d8ac;
    font-weight: 700;
    font-size: 34px;
    text-align: right;
    
    & > span {
      opacity: .8;
      font-weight: 600;
      font-size: 13px;
      margin-left: 3px;
    }
  }
}



.leaderboard {
  box-shadow: 0 0 40px -10px rgba(0, 0, 0, .4);
}
</style>