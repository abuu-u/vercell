import MockAdapter from 'axios-mock-adapter/types'
import useUser from 'src/pinia/user'
import { MessageType } from 'src/services/chat'
import { MockMessages } from '.'

export const mockSendMessage = (
  mock: MockAdapter,
  url: string,
  mockMessages: MockMessages,
) => {
  mock.onPost(url).reply(async (config) => {
    const { isBusy } = useUser()

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const { Authorization: accessToken } = config.headers as {
      Authorization: string
    }

    const { data } = config as { data: FormData }

    const user = mockMessages[accessToken]

    if (!user) {
      return [
        401,
        {
          message: 'UNAUTHORISED',
        },
      ]
    }

    const messageBlob = data.get('message') as Blob
    const id = data.get('id') as string
    const messageUrl = window.URL.createObjectURL(messageBlob)

    return [
      200,
      {
        message: {
          id: Math.round(Math.random() * 1000) + 500,
          src: messageUrl,
          sizeInBytes: messageBlob.size,
          sentTime: new Date(),
          type:
            id === '-1' && !isBusy
              ? MessageType.sentGlobal
              : MessageType.sentPersonal,
        },
      },
    ]
  })
}
