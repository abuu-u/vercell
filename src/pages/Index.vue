<template>
  <q-page class="column items-center justify-center text-h6">
    <p>{{ user.name || 'Guest' }}</p>
    <div class="row q-gutter-x-md">
      <router-link v-if="!user.name" to="'/login">login</router-link>
      <router-link v-if="!user.name" to="'/register">register</router-link>
      <q-btn v-if="user.name" @click="user.logout()">logout</q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import useUser from 'src/pinia/user'

const user = useUser()
</script>
