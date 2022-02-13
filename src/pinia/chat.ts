import { defineStore } from 'pinia'
import { Message } from 'src/services/chat'
import { getMessages } from 'src/services/chat/get-messages'
import { getRandomMessage } from 'src/services/chat/get-random-message'
import { sendMessage } from 'src/services/chat/send-message'

const CHUNK_SIZE = 20

export enum Status {
  idle,
  downloading,
  allDownloaded,
}

interface MessageGroup {
  date: string
  messages: Message[]
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
  messages: Message[],
  lastMessage?: Message,
): { messageGroup: MessageGroup[]; messagesToMerge: Message[] } => {
  const messageGroup: MessageGroup[] = []
  const dates: string[] = []
  const dictionary: { [date: string]: number } = {}
  let shouldMergeWithLastMessage = false
  const messagesToMerge: Message[] = []

  if (
    messages[0]?.sentTime.toLocaleDateString() ===
    lastMessage?.sentTime.toLocaleDateString()
  ) {
    shouldMergeWithLastMessage = true
  }

  messages.forEach((message) => {
    const date = `${
      MONTH[message.sentTime.getMonth()]
    } ${message.sentTime.getDate()}`

    const dateIndex =
      dictionary[date] ?? (dictionary[date] = dates.push(date) - 1)

    if (shouldMergeWithLastMessage && dateIndex === 0) {
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

    async getRandomMessage() {
      this.error = ''
      const res = await getRandomMessage()
      if (res.error) {
        this.error = res.error
      } else if (res.message) {
        const { messageGroup, messagesToMerge } = messagesToMessageGroups(
          [res.message],
          this.messageGroups[0]?.messages[0],
        )

        this.messageGroups[0]?.messages.unshift(...messagesToMerge)
        this.messageGroups.unshift(...messageGroup)
      }
    },

    async sendMessage(blob: Blob, id: number) {
      this.error = ''
      const res = await sendMessage(blob, id)
      if (res.error) {
        this.error = res.error
      } else if (res.message) {
        const { messageGroup, messagesToMerge } = messagesToMessageGroups(
          [res.message],
          this.messageGroups[0]?.messages[0],
        )

        this.messageGroups[0]?.messages.unshift(...messagesToMerge)
        this.messageGroups.unshift(...messageGroup)
      }
    },
  },
})

export default useChat
