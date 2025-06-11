'use client'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { ChildrenType } from '@core/types'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

// Styled Component Imports
import StyledMain from '@layouts/styles/shared/StyledMain'
import { usePathname } from 'next/navigation'
import useVerticalNav from '@/@menu/hooks/useVerticalNav'
import { useWatchFormStore } from '@/store/useFormScreenEndUserStore'

const LayoutContent = ({ children }: ChildrenType) => {
  // Hooks
  const { settings } = useSettings()
  const pathname = usePathname()
  const { isBreakpointReached } = useVerticalNav()
  const isWatchForm = useWatchFormStore(state => state.isWatchForm)

  // Vars
  const contentCompact = settings.contentWidth === 'compact'
  const contentWide = settings.contentWidth === 'wide'

  return (
    <StyledMain
      pathname={pathname}
      isContentCompact={contentCompact}
      className={classnames(verticalLayoutClasses.content, 'flex-auto', {
        [`${verticalLayoutClasses.contentCompact} is-full`]:
          isBreakpointReached && isWatchForm ? contentWide : contentCompact,
        // [`${verticalLayoutClasses.contentCompact} is-full`]: contentWide,

        [verticalLayoutClasses.contentWide]: contentWide
      })}
    >
      {children}
    </StyledMain>
  )
}

export default LayoutContent
