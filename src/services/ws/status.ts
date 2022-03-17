import useUser from 'src/pinia/user'
import { StatusRes, statusResToStatus } from '../user'

export const onStatus = (status: StatusRes) => {
  const user = useUser()

  user.setStatus(statusResToStatus(status))
}
