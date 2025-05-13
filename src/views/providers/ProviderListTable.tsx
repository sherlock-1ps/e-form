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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProvider } from '@/app/sevices/provider/provider'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type Provider = {
  provider_id: string
  provider_code: string
  provider_name: string
  categories: string[]
  percent_holder: number
  is_enable: boolean
  image: any
  currencies_code: string[]
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
const columnHelper = createColumnHelper<Provider>()

const ProviderListTable = ({ data, page, pageSize, setPage, setPageSize }: any) => {
  const { showDialog } = useDialog()
  // States
  const [rowSelection, setRowSelection] = useState({})
  // const [data, setData] = useState(...[dataMock])
  const [globalFilter, setGlobalFilter] = useState('')

  const queryClient = useQueryClient()

  const { mutate: toggleProviderStatus, isPending: pendingUpdate } = useMutation({
    mutationFn: updateProvider,

    onError: (error, _, context) => {
      console.error('Error updating provider:', error)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] })
    }
  })

  // Hooks
  const { lang: locale } = useParams()

  const columns = useMemo<ColumnDef<Provider, any>[]>(
    () => [
      columnHelper.accessor('provider_id', {
        header: 'No',
        cell: ({ row }) => <Typography variant='h6'>{row.index + 1}</Typography>,
        enableSorting: false
      }),

      columnHelper.accessor('provider_name', {
        header: 'Provider',

        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography variant='h6'>{row.original.provider_name}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('image', {
        header: 'Logo',
        cell: ({ row }) => <img src={row.original.image} width={32} alt='providerImg' className=' rounded' />
      }),
      columnHelper.accessor('categories', {
        header: 'Type',
        cell: ({ row }) => (
          <div className='flex gap-1'>
            {row?.original?.categories?.map((item, index) => {
              return (
                <Chip
                  key={index}
                  label={item}
                  variant='filled'
                  size='small'
                  className={`self-start rounded-sm text-white capitalize bg-${item}`}
                />
              )
            })}
          </div>
        )
      }),

      columnHelper.accessor('currencies_code', {
        header: 'Currency',
        cell: ({ row }) => <Typography>{row.original.currencies_code.join(', ')}</Typography>
      }),
      columnHelper.accessor('percent_holder', {
        header: 'Share',
        cell: ({ row }) => <Typography>{row.original.percent_holder}%</Typography>
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
                        title={'Do you want to change the status'}
                        content1={`Change this ${row.original.provider_name} provider status ?`}
                        onClick={() => {
                          toggleProviderStatus({
                            provider_id: row.original.provider_id,
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
        cell: ({ row }) => (
          <div className='flex items-center'>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                {
                  text: (
                    <Link
                      href={{
                        pathname: `/${locale}/providers/name`,
                        query: {
                          provider: row.original.provider_code,
                          providerName: row.original.provider_name,
                          providerImg: row.original.image
                        }
                      }}
                      className='text-secondary no-underline transition-transform duration-300 ease-in-out hover:scale-105'
                      onClick={e => e.stopPropagation()}
                    >
                      View Game
                    </Link>
                  )
                },
                {
                  text: 'Change Logo',
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () =>
                      showDialog({
                        id: 'ChangeProviderLogoDialog',
                        component: (
                          <ChangeProviderLogoDialog
                            id='ChangeProviderLogoDialog'
                            data={row.original}
                            onClick={() => {}}
                          />
                        ),
                        size: 'sm'
                      })
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

  const table = useReactTable<Provider>({
    // data: data.data.list,
    data: data.list || [],
    // data: filteredData as InvoiceType[],
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
        pageSize: pageSize
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
        count={data.max_page}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </Card>
  )
}

export default ProviderListTable
