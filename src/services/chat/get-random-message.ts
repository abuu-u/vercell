import axios from 'axios'
import { Audio, AudioRes } from '.'
import { apiWithJwt } from '../apiWithJwt'

const error: Record<string, string> = {
  NOT_FOUND: 'Не осталось рандомых аудио, попробуйте позже.',
}

type GetRandomMessage = () => Promise<
  | {
      message: Audio
      error?: never
    }
  | {
      message?: never
      error: string
    }
>

export const getRandomMessage: GetRandomMessage = async () => {
  try {
    const res = await apiWithJwt.get<AudioRes>('/audio/random')

    return {
      message: new Audio(res.data),
    }
  } catch (e) {
    let err = 'unexpected error'

    if (axios.isAxiosError(e)) {
      const errTxt =
        e.response?.status === 404 ? error.NOT_FOUND : error[e.message]

      if (errTxt) {
        err = errTxt
      } else {
        err += `: ${e.message}`
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
