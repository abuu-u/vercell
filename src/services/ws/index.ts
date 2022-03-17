import { io } from 'socket.io-client'
import useUser from 'src/pinia/user'
import { getToken, removeToken } from '../token'
import { removeUser, UserStatus } from '../user'
import { onAudio } from './audio'
import { onReject } from './reject'
import { onStatus } from './status'

const initWs = () => {
  const token = getToken()

  if (token) {
    const socket = io(process.env.API_BASE_URL ?? '', {
      transports: ['websocket'],
      auth: {
        token: `Bearer ${token || ''}`,
      },
    })

    socket.on('audio', onAudio)

    socket.on('status', onStatus)

    socket.on('reject', onReject)

    socket.on('invalid-token', () => {
      const user = useUser()

      user.status = UserStatus.unauthorised
      removeToken()
      removeUser()
    })
  }
}

export default initWs
