<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import { userService } from '~/utils/services/user.service'
import { containerMaxW } from '@/configs/config'
definePageMeta({
  middleware: 'auth' 
})
const mainStore = useMainStore()


onMounted(() => {
})



</script>

<template>
  <div>
    <NuxtLayout name="auth">
        <div class="w-full">
          <img src="/img/banner.jpeg" class='min-w-full hidden sm:inline-block' alt="">
          <img src="/img/banner-mobile.jpeg" class='min-w-full inline-block sm:hidden' alt="">
          <div class="flex items-center justify-center w-full absolute top-44 px-6 xl:px-0" >
            <div class="row w-full" :class='containerMaxW'>
              <div class="col-md-6 flex items-center justify-center">
                <div class="text-slate-100 text-center-cust md:text-left opacity-back p-3 rounded-lg">
                  <h1 class='text-3xl font-bold'>
                    Онлайн кино квизы
                  </h1>
                  <p>
                    Присоединяйтесь к нашему сообществу любителей кино и наслаждайтесь увлекательными квизами с необычными механиками
                  </p>
                  <NuxtLink to='/quizes'><BaseButton :label="'Играть'"  class='mt-6 ml-2' color="info"  /> </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
    </NuxtLayout>
  </div>
</template>
