<template>
  <div
    ref="notificationsRef"
    class="notifications"
    :class="{ 'notifications--show': show }"
  >
    <div class="notifications__top">
      <p class="q-ma-none text-h6">Notifications</p>

      <q-btn
        class="notifications__clear-all"
        icon="clear_all"
        round
        flat
        color="red"
      />
    </div>

    <q-separator />

    <q-list class="notifications__list">
      <q-item v-for="it in props.items" :key="it.id">
        <q-item-section avatar>
          <q-avatar
            text-color="primary"
            :icon="notification[it.type].icon"
            size="50px"
          />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ notification[it.type].label }}</q-item-label>
          <q-item-label caption lines="2">{{ it.data }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn icon="delete_outline" round flat color="red" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'

type NotificationType = 'rejected' | 'free' | 'busy' | 'request'

interface Notification {
  id: number
  type: NotificationType
  data: string
}

const props = defineProps<{
  show: boolean
  items: Notification[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const notificationsRef = ref<HTMLDivElement>()

const notification: {
  [k in NotificationType]: {
    icon: string
    label: string
  }
} = {
  busy: {
    icon: 'mdi-account-lock',
    label: 'asdasd',
  },
  free: {
    icon: 'mdi-account',
    label: 'asdasd',
  },
  rejected: {
    icon: 'favorite',
    label: 'asdasd',
  },
  request: {
    icon: 'heart_broken',
    label: 'asdasd',
  },
}

const onOutsideClick = (evt: MouseEvent) => {
  if (
    evt.target !== notificationsRef.value &&
    !notificationsRef.value?.contains(evt.target as Node)
  ) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('click', onOutsideClick)
})

onUnmounted(() => {
  window.removeEventListener('click', onOutsideClick)
})
</script>

<style lang="scss">
.notifications {
  position: absolute;
  top: calc(100% + 10px);
  right: 12px;

  width: calc(100% - 24px);
  max-width: 400px;

  color: #000;

  visibility: hidden;

  background: #fff;
  box-shadow: 0 0 10px 1px rgba(#000, 0.1);
  opacity: 0;

  transition: all 0.3s;

  &--show {
    visibility: visible;

    opacity: 1;
  }

  &__top {
    position: relative;

    display: flex;

    align-items: center;

    justify-content: center;

    padding: 10px;
  }

  &__clear-all {
    position: absolute;
    right: 22px;
  }

  &__list {
    max-height: 264px;
    overflow: auto;

    transition: scrollbar-color 0.3s;

    scrollbar-color: transparent transparent;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: transparent;

      border-radius: 3px;
    }

    &:hover {
      scrollbar-color: #ccc transparent;
    }

    &:hover::-webkit-scrollbar-thumb {
      background: #ccc;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #aaa;
    }

    &::-webkit-scrollbar-thumb:active {
      background: #666;
    }
  }
}
</style>
