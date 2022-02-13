<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="row">
        <q-btn flat round dense icon="menu" @click="drawerRef = !drawerRef" />
        <q-toolbar-title
          ><router-link to="/" class="text-white"
            >Any Dating</router-link
          ></q-toolbar-title
        >

        <q-btn-dropdown stretch flat :label="UserStatus[user.status]">
          <q-list>
            <q-item
              v-if="user.status !== UserStatus.unauthorised"
              v-close-popup
              clickable
              @click="onLogoutClick"
            >
              <q-item-section avatar>
                <q-avatar
                  icon="logout"
                  color="negative"
                  text-color="white"
                  size="md"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>

            <template v-else>
              <q-item to="/login">
                <q-item-section avatar>
                  <q-avatar
                    icon="login"
                    color="positive"
                    text-color="white"
                    size="md"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Login</q-item-label>
                </q-item-section>
              </q-item>

              <q-item to="/register">
                <q-item-section avatar>
                  <q-avatar
                    icon="person_add"
                    color="positive"
                    text-color="white"
                    size="md"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Register</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-btn-dropdown>
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
import useUser from 'src/pinia/user'
import { UserStatus } from 'src/services/user'

const drawerRef = ref(false)

const user = useUser()

const onLogoutClick = () => {
  void user.logout()
}
</script>
