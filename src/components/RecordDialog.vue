<template>
  <div ref="recordWrapperRef" class="record-wrapper">
    <div class="record">
      <div v-if="!audioBlob" class="record__mic-wrapper">
        <span class="record__wave" />

        <q-btn
          :icon="isRecording ? 'stop' : 'mic'"
          size="md"
          round
          color="primary"
          unelevated
          @click="onRecordClick"
        />
      </div>

      <div v-else class="record__player">
        <audio-player
          :id="-1"
          :active="false"
          :size="audioBlob.size"
          :src="audioSrc"
        />

        <q-btn icon="refresh" size="md" round flat @click="onReRecordClick" />
      </div>

      <div class="record__buttons">
        <q-btn
          color="primary"
          label="send"
          unelevated
          :disable="!isRecorded"
          @click="onSendClick"
        />

        <q-btn color="negative" label="cancel" outline @click="onCancelClick" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import AudioPlayer from './AudioPlayer.vue'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'send', blob: Blob): void
}>()

const isRecording = ref(false)
const isRecorded = ref(false)
const voiceWaveSize = ref(42)
const mediaStream = ref<MediaStream>()
const mediaRecorder = ref<MediaRecorder>()
const animationFrameRequestId = ref(-1)
const chunks = ref<Blob[]>([])
const audioBlob = ref<Blob>()
const audioSrc = computed(() =>
  audioBlob.value ? window.URL.createObjectURL(audioBlob.value) : '',
)

const recordWrapperRef = ref<HTMLDivElement>()

const stopRecording = () => {
  cancelAnimationFrame(animationFrameRequestId.value)
  if (mediaRecorder.value?.state !== 'inactive') {
    mediaRecorder.value?.stop()
  }
  mediaStream.value?.getTracks().forEach((track) => track.stop())
  isRecording.value = false
  voiceWaveSize.value = 42
}

const onRecordClick = async () => {
  if (isRecording.value) {
    stopRecording()

    isRecorded.value = true
  } else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })

      const mr = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=pcm',
      })

      mr.ondataavailable = (evt) => {
        chunks.value.push(evt.data)
      }

      mr.onstop = () => {
        audioBlob.value = new Blob(chunks.value, {
          type: 'audio/webm;codecs=pcm',
        })
      }

      const audioCtx = new window.AudioContext()
      const analyser = audioCtx.createAnalyser()
      const gainNode = audioCtx.createGain()

      const source = audioCtx.createMediaStreamSource(stream)
      source.connect(analyser)
      analyser.connect(gainNode)
      gainNode.connect(audioCtx.destination)

      gainNode.gain.value = 0

      mediaStream.value = stream
      mediaRecorder.value = mr

      analyser.fftSize = 32
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      mr.start()
      isRecording.value = true

      const updateButtonSize = () => {
        animationFrameRequestId.value = requestAnimationFrame(updateButtonSize)

        analyser.getByteTimeDomainData(dataArray)
        if (voiceWaveSize.value) {
          const vws =
            (Math.abs(dataArray[dataArray.length - 1] / 128 - 1) + 1) * 42 * 2 -
            42
          voiceWaveSize.value = vws > 55 ? 55 : vws
        }
      }

      updateButtonSize()
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, no-console
      console.log(`The following getUserMedia error occurred: ${err}`)

      stopRecording()
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('getUserMedia not supported on your browser!')
  }
}

const onSendClick = () => {
  stopRecording()

  if (audioBlob.value) {
    emit('send', audioBlob.value)
  }
}

const onCancelClick = () => {
  stopRecording()

  emit('close')
}

const onOutsideClick = (evt: MouseEvent) => {
  if (evt.target === recordWrapperRef.value) {
    emit('close')

    if (isRecording.value) {
      stopRecording()
    }
  }
}

const onReRecordClick = () => {
  isRecorded.value = false
  chunks.value = []
  audioBlob.value = undefined
}

onMounted(() => {
  window.addEventListener('click', onOutsideClick)
})

onUnmounted(() => {
  window.removeEventListener('click', onOutsideClick)
})
</script>

<style lang="scss">
@use 'sass:color';

.record-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2001;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;

  background: rgb(0 0 0 / 30%);
}

.record {
  position: relative;

  display: flex;

  flex-direction: column;

  width: 300px;
  padding: 10px;

  background: #eee;
  border-radius: 4px;

  &__mic-wrapper {
    position: relative;

    display: flex;

    align-items: center;
    justify-content: center;
  }

  &__wave {
    position: absolute;

    width: v-bind('`${voiceWaveSize}px`');

    height: v-bind('`${voiceWaveSize}px`');

    content: '';

    background: $primary;
    border-radius: 50%;

    transition: all 0.1s ease-out;
  }

  &__player {
    display: flex;

    gap: 10px;
  }

  &__buttons {
    display: grid;

    grid-template-columns: repeat(2, 1fr);

    gap: 10px;

    width: 100%;
    margin-top: 10px;
  }
}
</style>
