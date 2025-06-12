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

import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox'
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
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import type { ProjectTableRowType } from '@/types/pages/profileTypes'

// Component Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'
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

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

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

  // States
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const columns = useMemo<ColumnDef<TableRowData, any>[]>(
    () => [
      // {
      //   id: 'select',
      //   header: ({ table }) => (
      //     <Checkbox
      //       {...{
      //         checked: table.getIsAllRowsSelected(),
      //         indeterminate: table.getIsSomeRowsSelected(),
      //         onChange: table.getToggleAllRowsSelectedHandler()
      //       }}
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <Checkbox
      //       {...{
      //         checked: row.getIsSelected(),
      //         disabled: !row.getCanSelect(),
      //         indeterminate: row.getIsSomeSelected(),
      //         onChange: row.getToggleSelectedHandler()
      //       }}
      //     />
      //   )
      // },
      // columnHelper.accessor('created_at', {
      //   header: 'วันที่สร้าง',
      //   cell: ({ row }) => <Typography variant='body2'>{FormatShowDate(row.original.created_at)}</Typography>
      // }),

      columnHelper.accessor('created_by', {
        header: 'เริ่มโดย',
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
      }),
      columnHelper.accessor('name', {
        header: 'ชื่องาน',
        cell: ({ row }) => (
          <Typography color='text.primary' variant='body2'>
            {row.original?.name}
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'สถานะล่าสุด',
        cell: ({ row }) => {
          const status = row.original.status
          const chipConfig = statusMap[status] || { color: 'default', label: status }

          return (
            <div className='flex gap-2 items-center'>
              <Chip
                className='capitalize'
                label={chipConfig.label}
                size='small'
                variant='tonal'
                color={chipConfig.color}
              />
              <Typography variant='body2'>{FormatShowDate(row.original.updated_at)}</Typography>
            </div>
          )
        },
        enableSorting: false
      }),
      columnHelper.accessor('current_activity_names', {
        header: 'การเดินหนังสือล่าสุด',
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
      columnHelper.accessor('current_assignees_user_names', {
        header: 'ผู้รับผิดชอบปัจจุบัน',
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
      columnHelper.display({
        id: 'action',
        header: 'การดำเนินการ',
        cell: ({ row }) => {
          const options: OptionType[] = [
            // {
            //   text: 'แก้ไข',
            //   menuItemProps: {
            //     className: 'flex items-center  text-textSecondary',
            //     onClick: () => {}
            //   }
            // }
          ]

          return (
            // <OptionMenu
            //   options={options}
            //   customTrigger={
            //     <div className='flex items-center '>
            //       <Button
            //         variant='contained'
            //         color='primary'
            //         className=''
            //         onClick={() => {
            //           showDialog({
            //             id: 'alertDialogConfirmToggleTrigger',
            //             component: (
            //               <ConfirmAlert
            //                 id='alertDialogConfirmToggleTrigger'
            //                 title='จัดการ Flow'
            //                 content1='คุณต้องการจัดการ Flow นี้ใช่หรือไม่'
            //                 onClick={() => handleClickManage(row.original.id)}
            //               />
            //             ),
            //             size: 'sm'
            //           })

            //         }}
            //       >
            //         จัดการ
            //       </Button>
            //       {/* <OptionMenu iconButtonProps={{ size: 'medium' }} iconClassName='text-white' options={[]} /> */}
            //     </div>
            //   }
            // />
            <div className='flex gap-2'>
              <Button
                variant='outlined'
                color='primary'
                className=''
                onClick={() => {
                  onViewFlow(row.original.id)
                }}
              >
                ดูโฟลว์
              </Button>
              <Button
                variant='contained'
                color='primary'
                className=''
                onClick={() => {
                  showDialog({
                    id: 'alertDialogConfirmToggleTrigger',
                    component: (
                      <ConfirmAlert
                        id='alertDialogConfirmToggleTrigger'
                        title='จัดการ Flow'
                        content1='คุณต้องการจัดการ Flow นี้ใช่หรือไม่'
                        onClick={() => onManage(row.original.id, row.original?.status, row.original.flow_id)}
                      />
                    ),
                    size: 'sm'
                  })
                }}
              >
                {isView ? 'ดูรายละเอียด' : 'จัดการ'}
              </Button>
            </div>
          )
        },
        enableSorting: false
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
          placeholder='ค้นหา'
          className='w-1/3'
        />
        <Typography variant='h6' className='text-right '>
          มีทั้งหมด <span className='font-bold text-primary'>{count}</span> รายการ
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
