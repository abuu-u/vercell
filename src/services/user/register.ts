import axios from 'axios'
import { AuthRes, setUser } from '.'
import { api } from '../api'
import { setToken } from '../token'

export const genders = ['male', 'female'] as const

export type Gender = typeof genders[number]

export interface RegData {
  name: string
  gender: Gender
  birthDate: string
  email: string
  number: number
  city: string
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
      data: Omit<AuthRes, 'token'>
      error?: never
    }
  | {
      data?: never
      error: string
    }
>

export const register: Register = async (data) => {
  try {
    const res = await api.post<AuthRes>('/register', data)

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
