import Verify2faComponent from '@/views/verify2fa/Verify2faComponent'
import { getServerMode } from '@core/utils/serverHelpers'

const Verify2faGooglePage = () => {
  const mode = getServerMode()

  return <Verify2faComponent mode={mode} />
}

export default Verify2faGooglePage
