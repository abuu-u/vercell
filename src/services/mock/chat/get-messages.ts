import MockAdapter from 'axios-mock-adapter/types'
import { MockMessages } from '.'

export const mockGetMessages = (
  mock: MockAdapter,
  url: string,
  mockMessages: MockMessages,
) => {
  mock.onGet(url).reply(async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const { pagination } = config.params as { pagination: number }
    const { Authorization: accessToken } = config.headers as {
      Authorization: string
    }

    const messages = mockMessages?.[accessToken]?.[pagination] ?? []

    return [
      200,
      {
        messages,
      },
    ]
  })
}
