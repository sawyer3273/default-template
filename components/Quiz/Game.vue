<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  quizUsers: Object,
  me: Object,
})


</script>

<template>
  <div class='row'> 
    <div class='col-md-3'>
      <div class='mb-2 min-h-12'>
        <div class='bg-black overflow-hidden rounded-full m-1 text-white p-1 text-xl flex justify-between' v-for='(user, i) in quizUsers'>
          <div class='flex items-center w-4/5'>
            <div class='rounded-full bg-blue-500 min-w-7 text-center mr-2'>{{i+1}}</div>
            <UserAvatar class="min-w-7 w-7 h-7 mr-2" :username="user.user.username" />
            <div class='w-inherit'><div class='userName' :class='!user.isReady ? "text-gray-400": (me.id == user.id ? "text-green-600" : "")'>{{user.user.username}}  </div></div>

          </div>
          <div class='rounded-full bg-blue-500 w-12 text-center right-0'>{{user.score}}</div>
        </div>
      </div>


    </div>
    <div class='col-md-9'>



    </div>
  </div>
</template>
<style scoped>
.userName {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 90%;
}
</style>