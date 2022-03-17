<template>
  <router-view />
</template>

<script setup lang="ts">
import initWs from './services/ws'

initWs()
</script>
