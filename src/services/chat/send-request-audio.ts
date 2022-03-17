import axios from 'axios'
import { Audio, AudioRes, SendRequestArgs } from '.'
import { apiWithJwt } from '../apiWithJwt'

type SendRequestAudio = ({ audio, id }: SendRequestArgs) => Promise<
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
  FINISHED: 'Вы уже общались с этим пользователем.',
  IN_PROGRESS: 'Этот пользователь занят, попробуйте позже',
}

export const sendRequestAudio: SendRequestAudio = async ({ audio, id }) => {
  try {
    const formData = new FormData()
    formData.append('audio', audio, 'audio.ogg')
    formData.append('audioID', String(id))

    const res = await apiWithJwt.post<AudioRes>(
      '/user-relations/request',
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const errTxt = error[e.response?.data.message]

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
