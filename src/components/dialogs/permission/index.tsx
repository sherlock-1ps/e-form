/* eslint-disable react-hooks/exhaustive-deps */
'use client'

// React Imports
import type { ChangeEvent } from 'react'
import { useCallback, useMemo, useState } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Component Imports

// Styled Component Imports
import { Box, Button, Card, CardContent, Grid, Switch } from '@mui/material'

import CustomAvatar from '@/@core/components/mui/Avatar'
import PermissionLists from './PermissionLists'
import DirectionalIcon from '@/components/DirectionalIcon'
import type { permissionActionType } from '@/types/pages/permission/permissionType'
import MultipleSwitches from './wow'

type CreateAppProps = {
  data: any
}

type PreviewPermissionType = {
  menuId: number | string
  groupId: number | string
  permission: permissionActionType // Add permission as an object
}

const dataMockup = [
  {
    id: 1,
    name: 'User Section',
    actions: [
      {
        id: 1,
        action_id: 1,
        name: 'Can view setting website',
        group: 'Setting Website',
        preview_image: ''
      }
    ]
  },
  {
    id: 1,
    name: 'Payment Section',
    actions: [
      {
        id: 1,
        action_id: 1,
        name: 'Can view setting website',
        group: 'Setting Website',
        preview_image: ''
      }
    ]
  },
  {
    id: 1,
    name: 'Promotion Section',
    actions: [
      {
        id: 1,
        action_id: 1,
        name: 'Can view setting website',
        group: 'Setting Website',
        preview_image: ''
      }
    ]
  },
  {
    id: 1,
    name: 'Casino Section',
    actions: [
      {
        id: 1,
        action_id: 1,
        name: 'Can view setting website',
        group: 'Setting Website',
        preview_image: ''
      }
    ]
  },
  {
    id: 1,
    name: 'Setting Section',
    actions: [
      {
        id: 1,
        action_id: 1,
        name: 'Can view setting website',
        group: 'Setting Website',
        preview_image: ''
      }
    ]
  },
  {
    id: 1,
    name: 'Setting Section',
    actions: [
      {
        id: 1,
        action_id: 1,
        name: 'Can view setting website',
        group: 'Setting Website',
        preview_image: ''
      }
    ]
  }
]

const PermissionDialog = ({ data }: CreateAppProps) => {
  const [selectedMenu, setSelectedMenu] = useState(0)
  const [viewPreview, setViewPreview] = useState<any>(null)
  const [currentPermission, setCurrentPermission] = useState(data?.permissions)

  const handleStep = (step: number) => () => {
    setSelectedMenu(step)
  }

  const handleCLickPreview = () => {
    setViewPreview(1)
  }

  const handleUpdateCurrentPermission = (
    menuId: number | string,
    groupId: number | string,
    actionId: number | string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const updatedData = currentPermission.map((menu: any) =>
      menu.id === menuId
        ? {
            ...menu,
            groups: menu.groups.map((group: any) =>
              group.id === groupId
                ? {
                    ...group,
                    actions: group.actions.map((action: any) =>
                      action.id === actionId ? { ...action, is_active: e.target.checked } : action
                    )
                  }
                : group
            )
          }
        : menu
    )

    setCurrentPermission(updatedData)
  }

  const hasDifferentIsActive = useCallback((a: any, b: any) => {
    if (a.length !== b.length) {
      return true
    }

    for (let i = 0; i < a.length; i++) {
      const aSection = a[i]
      const bSection = b[i]

      if (aSection?.groups?.length !== bSection.groups?.length) {
        return true
      }

      for (let j = 0; j < aSection?.groups?.length; j++) {
        const aGroup = aSection?.groups[j]
        const bGroup = bSection?.groups[j]

        if (aGroup?.actions?.length !== bGroup?.actions?.length) {
          return true
        }

        for (let k = 0; k < aGroup?.actions?.length; k++) {
          const aAction = aGroup?.actions[k]
          const bAction = bGroup?.actions[k]

          if (aAction?.is_active !== bAction?.is_active) {
            return true
          }
        }
      }
    }

    return false
  }, [])

  const hasChanges = useMemo(() => {
    return hasDifferentIsActive(data?.permissions, currentPermission)
  }, [currentPermission])

  return (
    <Box sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <Typography variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Permission of {data?.name}
      </Typography>
      {/* <MultipleSwitches /> */}
      <div className='relative'>
        <div className='pbs-0 sm:pli-16 sm:pbe-16'>
          <div className='flex gap-y-6 flex-col md:flex-row md:gap-2'>
            <div className='flex flex-col gap-2 min-is-[220px] overflow-y-auto max-h-[500px]'>
              {dataMockup.map((label: any, index: number) => {
                return (
                  <Box key={index} onClick={handleStep(index)}>
                    <Box className='p-1 cursor-pointer '>
                      <div
                        className={classnames('step-label rounded-sm flex items-center px-1 gap-2', {
                          'bg-primary': selectedMenu === index
                        })}
                      >
                        <CustomAvatar
                          variant='rounded'
                          skin={selectedMenu === index ? 'filled' : 'light'}
                          {...(selectedMenu === index && { className: 'shadow-primarySm', color: 'primary' })}
                          size={38}
                        >
                          <i className={classnames('tabler-file-text', 'text-[22px]')} />
                        </CustomAvatar>
                        <div className='flex flex-col '>
                          <Typography
                            className={classnames('uppercase text-sm', {
                              'text-white': selectedMenu === index
                            })}
                          >
                            {label.name}
                          </Typography>
                        </div>
                      </div>
                    </Box>
                  </Box>
                )
              })}
            </div>
            <div className='flex-1 sm:border-t md:border-t-0 md:border-l border-secondarylight sm:pt-4 md:pl-4'>
              <PermissionLists
                handleCLickPreview={handleCLickPreview}
                data={data?.permissions}
                handleUpdateCurrentPermission={handleUpdateCurrentPermission}
                id={selectedMenu}
              />
              {hasChanges && (
                <Card className='mt-4 bg-primaryLight'>
                  <CardContent>
                    <div className='flex gap-2 justify-between items-center'>
                      <Typography variant='h6'>You have unsaved changes!</Typography>
                      <div>
                        <Button color='primary' disabled={true}>
                          Reset
                        </Button>
                        <Button
                          variant='contained'
                          startIcon={<i className='tabler-lock-check' />}
                          className='max-sm:is-full'
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
        {viewPreview && (
          <Card className=' absolute top-0 bottom-0 h-screen'>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className='pbs-0 sm:pli-16 sm:pbe-2 flex items-center gap-2'>
                  <Button
                    variant='tonal'
                    onClick={() => {
                      setViewPreview(null)
                    }}
                    color='primary'
                    startIcon={<DirectionalIcon ltrIconClass='tabler-arrow-left' rtlIconClass='tabler-arrow-right' />}
                  >
                    Back
                  </Button>
                  <Typography variant='h6'>Preview Permissions</Typography>
                  <Switch
                    // checked={viewPreview?.permission.is_active}
                    defaultChecked
                    // onChange={e =>
                    //   handleUpdateCurrentPermission(
                    //     viewPreview.menuId,
                    //     viewPreview.groupId,
                    //     viewPreview.permission.id,
                    //     e
                    //   )
                    // }
                  />
                </div>
              </Grid>
              <Grid item xs={12}>
                <img
                  className='w-full h-full object-contain'
                  src='/images/preview-permission/testPreview.png'
                  alt='testPreview'
                />
              </Grid>
            </Grid>
          </Card>
        )}
      </div>
    </Box>
  )
}

export default PermissionDialog
