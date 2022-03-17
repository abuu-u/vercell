import axios from 'axios'
import { apiWithJwt } from '../apiWithJwt'

const error: Record<string, string> = {
  INVALID_DATA: 'Email or password is incorrect',
}

type FinishCovnersation = () => Promise<{
  error: string
} | void>

export const finishCovnersation: FinishCovnersation = async () => {
  try {
    await apiWithJwt.post(
      '/user-relations/finish',
      {},
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
