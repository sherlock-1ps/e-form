'use client'

// React Imports
// MUI Imports
import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { FormControlLabel } from '@mui/material'

import tableStyles from '@core/styles/table.module.css'
import type { permissionActionType } from '@/types/pages/permission/permissionType'

type Props = {
  handleCLickPreview: () => void
  data: any
  handleUpdateCurrentPermission: (
    menuIndex: number | string,
    groupIndex: number | string,
    actionIndex: number | string,
    e: ChangeEvent<HTMLInputElement>
  ) => void
  id: any
}

const PermissionLists = ({ handleCLickPreview, data, handleUpdateCurrentPermission, id }: Props) => {
  const [switchStates, setSwitchStates] = useState(
    data?.map((menu: any) => menu?.groups?.map((g: any) => g.actions.map((item: any) => item.is_active)))
  )

  const [actionChangedIndex, setActionChangedIndex] = useState(null)

  const dataMockup = [
    {
      id: 1,
      name: 'Permission',
      group: [
        {
          name: 'Can view ',
          preview_image: '',
          isActive: true
        },
        {
          name: 'Can update ',
          preview_image: '',
          isActive: true
        },
        {
          name: 'Can create ',
          preview_image: '',
          isActive: false
        },
        {
          name: 'Can delete ',
          preview_image: '',
          isActive: false
        }
      ]
    }
  ]

  const [test, setTest] = useState(dataMockup)
  const [test2, setTest2] = useState(dataMockup)

  const handleSwitchToggle = (
    menuId: number | string,
    groupId: number | string,
    actionId: number | string,
    e: ChangeEvent<HTMLInputElement>,
    groupIndex: any,
    actionIndex: any
  ) => {
    const newSwitchStates = [...switchStates]

    newSwitchStates[id][groupIndex][actionIndex] = e.target.checked

    // setActionChangedIndex(actionId)
    setSwitchStates(newSwitchStates)
    handleUpdateCurrentPermission(menuId, groupId, actionId, e)
  }

  const handleToggle = (index: number) => {
    setTest2(prevTest2 =>
      prevTest2.map(group => ({
        ...group,
        group: group.group.map((item, idx) => (idx === index ? { ...item, isActive: !item.isActive } : item))
      }))
    )
  }

  return (
    <div className='flex flex-col gap-6'>
      <Grid container className=' overflow-y-auto max-h-[360px]'>
        <Grid item xs={12}>
          <Typography variant='h5' className='py-2'>
            {dataMockup[0].name}
          </Typography>
          <div className='overflow-x-auto border rounded'>
            {test[0].group.map((item, index) => {
              const isDifferent = test[0].group[index].isActive !== test2[0].group[index].isActive

              return (
                <table className={tableStyles.table} key={index}>
                  <tbody className={isDifferent ? 'bg-primaryLight' : ''}>
                    <tr>
                      <td>
                        <Typography color='text.primary'>{item.name}</Typography>
                      </td>
                      <td className='flex justify-end'>
                        <div className='flex items-center'>
                          <Button
                            className='font-light'
                            onClick={() => {
                              handleCLickPreview()
                            }}
                          >
                            preview
                          </Button>

                          <Switch checked={test2[0].group[index].isActive} onChange={() => handleToggle(index)} />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )
            })}
          </div>
        </Grid>

        {/* {data?.length > 0 &&
          data[id]?.groups?.map((group: any, groupIndex: number) => {
            return (
              <Grid item xs={12} key={'group permission' + groupIndex}>
                <Typography variant='h5' className='py-2'>
                  {group?.name}
                </Typography>
                <div className='overflow-x-auto border rounded'>
                  {group.actions.map((permission: any, actionIndex: number) => {
                    return (
                      <table className={tableStyles.table} key={'permission' + actionIndex}>
                        <tbody className={actionChangedIndex === permission?.id ? 'bg-primaryLight' : ''}>
                          <tr>
                            <td>
                              <Typography color='text.primary'>{permission.name}</Typography>
                            </td>
                            <td className='flex justify-end'>
                              <div className='flex items-center'>
                                <Button
                                  className='font-light'
                                  onClick={() => {
                                    handleCLickPreview(data?.id, group.id, permission)
                                  }}
                                >
                                  preview
                                </Button>

                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={switchStates[id][groupIndex][actionIndex]}
                                      onChange={e =>
                                        handleSwitchToggle(
                                          data[id].id,
                                          group.id,
                                          permission.id,
                                          e,
                                          groupIndex,
                                          actionIndex
                                        )
                                      }
                                    />
                                  }
                                  label={permission.label}
                                />
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )
                  })}
                </div>
              </Grid>
            )
          })} */}
      </Grid>
    </div>
  )
}

export default PermissionLists
