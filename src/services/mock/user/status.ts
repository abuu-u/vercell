import MockAdapter from 'axios-mock-adapter/types'
import { UserStatus } from 'src/services/user'
import { MockUsers } from '.'

export const mockStatus = (
  mock: MockAdapter,
  url: string,
  mockUsers: MockUsers,
) => {
  mock.onPost(url).reply(async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const { Authorization: accessToken } = config.headers as {
      Authorization: string
    }

    if (!mockUsers[accessToken]) {
      return [
        401,
        {
          message: 'UNAUTHORISED',
        },
      ]
    }

    if (Math.random() > 0.5) {
      return [
        401,
        {
          message: 'JWT_EXPIRED',
        },
      ]
    }

    return [
      200,
      {
        user: {
          status: Math.random() > 0.5 ? UserStatus.busy : UserStatus.free,
        },
      },
    ]
  })
}
