import { defineStore } from 'pinia'
import { getUser } from 'src/services/user'
import { login, LoginData } from 'src/services/user/login'
import { logout } from 'src/services/user/logout'
import { RegData, register } from 'src/services/user/register'
import { getStatus } from 'src/services/user/status'

interface User {
  isBusy: boolean
  error: string
}

const useUser = defineStore({
  id: 'user-module',
  state(): User {
    return {
      isBusy: getUser()?.isBusy ?? false,
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
        this.isBusy = res.data?.user.isBusy ?? false
        await this.$router.push('/link-telegram')
      }
    },

    async login(data: LoginData) {
      this.error = ''

      const res = await login(data)

      if (res.error) {
        this.error = res.error
      } else {
        this.isBusy = res.data?.user.isBusy ?? false
        await this.$router.push('/')
      }
    },

    async logout() {
      this.isBusy = false
      await logout()
    },

    async getStatus() {
      const res = await getStatus()

      if (res.error) {
        //
      } else {
        this.isBusy = res.data?.user.isBusy ?? false
      }
    },
  },
})

export default useUser
