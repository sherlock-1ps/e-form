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
import { toast } from 'react-toastify'
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
import RenameProviderDialog from '@/components/dialogs/provider/RenameProviderDialog'
import ThumbnailProviderDialog from '@/components/dialogs/provider/ThumbnailProviderDialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateGameProvider } from '@/app/sevices/provider/provider'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type Game = {
  game_id: string
  game_code: string
  game_name: string
  category: string
  provider: string
  is_enable: boolean
  image: any
  currency: string
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
const columnHelper = createColumnHelper<Game>()

const ProviderNameTable = ({ data = [], page, pageSize, setPage, setPageSize }: any) => {
  const { showDialog } = useDialog()
  // States
  const [status, setStatus] = useState<InvoiceType['invoiceStatus']>('')
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const { lang: locale } = useParams()

  const queryClient = useQueryClient()

  const { mutate: toggleGameProviderStatus, isPending: pendingUpdate } = useMutation({
    mutationFn: updateGameProvider,

    onError: (error, _, context) => {
      console.error('Error updating game provider:', error)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['gameProvider'] })
    }
  })

  const handleCopyGameId = (gameId: string) => {
    navigator.clipboard
      .writeText(gameId)
      .then(() => toast.success('Copied success ✅', { autoClose: 3000 }))
      .catch(() => toast.error('Copied failed ', { autoClose: 3000 }))
  }

  const columns = useMemo<ColumnDef<Game, any>[]>(
    () => [
      columnHelper.accessor('game_id', {
        header: 'No',
        cell: ({ row }) => <Typography variant='h6'>{row.original.game_id}</Typography>
      }),

      columnHelper.accessor('game_name', {
        header: 'Game Name',

        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography variant='h6'>{row.original.game_name}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('image', {
        header: 'Thumbnail',
        cell: ({ row }) => <img src={row.original.image} width={32} alt='thumbnailGame' className=' rounded' />
      }),

      columnHelper.accessor('is_enable', {
        header: 'Status',
        cell: ({ row }) => {
          return (
            <div className='flex gap-1 items-center'>
              <Switch
                checked={row.original.is_enable}
                onChange={() => {
                  showDialog({
                    id: 'alertDialogConfirmResetPasswordCreateOperator',
                    component: (
                      <ConfirmAlert
                        id='alertDialogConfirmResetPasswordCreateOperator'
                        title={'Do you want to change the status game'}
                        content1={`Change this ${row.original.game_name} status game ?`}
                        onClick={() => {
                          toggleGameProviderStatus({
                            game_id: row.original.game_id,
                            is_enable: !row.original.is_enable
                          })
                        }}
                      />
                    ),
                    size: 'sm'
                  })
                }}
                disabled={pendingUpdate}
              />
              <Typography>Enable</Typography>
            </div>
          )
        }
      }),

      columnHelper.display({
        id: 'action',
        header: '',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'Rename',
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () =>
                      showDialog({
                        id: 'RenameProviderDialog',
                        component: (
                          <RenameProviderDialog id='RenameProviderDialog' data={row.original} onClick={() => {}} />
                        ),
                        size: 'sm'
                      })
                  }
                },
                {
                  text: 'Change Thumbnail',
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () =>
                      showDialog({
                        id: 'ThumbnailProviderDialog',
                        component: (
                          <ThumbnailProviderDialog
                            id='ThumbnailProviderDialog'
                            data={row.original}
                            onClick={() => {}}
                          />
                        ),
                        size: 'sm'
                      })
                  }
                },
                {
                  text: 'Copy UID',
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-primary',
                    onClick: () => handleCopyGameId(row.original.game_id)
                  }
                }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

  const table = useReactTable<Game>({
    data: data.list,
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
                  <th
                    key={header.id}
                    style={{
                      width: header.index === 7 ? 50 : 'auto'
                    }}
                  >
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
                  No data available
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
        count={data.total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </Card>
  )
}

export default ProviderNameTable
