'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

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
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
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
import { getGroupLabelPlayer, getGroupPlayerGradient } from '@/utils/getGroupPlayer'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import { useDialog } from '@/hooks/useDialog'
import { Switch } from '@mui/material'
import ChangeProviderLogoDialog from '@/components/dialogs/provider/ChangeProviderLogoDialog'
import ResultGameDialog from '@/components/dialogs/transaction/ResultGameDialog'
import { useDictionary } from '@/contexts/DictionaryContext'

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

type GameTransaction = {
  tx_ID: number
  round_ID: number
  date_time: string
  prefix: string
  user_id: string
  provider: string
  game_name: string
  type: 'BET' | 'WIN' | 'REFUND' | string // extend as needed
  amount: number
}

// Column Definitions
const columnHelper = createColumnHelper<GameTransaction>()

const TransactionTable = () => {
  const { showDialog } = useDialog()
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([
    {
      tx_ID: 500000001,
      round_ID: 7900503,
      date_time: 'Jan 1, 2025 14:30',
      prefix: 'A1B2C3',
      user_id: 'XL55DOG00054D613',
      provider: 'PG',
      game_name: 'Treasures of Aztec',
      type: 'BET',
      amount: 10.0
    }
  ])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const { dictionary } = useDictionary()

  // Hooks
  const { lang: locale } = useParams()

  const columns = useMemo<ColumnDef<GameTransaction, any>[]>(
    () => [
      columnHelper.accessor('tx_ID', {
        header: 'tx_ID',
        cell: ({ row }) => <Typography variant='h6'>{row.original.tx_ID}</Typography>
      }),

      columnHelper.accessor('round_ID', {
        header: 'Round_ID',

        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography variant='h6'>{row.original.round_ID}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('date_time', {
        header: 'Date Time',
        cell: ({ row }) => <Typography variant='h6'>OPB1</Typography>
      }),
      columnHelper.accessor('prefix', {
        header: 'Prefix',
        cell: ({ row }) => <Typography variant='h6'>{row.original.prefix}</Typography>
      }),
      columnHelper.accessor('user_id', {
        header: 'User ID',
        cell: ({ row }) => <Typography variant='h6'>{row.original.user_id}</Typography>
      }),
      columnHelper.accessor('provider', {
        header: 'Provoider',
        cell: ({ row }) => <Typography variant='h6'>{row.original.provider}</Typography>
      }),
      columnHelper.accessor('game_name', {
        header: 'Game Name',
        cell: ({ row }) => <Typography variant='h6'>{row.original.game_name}</Typography>
      }),
      columnHelper.accessor('type', {
        header: 'Type',
        cell: ({ row }) => <Typography variant='h6'>{row.original.type}</Typography>
      }),
      columnHelper.accessor('amount', {
        header: 'Amount',
        cell: ({ row }) => <Typography variant='h6'>{row.original.amount}</Typography>
      }),
      columnHelper.display({
        id: 'action',
        header: '',
        cell: ({ row }) => (
          <Button
            variant='outlined'
            onClick={() => {
              showDialog({
                id: 'ResultGameDialog',
                component: <ResultGameDialog img={'hello'} />,
                size: 'sm'
              })
            }}
          >
            {dictionary['result']}
          </Button>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
  )

  const table = useReactTable({
    data: filteredData as GameTransaction[],
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
        pageSize: 10
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
                {dictionary['noDataAvailable']}
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
    </Card>
  )
}

export default TransactionTable
