'use client'

import { useDictionary } from '@/contexts/DictionaryContext'
import { useHasPermission } from '@/hooks/useHasPermission'
import { useFetchPermissionQueryOption } from '@/queryOptions/role/roleQueryOptions'
import { Button, Grid, Switch, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

const ICONS: Record<string, string> = {
  Providers: 'tabler-crown',
  Operators: 'tabler-building-skyscraper',
  'Activity Log': 'tabler-logs',
  Invoice: 'tabler-file-invoice',
  Account: 'tabler-user-circle',
  'Role & Permission': 'tabler-shield-chevron',
  FAQ: 'tabler-bubble-text',
  Credential: 'tabler-share',
  'Bet Transaction': 'tabler-zoom-money'
}

type SelectedPermissionMap = Record<string, Set<string>>

const PermissionList = () => {
  const { dictionary } = useDictionary()
  const router = useRouter()
  const { data: permissionList } = useFetchPermissionQueryOption()
  const { hasPermission } = useHasPermission()
  const {
    handleSubmit,
    setValue,
    formState: { errors }
  } = useFormContext()
  const [selectedModule, setSelectedModule] = useState<string>('')
  const [selectedPermissions, setSelectedPermissions] = useState<SelectedPermissionMap>({})

  const topLevelKeys = Object.keys(permissionList?.data || {})

  useEffect(() => {
    if (!selectedModule && topLevelKeys.length > 0) {
      setSelectedModule(topLevelKeys[0])
    }

    if (permissionList?.data && Object.keys(selectedPermissions).length === 0) {
      const initialSelected: SelectedPermissionMap = {}

      Object.entries(permissionList.data).forEach(([moduleKey, moduleValue]) => {
        if (Array.isArray(moduleValue)) {
          const ids = moduleValue.map(p => p.permission_id)
          initialSelected[moduleKey] = new Set(ids)
        } else if (typeof moduleValue === 'object') {
          Object.entries(moduleValue ?? {}).forEach(([groupKey, groupValue]) => {
            const ids = Array.isArray(groupValue) ? groupValue.map(p => p.permission_id) : []
            initialSelected[groupKey] = new Set(ids)
          })
        }
      })

      setSelectedPermissions(initialSelected)
    }
  }, [permissionList, selectedModule, topLevelKeys, selectedPermissions])

  useEffect(() => {
    const allSelectedIds = Object.values(selectedPermissions).flatMap(set => Array.from(set))
    setValue('permissions', allSelectedIds, { shouldValidate: true }) // 👈 validate ทันทีเมื่อเปลี่ยน
  }, [selectedPermissions, setValue])

  const selectedData = permissionList?.data[selectedModule]

  const toggleAll = (groupKey: string, permissionIds: string[], checked: boolean) => {
    setSelectedPermissions(prev => {
      const updated = new Set(prev[groupKey] || [])

      checked ? permissionIds.forEach(id => updated.add(id)) : permissionIds.forEach(id => updated.delete(id))

      return {
        ...prev,
        [groupKey]: updated
      }
    })
  }

  const toggleSingle = (groupKey: string, permissionId: string, checked: boolean) => {
    setSelectedPermissions(prev => {
      const updated = new Set(prev[groupKey] || [])
      checked ? updated.add(permissionId) : updated.delete(permissionId)

      return {
        ...prev,
        [groupKey]: updated
      }
    })
  }

  const isAllSelected = (groupKey: string, permissionIds: string[]) =>
    selectedPermissions[groupKey]?.size === permissionIds.length

  const renderPermissionGroup = (groupKey: string, permissions: any[]) => {
    const selectedSet = selectedPermissions[groupKey] || new Set()

    return (
      <div key={groupKey} className='mt-4'>
        <div className='px-4 py-2 h-[52px] rounded-tl-xl rounded-tr-xl border flex items-center justify-between'>
          <Typography>{groupKey} Permissions</Typography>
          <div className='flex gap-1 items-center'>
            <Switch
              checked={isAllSelected(
                groupKey,
                permissions.map(p => p.permission_id)
              )}
              onChange={e =>
                toggleAll(
                  groupKey,
                  permissions.map(p => p.permission_id),
                  e.target.checked
                )
              }
            />
            <Typography>{dictionary?.selectAll}</Typography>
          </div>
        </div>

        {permissions.map(permission => (
          <div
            key={permission.permission_id}
            className='px-4 py-2 min-h-[72px] border border-t-0 flex gap-2 items-center'
          >
            <div className='self-start'>
              <Switch
                checked={selectedSet.has(permission.permission_id)}
                onChange={e => toggleSingle(groupKey, permission.permission_id, e.target.checked)}
              />
            </div>
            <div className='flex flex-col'>
              <Typography variant='h6'>{permission.permission_name}</Typography>
              <Typography>{permission.permission_detail}</Typography>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderPermissions = () => {
    if (Array.isArray(selectedData)) {
      return renderPermissionGroup(selectedModule, selectedData)
    }

    if (typeof selectedData === 'object') {
      return Object.entries(selectedData || {})
        .filter(([_key, value]) => Array.isArray(value))
        .map(([groupKey, value]) => renderPermissionGroup(groupKey, value as any[]))
    }

    return <p>{dictionary?.loading}....</p>
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={3} className='flex flex-col gap-2'>
          {topLevelKeys.map(key => (
            <Button
              key={key}
              variant={selectedModule === key ? 'contained' : 'text'}
              startIcon={<i className={`${ICONS[key] || 'tabler-circle'} text-xl`} />}
              className='flex items-start justify-start text-nowrap'
              onClick={() => setSelectedModule(key)}
            >
              {key}
            </Button>
          ))}
        </Grid>

        <Grid item xs={12} sm>
          {renderPermissions()}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {typeof errors.permissions?.message === 'string' && selectedModule && (
          <Typography color='error' variant='body1' className='mt-2 text-end'>
            {errors.permissions.message}
          </Typography>
        )}
      </Grid>

      <Grid item xs={12} className='flex justify-end mt-4 gap-4'>
        <Button
          variant='outlined'
          onClick={() => {
            router.back()
          }}
        >
          {dictionary?.cancel}
        </Button>
        {hasPermission('create-operator-22') && (
          <Button type='submit' variant='contained'>
            {dictionary['role']?.createRole}
          </Button>
        )}
      </Grid>
    </>
  )
}

export default PermissionList
