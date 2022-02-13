import MockAdapter from 'axios-mock-adapter/types'
import { LoginData } from 'src/services/user/login'
import { MockUsers } from '.'

export const mockLogin = (
  mock: MockAdapter,
  url: string,
  mockUsers: MockUsers,
) => {
  mock.onPost(url).reply(async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const { email, password } = JSON.parse(config.data) as LoginData

    if (email && password) {
      const data = Object.entries(mockUsers).find(
        ([, value]) => value.email === email && value.password === password,
      )

      if (data) {
        return [
          200,
          {
            token: {
              access: data[0].split(' ')[1],
              refresh: data[0].split(' ')[1],
            },
            user: {
              status: data[1].status,
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
