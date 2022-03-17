import axios from 'axios'
import { Audio, AudioRes, SendRequestArgs } from '.'
import { apiWithJwt } from '../apiWithJwt'

type SendAcceptAudio = ({ audio, id }: SendRequestArgs) => Promise<
  | {
      message: Audio
      error?: never
    }
  | {
      message?: never
      error: string
    }
>

const error: Record<string, string> = {
  ALREADY_RELATED: 'Данный пользователь уже общается с другим человеком.',
}

export const sendAcceptAudio: SendAcceptAudio = async ({ audio, id }) => {
  try {
    const formData = new FormData()
    formData.append('audio', audio, 'audio.ogg')
    formData.append('audioID', String(id))

    const res = await apiWithJwt.post<AudioRes>(
      '/user-relations/relate',
      formData,
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )

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
