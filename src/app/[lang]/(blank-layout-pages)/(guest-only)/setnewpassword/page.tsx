import SetNewPasswordComponent from '@/views/setnewpassword/SetNewPasswordComponent'
import { getServerMode } from '@core/utils/serverHelpers'

const SetNewPasswordPage = () => {
  const mode = getServerMode()

  return null

  return <SetNewPasswordComponent mode={mode} />
}

export default SetNewPasswordPage
