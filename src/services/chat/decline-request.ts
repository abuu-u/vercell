import axios from 'axios'
import { AudioRes } from '.'
import { apiWithJwt } from '../apiWithJwt'

type DeclineRequest = ({ id }: { id: number }) => Promise<{
  error: string
} | void>

const error: Record<string, string> = {}

export const declineRequest: DeclineRequest = async ({ id }) => {
  try {
    await apiWithJwt.post<AudioRes>(
      '/user-relations/decline',
      {
        audioID: id,
      },
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )

    return void 0
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
