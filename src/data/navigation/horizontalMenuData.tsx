// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const horizontalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): HorizontalMenuDataType[] => [
  // This is how you will normally render submenu
  {
    label: dictionary['navigation'].dashboards,
    icon: 'tabler-smart-home',
    children: [
      // This is how you will normally render menu item
      {
        label: dictionary['navigation'].crm,
        icon: 'tabler-chart-pie-2',
        href: '/dashboards/crm'
      },
      {
        label: dictionary['navigation'].analytics,
        icon: 'tabler-trending-up',
        href: '/dashboards/analytics'
      },
      {
        label: dictionary['navigation'].eCommerce,
        icon: 'tabler-shopping-cart',
        href: '/dashboards/ecommerce'
      },
      {
        label: dictionary['navigation'].academy,
        icon: 'tabler-school',
        href: '/dashboards/academy'
      },
      {
        label: dictionary['navigation'].logistics,
        icon: 'tabler-truck',
        href: '/dashboards/logistics'
      }
    ]
  },
  {
    label: dictionary['navigation'].apps,
    icon: 'tabler-mail',
    children: [
      {
        label: dictionary['navigation'].eCommerce,
        icon: 'tabler-shopping-cart',
        children: [
          {
            label: dictionary['navigation'].dashboard,
            href: '/apps/ecommerce/dashboard'
          },
          {
            label: dictionary['navigation'].products,
            children: [
              {
                label: dictionary['navigation'].list,
                href: '/apps/ecommerce/products/list'
              },
              {
                label: dictionary['navigation'].add,
                href: '/apps/ecommerce/products/add'
              },
              {
                label: dictionary['navigation'].category,
                href: '/apps/ecommerce/products/category'
              }
            ]
          },
          {
            label: dictionary['navigation'].orders,
            children: [
              {
                label: dictionary['navigation'].list,
                href: '/apps/ecommerce/orders/list'
              },
              {
                label: dictionary['navigation'].details,
                href: '/apps/ecommerce/orders/details/5434',
                exactMatch: false,
                activeUrl: '/apps/ecommerce/orders/details'
              }
            ]
          },
          {
            label: dictionary['navigation'].customers,
            children: [
              {
                label: dictionary['navigation'].list,
                href: '/apps/ecommerce/customers/list'
              },
              {
                label: dictionary['navigation'].details,
                href: '/apps/ecommerce/customers/details/879861',
                exactMatch: false,
                activeUrl: '/apps/ecommerce/customers/details'
              }
            ]
          },
          {
            label: dictionary['navigation'].manageReviews,
            href: '/apps/ecommerce/manage-reviews'
          },
          {
            label: dictionary['navigation'].referrals,
            href: '/apps/ecommerce/referrals'
          }
        ]
      },
      {
        label: dictionary['navigation'].academy,
        icon: 'tabler-school',
        children: [
          {
            label: dictionary['navigation'].dashboard,
            href: '/apps/academy/dashboard'
          },
          {
            label: dictionary['navigation'].myCourses,
            href: '/apps/academy/my-courses'
          },
          {
            label: dictionary['navigation'].courseDetails,
            href: '/apps/academy/course-details'
          }
        ]
      },
      {
        label: dictionary['navigation'].logistics,
        icon: 'tabler-truck',
        children: [
          {
            label: dictionary['navigation'].dashboard,
            href: '/apps/logistics/dashboard'
          },
          {
            label: dictionary['navigation'].fleet,
            href: '/apps/logistics/fleet'
          }
        ]
      },
      {
        label: dictionary['navigation'].email,
        icon: 'tabler-mail',
        href: '/apps/email',
        exactMatch: false,
        activeUrl: '/apps/email'
      },
      {
        label: dictionary['navigation'].chat,
        icon: 'tabler-message-circle-2',
        href: '/apps/chat'
      },
      {
        label: dictionary['navigation'].calendar,
        icon: 'tabler-calendar',
        href: '/apps/calendar'
      },
      {
        label: dictionary['navigation'].kanban,
        icon: 'tabler-copy',
        href: '/apps/kanban'
      },

      {
        label: dictionary['navigation'].user,
        icon: 'tabler-user',
        children: [
          {
            label: dictionary['navigation'].list,
            icon: 'tabler-circle',
            href: '/apps/user/list'
          },
          {
            label: dictionary['navigation'].view,
            icon: 'tabler-circle',
            href: '/apps/user/view'
          }
        ]
      }
    ]
  },
  {
    label: dictionary['navigation'].pages,
    icon: 'tabler-file',
    children: [
      {
        label: dictionary['navigation'].userProfile,
        icon: 'tabler-user-circle',
        href: '/pages/user-profile'
      },
      {
        label: dictionary['navigation'].accountSettings,
        icon: 'tabler-settings',
        href: '/pages/account-settings'
      },

      {
        label: dictionary['navigation'].pricing,
        icon: 'tabler-currency-dollar',
        href: '/pages/pricing'
      },
      {
        label: dictionary['navigation'].miscellaneous,
        icon: 'tabler-file-info',
        children: [
          {
            label: dictionary['navigation'].comingSoon,
            icon: 'tabler-circle',
            href: '/pages/misc/coming-soon',
            target: '_blank'
          },
          {
            label: dictionary['navigation'].underMaintenance,
            icon: 'tabler-circle',
            href: '/pages/misc/under-maintenance',
            target: '_blank'
          },
          {
            label: dictionary['navigation'].pageNotFound404,
            icon: 'tabler-circle',
            href: '/pages/misc/404-not-found',
            target: '_blank'
          },
          {
            label: dictionary['navigation'].notAuthorized401,
            icon: 'tabler-circle',
            href: '/pages/misc/401-not-authorized',
            target: '_blank'
          }
        ]
      },
      {
        label: dictionary['navigation'].authPages,
        icon: 'tabler-shield-lock',
        children: [
          {
            label: dictionary['navigation'].login,
            icon: 'tabler-circle',
            children: [
              {
                label: dictionary['navigation'].loginV1,
                icon: 'tabler-circle',
                href: '/pages/auth/login-v1',
                target: '_blank'
              },
              {
                label: dictionary['navigation'].loginV2,
                icon: 'tabler-circle',
                href: '/pages/auth/login-v2',
                target: '_blank'
              }
            ]
          },
          {
            label: dictionary['navigation'].register,
            icon: 'tabler-circle',
            children: [
              {
                label: dictionary['navigation'].registerV1,
                icon: 'tabler-circle',
                href: '/pages/auth/register-v1',
                target: '_blank'
              },
              {
                label: dictionary['navigation'].registerV2,
                icon: 'tabler-circle',
                href: '/pages/auth/register-v2',
                target: '_blank'
              },
              {
                label: dictionary['navigation'].registerMultiSteps,
                icon: 'tabler-circle',
                href: '/pages/auth/register-multi-steps',
                target: '_blank'
              }
            ]
          },
          {
            label: dictionary['navigation'].verifyEmail,
            icon: 'tabler-circle',
            children: [
              {
                label: dictionary['navigation'].verifyEmailV1,
                icon: 'tabler-circle',
                href: '/pages/auth/verify-email-v1',
                target: '_blank'
              },
              {
                label: dictionary['navigation'].verifyEmailV2,
                icon: 'tabler-circle',
                href: '/pages/auth/verify-email-v2',
                target: '_blank'
              }
            ]
          },
          {
            label: dictionary['navigation'].forgotPassword,
            icon: 'tabler-circle',
            children: [
              {
                label: dictionary['navigation'].forgotPasswordV1,
                icon: 'tabler-circle',
                href: '/pages/auth/forgot-password-v1',
                target: '_blank'
              },
              {
                label: dictionary['navigation'].forgotPasswordV2,
                icon: 'tabler-circle',
                href: '/pages/auth/forgot-password-v2',
                target: '_blank'
              }
            ]
          },
          {
            label: dictionary['navigation'].resetPassword,
            icon: 'tabler-circle',
            children: [
              {
                label: dictionary['navigation'].resetPasswordV1,
                icon: 'tabler-circle',
                href: '/pages/auth/reset-password-v1',
                target: '_blank'
              },
              {
                label: dictionary['navigation'].resetPasswordV2,
                icon: 'tabler-circle',
                href: '/pages/auth/reset-password-v2',
                target: '_blank'
              }
            ]
          },
          {
            label: dictionary['navigation'].twoSteps,
            icon: 'tabler-circle',
            children: [
              {
                label: dictionary['navigation'].twoStepsV1,
                icon: 'tabler-circle',
                href: '/pages/auth/two-steps-v1',
                target: '_blank'
              },
              {
                label: dictionary['navigation'].twoStepsV2,
                icon: 'tabler-circle',
                href: '/pages/auth/two-steps-v2',
                target: '_blank'
              }
            ]
          }
        ]
      },
      {
        label: dictionary['navigation'].wizardExamples,
        icon: 'tabler-dots',
        children: [
          {
            label: dictionary['navigation'].checkout,
            icon: 'tabler-circle',
            href: '/pages/wizard-examples/checkout'
          },
          {
            label: dictionary['navigation'].propertyListing,
            icon: 'tabler-circle',
            href: '/pages/wizard-examples/property-listing'
          },
          {
            label: dictionary['navigation'].createDeal,
            icon: 'tabler-circle',
            href: '/pages/wizard-examples/create-deal'
          }
        ]
      },
      {
        label: dictionary['navigation'].dialogExamples,
        icon: 'tabler-square',
        href: '/pages/dialog-examples'
      },
      {
        label: dictionary['navigation'].widgetExamples,
        icon: 'tabler-chart-bar',
        children: [
          {
            label: dictionary['navigation'].basic,
            href: '/pages/widget-examples/basic'
          },
          {
            label: dictionary['navigation'].advanced,
            icon: 'tabler-circle',
            href: '/pages/widget-examples/advanced'
          },
          {
            label: dictionary['navigation'].statistics,
            icon: 'tabler-circle',
            href: '/pages/widget-examples/statistics'
          },
          {
            label: dictionary['navigation'].charts,
            icon: 'tabler-circle',
            href: '/pages/widget-examples/charts'
          },
          {
            label: dictionary['navigation'].actions,
            href: '/pages/widget-examples/actions'
          }
        ]
      },
      {
        label: dictionary['navigation'].frontPages,
        icon: 'tabler-files',
        children: [
          {
            label: dictionary['navigation'].landing,
            href: '/front-pages/landing-page',
            target: '_blank',
            excludeLang: true
          },
          {
            label: dictionary['navigation'].pricing,
            href: '/front-pages/pricing',
            target: '_blank',
            excludeLang: true
          },
          {
            label: dictionary['navigation'].payment,
            href: '/front-pages/payment',
            target: '_blank',
            excludeLang: true
          },
          {
            label: dictionary['navigation'].checkout,
            href: '/front-pages/checkout',
            target: '_blank',
            excludeLang: true
          },
          {
            label: dictionary['navigation'].helpCenter,
            href: '/front-pages/help-center',
            target: '_blank',
            excludeLang: true
          }
        ]
      }
    ]
  },
  {
    label: dictionary['navigation'].formsAndTables,
    icon: 'tabler-file-invoice',
    children: [
      {
        label: dictionary['navigation'].formLayouts,
        icon: 'tabler-layout',
        href: '/forms/form-layouts'
      },
      {
        label: dictionary['navigation'].formValidation,
        icon: 'tabler-checkup-list',
        href: '/forms/form-validation'
      },
      {
        label: dictionary['navigation'].formWizard,
        icon: 'tabler-git-merge',
        href: '/forms/form-wizard'
      },
      {
        label: dictionary['navigation'].reactTable,
        icon: 'tabler-table',
        href: '/react-table'
      },
      {
        label: dictionary['navigation'].formELements,
        icon: 'tabler-checkbox',
        suffix: <i className='tabler-external-link text-xl' />,
        href: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements`,
        target: '_blank'
      },
      {
        label: dictionary['navigation'].muiTables,
        icon: 'tabler-layout-board-split',
        href: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/mui-table`,
        suffix: <i className='tabler-external-link text-xl' />,
        target: '_blank'
      }
    ]
  },
  {
    label: dictionary['navigation'].charts,
    icon: 'tabler-chart-donut-2',
    children: [
      {
        label: dictionary['navigation'].apex,
        icon: 'tabler-chart-ppf',
        href: '/charts/apex-charts'
      },
      {
        label: dictionary['navigation'].recharts,
        icon: 'tabler-chart-sankey',
        href: '/charts/recharts'
      }
    ]
  },
  {
    label: dictionary['navigation'].others,
    icon: 'tabler-dots',
    children: [
      {
        label: dictionary['navigation'].foundation,
        icon: 'tabler-cards',
        href: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/foundation`,
        suffix: <i className='tabler-external-link text-xl' />,
        target: '_blank'
      },
      {
        label: dictionary['navigation'].components,
        icon: 'tabler-atom',
        href: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components`,
        suffix: <i className='tabler-external-link text-xl' />,
        target: '_blank'
      },
      {
        label: dictionary['navigation'].menuExamples,
        icon: 'tabler-list-search',
        href: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/menu-examples/overview`,
        suffix: <i className='tabler-external-link text-xl' />,
        target: '_blank'
      },
      {
        label: dictionary['navigation'].raiseSupport,
        icon: 'tabler-lifebuoy',
        suffix: <i className='tabler-external-link text-xl' />,
        target: '_blank',
        href: 'https://pixinvent.ticksy.com'
      },
      {
        label: dictionary['navigation'].documentation,
        icon: 'tabler-book-2',
        suffix: <i className='tabler-external-link text-xl' />,
        target: '_blank',
        href: `${process.env.NEXT_PUBLIC_DOCS_URL}`
      },
      {
        suffix: {
          label: 'New',
          color: 'info'
        },
        label: dictionary['navigation'].itemWithBadge,
        icon: 'tabler-notification'
      },
      {
        label: dictionary['navigation'].externalLink,
        icon: 'tabler-link',
        href: 'https://pixinvent.com',
        target: '_blank',
        suffix: <i className='tabler-external-link text-xl' />
      },
      {
        label: dictionary['navigation'].menuLevels,
        icon: 'tabler-menu-2',
        children: [
          {
            label: dictionary['navigation'].menuLevel2,
            icon: 'tabler-circle'
          },
          {
            label: dictionary['navigation'].menuLevel2,
            icon: 'tabler-circle',
            children: [
              {
                label: dictionary['navigation'].menuLevel3,
                icon: 'tabler-circle'
              },
              {
                label: dictionary['navigation'].menuLevel3,
                icon: 'tabler-circle'
              }
            ]
          }
        ]
      },
      {
        label: dictionary['navigation'].disabledMenu,
        disabled: true
      }
    ]
  }
]

export default horizontalMenuData
