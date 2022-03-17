import axios from 'axios'
import { AuthRes, setUser, User } from '.'
import { api } from '../api'
import { setToken } from '../token'

export const genders = ['male', 'female'] as const

export type Gender = typeof genders[number]

export interface RegData {
  username: string
  email: string
  password: string
}

const error: Record<string, string> = {
  EMAIL_ALREADY_IN_USE:
    'User with this email already exists, use another email',
  NUMBER_ALREADY_IN_USE:
    'User with this number already exists, use another number',
  INVALID_DATA: 'You entered invalid data or some fields are empty',
}

type Register = (data: RegData) => Promise<
  | {
      user: User
      error?: never
    }
  | {
      user?: never
      error: string
    }
>

export const register: Register = async (data) => {
  try {
    const res = await api.post<AuthRes>('/users/registration', data, {
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
