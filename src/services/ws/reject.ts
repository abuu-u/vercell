import useChat from 'src/pinia/chat'
import { AudioType } from '../chat'

export const onReject = (idsObj: { id: number }[]) => {
  const chat = useChat()

  const ids = idsObj.map((it) => it.id)

  chat.messageGroups.forEach((mg) => {
    mg.messages.forEach((m) => {
      if (ids.includes(m.id)) {
        m.type = AudioType.recivedRejected
      }
    })
  })
}
