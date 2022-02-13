<template>
  <div class="audio">
    <q-btn
      :icon="isPlaying ? 'pause' : 'play_arrow'"
      class="q-mr-md"
      unelevated
      round
      color="primary"
      size="md"
      @click="onPlayClick"
    />
    <div class="audio__player-wrapper">
      <div ref="playerRef" class="audio__player" @mousedown="onPlayerMouseDown">
        <audio
          ref="audioRef"
          :src="src"
          preload="metadata"
          @loadedmetadata="onLoadedmetadata"
          @timeupdate="onTimeUpdate"
          @ended="onAudioEnded"
          @play="onAudioPlay"
        />

        <div
          class="audio__progress"
          :style="{ width: `${progressPercentage}%` }"
        />

        <button
          v-if="isActive"
          class="audio__slider"
          :style="{ left: `${progressPercentage}%` }"
        />
      </div>

      <div class="audio__details">
        <span v-if="isActive">{{ progressText }} /&nbsp;</span>

        <span> {{ durationText }}</span>

        <span v-if="!isActive">,&nbsp;{{ sizeInMb }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { decimalRound, secondsTommss } from 'src/utils'
import { ref, defineExpose } from 'vue'

const props = defineProps<{
  id: number
  src: string
  size: number
}>()

const emit = defineEmits<{
  (e: 'ended'): void
  (e: 'started'): void
}>()

const sizeInMb = `${decimalRound(props.size / 1024 / 1024, -1)} MB`

const isPlaying = ref(false)
const durationText = ref('00:00')
const progressText = ref('00:00')
const progressPercentage = ref(0)
const isActive = ref(false)

const audioRef = ref<HTMLAudioElement>()
const playerRef = ref<HTMLElement>()

const stop = () => {
  if (audioRef.value) {
    isActive.value = false
    isPlaying.value = false
    audioRef.value.pause()
    audioRef.value.currentTime = 0
  }
}

defineExpose({
  stop,
})

const setPlayerProgress = (mouseX: number) => {
  if (playerRef.value && audioRef.value) {
    const playerWidth = playerRef.value.offsetWidth
    const mouseRelativeToPlayer =
      mouseX - playerRef.value.getBoundingClientRect().x
    const mouseRelativeToPlayerInside =
      mouseRelativeToPlayer < 0
        ? 0
        : mouseRelativeToPlayer > playerWidth
        ? playerWidth
        : mouseRelativeToPlayer

    void audioRef.value.pause()

    audioRef.value.currentTime = Math.round(
      (mouseRelativeToPlayerInside / playerWidth) * audioRef.value.duration,
    )
  }
}

const onPlayClick = () => {
  if (isPlaying.value) {
    audioRef.value?.pause()
  } else {
    audioRef.value?.play()
  }

  isPlaying.value = !isPlaying.value
}

const onWindowMouseMove = (evt: MouseEvent) => {
  setPlayerProgress(evt.clientX)
}

const onWindowMouseUp = (evt: MouseEvent) => {
  window.removeEventListener('mousemove', onWindowMouseMove)
  window.removeEventListener('mouseup', onWindowMouseUp)

  setPlayerProgress(evt.clientX)

  audioRef.value?.play()
  isPlaying.value = true
}

const onPlayerMouseDown = (evt: MouseEvent) => {
  if (evt.button === 0) {
    window.addEventListener('mousemove', onWindowMouseMove)
    window.addEventListener('mouseup', onWindowMouseUp)
  }
}

const onLoadedmetadata = () => {
  if (audioRef.value) {
    durationText.value = secondsTommss(Math.floor(audioRef.value.duration))
  }
}

const onTimeUpdate = () => {
  if (audioRef.value) {
    progressText.value = secondsTommss(Math.floor(audioRef.value.currentTime))

    progressPercentage.value = Math.floor(
      (audioRef.value.currentTime / audioRef.value.duration) * 100,
    )
  }
}

const onAudioPlay = () => {
  if (!isActive.value) {
    emit('started')
    isActive.value = true
  }
}

const onAudioEnded = () => {
  isPlaying.value = false
  isActive.value = false
  emit('ended')
}
</script>

<style lang="scss">
.audio {
  display: flex;

  flex-grow: 1;

  &__player-wrapper {
    display: flex;

    flex-direction: column;
    flex-grow: 1;

    justify-content: flex-end;

    height: 100%;
  }

  &__player {
    position: relative;

    display: flex;

    flex-direction: column;

    justify-content: center;

    height: 4px;
    padding: 10px 0;

    cursor: pointer;

    &::after {
      position: absolute;
      left: 0;

      width: 100%;
      height: 4px;

      content: '';

      background: $player-color;
      border-radius: 4px;
    }
  }

  &__progress {
    z-index: 1;

    flex-shrink: 0;

    height: 4px;

    background: $proggres-color;

    border-radius: 4px;
  }

  &__slider {
    position: absolute;
    z-index: 2;

    flex-grow: 0;
    flex-shrink: 0;

    width: 10px;
    height: 10px;
    padding: 0;
    margin-left: -5px;

    pointer-events: none;

    cursor: pointer;

    background: $slider-color;
    border: none;
    border-radius: 50%;
  }

  &__details {
    display: flex;
  }
}
</style>
