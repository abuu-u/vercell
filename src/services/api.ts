import axios from 'axios'
import { COMMON_HEADERS } from '.'

const api = axios.create({
  baseURL: `${process.env.API_BASE_URL ?? '/'}/api`,
  headers: COMMON_HEADERS,
})

export { api }
