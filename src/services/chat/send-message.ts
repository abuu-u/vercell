import axios from 'axios'
import { Message, MessageRes } from '.'
import { apiWithJwt } from '../apiWithJwt'

interface SendMessageRes {
  message: MessageRes
}

type SendMessages = (
  blob: Blob,
  id: number,
) => Promise<
  | {
      message: Message
      error?: never
    }
  | {
      message?: never
      error: string
    }
>

const error: Record<string, string> = {}

export const sendMessage: SendMessages = async (blob, id) => {
  try {
    const formData = new FormData()
    formData.append('message', blob)
    formData.append('id', `${id}`)

    const {
      data: { message },
    } = await apiWithJwt.post<SendMessageRes>('/messages', formData)

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
