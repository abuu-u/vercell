import axios from 'axios'
import { Audio, AudioRes } from '.'
import { apiWithJwt } from '../apiWithJwt'

export const CHUNK_SIZE = 10

const error: Record<string, string> = {}

type GetMessages = (pagination: number) => Promise<
  | {
      messages: Audio[]
      error?: never
    }
  | {
      messages?: never
      error: string
    }
>

export const getMessages: GetMessages = async (pagination) => {
  try {
    const res = await apiWithJwt.get<AudioRes[]>('/audio', {
      params: {
        count: CHUNK_SIZE,
        offset: pagination,
      },
    })

    return {
      messages: Audio.fromArray(res.data),
    }
  } catch (e) {
    let err = 'unexpected error'

    if (axios.isAxiosError(e)) {
      const errTxt = error[e.message]

      if (e.response?.status === 401) {
        return { messages: [] }
      }

      if (errTxt) {
        err = errTxt
      } else {
        err += `: ${e.message}`
      }
    }

    // eslint-disable-next-line no-console
    console.log(e)

    return {
      error: err,
    }
  }
}
