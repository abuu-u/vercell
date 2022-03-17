import axios from 'axios'
import { Audio, AudioRes, SendCommonArgs } from '.'
import { apiWithJwt } from '../apiWithJwt'

type SendGreetingAudio = ({ audio }: SendCommonArgs) => Promise<
  | {
      message: Audio
      error?: never
    }
  | {
      message?: never
      error: string
    }
>

const error: Record<string, string> = {}

export const sendGreetingAudio: SendGreetingAudio = async ({ audio }) => {
  try {
    const formData = new FormData()
    formData.append('audio', audio, 'audio.ogg')

    const res = await apiWithJwt.post<AudioRes>('/audio/greeting', formData, {
      headers: {
        accept: 'application/json',
      },
    })

    return {
      message: new Audio(res.data),
    }
  } catch (e) {
    let err = 'unexpected error'

    if (axios.isAxiosError(e)) {
      const errTxt = error[e.message]

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
