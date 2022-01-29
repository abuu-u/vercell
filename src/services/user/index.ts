import { Token } from '../token'

interface User {
  name: string
}

export interface AuthRes {
  token: Token
  user: User
}

const USER_KEY = 'user'

export const getUser = (): User | undefined => {
  const userStr = localStorage.getItem(USER_KEY)

  if (!userStr) {
    return undefined
  }

  const user = JSON.parse(userStr) as User

  return user
}

export const setUser = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const removeUser = () => {
  localStorage.removeItem(USER_KEY)
}
