import { defineStore } from 'pinia'
import { Loading } from 'quasar'
import { getUser } from 'src/services/user'
import { login, LoginData } from 'src/services/user/login'
import { logout } from 'src/services/user/logout'
import { RegData, register } from 'src/services/user/register'

interface User {
  name: string
  error: string
}

const useUser = defineStore({
  id: 'user-module',
  state(): User {
    return {
      name: getUser()?.name || '',
      error: '',
    }
  },

  actions: {
    async register(data: RegData) {
      this.error = ''
      Loading.show()

      const res = await register(data)
      Loading.hide()

      if (res.error) {
        this.error = res.error
      } else {
        this.name = res.data?.user.name || ''
        await this.$router.push('/link-telegram')
      }
    },

    async login(data: LoginData) {
      this.error = ''
      Loading.show()

      const res = await login(data)
      Loading.hide()

      if (res.error) {
        this.error = res.error
      } else {
        this.name = res.data?.user.name || ''
        await this.$router.push('/')
      }
    },

    async logout() {
      this.name = ''
      await logout()
    },
  },
})

export default useUser
