import { defineStore } from 'pinia'
import { getUser, UserStatus } from 'src/services/user'
import { login, LoginData } from 'src/services/user/login'
import { logout } from 'src/services/user/logout'
import { RegData, register } from 'src/services/user/register'
import { getStatus } from 'src/services/user/status'

interface User {
  status: UserStatus
  error: string
}

const useUser = defineStore({
  id: 'user-module',
  state(): User {
    return {
      status: getUser()?.status ?? UserStatus.unauthorised,
      error: '',
    }
  },

  actions: {
    async register(data: RegData) {
      this.error = ''

      const res = await register(data)

      if (res.error) {
        this.error = res.error
      } else {
        this.status = res.data?.user.status ?? UserStatus.unauthorised
        await this.$router.push('/link-telegram')
      }
    },

    async login(data: LoginData) {
      this.error = ''

      const res = await login(data)

      if (res.error) {
        this.error = res.error
      } else {
        this.status = res.data?.user.status ?? UserStatus.unauthorised
        await this.$router.push('/')
      }
    },

    async logout() {
      this.status = UserStatus.unauthorised
      await logout()
    },

    async getStatus() {
      const res = await getStatus()

      if (res.error) {
        //
      } else {
        this.status = res.data?.user.status ?? UserStatus.unauthorised
      }
    },
  },
})

export default useUser
