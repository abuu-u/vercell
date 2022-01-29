import MockAdapter from 'axios-mock-adapter/types'
import { MockData } from '.'
import { LoginData } from '../user/login'

export const mockLogin = (
  mock: MockAdapter,
  url: string,
  mockData: MockData,
) => {
  mock.onPost(url).reply(async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const { email, password } = JSON.parse(config.data) as LoginData

    if (email && password) {
      const data = Object.entries(mockData).find(
        ([, value]) => value.email === email && value.password === password,
      )

      if (data) {
        return [
          200,
          {
            token: data[0].split(' ')[1],
            user: {
              name: data[1].name,
            },
          },
        ]
      }
    }

    return [
      400,
      {
        message: 'INVALID_DATA',
      },
    ]
  })
}
