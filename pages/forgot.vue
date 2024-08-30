<script setup>
import { reactive } from 'vue'
import { NuxtLink } from '#components'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import axios from 'axios';
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, email} from '@vuelidate/validators'

const router = useRouter()

const form = reactive({
  login: '',
  pass: '',
  remember: true
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

const submitForm = async () => {
  const result = $v.value.$validate();
  result.then(async (res) => {
    if(res) {
      let login = await axios.post('/api/user/login', {email: form.login, password: form.pass, remember: form.remember})
      console.log('login',login)
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
          <FormField :label="$t('Login')" :help="$t('enterLogin')" :error="$v.login.$error ? $t('error_'+$v.login.$errors[0].$validator) : ''">
            <FormControl
              v-model="form.login"
              :icon="mdiAccount"
              name="login"
              autocomplete="username"
            />
          </FormField>
          <template #footer>
            <BaseButtons>
              <BaseButton :disabled='$v.$error' type="submit" color="info" :label="$t('Remind')" />
            </BaseButtons>
          </template>
        </CardBox>
      </SectionFullScreen>
    </NuxtLayout>
  </div>
</template>
