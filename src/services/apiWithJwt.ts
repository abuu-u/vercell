import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { COMMON_HEADERS } from '.'
import { api } from './api'
import { mockApiWithJwt } from './mock'
import { getToken, setToken, Token } from './token'

const apiWithJwt = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: COMMON_HEADERS,
})

apiWithJwt.interceptors.request.use((config) => {
  const token = getToken()

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!config.headers.Authorization) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    config.headers.Authorization = `Bearer ${token?.access || ''}`
  }

  return config
})

apiWithJwt.interceptors.response.use(
  (res) => {
    return res
  },
  async (error) => {
    const token = getToken()

    if (
      token &&
      axios.isAxiosError(error) &&
      error?.response?.status === 401 &&
      (error?.response?.data as { message?: string })?.message === 'JWT_EXPIRED'
    ) {
      const { data } = await api.post<{ token: Token }>('/refresh', {
        token: token.refresh,
      })

      setToken(data.token)

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      error.config.headers.Authorization = `Bearer ${data.token.access}`

      return apiWithJwt(error.config)
    }

    return Promise.reject(error)
  },
)

const mockAdapter = new MockAdapter(apiWithJwt)

mockApiWithJwt(mockAdapter)

export { apiWithJwt }
