'use client'

// React Imports
import { useState, useEffect, useMemo, Fragment } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
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
  getSortedRowModel,
  getExpandedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, ExpandedState, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import type { ThemeColor } from '@core/types'
import type { InvoiceType } from '@/types/apps/invoiceTypes'
import type { Locale } from '@configs/i18n'

// Component Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import { useDictionary } from '@/contexts/DictionaryContext'

import { toast } from 'react-toastify'
import { useFetchDetailLogOwnerMutationOption } from '@/queryOptions/log/logQueryOptions'
import { FormatShowDate } from '@/utils/formatShowDate'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type AuditLogType = {
  log_id: string
  created_at: string
  action: string
  email: string
  ip: string
  device: string
  location: string
  status: string
}

type DetailLogData = {
  [log_id: string]: {
    created_at: string
    log_id: string
    payload: string
    old_value: string
    response: string
    ip: string
    device: string
    location: string
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

// Column Definitions
const columnHelper = createColumnHelper<AuditLogType>()

const AuditLogTable = ({ data, page, pageSize, setPage, setPageSize }: any) => {
  const { dictionary } = useDictionary()
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [expandedData, setExpandedData] = useState<DetailLogData>({})

  const { mutateAsync } = useFetchDetailLogOwnerMutationOption()

  const columns = useMemo<ColumnDef<AuditLogType, any>[]>(
    () => [
      columnHelper.accessor('created_at', {
        header: dictionary?.dateTime,
        cell: ({ row }) => <Typography variant='h6'>{FormatShowDate(row.original.created_at)}</Typography>
      }),

      columnHelper.accessor('action', {
        header: dictionary?.action,

        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography variant='h6'>{row.original.action}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('email', {
        header: dictionary?.email,
        cell: ({ row }) => <Typography variant='h6'>{row.original.email}</Typography>
      }),
      columnHelper.accessor('device', {
        header: dictionary?.device,
        cell: ({ row }) => <Typography variant='h6'>{row.original.device}</Typography>
      }),

      columnHelper.accessor('location', {
        header: dictionary?.geolocation,
        cell: ({ row }) => <Typography variant='h6'>{row.original.location}</Typography>
      }),
      columnHelper.accessor('ip', {
        header: 'IP',
        cell: ({ row }) => <Typography variant='h6'>{row.original.ip}</Typography>
      }),
      columnHelper.accessor('status', {
        header: dictionary?.status,
        cell: ({ row }) => (
          <Chip
            color={row.original.status == 'success' ? 'success' : 'primary'}
            label={row.original.status}
            size='small'
            variant='tonal'
          />
        )
      }),
      {
        id: 'expand',
        cell: ({ row }) => (
          <button
            onClick={async () => {
              row.toggleExpanded()
              const logId = row.original.log_id
              if (!expandedData[logId]) {
                const res = await mutateAsync({ log_id: logId })
                if (res?.data) {
                  setExpandedData(prev => ({ ...prev, [logId]: res.data }))
                }
              }
            }}
          >
            {row.getIsExpanded() ? (
              <i className='tabler-chevron-up text-xl' />
            ) : (
              <i className='tabler-chevron-down text-xl' />
            )}
          </button>
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable<AuditLogType>({
    data: data.list,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      expanded
    },
    initialState: {
      pagination: {
        pageSize: 999
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    // globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel()
  })

  return (
    <Card>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead className='border-0'>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className='bg-primary text-white'>
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
                  {dictionary?.noDataAvailable}
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, table.getState().pagination.pageSize)
                .map(row => (
                  <Fragment key={row.id}>
                    <tr className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                    {row.getIsExpanded() && expandedData[row.original.log_id] && (
                      <tr key={`${row.id}-expanded`}>
                        <td colSpan={columns.length} className=' bg-primaryLighter'>
                          <div className='p-2 flex flex-col gap-2 '>
                            <div className='flex gap-6'>
                              <Typography className='w-[112px]'>Datetime :</Typography>
                              <Typography variant='h6'>{expandedData[row.original.log_id]?.created_at}</Typography>
                            </div>
                            <div className='flex gap-6'>
                              <Typography className='w-[112px]'>Log ID :</Typography>
                              <Typography variant='h6'>{expandedData[row.original.log_id]?.log_id}</Typography>
                            </div>
                            <div className='flex gap-6'>
                              <Typography className='w-[112px]'>Payload :</Typography>
                              <div className=' rounded-sm border w-full p-2 bg-primaryLighter'>
                                <Typography variant='h6' className='text-wrap'>
                                  {JSON.stringify(expandedData[row.original.log_id]?.payload, null, 2)}
                                </Typography>
                              </div>
                            </div>
                            <div className='flex gap-6'>
                              <Typography className='w-[112px]'>Old Value :</Typography>
                              <div className=' rounded-sm border w-full p-2 bg-primaryLighter'>
                                <Typography variant='h6' className='text-wrap'>
                                  {JSON.stringify(expandedData[row.original.log_id]?.old_value, null, 2)}
                                </Typography>
                              </div>
                            </div>
                            <div className='flex gap-6'>
                              <Typography className='w-[112px]'>Response :</Typography>
                              <div className=' rounded-sm border w-full p-2 bg-primaryLighter'>
                                <Typography variant='h6' className='text-wrap'>
                                  {JSON.stringify(expandedData[row.original.log_id]?.response, null, 2)}
                                </Typography>
                              </div>
                            </div>
                            <div className='flex gap-6'>
                              <Typography className='w-[112px]'>IP :</Typography>
                              <Typography variant='h6'>{expandedData[row.original.log_id]?.ip}</Typography>
                            </div>
                            <div className='flex gap-6'>
                              <Typography className='w-[112px]'>Device :</Typography>
                              <Typography variant='h6'>{expandedData[row.original.log_id]?.device}</Typography>
                            </div>
                            <div className='flex gap-6'>
                              <Typography className='w-[112px]'>Geolocation :</Typography>
                              <Typography variant='h6' className='text-wrap'>
                                {expandedData[row.original.log_id]?.location}
                              </Typography>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
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

export default AuditLogTable
