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
import RenameAccountDialog from '@/components/dialogs/account/RenameAccountDialog'
import { useDictionary } from '@/contexts/DictionaryContext'
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
type RoleConfig = {
  role_id: string
  parent_role_id: string
  role_name: string
  description: string
  is_enable: boolean
  operator_prefix: string
  member: number
  update_at: string
}

// Column Definitions
const columnHelper = createColumnHelper<RoleConfig>()

const RoleTable = ({ data, page, pageSize, setPage, setPageSize, onUpdateStatus, onDeleteRole }: any) => {
  const { showDialog } = useDialog()
  const { dictionary } = useDictionary()
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const { lang: locale } = useParams()

  const columns = useMemo<ColumnDef<RoleConfig, any>[]>(
    () => [
      columnHelper.display({
        id: 'id',
        header: 'ID',
        cell: ({ row }) => <Typography variant='h6'>{row.index + 1}</Typography>
      }),

      columnHelper.accessor('role_name', {
        header: 'Role',

        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography variant='h6'>{row.original.role_name}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('description', {
        header: dictionary?.description,
        cell: ({ row }) => <Typography variant='h6'>{row.original.description}</Typography>
      }),
      columnHelper.accessor('member', {
        header: dictionary?.member,
        cell: ({ row }) => <Typography variant='h6'>{row.original.member}</Typography>
      }),

      columnHelper.accessor('is_enable', {
        header: dictionary?.status,
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
                        title={dictionary?.changeStatus}
                        // content1={`Change this operator status?`}
                        content1={
                          dictionary?.changeStatusWithName
                            ?.replace('{{name}}', row.original.role_name)
                            .replace('{{key}}', 'role') ?? `Change this ${row.original.role_name} role status?`
                        }
                        onClick={() => {
                          onUpdateStatus(row.original.role_id, !row.original.is_enable)
                        }}
                      />
                    ),
                    size: 'sm'
                  })
                }}
              />
              <Typography>{row.original.is_enable ? dictionary?.enable : dictionary?.disabled}</Typography>
            </div>
          )
        }
      }),
      columnHelper.accessor('update_at', {
        header: dictionary?.lastLogin,
        cell: ({ row }) => <Typography variant='h6'>{FormatShowDate(row.original.update_at)}</Typography>
      }),

      columnHelper.display({
        id: 'action',
        header: '',
        cell: ({ row }) => {
          const roleItem = encodeURIComponent(JSON.stringify(row.original))
          const options: OptionType[] = []

          options.push({
            text: (
              <Link
                href={{
                  pathname: `/${locale}/role/managerole`,
                  query: { role: roleItem }
                }}
                className='no-underline text-textSecondary'
                onClick={e => e.stopPropagation()}
              >
                {dictionary['role']?.editRole}
              </Link>
            )
          })
          if (row.original.member == 0) {
            options.push({
              text: <span>Delete</span>,
              menuItemProps: {
                className: 'flex items-center gap-2 text-textSecondary',
                onClick: () =>
                  showDialog({
                    id: 'alertDialogConfirmResetPasswordCreateOperator',
                    component: (
                      <ConfirmAlert
                        id='alertDialogConfirmResetPasswordCreateOperator'
                        title={dictionary['role']?.confirmDelete}
                        content1={dictionary['role']?.titleDelete}
                        content2={dictionary['role']?.detailDelete}
                        onClick={() => {
                          onDeleteRole(row.original.role_id)
                        }}
                      />
                    ),
                    size: 'sm'
                  })
              }
            })
          }

          return (
            <div className='flex items-center'>
              <OptionMenu iconButtonProps={{ size: 'medium' }} iconClassName='text-textSecondary' options={options} />
            </div>
          )
        },
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

  const table = useReactTable<RoleConfig>({
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
                  {dictionary?.noDataAvailable}
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

export default RoleTable
