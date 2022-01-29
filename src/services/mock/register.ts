import MockAdapter from 'axios-mock-adapter/types'
import { MockData } from '.'
import { RegData } from '../user/register'

export const mockRegister = (
  mock: MockAdapter,
  url: string,
  mockData: MockData,
) => {
  mock.onPost(url).reply(async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const { name, email, password, gender, birthDate, number, city } =
      JSON.parse(config.data) as RegData

    if (name && email && password && gender && birthDate && number && city) {
      if (Object.values(mockData).find((user) => user.email === email)) {
        return [
          400,
          {
            message: 'EMAIL_ALREADY_IN_USE',
          },
        ]
      }

      if (Object.values(mockData).find((user) => user.number === number)) {
        return [
          400,
          {
            message: 'NUMBER_ALREADY_IN_USE',
          },
        ]
      }

      return [
        200,
        {
          token: 'user-4-token',

          user: {
            name,
          },
        },
      ]
    }

    return [
      400,
      {
        message: 'INVALID_DATA',
      },
    ]
  })
}
