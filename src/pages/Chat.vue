<template>
  <q-page class="messages-wrapper column items-center">
    <div
      ref="scrollArea"
      class="scroll-area container column reverse no-wrap"
      @scroll="onScroll"
    >
      <div class="messages column reverse q-pa-sm">
        <template
          v-for="(messageGroup, i) in messageGroups"
          :key="messageGroup.date"
        >
          <custom-message
            v-for="(message, j) in messageGroup.messages"
            :id="message.id"
            :key="message.id"
            :type="message.type"
            :sent-time="message.sentTime"
            @like="onLike"
            @dislike="onDislke"
          >
            <audio-player
              :id="message.id"
              :ref="setAudioRef(`${i}-${j}`)"
              :size="message.sizeInBytes"
              :src="message.src"
              @ended="onAudioEnded"
              @started="onAudioStarted(`${i}-${j}`)"
            />
          </custom-message>

          <p class="date self-center q-ma-none bg-blue-grey-1 q-pa-xs">
            {{ messageGroup.date }}
          </p>
        </template>

        <template v-if="chat.status === Status.allDownloaded">
          <p>Попробуй записать своё сообщение!</p>

          <p>
            Ты можешь записать сколько угодно голосовых сообщений (чем больше
            голосовых сообщений с интересными темами, тем выше шансы, что тебя
            заметят).
          </p>

          <p>
            <span class="flex text-bold">
              Чем мы отличаемся от других, и за что нас любят?
            </span>
            В отличие от тиндеров, баду, мамб и прочих сервисов для одноразового
            общения, мы за НАСТОЯЩИЕ (или какое-то другое слово) знакомства.
            Пока ты общаешься с кем-либо, то вам двоим присваивается статус
            “занят/занята”. Соответственно, вы оба не сможете знакомиться с
            другими, пока общаетесь друг с другом. А другие, разумеется, не
            смогут установить с тобой контакт. (В будущем добавим выбор пола
            автора, и желаемый пол получаемых голосовых сообщений).
          </p>

          <p>
            <span class="flex text-bold">Как это работает?</span>
            Ты записываешь голосовое сообщение в бот, которое может прослушать
            случайный человек. Если ему понравится твой голос, тембр, тон,
            записанная информация или всё сразу, то мы тебе сразу это сообщим.
            Вы сможете общаться напрямую.
          </p>

          <p>
            Привет! Добро пожаловать в бот для знакомств AnyVoice. Здесь ты
            можешь найти друга, подругу, и вполне возможно свою вторую
            половинку.
          </p>
        </template>
      </div>
    </div>

    <q-separator class="container" color="grey-5" />

    <q-input v-model="textRef" class="container" borderless hide-bottom-space>
      <template #prepend>
        <q-btn
          v-if="status !== UserStatus.busy"
          icon="shuffle"
          flat
          round
          @click="onDislke"
        />

        <q-btn v-else icon="close" flat round @click="onStopConversation" />
      </template>

      <template #append>
        <q-btn
          icon="mic"
          flat
          round
          :disable="status === UserStatus.unauthorised"
          @click="onRecordClick"
        />
      </template>
    </q-input>
  </q-page>

  <record-dialog
    v-if="isRecordShow"
    @send="onSend"
    @close="isRecordShow = false"
  />
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import CustomMessage from 'src/components/CustomMessage.vue'
import { Loading, useQuasar } from 'quasar'
import useChat, { Status } from 'src/pinia/chat'
import { storeToRefs } from 'pinia'
import RecordDialog from 'src/components/RecordDialog.vue'
import AudioPlayer from 'src/components/AudioPlayer.vue'
import useUser from 'src/pinia/user'
import { UserStatus } from 'src/services/user'

const textRef = ref('')
const isRecordShow = ref(false)
const likeId = ref(-1)
const activeIndex = ref('')

const scrollArea = ref<HTMLElement>()
const audioRefs = ref<{ [k: string]: InstanceType<typeof AudioPlayer> }>({})
const setAudioRef = (index: string) => (el: unknown) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  audioRefs.value[index] = el as InstanceType<typeof AudioPlayer>
}

const chat = useChat()
const $q = useQuasar()
const user = useUser()

const { messageGroups } = storeToRefs(chat)
const { status } = storeToRefs(user)

watchEffect(() => {
  if (chat.pagination === 0) {
    void chat.getInitialMessages()
  }
})

const onScroll = async () => {
  if (
    scrollArea.value &&
    scrollArea.value.scrollHeight -
      scrollArea.value.offsetHeight -
      Math.abs(scrollArea.value.scrollTop) <
      250 &&
    chat.status === Status.idle
  ) {
    await chat.getMessages()
  }
}

const onRecordClick = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  audioRefs.value[activeIndex.value]?.stop()
  isRecordShow.value = true
  activeIndex.value = ''
}

const onLike = (id: number) => {
  likeId.value = id

  $q.notify({
    color: 'secondary',
    classes: 'like-notification',
    multiLine: true,
    actions: [
      {
        label: 'Записать ответ',
        color: 'yellow',
        icon: 'mic',
        handler: onRecordClick,
      },
      {
        label: 'Отказатся',
        color: 'white',
        icon: 'cancel',
      },
    ],
    message:
      'Здорово, что тебе понравилась это сообщение! Запиши что-то в ответ, чтобы пользователь на другом конце провода смог услышать тебя. В случае взаимности, вы сможете общаться напрямую.',
  })
}

const onDislke = async () => {
  await chat.getRandomMessage()
}

const onStopConversation = () => {
  // TODO
  user.status = UserStatus.free
}

const onSend = async (blob: Blob) => {
  Loading.show()

  await chat.sendMessage(blob, likeId.value)

  if (!chat.error) {
    isRecordShow.value = false
    likeId.value = -1
  }

  Loading.hide()
}

const onAudioEnded = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  audioRefs.value[activeIndex.value]?.stop()
  activeIndex.value = ''
}

const onAudioStarted = (index: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  audioRefs.value[activeIndex.value]?.stop()
  activeIndex.value = index
}
</script>

<style lang="scss">
.messages-wrapper {
  height: calc(100vh - 50px);
}

.container {
  width: 600px;
}

.scroll-area {
  height: calc(100% - 56px - 1px);
  overflow: auto;
}

.date {
  border-radius: 5px;
}

.messages {
  row-gap: 10px;
}

.like-notification {
  width: 500px;
}
</style>
