import axios from 'axios'
import { Message, MessageRes } from '.'
import { api } from '../api'

interface GetRandomMessageRes {
  message: MessageRes
}

const error: Record<string, string> = {}

type GetRandomMessage = () => Promise<
  | {
      message: Message
      error?: never
    }
  | {
      message?: never
      error: string
    }
>

export const getRandomMessage: GetRandomMessage = async () => {
  try {
    const {
      data: { message },
    } = await api.get<GetRandomMessageRes>('/messages/random')

    return {
      message: {
        ...message,
        sentTime: new Date(message.sentTime),
      },
    }
  } catch (e) {
    let err = 'unexpected error'

    if (axios.isAxiosError(e)) {
      const errTxt = error[(e.response?.data as { message: string })?.message]

      if (errTxt) {
        err = errTxt
      }
    } else {
      // eslint-disable-next-line no-console
      console.log(e)
    }

    return {
      error: err,
    }
  }
}
