import { defineStore } from 'pinia'
import {
  Audio,
  AudioType,
  SendCommonArgs,
  SendRequestArgs,
} from 'src/services/chat'
import { declineRequest } from 'src/services/chat/decline-request'
import { CHUNK_SIZE, getMessages } from 'src/services/chat/get-messages'
import { getRandomMessage } from 'src/services/chat/get-random-message'
import { sendAcceptAudio } from 'src/services/chat/send-accept-audio'
import { sendGreetingAudio } from 'src/services/chat/send-greeting-audio'
import { sendRegularAudio } from 'src/services/chat/send-regular-audio'
import { sendRequestAudio } from 'src/services/chat/send-request-audio'

export enum Status {
  idle,
  downloading,
  allDownloaded,
}

interface MessageGroup {
  date: string
  messages: Audio[]
}

interface Chat {
  messageGroups: MessageGroup[]
  pagination: number
  status: Status
  error: string
}

const MONTH = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const messagesToMessageGroups = (
  messages: Audio[],
  firstMessage?: Audio,
): { messageGroup: MessageGroup[]; messagesToMerge: Audio[] } => {
  const messageGroup: MessageGroup[] = []
  const dates: string[] = []
  const dictionary: { [date: string]: number } = {}
  let shouldMergeWithFirstMessage = false
  const messagesToMerge: Audio[] = []

  if (
    messages[0]?.sentTime.toLocaleDateString() ===
    firstMessage?.sentTime.toLocaleDateString()
  ) {
    shouldMergeWithFirstMessage = true
  }

  messages.forEach((message) => {
    const date = `${
      MONTH[message.sentTime.getMonth()]
    } ${message.sentTime.getDate()}`

    const dateIndex =
      dictionary[date] ?? (dictionary[date] = dates.push(date) - 1)

    if (shouldMergeWithFirstMessage && dateIndex === 0) {
      messagesToMerge.push(message)
    } else if (messageGroup[dateIndex]?.date) {
      messageGroup[dateIndex].messages.push(message)
    } else {
      messageGroup[dateIndex] = {
        date,
        messages: [message],
      }
    }
  })

  if (messagesToMerge.length) {
    messageGroup.splice(0, 1)
  }

  return {
    messageGroup,
    messagesToMerge,
  }
}

const useChat = defineStore({
  id: 'chat-module',
  state(): Chat {
    return {
      messageGroups: [],
      pagination: 0,
      status: Status.idle,
      error: '',
    }
  },

  actions: {
    async getMessages() {
      this.error = ''
      this.status = Status.downloading
      const res = await getMessages(this.pagination)
      this.status = Status.idle
      this.pagination += 1

      if (res.error) {
        this.error = res.error
      } else if (res.messages) {
        if (res.messages.length < CHUNK_SIZE) {
          this.status = Status.allDownloaded
        }

        const messageGroupsLastIndex = this.messageGroups.length - 1

        const { messageGroup, messagesToMerge } = messagesToMessageGroups(
          res.messages,
          this.messageGroups[messageGroupsLastIndex]?.messages[0],
        )

        this.messageGroups[messageGroupsLastIndex]?.messages.push(
          ...messagesToMerge,
        )
        this.messageGroups.push(...messageGroup)
      }
    },

    async getInitialMessages() {
      if (!this.pagination) {
        await this.getMessages()
      }
    },

    addMessageToMessageGroups(message: Audio) {
      const { messageGroup, messagesToMerge } = messagesToMessageGroups(
        [message],
        this.messageGroups[0]?.messages[0],
      )

      this.messageGroups[0]?.messages.unshift(...messagesToMerge)
      this.messageGroups.unshift(...messageGroup)
    },

    async getRandomMessage() {
      this.error = ''
      const res = await getRandomMessage()
      if (res.error) {
        this.error = res.error
      } else if (res.message) {
        this.addMessageToMessageGroups(res.message)
      }
    },

    async sendGreetingAudio(data: SendCommonArgs) {
      this.error = ''

      const res = await sendGreetingAudio(data)

      if (res.error) {
        this.error = res.error
      } else if (res.message) {
        this.addMessageToMessageGroups(res.message)
      }
    },

    async sendRegularAudio(data: SendCommonArgs) {
      this.error = ''

      const res = await sendRegularAudio(data)

      if (res.error) {
        this.error = res.error
      } else if (res.message) {
        this.addMessageToMessageGroups(res.message)
      }
    },

    async sendRequestAudio(data: SendRequestArgs) {
      this.error = ''

      const res = await sendRequestAudio(data)

      if (res.error) {
        this.error = res.error
      } else if (res.message) {
        this.addMessageToMessageGroups(res.message)
      }
    },

    async sendAcceptAudio(data: SendRequestArgs) {
      this.error = ''

      const res = await sendAcceptAudio(data)

      if (res.error) {
        this.error = res.error
      } else if (res.message) {
        this.addMessageToMessageGroups(res.message)
      }
    },

    async declineRequest(id: number) {
      this.error = ''

      const res = await declineRequest({ id })

      if (res !== void 0) {
        this.error = res.error
      } else {
        this.messageGroups.forEach((mg) => {
          const msg = mg.messages.find((m) => m.id === id)

          if (msg) {
            msg.type = AudioType.recivedRejectedRequest
          }
        })
      }
    },
  },
})

export default useChat
