import MockAdapter from 'axios-mock-adapter/types'
import { MessageType } from 'src/services/chat'

export const mockGetRandomMessage = (mock: MockAdapter, url: string) => {
  mock.onGet(url).reply(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return [
      200,
      {
        message: {
          id: Math.round(Math.random() * 1000) + 5000,
          src: 'https://wavesurfer-js.org/example/media/stereo.mp3',
          sizeInBytes:
            Math.round((Math.round(Math.random() * 100) / 10) * 1000000) +
            100000,
          sentTime: new Date(),
          type: MessageType.recivedGlobal,
        },
      },
    ]
  })
}
