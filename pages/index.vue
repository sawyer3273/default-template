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
        <div class="-mt-18 xl:-mt-52 w-full">
          <img src="/img/hero-bg.png" class='min-w-full hidden lg:inline-block' alt="">
          <div class='min-w-full inline-block lg:hidden bg-gradient-to-r from-blue-start to-blue-end min-h-85vh md:min-h-75vh' alt=""> </div>
          <div class="flex items-center justify-center w-full absolute top-24 px-6 xl:px-0" >
            <div class="row" :class='containerMaxW'>
              <div class="col-md-6 flex items-center justify-center">
                <div class="text-slate-100 text-center-cust md:text-left">
                  <h1 class='text-3xl font-bold'>
                    Онлайн кино квизы
                  </h1>
                  <p>
                    Присоединяйтесь к нашему сообществу любителей кино и наслаждайтесь увлекательными квизами с необычными механиками
                  </p>
                  <NuxtLink to='/intuition'><BaseButton :label="'Играть'"  class='mt-6' color="info"  /> </NuxtLink>
                </div>
              </div>
              <div class="col-md-6 flex items-center justify-center">
                <div class="img-box w-96 pt-12 md:pt-0">
                  <img src="/img/film-roll-transparent-free-png.png" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
    </NuxtLayout>
  </div>
</template>
