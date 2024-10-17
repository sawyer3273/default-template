<script setup>
import { reactive } from 'vue'
import { mdiAccount, mdiMail, mdiAsterisk, mdiFormTextboxPassword, mdiGithub } from '@mdi/js'
import { userService } from '~/utils/services/user.service'

let userStore = useUserStore()
const profileForm = reactive({
  username: userStore.user.username,
  email: userStore.user.email
})
definePageMeta({
  middleware: 'auth' 
})
const passwordForm = reactive({
  password_current: '',
  password: '',
  password_confirmation: ''
})

const submitProfile = () => {
  userService.updateUser(profileForm)
}

const changeUserAvatar = (file) => {
  userService.updateUser({avatar: file})
}
</script>

<template>
  <div>
    <NuxtLayout name="auth">
      <SectionMain v-if='userStore.user.username'>
        <SectionTitleLineWithButton :icon="mdiAccount" title="Профиль" main>
          
        </SectionTitleLineWithButton>

  
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardBox is-form @submit.prevent="submitProfile">
            

            <FormField label="Имя" >
              <FormControl
                v-model="profileForm.username"
                :icon="mdiAccount"
                name="username"
                required
              />
            </FormField>

            <template #footer>
              <BaseButtons>
                <BaseButton color="info" type="submit" label="Сохранить" />
              </BaseButtons>
            </template>
          </CardBox>

          <CardBox>
            <div class='w-48 flex justify-center flex-wrap'>
              <UserAvatar :username="userStore.user.username" :avatar="userStore.user.avatar"/>
              <CropperCust :classProp='"inline-grid"' v-model='userStore.user.avatar' :showImage='false' folder='users' ratio='1' @onUpload='(file) => changeUserAvatar(file)'/> 
            </div>
          </CardBox>
        </div>
      </SectionMain>
    </NuxtLayout>
  </div>
</template>
