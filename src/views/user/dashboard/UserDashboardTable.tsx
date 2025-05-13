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
  createdAt: string
  startedBy: UserInfo
  jobName: string
  jobId: string
  latestStatus: LatestStatus
  currentAssignee: UserInfo
}
// Column Definitions
const columnHelper = createColumnHelper<TableRowData>()

const UserDashboardTable = ({ projectTable, page, pageSize, setPage, setPageSize }: any) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[projectTable])
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
      columnHelper.accessor('createdAt', {
        header: 'วันที่สร้าง',
        cell: ({ row }) => <Typography variant='body2'>{row.original.createdAt}</Typography>
      }),
      columnHelper.accessor('startedBy.name', {
        header: 'เริ่มโดย',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {/* <CustomAvatar src={row.original.startedBy.avatar} size={34} /> */}
            <CustomAvatar size={32}>{getInitials(row.original.startedBy.name)}</CustomAvatar>
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.startedBy.name}
              </Typography>
              <Typography variant='body2'>{row.original.startedBy.position}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('jobName', {
        header: 'ชื่องาน',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.jobName}</Typography>
      }),
      columnHelper.accessor('latestStatus.date', {
        header: 'สถานะล่าสุด',
        cell: ({ row }) => (
          <div className='flex  gap-2'>
            <Typography style={{ color: '#0463EA' }} variant='h6'>
              {row.original.latestStatus.label}
            </Typography>
            <Typography>{row.original.latestStatus.date}</Typography>
          </div>
        ),
        enableSorting: false
      }),
      columnHelper.accessor('currentAssignee.name', {
        header: 'ผู้รับผิดชอบปัจจุบัน',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <CustomAvatar size={32}>{getInitials(row.original.currentAssignee.name)}</CustomAvatar>
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.currentAssignee.name}
              </Typography>
              <Typography variant='body2'>{row.original.currentAssignee.position}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.display({
        id: 'action',
        header: 'การดำเนินการ',
        cell: ({ row }) => {
          const options: OptionType[] = [
            {
              text: 'ดู workflow',
              menuItemProps: {
                className: 'flex items-center gap-2 text-textSecondary',
                onClick: () => {}
              }
            }
          ]

          return (
            <OptionMenu
              options={options}
              customTrigger={
                <div className='flex gap-2'>
                  <Button variant='contained' color='secondary' className='flex items-center justify-center px-4 py-1'>
                    จัดการ
                    <OptionMenu iconButtonProps={{ size: 'medium' }} iconClassName='text-white' options={[]} />
                  </Button>
                </div>
              }
            />
          )
        },
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: data as TableRowData[],
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
        count={data.max_page}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </Card>
  )
}

export default UserDashboardTable
