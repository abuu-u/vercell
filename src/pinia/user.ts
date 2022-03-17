import { defineStore } from 'pinia'
import { getUser, UserStatus } from 'src/services/user'
import { finishCovnersation } from 'src/services/user/finish-conversation'
import { login, LoginData } from 'src/services/user/login'
import { logout } from 'src/services/user/logout'
import { RegData, register } from 'src/services/user/register'

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
      } else if (res.user) {
        this.status = res.user.status
        window.location.href = '/chat'
        // await this.$router.push('/link-telegram')
      }
    },

    async login(data: LoginData) {
      this.error = ''

      const res = await login(data)

      if (res.error) {
        this.error = res.error
      } else if (res.user) {
        this.status = res.user.status
        window.location.href = '/chat'
        // await this.$router.push('/')
      }
    },

    async logout() {
      try {
        this.status = UserStatus.unauthorised
        await logout()
        window.location.reload()
      } catch {
        window.location.reload()
      }
    },

    setStatus(staus: UserStatus) {
      this.status = staus
    },

    async finishCovnersation() {
      this.error = ''

      const res = await finishCovnersation()

      if (res !== void 0) {
        this.error = res.error
      }
    },
  },
})

export default useUser
