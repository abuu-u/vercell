import axios from 'axios'
import { AuthRes, setUser, User } from '.'
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
      user: User
      error?: never
    }
  | {
      user?: never
      error: string
    }
>

export const login: Login = async (data) => {
  try {
    const res = await api.post<AuthRes>('/users/login', data, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const { token, ...userObj } = res.data
    const user = new User(userObj)

    setToken(token)
    setUser(user)

    return {
      user,
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
