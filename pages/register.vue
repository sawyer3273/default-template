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
        router.push('/login');
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
      <SectionFullScreen v-slot="{ cardClass }" bg="bg-gray-900">

        <div class="background">
            <div class="shape"><img src='/img/login1.png'/></div>
            <div class="shape"><img src='/img/login2.png'/></div>
        </div>
        <CardBox class='form-login text-white' :isNoClass='true'  :hasTable='true' is-form @submit.prevent="submitForm">
          <div class='-mt-6'><h1 class='font-bold text-xl text-center w-full '> Регистрация </h1></div>
          <FormField :label="$t('UserName')" :error="$v.userName.$error ? $t('error_'+$v.userName.$errors[0].$validator) : ''">
            <FormControl
              v-model="form.userName"
              :icon="mdiAccount"
              name="userName"
              inputCass="text-black"
              autocomplete="username"
            />
          </FormField>
          <FormField :label="$t('Login')"  :error="$v.login.$error ? $t('error_'+$v.login.$errors[0].$validator) : ''">
            <FormControl
              v-model="form.login"
              :icon="mdiAccount"
              name="login"
              inputCass="text-black"
              autocomplete="email"
            />
          </FormField>
          <FormField :label="$t('Pass')"  :error="$v.pass.$error ? $t('error_'+$v.pass.$errors[0].$validator, {min: 8}) : ''">
            <FormControl
              v-model="form.pass"
              :icon="mdiAsterisk"
              type="password"
              name="password"
              inputCass="text-black"
              autocomplete="current-password"
            />
          </FormField>
          <div class='mt-5'>
              <BaseButton :disabled='$v.$error' type="submit" color="white" class='w-full font-bold' :label="$t('RegisterNow')" />
             
          </div>
          <div class='mt-2'>
            <NuxtLink to="/" > {{$t('HaveAcc')}} </NuxtLink>
          </div>
            
        </CardBox>
      </SectionFullScreen>
    </NuxtLayout>
  </div>
</template>

<style scoped>
      *,
*:before,
*:after{
    box-sizing: border-box;
}
body{
    background-color: #080710;
}
.background{
    width: 430px;
    height: 520px;
    position: absolute;
    transform: translate(-50%,-50%);
    left: 50%;
    top: 50%;
}
.background .shape{
    height: 200px;
    width: 200px;
    position: absolute;
    border-radius: 50%;
}
.shape:first-child{
    left: -80px;
    top: -105px;
}
.shape:last-child{
    right: -112px;
    bottom: -50px;
}

.form-login {
    height: 490px;
    width: 400px;
    background-color: rgba(255,255,255,0.13);
    position: absolute;
    transform: translate(-50%,-50%);
    top: 50%;
    left: 50%;
    border-radius: 10px;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255,255,255,0.1);
    box-shadow: 0 0 40px rgba(8,7,16,0.6);
    padding: 50px 35px;
}
.form-login *{
  font-family: 'Poppins',sans-serif;
  letter-spacing: 0.5px;
  outline: none;
  border: none;
}
.form-login h3{
    font-size: 32px;
    font-weight: 500;
    line-height: 42px;
    text-align: center;
}

label{
    display: block;
    margin-top: 30px;
    font-size: 16px;
    font-weight: 500;
}
input {
  display: block;
  height: 50px;
  width: 100%;
  background-color: rgba(255,255,255,0.07);
  border-radius: 3px;
  padding: 0 10px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 300;
}
::placeholder{
    color: #e5e5e5;
}
.social{
  display: flex;
}
.social div{
  background: red;
  height: 42px;
  padding: 5px 10px 10px 5px;
  background-color: rgba(255,255,255,0.27);
  color: #eaf0fb;
  text-align: center;
}
.social div:hover{
  background-color: rgba(255,255,255,0.47);
}
.social .fb{
  margin-left: 25px;
}
.social i{
  margin-right: 4px;
}

.input-form {
  color: black !important;
}
@media (max-width: 500px) {
   .shape:first-child{
    left: 1px;
    top: -115px;
   }
   .shape:last-child{
    right: 1px;
    bottom: -100px;
   }
   .form-login {
    width: calc(100vw - 20px)
   }
   .background {
    width: 100vw;
   }
}
    </style>
