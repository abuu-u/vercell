import MockAdapter from 'axios-mock-adapter/types'

export const mockLogout = (mock: MockAdapter, url: string) => {
  mock.onPost(url).reply(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return [200]
  })
}
