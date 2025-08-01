'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import AvatarGroup from '@mui/material/AvatarGroup'
import LinearProgress from '@mui/material/LinearProgress'
import Card from '@mui/material/Card'
import Checkbox from '@mui/material/Checkbox'
import CardHeader from '@mui/material/CardHeader'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
// import { type ColumnFiltersState, type VisibilityState } from '@tanstack/react-table'
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox'

import {
  Directions,
  Preview,
  Pageview,
  PlayCircleOutline,
  Article,
  FindInPage,
  DeviceHub,
  Delete
} from '@mui/icons-material'

import { useDeleteFormDataQueryOption } from '@/queryOptions/form/formQueryOptions'
// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type FilterFn,
  type ColumnFiltersState,
  type VisibilityState
} from '@tanstack/react-table'

import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports

import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@/components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { getInitials } from '@/utils/getInitials'
import { Button, Chip, Tooltip, Typography } from '@mui/material'
import { OptionType } from '@/@core/components/option-menu/types'
import { FormatShowDate } from '@/utils/formatShowDate'
import { useDialog } from '@/hooks/useDialog'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import { useAuthStore } from '@/store/useAuthStore'
import { useDictionary } from '@/contexts/DictionaryContext'
import { viewFlow } from '@/app/sevices/form/formServices'
import { adminGroupId } from '@/utils/viewPermissionRoutes'
declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// const flexibleFilter: FilterFn<any> = (row, columnId, filterValue) => {
//   const value = row.getValue(columnId)
//   const filter = String(filterValue).toLowerCase()

//   // 1. If the value is an array, check if any element includes the filter text
//   if (Array.isArray(value)) {
//     return value.some(item => String(item).toLowerCase().includes(filter))
//   }

//   // 2. If the value is a string, check if it includes the filter text
//   if (typeof value === 'string') {
//     return value.toLowerCase().includes(filter)
//   }

//   // 3. If it's neither, don't include it in the results
//   return false
// }

// const fuzzyFilter: FilterFn<any> = (row, columnId, filterValue) => {
//   console.log('array row, columnId, filterValue')
//   const rowValue = row.getValue(columnId) as string[]

//   const query = String(filterValue).toLowerCase()

//   // Return false if the row value isn't an array
//   if (!Array.isArray(rowValue)) {
//     return false
//   }

//   // Check if any item in the array includes the filter query
//   return rowValue.some(item => String(item).toLowerCase().includes(query))
// }

// const fuzzyFilter: FilterFn<any> = (row, columnId, value) => {
//   const cellValue = row.getValue(columnId)
//   const filterValue = value

//   // console.log(row, columnId, value, cellValue)

//   if (Array.isArray(cellValue)) {
//     return cellValue.some(item => rankItem(String(item), filterValue).passed)
//   }

//   return rankItem(String(cellValue), filterValue).passed
// }

const fuzzyFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const cellValue = row.getValue(columnId)
  const query = String(filterValue).toLowerCase()

  // 1. ตรวจสอบว่าเป็น Array หรือไม่
  if (Array.isArray(cellValue)) {
    // ถ้าเป็น Array, ให้ค้นหาในแต่ละ item
    // .some จะคืนค่า true ทันทีถ้าเจอตัวแรกที่ตรงเงื่อนไข
    return cellValue.some(item => String(item).toLowerCase().includes(query))
  }

  // 2. ถ้าไม่ใช่ Array, ตรวจสอบว่าเป็น String หรือไม่
  if (typeof cellValue === 'string') {
    // ถ้าเป็น String, ให้ค้นหาโดยตรง
    return cellValue.toLowerCase().includes(query)
  }

  // 3. ถ้าไม่ใช่ทั้งสองอย่าง (เช่น null หรือ number) ให้ข้ามไป
  return false
}

// const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {

//   const itemRank = rankItem(row.getValue(columnId), value)

//   // Store the itemRank info
//   addMeta({
//     itemRank
//   })

//   // Return if the item should be filtered in/out
//   return itemRank.passed
// }

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

interface UserInfo {
  name: string
  position: string
  avatar?: string
  online?: boolean
}

interface LatestStatus {
  label: string
  date: string
  color: 'orange' | 'purple' | 'green' | 'blue' | 'red' | string
}

interface TableRowData {
  id: number
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
  name: string
  flow_version_id: number
  is_sign: boolean
  sign_date: string
  sign: any | null
  FormDataDetails: any | null
  current_activities: number[]
  current_assignees_user: any | null
  current_assignees_department: any | null
  current_assignees_position: any | null
  current_activity_names: string[] | null
  current_assignees_user_names: string[]
  current_assignees_department_names: string[] | null
  current_assignees_position_names: string[] | null
  status: string
  FormDataDetailMerge: any | null
  f_first_name: any
  f_last_name: any
  f_position_name: any
  department_name: any
  flow_id: number
}

const statusMap: Record<
  string,
  { color: 'primary' | 'success' | 'warning' | 'error' | 'default' | 'secondary'; label?: string }
> = {
  draft: { color: 'primary', label: 'Draft' },
  end: { color: 'secondary', label: 'End' },
  active: { color: 'success', label: 'Active' }
}
// Column Definitions
const columnHelper = createColumnHelper<TableRowData>()

const UserDashboardTable = ({
  projectTable,
  page,
  pageSize,
  setPage,
  setPageSize,
  count,
  onManage,
  onViewFlow,
  isView = true
}: any) => {
  const { showDialog } = useDialog()
  const profile = useAuthStore(state => state.profile)
  const { mutateAsync: deleteFormData } = useDeleteFormDataQueryOption()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    f_first_name: false,
    f_last_name: false
  })
  const isAdmin = profile && adminGroupId.some(id => profile.USER_GROUP_LISTS_ID.includes(id))

  // alert('')

  // States
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [globalFilter, setGlobalFilter] = useState('')

  const { dictionary } = useDictionary()
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([{ id: 'name', value: 'ทด' }])

  const viewClick = (row: any) => {
    {
      onManage(row.original.id, row.original?.status, row.original.flow_id)
      // showDialog({
      //   id: 'alertDialogConfirmToggleTrigger',
      //   component: (
      //     <ConfirmAlert
      //       id='alertDialogConfirmToggleTrigger'
      //       title='จัดการ Flow'
      //       content1='คุณต้องการจัดการ Flow นี้ใช่หรือไม่'
      //       onClick={() => onManage(row.original.id, row.original?.status, row.original.flow_id)}
      //     />
      //   ),
      //   size: 'sm'
      // })
    }
  }

  const onDelete = (row: any) => {
    deleteFormData({ form_data_id: row.original.id })
  }

  // Hooks
  const columns = useMemo<ColumnDef<TableRowData, any>[]>(
    () => [
      columnHelper.display({
        id: 'action',
        header: dictionary?.action,

        cell: ({ row }) => {
          const status = row.original.status

          return (
            <div className='flex gap-2 justify-between'>
              <DeviceHub
                color='warning'
                fontSize='large'
                titleAccess={dictionary?.viewFlow}
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  onViewFlow(row.original.id)
                }}
              />
              {isView ? (
                status !== 'draft' ? (
                  <FindInPage
                    color='info'
                    titleAccess={dictionary?.viewDetail}
                    fontSize='large'
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                      viewClick(row)
                    }}
                  />
                ) : null
              ) : (
                <PlayCircleOutline
                  color='primary'
                  titleAccess={dictionary?.action}
                  fontSize='large'
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    viewClick(row)
                  }}
                />
              )}

              {status == 'draft' || isAdmin ? (
                <Delete
                  color='secondary'
                  fontSize='large'
                  titleAccess={dictionary?.viewFlow}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    showDialog({
                      id: 'alertDialogConfirmToggleTrigger',
                      component: (
                        <ConfirmAlert
                          id='alertDialogConfirmToggleTrigger'
                          title={dictionary?.confirmDelete}
                          content1={dictionary?.confirmDeleteItem}
                          onClick={() => onDelete(row)}
                        />
                      ),
                      size: 'sm'
                    })
                  }}
                />
              ) : null}
            </div>
          )
        },
        enableSorting: false
      }),

      columnHelper.accessor('f_first_name', {}),
      columnHelper.accessor('f_last_name', {}),

      columnHelper.accessor('name', {
        header: dictionary?.docutmentName,
        cell: ({ row }) => (
          <Typography color='text.primary' variant='body2'>
            {row.original?.name}
          </Typography>
        )
      }),
      // columnHelper.accessor('current_activity_names', {
      //   header: dictionary?.latestDocumentProcess,
      //   filterFn: filterInArray,

      //   cell: ({ getValue }) => (getValue() || (['ยังไม่มีการเดินหนังสือ'] as string[])).join(', ')
      // }),
      columnHelper.accessor('current_activity_names', {
        header: dictionary?.latestDocumentProcess,
        // filterFn: filterInArray,
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Typography variant='body2'>
              {row.original.current_activity_names ? row.original.current_activity_names[0] : 'ยังไม่มีการเดินหนังสือ'}
            </Typography>

            <Tooltip title={(row.original.current_activity_names || []).join(', ')}>
              <ForwardToInboxIcon className='text-primary cursor-help' fontSize='small' />
            </Tooltip>
          </div>
        )
      }),

      // columnHelper.accessor('current_activity_names', { header: 'xxxxxx' }),
      columnHelper.accessor('status', {
        header: dictionary?.latestStatus,
        cell: ({ row }) => {
          const status = row.original.status
          const chipConfig = statusMap[status] || { color: 'default', label: status }

          return (
            <div className='flex gap-2 items-center'>
              <Typography variant='body2'>{FormatShowDate(row.original.updated_at)}</Typography>
              <Chip
                className='capitalize'
                // label={chipConfig.label}
                label={
                  chipConfig.label == 'Draft'
                    ? dictionary?.draft
                    : chipConfig.label == 'Active'
                      ? dictionary?.inProgress
                      : dictionary?.finished
                }
                size='small'
                variant='tonal'
                color={chipConfig.color}
              />
            </div>
          )
        },
        enableSorting: false
      }),

      columnHelper.accessor('current_assignees_user_names', {
        header: dictionary?.currentResponsible,
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {row.original.status === 'draft' ? (
              <Typography className='font-medium' variant='body2'>
                {profile?.userInformation?.F_FIRST_NAME || ''} {profile?.userInformation?.F_LAST_NAME || ''}
              </Typography>
            ) : (
              <>
                <Typography className='font-medium truncate max-w-[220px] cursor-help' variant='body2'>
                  {[
                    ...(row.original.current_assignees_user_names || []),
                    ...(row.original.current_assignees_position_names || []),
                    ...(row.original.current_assignees_department_names || [])
                  ].join(', ') || '-'}
                </Typography>

                <Tooltip
                  title={
                    [
                      ...(row.original.current_assignees_user_names || []),
                      ...(row.original.current_assignees_position_names || []),
                      ...(row.original.current_assignees_department_names || [])
                    ].join(', ') || '-'
                  }
                >
                  <PeopleOutlineIcon className='text-primary cursor-help' fontSize='small' />
                </Tooltip>
              </>
            )}
          </div>
        )
      }),
      columnHelper.accessor('created_by', {
        header: dictionary?.startedBy,
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {/* <CustomAvatar src={row.original.startedBy.avatar} size={34} /> */}
            {/* <CustomAvatar size={32}>{getInitials(row.original.startedBy.name)}</CustomAvatar> */}
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.created_by}
              </Typography>
              <Typography variant='body2'>{`${row.original.f_first_name} ${row.original.f_last_name}`}</Typography>
            </div>
          </div>
        )
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: projectTable as TableRowData[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      columnVisibility,
      // columnFilters,
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 999
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <Card>
      <div className='flex items-center justify-between p-4'>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder={dictionary?.search}
          className='w-1/3'
        />
        <Typography variant='h6' className='text-right '>
          {dictionary?.total} <span className='font-bold text-primary'>{count}</span> {dictionary?.item}
        </Typography>
      </div>

      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={classnames({
                          'flex items-center': header.column.getIsSorted(),
                          'cursor-pointer select-none': header.column.getCanSort()
                        })}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <i className='tabler-chevron-up text-xl' />,
                          desc: <i className='tabler-chevron-down text-xl' />
                        }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  ไม่มีข้อมูล
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, table.getState().pagination.pageSize)
                .map(row => {
                  return (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  )
                })}
            </tbody>
          )}
        </table>
      </div>
      <TablePaginationComponent
        table={table}
        count={Math.ceil(count / pageSize)}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </Card>
  )
}

export default UserDashboardTable
