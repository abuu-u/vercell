import { Message } from 'src/services/chat'

export interface MockMessages {
  [k: string]: Message[][]
}

const generateMessages = (id: number): Message[][] => {
  const emptyMessage: Message = {
    id: id * 100 - 1,
    src: 'https://wavesurfer-js.org/example/media/stereo.mp3',
    sizeInBytes: 0,
    sentTime: new Date(),
    type: 1,
  }

  const msgs = Array<Message>(Math.round(Math.random() * 100) + 1)
    .fill(emptyMessage)
    .map(
      ((acc) => () => {
        const msg: Message = {
          id: (acc.id += 1),
          src: 'https://wavesurfer-js.org/example/media/stereo.mp3',
          sizeInBytes:
            Math.round((Math.round(Math.random() * 100) / 10) * 1000000) +
            100000,
          sentTime: (acc.sentTime = new Date(
            acc.sentTime.getTime() -
              Math.round(Math.random() * 110000000) -
              60000,
          )),
          type: Math.round(Math.random() * 4),
        }

        return msg
      })(emptyMessage),
    )

  const chunks: Message[][] = []

  while (msgs.length > 0) {
    chunks.push(msgs.splice(0, 20))
  }

  return chunks
}

export const messages: MockMessages = {
  'Bearer user-1-token': generateMessages(1),
  'Bearer user-2-token': generateMessages(2),
  'Bearer user-3-token': generateMessages(3),
}
