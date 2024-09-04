<script setup>
import { reactive } from 'vue'
import { NuxtLink } from '#components'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, email} from '@vuelidate/validators'
import { userService } from '~/utils/services/user.service'

const router = useRouter()
const route = useRoute()



const form = reactive({
  pass: '',
})
const rules = computed(() => (
  {
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
      let resp = await userService.updatePassword({token: route.params.id, password: form.pass})
      if (resp.success) {
        router.push('/login');
      }
    }
  }).catch((err) => {
    console.log(err);
  })
};

onMounted(async () => {
  try {
    let findToken = await userService.checkForgotToken(route.params.id)
  } catch (err) {
    router.push('/login');
  }

});
</script>

<template>
  <div>
    <NuxtLayout>
      <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
        <CardBox :class="cardClass" is-form @submit.prevent="submitForm">
          <FormField :label="$t('Pass')" :help="$t('enterPass')" :error="$v.pass.$error ? $t('error_'+$v.pass.$errors[0].$validator) : ''">
            <FormControl
              v-model="form.pass"
              name="pass"
              type="password"
              :icon="mdiAsterisk"
            />
          </FormField>
          <template #footer>
            <div class='justify-between items-center flex'>
              <BaseButtons>
                <BaseButton :disabled='$v.$error' type="submit" color="info" :label="$t('Remind')" />
              </BaseButtons>
              <NuxtLink to="/"> {{$t('enter')}} </NuxtLink>
            </div>
          </template>
        </CardBox>
      </SectionFullScreen>
    </NuxtLayout>
  </div>
</template>
