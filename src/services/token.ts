export interface Token {
  access: string
  refresh: string
}

const TOKEN_KEY = 'token'

export const getToken = (): Token | undefined => {
  const tokenStr = localStorage.getItem(TOKEN_KEY)

  if (!tokenStr) {
    return undefined
  }

  const token = JSON.parse(tokenStr) as Token

  return token
}

export const setToken = (token: Token) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}
