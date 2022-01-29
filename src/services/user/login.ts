import axios from 'axios'
import { AuthRes, setUser } from '.'
import { api } from '../api'
import { setToken } from '../token'

export interface LoginData {
  email: string
  password: string
}

const error: Record<string, string> = {
  INVALID_DATA: 'Email or password is incorrect',
}

type Login = (data: LoginData) => Promise<
  | {
      data: Omit<AuthRes, 'token'>
      error?: never
    }
  | {
      data?: never
      error: string
    }
>

export const login: Login = async (data) => {
  try {
    const res = await api.post<AuthRes>('/login', data)

    setToken(res.data.token)
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
