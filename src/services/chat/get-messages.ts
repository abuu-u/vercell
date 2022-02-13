import axios from 'axios'
import { Message, MessageRes } from '.'
import { apiWithJwt } from '../apiWithJwt'

interface GetMessagesRes {
  messages: MessageRes[]
}

const error: Record<string, string> = {}

type GetMessages = (pagination: number) => Promise<
  | {
      messages: Message[]
      error?: never
    }
  | {
      messages?: never
      error: string
    }
>

export const getMessages: GetMessages = async (pagination = 0) => {
  try {
    const { data } = await apiWithJwt.get<GetMessagesRes>('/messages', {
      params: {
        pagination,
      },
    })

    const messages = data.messages.map((it) => ({
      ...it,
      sentTime: new Date(it.sentTime),
    }))

    return {
      messages,
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
