/* eslint-disable react-hooks/exhaustive-deps */
// Next Imports
import { useParams, usePathname } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'
import LogoutIcon from '@mui/icons-material/Logout'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  ViewKanban,
  Draw,
  InsertDriveFile,
  AccountTree,
  SmsFailed,
  RuleFolder,
  Webhook,
  PermMedia,
  Task,
  Add,
  PushPin,
  ViewList,
  AssignmentTurnedIn,
  Assessment
} from '@mui/icons-material'

// Type Imports
import { Button, Divider, Typography } from '@mui/material'

import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'
import CustomChip from '@core/components/mui/Chip'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import { useHasPermission } from '@/hooks/useHasPermission'
import ToolboxFormNavigation from './ToolboxFormNavigation/ToolboxFormNavigation'
import { useMemo } from 'react'
import { useDialog } from '@/hooks/useDialog'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import { useLogout } from '@/queryOptions/form/formQueryOptions'
import { toast } from 'react-toastify'
import { useAuthStore } from '@/store/useAuthStore'

// Menu Data Imports
// import menuData from '@/data/navigation/verticalMenuData'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  const { showDialog } = useDialog()
  const profile = useAuthStore(state => state.profile)

  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()
  const pathname = usePathname()
  const { mutateAsync } = useLogout()
  // const { hasPermission } = useHasPermission()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  const handleLogout = async () => {
    try {
      const response = await mutateAsync()
      if (response.status == 'success') {
        toast.success('ออกจากระบบสำเร็จ', { autoClose: 3000 })
        window.location.href = 'https://dtn.igenco.dev/login'
        useAuthStore.getState().clearTokens()
      }
    } catch (error: any) {
      console.log('error', error)
      if (error?.url_redirect) {
        toast.success('ออกจากระบบสำเร็จ', { autoClose: 3000 })
        window.location.href = error?.url_redirect
      }
    }
  }

  const renderNavigationMenu = useMemo(() => {
    if (pathname.includes('/dashboard/form')) {
      return <ToolboxFormNavigation />
    }
    // if (pathname.includes('/user')) {
    //   return (
    //     <Menu
    //       popoutMenuOffset={{ mainAxis: 23 }}
    //       menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
    //       renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
    //       renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
    //       menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
    //     >
    //       <SubMenu label={'จัดการงาน'} className='mt-4 p-4 rounded-lg bg-white shadow-lg'>
    //         <MenuItem href={`/${locale}/user/dashboard`} icon={<Task style={{ width: '20px', height: '20px' }} />}>
    //           เอกสารของฉัน
    //         </MenuItem>
    //         <MenuItem href={`/${locale}/user/createTask`} icon={<Add style={{ width: '20px', height: '20px' }} />}>
    //           สร้างเอกสารใหม่
    //         </MenuItem>
    //         <Divider className='my-2' />
    //         <MenuItem href={`/${locale}/user/followTask`} icon={<PushPin style={{ width: '20px', height: '20px' }} />}>
    //           เอกสารที่กำลังติดตาม
    //         </MenuItem>
    //         <MenuItem href={`/${locale}/user/allTask`} icon={<ViewList style={{ width: '20px', height: '20px' }} />}>
    //           เอกสารทั้งหมด
    //         </MenuItem>
    //       </SubMenu>
    //     </Menu>
    //   )
    // }

    return (
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <SubMenu label={'จัดการงาน'} className='mt-4 p-4 rounded-lg bg-white shadow-lg'>
          {/* <MenuItem href={`/${locale}/user/createTask`} icon={<Add style={{ width: '20px', height: '20px' }} />}>
            สร้างเอกสารใหม่
          </MenuItem> */}
          <MenuItem href={`/${locale}/user/dashboard`} icon={<Task style={{ width: '20px', height: '20px' }} />}>
            เอกสารของฉัน
          </MenuItem>

          <Divider className='my-2' />
          <MenuItem href={`/${locale}/user/followTask`} icon={<PushPin style={{ width: '20px', height: '20px' }} />}>
            เอกสารที่กำลังติดตาม
          </MenuItem>
          <MenuItem href={`/${locale}/user/allTask`} icon={<ViewList style={{ width: '20px', height: '20px' }} />}>
            เอกสารทั้งหมด
          </MenuItem>
          <MenuItem
            href={`/${locale}/user/doneTask`}
            icon={<AssignmentTurnedIn style={{ width: '20px', height: '20px' }} />}
          >
            เอกสารที่จบแล้ว
          </MenuItem>
          <MenuItem href={`/${locale}/user/report`} icon={<Assessment style={{ width: '20px', height: '20px' }} />}>
            รายงาน
          </MenuItem>
        </SubMenu>

        {profile && ['1005', '1026'].some(id => profile.USER_GROUP_LISTS_ID.includes(id)) ? (
          <SubMenu label={'การจัดการ'} className='mt-4 p-4 rounded-lg bg-white shadow-lg'>
            <MenuItem
              href={`/${locale}/admin/dashboard`}
              icon={<InsertDriveFile style={{ width: '20px', height: '20px' }} />}
            >
              {dictionary?.manageForm}
            </MenuItem>
            <MenuItem
              href={`/${locale}/workflow/dashboard`}
              icon={<AccountTree style={{ width: '20px', height: '20px' }} />}
            >
              {dictionary?.manageFlow}
            </MenuItem>
          </SubMenu>
        ) : null}

        <div className='w-full mt-4 px-4'>
          <Button
            variant='contained'
            fullWidth
            color='error'
            startIcon={<LogoutIcon style={{ width: 20, height: 20 }} />}
            onClick={() => {
              showDialog({
                id: 'alertLogout',
                component: (
                  <ConfirmAlert
                    id='alertLogout'
                    title={'ออกจากระบบ'}
                    content1={'คุณต้องการออกจากระบบใช่หรือไม่ ?'}
                    onClick={() => {
                      handleLogout()
                    }}
                  />
                ),
                size: 'sm'
              })
            }}
          >
            ออกจากระบบ
          </Button>
        </div>

        {process.env.NEXT_PUBLIC_ENVIRONMENT == 'prod' ? null : (
          <>
            <MenuSection label={dictionary['navigation'].appsPages}>
              <SubMenu
                label={dictionary['navigation'].dashboards}
                icon={<i className='tabler-layout-dashboard' />}

                // suffix={<CustomChip label='5' size='small' color='error' round='true' />}
              >
                <MenuItem href={`/${locale}/dashboards/crm`}>{dictionary['navigation'].crm}</MenuItem>
                <MenuItem href={`/${locale}/dashboards/analytics`}>{dictionary['navigation'].analytics}</MenuItem>
                <MenuItem href={`/${locale}/dashboards/ecommerce`}>{dictionary['navigation'].eCommerce}</MenuItem>
                <MenuItem href={`/${locale}/dashboards/academy`}>{dictionary['navigation'].academy}</MenuItem>
                <MenuItem href={`/${locale}/dashboards/logistics`}>{dictionary['navigation'].logistics}</MenuItem>
              </SubMenu>
              {/* <SubMenu label={dictionary['navigation'].frontPages} icon={<i className='tabler-files' />}>
          <MenuItem href='/front-pages/landing-page' target='_blank'>
            {dictionary['navigation'].landing}
          </MenuItem>
          <MenuItem href='/front-pages/pricing' target='_blank'>
            {dictionary['navigation'].pricing}
          </MenuItem>
          <MenuItem href='/front-pages/payment' target='_blank'>
            {dictionary['navigation'].payment}
          </MenuItem>
          <MenuItem href='/front-pages/checkout' target='_blank'>
            {dictionary['navigation'].checkout}
          </MenuItem>
          <MenuItem href='/front-pages/help-center' target='_blank'>
            {dictionary['navigation'].helpCenter}
          </MenuItem>
        </SubMenu> */}
              <SubMenu label={dictionary['navigation'].eCommerce} icon={<i className='tabler-shopping-cart' />}>
                <MenuItem href={`/${locale}/apps/ecommerce/dashboard`}>{dictionary['navigation'].dashboard}</MenuItem>
                <SubMenu label={dictionary['navigation'].products}>
                  <MenuItem href={`/${locale}/apps/ecommerce/products/list`}>{dictionary['navigation'].list}</MenuItem>
                  <MenuItem href={`/${locale}/apps/ecommerce/products/add`}>{dictionary['navigation'].add}</MenuItem>
                  <MenuItem href={`/${locale}/apps/ecommerce/products/category`}>
                    {dictionary['navigation'].category}
                  </MenuItem>
                </SubMenu>
                <SubMenu label={dictionary['navigation'].orders}>
                  <MenuItem href={`/${locale}/apps/ecommerce/orders/list`}>{dictionary['navigation'].list}</MenuItem>
                  <MenuItem
                    href={`/${locale}/apps/ecommerce/orders/details/5434`}
                    exactMatch={false}
                    activeUrl='/apps/ecommerce/orders/details'
                  >
                    {dictionary['navigation'].details}
                  </MenuItem>
                </SubMenu>
                <SubMenu label={dictionary['navigation'].customers}>
                  <MenuItem href={`/${locale}/apps/ecommerce/customers/list`}>{dictionary['navigation'].list}</MenuItem>
                  <MenuItem
                    href={`/${locale}/apps/ecommerce/customers/details/879861`}
                    exactMatch={false}
                    activeUrl='/apps/ecommerce/customers/details'
                  >
                    {dictionary['navigation'].details}
                  </MenuItem>
                </SubMenu>
                <MenuItem href={`/${locale}/apps/ecommerce/manage-reviews`}>
                  {dictionary['navigation'].manageReviews}
                </MenuItem>
                <MenuItem href={`/${locale}/apps/ecommerce/referrals`}>{dictionary['navigation'].referrals}</MenuItem>
                {/* <MenuItem href={`/${locale}/apps/ecommerce/settings`}>{dictionary['navigation'].settings}</MenuItem> */}
              </SubMenu>
              <SubMenu label={dictionary['navigation'].academy} icon={<i className='tabler-school' />}>
                <MenuItem href={`/${locale}/apps/academy/dashboard`}>{dictionary['navigation'].dashboard}</MenuItem>
                <MenuItem href={`/${locale}/apps/academy/my-courses`}>{dictionary['navigation'].myCourses}</MenuItem>
                <MenuItem href={`/${locale}/apps/academy/course-details`}>
                  {dictionary['navigation'].courseDetails}
                </MenuItem>
              </SubMenu>
              <SubMenu label={dictionary['navigation'].logistics} icon={<i className='tabler-truck' />}>
                <MenuItem href={`/${locale}/apps/logistics/dashboard`}>{dictionary['navigation'].dashboard}</MenuItem>
                <MenuItem href={`/${locale}/apps/logistics/fleet`}>{dictionary['navigation'].fleet}</MenuItem>
              </SubMenu>
              <MenuItem
                href={`/${locale}/apps/email`}
                icon={<i className='tabler-mail' />}
                exactMatch={false}
                activeUrl='/apps/email'
              >
                {dictionary['navigation'].email}
              </MenuItem>
              <MenuItem href={`/${locale}/apps/chat`} icon={<i className='tabler-message-circle-2' />}>
                {dictionary['navigation'].chat}
              </MenuItem>
              <MenuItem href={`/${locale}/apps/calendar`} icon={<i className='tabler-calendar' />}>
                {dictionary['navigation'].calendar}
              </MenuItem>
              <MenuItem href={`/${locale}/apps/kanban`} icon={<i className='tabler-copy' />}>
                {dictionary['navigation'].kanban}
              </MenuItem>
              {/* <SubMenu label={dictionary['navigation'].invoice} icon={<i className='tabler-file-description' />}>
                <MenuItem href={`/${locale}/apps/invoice/list`}>{dictionary['navigation'].list}</MenuItem>
                <MenuItem
                  href={`/${locale}/apps/invoice/preview/4987`}
                  exactMatch={false}
                  activeUrl='/apps/invoice/preview'
                >
                  {dictionary['navigation'].preview}
                </MenuItem>
                <MenuItem href={`/${locale}/apps/invoice/edit/4987`} exactMatch={false} activeUrl='/apps/invoice/edit'>
                  {dictionary['navigation'].edit}
                </MenuItem>
                <MenuItem href={`/${locale}/apps/invoice/add`}>{dictionary['navigation'].add}</MenuItem>
              </SubMenu> */}
              <SubMenu label={dictionary['navigation'].user} icon={<i className='tabler-user' />}>
                <MenuItem href={`/${locale}/apps/user/list`}>{dictionary['navigation'].list}</MenuItem>
                <MenuItem href={`/${locale}/apps/user/view`}>{dictionary['navigation'].view}</MenuItem>
              </SubMenu>
              {/* <SubMenu label={dictionary['navigation'].rolesPermissions} icon={<i className='tabler-lock' />}>
                <MenuItem href={`/${locale}/apps/roles`}>{dictionary['navigation'].roles}</MenuItem>
                <MenuItem href={`/${locale}/apps/permissions`}>{dictionary['navigation'].permissions}</MenuItem>
              </SubMenu> */}
              <SubMenu label={dictionary['navigation'].pages} icon={<i className='tabler-file' />}>
                <MenuItem href={`/${locale}/pages/user-profile`}>{dictionary['navigation'].userProfile}</MenuItem>
                <MenuItem href={`/${locale}/pages/account-settings`}>
                  {dictionary['navigation'].accountSettings}
                </MenuItem>
                {/* <MenuItem href={`/${locale}/pages/faq`}>{dictionary['navigation'].faq}</MenuItem> */}
                <MenuItem href={`/${locale}/pages/pricing`}>{dictionary['navigation'].pricing}</MenuItem>
                <SubMenu label={dictionary['navigation'].miscellaneous}>
                  <MenuItem href={`/${locale}/pages/misc/coming-soon`} target='_blank'>
                    {dictionary['navigation'].comingSoon}
                  </MenuItem>
                  <MenuItem href={`/${locale}/pages/misc/under-maintenance`} target='_blank'>
                    {dictionary['navigation'].underMaintenance}
                  </MenuItem>
                  <MenuItem href={`/${locale}/pages/misc/404-not-found`} target='_blank'>
                    {dictionary['navigation'].pageNotFound404}
                  </MenuItem>
                  <MenuItem href={`/${locale}/pages/misc/401-not-authorized`} target='_blank'>
                    {dictionary['navigation'].notAuthorized401}
                  </MenuItem>
                </SubMenu>
              </SubMenu>
              <SubMenu label={dictionary['navigation'].authPages} icon={<i className='tabler-shield-lock' />}>
                <SubMenu label={dictionary['navigation'].login}>
                  <MenuItem href={`/${locale}/pages/auth/login-v1`} target='_blank'>
                    {dictionary['navigation'].loginV1}
                  </MenuItem>
                  <MenuItem href={`/${locale}/pages/auth/login-v2`} target='_blank'>
                    {dictionary['navigation'].loginV2}
                  </MenuItem>
                </SubMenu>
                <SubMenu label={dictionary['navigation'].register}>
                  <MenuItem href={`/${locale}/pages/auth/register-v1`} target='_blank'>
                    {dictionary['navigation'].registerV1}
                  </MenuItem>
                  <MenuItem href={`/${locale}/pages/auth/register-v2`} target='_blank'>
                    {dictionary['navigation'].registerV2}
                  </MenuItem>
                  <MenuItem href={`/${locale}/pages/auth/register-multi-steps`} target='_blank'>
                    {dictionary['navigation'].registerMultiSteps}
                  </MenuItem>
                </SubMenu>
                <SubMenu label={dictionary['navigation'].verifyEmail}>
                  <MenuItem href={`/${locale}/pages/auth/verify-email-v1`} target='_blank'>
                    {dictionary['navigation'].verifyEmailV1}
                  </MenuItem>
                  <MenuItem href={`/${locale}/pages/auth/verify-email-v2`} target='_blank'>
                    {dictionary['navigation'].verifyEmailV2}
                  </MenuItem>
                </SubMenu>
                <SubMenu label={dictionary['navigation'].forgotPassword}>
                  <MenuItem href={`/${locale}/pages/auth/forgot-password-v1`} target='_blank'>
                    {dictionary['navigation'].forgotPasswordV1}
                  </MenuItem>
                  <MenuItem href={`/${locale}/pages/auth/forgot-password-v2`} target='_blank'>
                    {dictionary['navigation'].forgotPasswordV2}
                  </MenuItem>
                </SubMenu>
                <SubMenu label={dictionary['navigation'].resetPassword}>
                  <MenuItem href={`/${locale}/pages/auth/reset-password-v1`} target='_blank'>
                    {dictionary['navigation'].resetPasswordV1}
                  </MenuItem>
                  <MenuItem href={`/${locale}/pages/auth/reset-password-v2`} target='_blank'>
                    {dictionary['navigation'].resetPasswordV2}
                  </MenuItem>
                </SubMenu>
                <SubMenu label={dictionary['navigation'].twoSteps}>
                  <MenuItem href={`/${locale}/pages/auth/two-steps-v1`} target='_blank'>
                    {dictionary['navigation'].twoStepsV1}
                  </MenuItem>
                  <MenuItem href={`/${locale}/pages/auth/two-steps-v2`} target='_blank'>
                    {dictionary['navigation'].twoStepsV2}
                  </MenuItem>
                </SubMenu>
              </SubMenu>
              <SubMenu label={dictionary['navigation'].wizardExamples} icon={<i className='tabler-dots' />}>
                <MenuItem href={`/${locale}/pages/wizard-examples/checkout`}>
                  {dictionary['navigation'].checkout}
                </MenuItem>
                <MenuItem href={`/${locale}/pages/wizard-examples/property-listing`}>
                  {dictionary['navigation'].propertyListing}
                </MenuItem>
                <MenuItem href={`/${locale}/pages/wizard-examples/create-deal`}>
                  {dictionary['navigation'].createDeal}
                </MenuItem>
              </SubMenu>
              <MenuItem href={`/${locale}/pages/dialog-examples`} icon={<i className='tabler-square' />}>
                {dictionary['navigation'].dialogExamples}
              </MenuItem>
              <SubMenu label={dictionary['navigation'].widgetExamples} icon={<i className='tabler-chart-bar' />}>
                <MenuItem href={`/${locale}/pages/widget-examples/basic`}>{dictionary['navigation'].basic}</MenuItem>
                <MenuItem href={`/${locale}/pages/widget-examples/advanced`}>
                  {dictionary['navigation'].advanced}
                </MenuItem>
                <MenuItem href={`/${locale}/pages/widget-examples/statistics`}>
                  {dictionary['navigation'].statistics}
                </MenuItem>
                <MenuItem href={`/${locale}/pages/widget-examples/charts`}>{dictionary['navigation'].charts}</MenuItem>
                <MenuItem href={`/${locale}/pages/widget-examples/actions`}>
                  {dictionary['navigation'].actions}
                </MenuItem>
              </SubMenu>
            </MenuSection>
            <MenuSection label={dictionary['navigation'].formsAndTables}>
              <MenuItem href={`/${locale}/forms/form-layouts`} icon={<i className='tabler-layout' />}>
                {dictionary['navigation'].formLayouts}
              </MenuItem>
              <MenuItem href={`/${locale}/forms/form-validation`} icon={<i className='tabler-checkup-list' />}>
                {dictionary['navigation'].formValidation}
              </MenuItem>
              <MenuItem href={`/${locale}/forms/form-wizard`} icon={<i className='tabler-git-merge' />}>
                {dictionary['navigation'].formWizard}
              </MenuItem>
              <MenuItem href={`/${locale}/react-table`} icon={<i className='tabler-table' />}>
                {dictionary['navigation'].reactTable}
              </MenuItem>
              <MenuItem
                icon={<i className='tabler-checkbox' />}
                href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements`}
                suffix={<i className='tabler-external-link text-xl' />}
                target='_blank'
              >
                {dictionary['navigation'].formELements}
              </MenuItem>
              <MenuItem
                icon={<i className='tabler-layout-board-split' />}
                href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/mui-table`}
                suffix={<i className='tabler-external-link text-xl' />}
                target='_blank'
              >
                {dictionary['navigation'].muiTables}
              </MenuItem>
            </MenuSection>
            <MenuSection label={dictionary['navigation'].chartsMisc}>
              <SubMenu label={dictionary['navigation'].charts} icon={<i className='tabler-chart-donut-2' />}>
                <MenuItem href={`/${locale}/charts/apex-charts`}>{dictionary['navigation'].apex}</MenuItem>
                <MenuItem href={`/${locale}/charts/recharts`}>{dictionary['navigation'].recharts}</MenuItem>
              </SubMenu>
              <MenuItem
                icon={<i className='tabler-cards' />}
                href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/foundation`}
                suffix={<i className='tabler-external-link text-xl' />}
                target='_blank'
              >
                {dictionary['navigation'].foundation}
              </MenuItem>
              <MenuItem
                icon={<i className='tabler-atom' />}
                href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components`}
                suffix={<i className='tabler-external-link text-xl' />}
                target='_blank'
              >
                {dictionary['navigation'].components}
              </MenuItem>
              <MenuItem
                icon={<i className='tabler-list-search' />}
                href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/menu-examples/overview`}
                suffix={<i className='tabler-external-link text-xl' />}
                target='_blank'
              >
                {dictionary['navigation'].menuExamples}
              </MenuItem>
              <MenuItem
                icon={<i className='tabler-lifebuoy' />}
                suffix={<i className='tabler-external-link text-xl' />}
                target='_blank'
                href='https://pixinvent.ticksy.com'
              >
                {dictionary['navigation'].raiseSupport}
              </MenuItem>
              <MenuItem
                icon={<i className='tabler-book-2' />}
                suffix={<i className='tabler-external-link text-xl' />}
                target='_blank'
                href={`${process.env.NEXT_PUBLIC_DOCS_URL}`}
              >
                {dictionary['navigation'].documentation}
              </MenuItem>
              <SubMenu label={dictionary['navigation'].others} icon={<i className='tabler-box' />}>
                <MenuItem suffix={<CustomChip label='New' size='small' color='info' round='true' />}>
                  {dictionary['navigation'].itemWithBadge}
                </MenuItem>
                <MenuItem
                  href='https://pixinvent.com'
                  target='_blank'
                  suffix={<i className='tabler-external-link text-xl' />}
                >
                  {dictionary['navigation'].externalLink}
                </MenuItem>
                <SubMenu label={dictionary['navigation'].menuLevels}>
                  <MenuItem>{dictionary['navigation'].menuLevel2}</MenuItem>
                  <SubMenu label={dictionary['navigation'].menuLevel2}>
                    <MenuItem>{dictionary['navigation'].menuLevel3}</MenuItem>
                    <MenuItem>{dictionary['navigation'].menuLevel3}</MenuItem>
                  </SubMenu>
                </SubMenu>
                <MenuItem disabled>{dictionary['navigation'].disabledMenu}</MenuItem>
              </SubMenu>
            </MenuSection>
          </>
        )}
      </Menu>
    )
  }, [pathname])

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true }
            // onScrollY: container => scrollMenu(container, true)
          })}
      className=' bg-gray-100 h-full '
    >
      {/* Vertical Menu */}
      {renderNavigationMenu}

      <Typography variant='subtitle2' className='text-center mb-4'>
        Version 1.0.0
      </Typography>
    </ScrollWrapper>
  )
}

export default VerticalMenu
