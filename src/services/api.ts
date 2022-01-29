import axios from 'axios'
import { mockApi } from './mock'

const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

mockApi(api)

// api.interceptors.request.use((config) => {
//   //
// })

export { api }
