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
import { Button, Typography } from '@mui/material'
import { OptionType } from '@/@core/components/option-menu/types'
import { FormatShowDate } from '@/utils/formatShowDate'
import { useDialog } from '@/hooks/useDialog'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'

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
}
// Column Definitions
const columnHelper = createColumnHelper<TableRowData>()

const UserDashboardTable = ({ projectTable, page, pageSize, setPage, setPageSize, count, onManage }: any) => {
  const { showDialog } = useDialog()

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
      columnHelper.accessor('created_at', {
        header: 'วันที่สร้าง',
        cell: ({ row }) => <Typography variant='body2'>{FormatShowDate(row.original.created_at)}</Typography>
      }),
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
              <Typography variant='body2'>-</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('FormDataDetails', {
        header: 'ชื่องาน',
        cell: ({ row }) => <Typography color='text.primary'>-</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'สถานะล่าสุด',
        cell: ({ row }) => (
          <div className='flex  gap-2'>
            <Typography style={{ color: '#0463EA' }} variant='h6'>
              {row.original.status}
            </Typography>
            <Typography>{FormatShowDate(row.original.updated_at)}</Typography>
          </div>
        ),
        enableSorting: false
      }),
      columnHelper.accessor('current_assignees_user_names', {
        header: 'ผู้รับผิดชอบปัจจุบัน',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {/* <CustomAvatar size={32}>{getInitials(row.original.current_assignees_user_names)}</CustomAvatar> */}
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.current_assignees_user_names ?? '-'}
              </Typography>
              <Typography variant='body2'>{row.original.current_assignees_position ?? '-'}</Typography>
            </div>
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
                      onClick={() => onManage(row.original.id)}
                    />
                  ),
                  size: 'sm'
                })
              }}
            >
              จัดการ
            </Button>
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
      <DebouncedInput
        value={globalFilter ?? ''}
        onChange={value => setGlobalFilter(String(value))}
        placeholder='ค้นหา'
        className='p-4'
      />

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
        count={count}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </Card>
  )
}

export default UserDashboardTable
