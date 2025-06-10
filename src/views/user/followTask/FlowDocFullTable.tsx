'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

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

// Component Imports
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import { useDialog } from '@/hooks/useDialog'
import { Chip, Switch, Tooltip } from '@mui/material'
import { useResetPasswordOperatorMutationOption } from '@/queryOptions/operator/operatorQueryOptions'
import { toast } from 'react-toastify'
import { useDictionary } from '@/contexts/DictionaryContext'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { useHasPermission } from '@/hooks/useHasPermission'
import { OptionType } from '@/@core/components/option-menu/types'
import { FormatShowDate } from '@/utils/formatShowDate'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type flowType = {
  create_by: string
  created_at: string
  comment: string
  f_first_name: string
  f_last_name: string
  department_name: string
  f_dept_id: string
  f_position_id: string
  f_position_name: string
  form_data_id: number
  id: number
  flow_activity_name: string
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

// Column Definitions
const columnHelper = createColumnHelper<flowType>()

const FlowDocFullTable = ({ data = [], page, pageSize, setPage, setPageSize }: any) => {
  const { showDialog } = useDialog()
  const { dictionary } = useDictionary()
  const router = useRouter()
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const { lang: locale } = useParams()

  const columns = useMemo<ColumnDef<flowType, any>[]>(
    () => [
      columnHelper.accessor('f_first_name', {
        header: 'ผู้ดำเนินการ',
        cell: ({ row }) => (
          <div className=' flex flex-col items-center'>
            <Typography variant='body1'>
              {row.original.f_first_name} {row.original.f_last_name}
            </Typography>
            <Typography variant='body1'>{row.original.f_position_name}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('department_name', {
        header: 'หน่วยงาน / สังกัด',
        cell: ({ row }) => <Typography variant='body1'>{row.original.department_name}</Typography>
      }),
      // columnHelper.display({
      //   id: 'department',
      //   header: 'หน่วยงาน / สังกัด',
      //   cell: ({ row }) => <Typography variant='body1'>-</Typography>,
      //   enableSorting: false
      // }),
      columnHelper.accessor('created_at', {
        header: 'บันทึกเวลา',
        cell: ({ row }) => <Typography variant='body1'>{FormatShowDate(row.original.created_at)}</Typography>
      }),
      columnHelper.accessor('comment', {
        header: 'ความคิดเห็น',
        cell: ({ row }) => <Typography variant='body1'>{row.original.comment}</Typography>
      }),
      columnHelper.accessor('flow_activity_name', {
        header: 'สถานะ',
        cell: ({ row }) => <Typography variant='body1'>{row.original.flow_activity_name}</Typography>
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

  const table = useReactTable({
    data: (data as flowType[]) || [],
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
    // globalFilterFn: fuzzyFilter,
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
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead className='border-0'>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className='bg-secondary text-white'>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
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
                      </>
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
                  ยังไม่มีการเดินหนังสือ
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
        count={data?.total || 1}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </Card>
  )
}

export default FlowDocFullTable
