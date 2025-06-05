// Third-party Imports
import styled from '@emotion/styled'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Util Imports
import { commonLayoutClasses } from '@layouts/utils/layoutClasses'

type StyledMainProps = {
  isContentCompact: boolean
  pathname: string
}

const StyledMain = styled.main<StyledMainProps>`
  padding: ${({ pathname }) => (pathname.includes('/admin/workflow') ? '0px' : `${themeConfig.layoutPadding}px`)};

  ${({ isContentCompact, pathname }) =>
    isContentCompact &&
    `
    margin-inline: auto;
    max-inline-size: ${pathname.includes('/admin/workflow') ? '1920px' : themeConfig.compactContentWidth + 'px'};
  `}

  &:has(.${commonLayoutClasses.contentHeightFixed}) {
    display: flex;
    overflow: hidden;
  }
`

export default StyledMain
