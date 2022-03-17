export enum UserStatus {
  free,
  busy,
  unauthorised,
  blocked,
}

export type StatusRes = 'FREE' | 'RELATED' | 'BLOCKED'

export const statusResToStatus = (status: StatusRes): UserStatus => {
  let userStatus: UserStatus

  switch (status) {
    case 'BLOCKED':
      userStatus = UserStatus.blocked
      break

    case 'FREE':
      userStatus = UserStatus.free
      break

    case 'RELATED':
      userStatus = UserStatus.busy
      break

    default:
      userStatus = UserStatus.unauthorised
      break
  }

  return userStatus
}

export interface AuthRes {
  token: string
  refreshToken: string
  id: number
  username: string
  status: StatusRes
}

type UserRes = Pick<AuthRes, 'id' | 'username' | 'status'>

export class User {
  id: number

  username: string

  status: UserStatus

  constructor({ id, username, status }: UserRes) {
    this.id = id
    this.username = username
    this.status = statusResToStatus(status)
  }

  static fromJson(json: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Object.assign(
      new User({ id: 1, status: 'RELATED', username: '' }),
      JSON.parse(json),
    ) as User
  }
}

const USER_KEY = 'user'

export const getUser = (): User | undefined => {
  const userStr = localStorage.getItem(USER_KEY)

  if (!userStr) {
    return undefined
  }

  return User.fromJson(userStr)
}

export const setUser = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const removeUser = () => {
  localStorage.removeItem(USER_KEY)
}
