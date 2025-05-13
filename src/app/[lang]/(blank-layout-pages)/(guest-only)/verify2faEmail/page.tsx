import Verify2faEmailComponent from '@/views/verify2fa/email/Verify2faEmailComponent'
import { getServerMode } from '@core/utils/serverHelpers'

const Verify2faEmailPage = () => {
  const mode = getServerMode()

  return <Verify2faEmailComponent mode={mode} />
}

export default Verify2faEmailPage
