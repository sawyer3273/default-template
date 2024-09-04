<script setup>
import { reactive } from 'vue'
import { NuxtLink } from '#components'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, email} from '@vuelidate/validators'
import { useMainStore } from '@/stores/main'
const mainStore = useMainStore()
import CONSTANTS from '~/constants.js'
import { useToast } from "vue-toastification";
import { userService } from '~/utils/services/user.service'
const toast = useToast();
const router = useRouter()

const form = reactive({
  login: '',
  pass: '',
  userName: '',
})
const rules = computed(() => (
  {
    login: {
      required, email,
      minLength: minLength(3),
    },
    userName: {
      minLength: minLength(3),
    },
    pass: {
      required,
      minLength: minLength(8),
    },
  }
));

const $v = useVuelidate(rules, form);

const submitForm = async () => {
  const result = $v.value.$validate();
  result.then(async (res) => {
    if(res) {
      let user = await userService.register({username: form.userName, email: form.login, password: form.pass})
      if (user && user.success) {
        router.push('/');
      }
    }
  }).catch((err) => {
    console.log(err);
  })
};

onMounted(() => {
});
</script>

<template>
  <div>
    <NuxtLayout>
      <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
        <CardBox :class="cardClass" is-form @submit.prevent="submitForm">
          <FormField :label="$t('UserName')" :help="$t('enterUserName')" :error="$v.userName.$error ? $t('error_'+$v.userName.$errors[0].$validator) : ''">
            <FormControl
              v-model="form.userName"
              :icon="mdiAccount"
              name="userName"
              autocomplete="username"
            />
          </FormField>
          <FormField :label="$t('Login')" :help="$t('enterLogin')" :error="$v.login.$error ? $t('error_'+$v.login.$errors[0].$validator) : ''">
            <FormControl
              v-model="form.login"
              :icon="mdiAccount"
              name="login"
              autocomplete="email"
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
          <template #footer>
            <div class='justify-between items-center flex'>
              <BaseButtons>
                <BaseButton :disabled='$v.$error' type="submit" color="info" :label="$t('RegisterNow')" />
              </BaseButtons>
              <NuxtLink to="/"> {{$t('HaveAcc')}} </NuxtLink>
            </div>
          </template>
        </CardBox>
      </SectionFullScreen>
    </NuxtLayout>
  </div>
</template>
