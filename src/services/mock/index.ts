import { AxiosInstance } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { genders, RegData } from '../user/register'
import { mockLogin } from './login'
import { mockLogout } from './logout'
import { mockRegister } from './register'

export interface MockData {
  [k: string]: RegData
}

export const mockApi = (api: AxiosInstance) => {
  const mock = new MockAdapter(api)

  const users: MockData = {
    'Bearer user-1-token': {
      name: 'user1',
      email: 'user1@mail.com',
      password: 'user123',
      gender: genders[0],
      birthDate: '2022/02/02',
      number: 1234567,
      city: 'city 1',
    },
    'Bearer user-2-token': {
      name: 'user2',
      email: 'user2@mail.com',
      password: 'user123',
      gender: genders[1],
      birthDate: '2022/02/02',
      number: 12345678,
      city: 'city 2',
    },
    'Bearer user-3-token': {
      name: 'user3',
      email: 'user3@mail.com',
      password: 'user123',
      gender: genders[0],
      birthDate: '2022/02/02',
      number: 123456789,
      city: 'city 3',
    },
  }

  mockRegister(mock, '/register', users)
  mockLogin(mock, '/login', users)
  mockLogout(mock, '/logout')
}
