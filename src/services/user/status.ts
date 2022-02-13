import axios from 'axios'
import { AuthRes, setUser } from '.'
import { apiWithJwt } from '../apiWithJwt'

const error: Record<string, string> = {}

type Status = () => Promise<
  | {
      data: Omit<AuthRes, 'token'>
      error?: never
    }
  | {
      data?: never
      error: string
    }
>

export const getStatus: Status = async () => {
  try {
    const res = await apiWithJwt.post<AuthRes>('/status')

    setUser(res.data.user)

    return {
      data: {
        user: res.data.user,
      },
    }
  } catch (e) {
    let err = 'unexpected error'

    if (axios.isAxiosError(e)) {
      const errTxt = error[(e.response?.data as { message: string }).message]

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
