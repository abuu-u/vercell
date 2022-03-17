import useChat from 'src/pinia/chat'
import { Audio, AudioRes } from '../chat'

export const onAudio = (audio: AudioRes) => {
  const chat = useChat()

  chat.addMessageToMessageGroups(new Audio(audio))
}
