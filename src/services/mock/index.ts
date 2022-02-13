import MockAdapter from 'axios-mock-adapter'
import { messages } from './chat'
import { mockGetMessages } from './chat/get-messages'
import { mockGetRandomMessage } from './chat/get-random-message'
import { mockSendMessage } from './chat/send-message'
import { users } from './user'
import { mockLogin } from './user/login'
import { mockLogout } from './user/logout'
import { mockRefresh } from './user/refreshToken'
import { mockRegister } from './user/register'
import { mockStatus } from './user/status'

export const mockApi = (mockApiAdapter: MockAdapter) => {
  mockRegister(mockApiAdapter, '/register', users)
  mockLogin(mockApiAdapter, '/login', users)
  mockLogout(mockApiAdapter, '/logout')
  mockRefresh(mockApiAdapter, '/refresh', users)
  mockGetRandomMessage(mockApiAdapter, '/messages/random')
}

export const mockApiWithJwt = (mockApiWithJwtAdapter: MockAdapter) => {
  mockStatus(mockApiWithJwtAdapter, '/status', users)
  mockGetMessages(mockApiWithJwtAdapter, '/messages', messages)
  mockSendMessage(mockApiWithJwtAdapter, '/messages', messages)
}
