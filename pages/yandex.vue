<script setup>
import { reactive } from 'vue'
import { NuxtLink } from '#components'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import axios from 'axios';
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, email} from '@vuelidate/validators'
import { userService } from '~/utils/services/user.service'
import { useMainStore } from '@/stores/main'

useHead({
  script: [{ src: "https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-token-with-polyfills-latest.js" }],
});

const route = useRoute()

const submitForm = async () => {
  const result = $v.value.$validate();
  result.then(async (res) => {
    if(res) {
      let data = await userService.login({email: form.login, password: form.pass})
      if (data && data.success) {
        mainStore.setUser(data.user)
        router.push('/');
      }
    }
  }).catch((err) => {
    console.log(err);
  })
};
//https://rx90d8n0-8000.euw.devtunnels.ms/yandex#access_token=y0_AgAAAAAuq1spAAxkfgAAAAEQCEoqAAD3p3_otaVFG5VGaTW1eraTIsAQ4g&token_type=bearer&expires_in=31472824&cid=vn8d2u9wqb559t76rzajp6p0w8
onMounted(async () => {
  YaSendSuggestToken(
   'https://rx90d8n0-8000.euw.devtunnels.ms', 
      {
          flag: true
      }
    )
    if (route.hash && route.hash.includes('#access_token=')) {
      let token = route.hash.split('&')[0].split('#access_token=')[1]
      console.log('route',token)
   //   await userService.loginYandex({token})
    }

});
</script>

<template>
  <div>
    <NuxtLayout>
    </NuxtLayout>
  </div>
</template>
