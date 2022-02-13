<template>
  <router-view />
</template>

<script setup lang="ts">
import useUser from './pinia/user'

const user = useUser()

void user.getStatus()
</script>
