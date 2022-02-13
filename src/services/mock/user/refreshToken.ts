import MockAdapter from 'axios-mock-adapter/types'
import { MockUsers } from '.'

export const mockRefresh = (
  mock: MockAdapter,
  url: string,
  mockUsers: MockUsers,
) => {
  mock.onPost(url).reply(async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const { token } = JSON.parse(config.data) as { token: string }

    if (mockUsers[`Bearer ${token}`]) {
      return [
        200,
        {
          token: {
            access: token,
            refresh: token,
          },
        },
      ]
    }

    return [
      401,
      {
        message: 'UNAUTHORISED',
      },
    ]
  })
}
