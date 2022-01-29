import { removeUser } from '.'
import { api } from '../api'
import { getToken, removeToken } from '../token'

export const logout = async () => {
  try {
    const token = getToken()
    await api.post('/logout', JSON.stringify(token?.refresh))
  } finally {
    removeToken()

    removeUser()
  }
}
