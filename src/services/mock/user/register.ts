import MockAdapter from 'axios-mock-adapter/types'
import { UserStatus } from 'src/services/user'
import { RegData } from 'src/services/user/register'
import { MockUsers } from '.'

export const mockRegister = (
  mock: MockAdapter,
  url: string,
  mockUsers: MockUsers,
) => {
  mock.onPost(url).reply(async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const { name, email, password, gender, birthDate, number, city } =
      JSON.parse(config.data) as RegData

    if (name && email && password && gender && birthDate && number && city) {
      if (Object.values(mockUsers).find((user) => user.email === email)) {
        return [
          400,
          {
            message: 'EMAIL_ALREADY_IN_USE',
          },
        ]
      }

      if (Object.values(mockUsers).find((user) => user.number === number)) {
        return [
          400,
          {
            message: 'NUMBER_ALREADY_IN_USE',
          },
        ]
      }

      return [
        200,
        {
          token: {
            access: 'user-4-token',
            refresh: 'user-4-token',
          },

          user: {
            status: Math.random() > 0.5 ? UserStatus.busy : UserStatus.free,
          },
        },
      ]
    }

    return [
      400,
      {
        message: 'INVALID_DATA',
      },
    ]
  })
}
