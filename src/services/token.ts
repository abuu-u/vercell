const TOKEN_KEY = 'token'

export const getToken = (): string | undefined => {
  const token = localStorage.getItem(TOKEN_KEY)

  if (!token) {
    return undefined
  }

  return token
}

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}
