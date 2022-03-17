<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="row nav">
        <q-btn flat round icon="menu" @click="drawerRef = !drawerRef" />
        <q-toolbar-title
          ><router-link to="/" class="text-white"
            >Any Dating</router-link
          ></q-toolbar-title
        >

        <q-btn
          flat
          round
          icon="notifications"
          class="q-mr-sm"
          @click.stop="notificationsShow = !notificationsShow"
        >
          <q-badge color="red" floating rounded>4</q-badge>
        </q-btn>

        <notifications
          :show="notificationsShow"
          :items="[
            { id: 1, type: 'busy', data: 'asd' },
            { id: 2, type: 'free', data: 'asd' },
            { id: 3, type: 'rejected', data: 'asd' },
            { id: 5, type: 'request', data: 'asd' },
            { id: 6, type: 'busy', data: 'asd' },
            { id: 7, type: 'free', data: 'asd' },
            { id: 8, type: 'rejected', data: 'asd' },
            { id: 9, type: 'request', data: 'asd' },
            { id: 10, type: 'busy', data: 'asd' },
            { id: 11, type: 'free', data: 'asd' },
            { id: 13, type: 'rejected', data: 'asd' },
            { id: 14, type: 'request', data: 'asd' },
            { id: 15, type: 'busy', data: 'asd' },
            { id: 16, type: 'free', data: 'asd' },
            { id: 17, type: 'rejected', data: 'asd' },
            { id: 18, type: 'request', data: 'asd' },
          ]"
          @close="notificationsShow = false"
        />
        <q-btn flat round :icon="icon[UserStatus[user.status]]">
          <q-popup-proxy>
            <p class="q-ma-sm text-body1 text-center">
              {{ UserStatus[user.status] }}
            </p>

            <q-separator />

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
          </q-popup-proxy>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerRef" :width="300" bordered overlay>
      <q-scroll-area class="fit">
        <theme-builder />
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="page">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ThemeBuilder from 'src/components/ThemeBuilder.vue'
import useUser from 'src/pinia/user'
import { UserStatus } from 'src/services/user'
import Notifications from 'src/components/Notifications.vue'

const drawerRef = ref(false)
const notificationsShow = ref(false)

const user = useUser()

const icon: { [k: string]: string } = {
  busy: 'mdi-account-lock',
  free: 'mdi-account',
  unauthorised: 'help',
}

const onLogoutClick = () => {
  void user.logout()
}
</script>

<style lang="scss">
.nav {
  position: relative;

  max-width: 600px;
  margin: auto;
}

.page {
  background-color: #fff;
}
</style>
