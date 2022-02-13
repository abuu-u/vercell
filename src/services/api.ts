import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { COMMON_HEADERS } from '.'
import { mockApi } from './mock'

const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: COMMON_HEADERS,
})

const mockAdapter = new MockAdapter(api)

mockApi(mockAdapter)

export { api }
