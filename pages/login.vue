<script setup>
import { reactive } from 'vue'
import { NuxtLink } from '#components'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import axios from 'axios';
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, email} from '@vuelidate/validators'
import { userService } from '~/utils/services/user.service'
import { useMainStore } from '@/stores/main'

const router = useRouter()

useHead({
  script: [{ src: "https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js" }],
});

const config = useRuntimeConfig()






const form = reactive({
  login: '',
  pass: '',
  remember: true
})

const mainStore = useMainStore()

definePageMeta({
  middleware: 'guest' 
})

const rules = computed(() => (
  {
    login: {
      required, email,
      minLength: minLength(3),
    },
    pass: {
      required,
      minLength: minLength(8),
    },
  }
));

const $v = useVuelidate(rules, form);

 const fpPromise = import('https://openfpcdn.io/fingerprintjs/v4')
  .then(FingerprintJS => FingerprintJS.load())

// Get the visitor identifier when you need it.
fpPromise
  .then(fp => fp.get())
  .then(result => {
    // This is the visitor identifier:
    const visitorId = result.visitorId
    console.log(visitorId)
  })



const submitForm = async () => {
  const result = $v.value.$validate();
  result.then(async (res) => {
    if(res) {
      let data = await userService.login({email: form.login, password: form.pass})
      if (data && data.success) {
        router.push('/');
      }
    }
  }).catch((err) => {
    console.log(err);
  })
};

onMounted(() => {
/*
YaAuthSuggest.init(
      {
         client_id: config.public.yandexClientId,
         response_type: 'token',
         redirect_uri: 'https://rx90d8n0-8000.euw.devtunnels.ms/yandex'
      },
      'https://rx90d8n0-8000.euw.devtunnels.ms',
      {
      view: "button",
      parentId: "buttonContainerId",
      buttonSize: 'm',
      buttonView: 'main',
      buttonTheme: 'light',
      buttonBorderRadius: "0",
      buttonIcon: 'ya',
    }
   )
   .then(({
      handler
   }) => handler())
   .then(async payload => {
      mainStore.setLoader(true)
      let data = await userService.loginYandex({token: payload.access_token})
      if (data && data.success) {
        router.push('/');
      }
   })
   .catch(error => console.log('Обработка ошибки', error));

*/

});
</script>

<template>
  <div>
    <NuxtLayout>
      <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
        <CardBox :class="cardClass" is-form @submit.prevent="submitForm">
          <FormField :label="$t('Login')" :help="$t('enterLogin')" :error="$v.login.$error ? $t('error_'+$v.login.$errors[0].$validator) : ''">
            <FormControl
              v-model="form.login"
              :icon="mdiAccount"
              name="login"
              autocomplete="username"
            />
          </FormField>
          <FormField :label="$t('Pass')" :help="$t('enterPass')" :error="$v.pass.$error ? $t('error_'+$v.pass.$errors[0].$validator, {min: 8}) : ''">
            <FormControl
              v-model="form.pass"
              :icon="mdiAsterisk"
              type="password"
              name="password"
              autocomplete="current-password"
            />
          </FormField>
          <div class='justify-between items-center flex'>
            <FormCheckRadio
              v-model="form.remember"
              name="remember"
              :label="$t('Remember')"
              :input-value="true"
            />
            <NuxtLink to="/forgot"> {{$t('ForgotPassword')}} </NuxtLink>
          </div>
          <template #footer>
            <BaseButtons>
              <BaseButton :disabled='$v.$error' type="submit" color="info" :label="$t('enter')" />
              <a href='/register'> <BaseButton :label="$t('Register')" color="info" outline > </BaseButton> </a>
            </BaseButtons>
            <!--<div class='mt-2' id='buttonContainerId'></div>-->
          </template>
        </CardBox>
      </SectionFullScreen>
    </NuxtLayout>
  </div>
</template>
