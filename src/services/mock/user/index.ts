import { UserStatus } from 'src/services/user'
import { genders, RegData } from 'src/services/user/register'

export interface MockUsers {
  [k: string]: RegData & { status: UserStatus }
}

export const users: MockUsers = {
  'Bearer user-1-token': {
    name: 'user1',
    email: 'user1@mail.com',
    password: 'user123',
    gender: genders[0],
    birthDate: '2022/02/02',
    number: 1234567,
    city: 'city 1',
    status: Math.random() > 0.5 ? UserStatus.busy : UserStatus.free,
  },

  'Bearer user-2-token': {
    name: 'user2',
    email: 'user2@mail.com',
    password: 'user123',
    gender: genders[1],
    birthDate: '2022/02/02',
    number: 12345678,
    city: 'city 2',
    status: Math.random() > 0.5 ? UserStatus.busy : UserStatus.free,
  },

  'Bearer user-3-token': {
    name: 'user3',
    email: 'user3@mail.com',
    password: 'user123',
    gender: genders[0],
    birthDate: '2022/02/02',
    number: 123456789,
    city: 'city 3',
    status: Math.random() > 0.5 ? UserStatus.busy : UserStatus.free,
  },
}
