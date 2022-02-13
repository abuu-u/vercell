<template>
  <auth-layout label="Register" :error="error" @submit="onSubmit">
    <custom-input
      v-model="nameRef"
      label="Name"
      :required="true"
      :rules="rules.required"
    />

    <custom-select
      v-model="genderRef"
      :options="genderOptions"
      label="Gender"
      :required="true"
      :rules="rules.required"
    />

    <custom-input
      v-model="birthDateRef"
      label="Birthdate"
      mask="date"
      :rules="[...rules.required, 'date']"
      :required="true"
    >
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy
          ref="qDateProxy"
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date v-model="birthDateRef">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </custom-input>

    <custom-input
      v-model="emailRef"
      label="Email"
      type="email"
      :rules="rules.email"
      :required="true"
    />

    <custom-input
      v-model.number="numberRef"
      label="Tel number"
      type="tel"
      prefix="+"
      :rules="rules.required"
      :required="true"
    />

    <custom-input
      v-model="cityRef"
      label="City"
      :rules="rules.required"
      :required="true"
    />

    <custom-input
      v-model="passwordRef"
      label="Password"
      :type="isPwd ? 'password' : 'text'"
      :rules="rules.required"
      :required="true"
    >
      <q-icon
        :name="isPwd ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="isPwd = !isPwd"
      />
    </custom-input>

    <custom-input
      label="Password"
      :required="true"
      :type="isPwd ? 'password' : 'text'"
      :rules="rules.passwordRetype"
    />

    <div class="row items-center">
      <q-checkbox v-model="tncRef" label="I agree to the" />
      <a class="q-mx-xs" href="/#nowhere">terms and conditions</a>
    </div>

    <template #after-button>
      <router-link class="text-body1 self-center" to="/login"
        >Already have an account</router-link
      >
    </template>
  </auth-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CustomInput from 'src/components/CustomInput.vue'
import { email, required, shouldBeSame } from 'src/components/validators'
import { Loading, useQuasar } from 'quasar'
import AuthLayout from 'src/layouts/AuthLayout.vue'
import useUser from 'src/pinia/user'
import { storeToRefs } from 'pinia'
import CustomSelect from 'src/components/CustomSelect.vue'
import { Gender, genders } from 'src/services/user/register'

const nameRef = ref<string | null>(null)
const emailRef = ref<string | null>(null)
const passwordRef = ref<string | null>(null)
const birthDateRef = ref<string | null>(null)
const cityRef = ref<string | null>(null)
const genderRef = ref<Gender | null>(null)
const numberRef = ref<number | null>(null)
const tncRef = ref<boolean>(false)

const isPwd = ref(true)

const rules = {
  email: [email('invalid email')],
  required: [required('required field')],
  passwordRetype: [
    required('required field'),
    shouldBeSame('should be same', passwordRef),
  ],
}

const genderOptions = genders.map((gender) => ({
  label: gender,
  value: gender,
}))

const $q = useQuasar()

const user = useUser()
const { error } = storeToRefs(user)

const onSubmit = async () => {
  if (tncRef.value !== true) {
    $q.notify({
      color: 'negative',
      message: 'You need to accept the terms and conditions',
    })
  } else if (
    nameRef.value &&
    emailRef.value &&
    passwordRef.value &&
    birthDateRef.value &&
    cityRef.value &&
    genderRef.value &&
    numberRef.value
  ) {
    Loading.show()

    await user.register({
      name: nameRef.value,
      email: emailRef.value,
      password: passwordRef.value,
      birthDate: birthDateRef.value,
      city: cityRef.value,
      gender: genderRef.value,
      number: numberRef.value,
    })

    Loading.hide()
  }
}
</script>
