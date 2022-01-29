<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="drawerRef = !drawerRef" />
        <q-toolbar-title
          ><router-link to="/" class="text-white"
            >Any Dating</router-link
          ></q-toolbar-title
        >
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerRef" :width="300" bordered>
      <q-scroll-area class="fit">
        <theme-builder />
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ThemeBuilder from 'src/components/ThemeBuilder.vue'

const drawerRef = ref(false)
</script>
