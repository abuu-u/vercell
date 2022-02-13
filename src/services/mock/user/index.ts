import { genders, RegData } from 'src/services/user/register'

export interface MockUsers {
  [k: string]: RegData & { isBusy: boolean }
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
    isBusy: Math.random() > 0.5,
  },
  'Bearer user-2-token': {
    name: 'user2',
    email: 'user2@mail.com',
    password: 'user123',
    gender: genders[1],
    birthDate: '2022/02/02',
    number: 12345678,
    city: 'city 2',
    isBusy: Math.random() > 0.5,
  },
  'Bearer user-3-token': {
    name: 'user3',
    email: 'user3@mail.com',
    password: 'user123',
    gender: genders[0],
    birthDate: '2022/02/02',
    number: 123456789,
    city: 'city 3',
    isBusy: Math.random() > 0.5,
  },
}
