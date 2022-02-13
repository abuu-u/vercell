<template>
  <auth-layout label="Login" :error="error" @submit="onSubmit">
    <custom-input
      v-model="emailRef"
      shape="outlined"
      label="Email"
      type="email"
      :required="true"
      :hide-bottom-space="true"
      :lazy-rules="true"
      :rules="rules.required"
    />

    <custom-input
      v-model="passwordRef"
      shape="outlined"
      label="Password"
      type="password"
      :required="true"
      :hide-bottom-space="true"
      :lazy-rules="true"
      :rules="rules.required"
    />

    <template #after-button>
      <router-link class="text-body1 self-center" to="/register"
        >Create an account</router-link
      >
    </template>
  </auth-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CustomInput from 'src/components/CustomInput.vue'
import { required } from 'src/components/validators'
import AuthLayout from 'src/layouts/AuthLayout.vue'
import { storeToRefs } from 'pinia'
import useUser from 'src/pinia/user'
import { Loading } from 'quasar'

const emailRef = ref(null)
const passwordRef = ref(null)

const user = useUser()
const { error } = storeToRefs(user)

const rules = {
  required: [required('required field')],
}

const onSubmit = async () => {
  if (emailRef.value && passwordRef.value) {
    Loading.show()

    await user.login({
      email: emailRef.value,
      password: passwordRef.value,
    })

    Loading.hide()
  }
}
</script>
