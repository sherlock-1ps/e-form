/* eslint-disable react-hooks/exhaustive-deps */
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
import GameCredentialProviderDialog from '@/components/dialogs/operators/GameCredentialProviderDialog'
import { ProviderCredentialType } from '@/types/credential/credentialTypes'

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

// Column Definitions
const columnHelper = createColumnHelper<ProviderCredentialType>()

const SelectNewProviderTable = ({ dataTable, category, updateMain }: any) => {
  const { showDialog } = useDialog()
  // States
  const [rowSelection, setRowSelection] = useState<{ [key: number]: boolean }>({})
  const [data, setData] = useState(...[dataTable])
  const [dataModify, setDataModify] = useState<ProviderCredentialType[]>(...[dataTable])
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const { lang: locale } = useParams()

  const handleChangeShareCredential = (share: string, index: number) => {
    const updatedData = [...dataModify]
    const percentHolder = data[index]?.percent_holder || 0

    let parsedShare = Number(share)

    if (isNaN(parsedShare) || parsedShare < 0) {
      parsedShare = 0
    }

    if (parsedShare > percentHolder) {
      parsedShare = percentHolder
    }

    updatedData[index] = {
      ...updatedData[index],
      selectShare: parsedShare
    }

    updateMain(category, index, parsedShare, undefined)
    setDataModify(updatedData)
  }

  useEffect(() => {
    if (rowSelection) {
      const updateData = dataModify.map((item, index) => ({
        ...item,
        is_select: Boolean(rowSelection[index])
      }))
      setDataModify(updateData)
      updateMain(category, undefined, undefined, updateData)
    }
  }, [rowSelection])

  useEffect(() => {
    if (data) {
      const defaultSelection = data.reduce((acc: Record<number, boolean>, item: { is_select: any }, index: number) => {
        if (item.is_select) {
          acc[index] = true
        }

        return acc
      }, {})

      setRowSelection(defaultSelection)
    }
  }, [data])

  const columns = useMemo<ColumnDef<ProviderCredentialType, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            sx={{
              color: 'red',
              '&.Mui-checked': {
                color: 'green'
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)'
              }
            }}
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },

      columnHelper.display({
        id: 'provider',
        header: 'Select All Slot Provider',
        enableSorting: false,
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography variant='h6'>{row.original.provider_name}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('image', {
        header: '',
        cell: ({ row }) => <img src={row.original.image} alt='providerLogo' className='w-[48px] h-[48px]  rounded-md' />
      }),
      columnHelper.accessor('percent_holder', {
        header: 'Holder %',
        cell: ({ row }) => {
          return

          // return <Typography variant='h6'>{row.original.percent_holder}%</Typography>
        }
      }),
      columnHelper.display({
        id: 'credential',
        header: 'Credential %',
        enableSorting: false,
        cell: ({ row }) => {
          return
          // (
          //   <CustomTextField
          //     type='number'
          //     label=''
          //     className='min-w-[122px]'
          //     onChange={e => {
          //       handleChangeShareCredential(e.target.value, row.index)
          //     }}
          //     value={dataModify[row.index]?.selectShare}
          //     inputProps={{
          //       min: 0,
          //       max: row.original.percent_holder // Max limit
          //     }}
          //   />
          // )
        }
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

  const table = useReactTable<ProviderCredentialType>({
    data: data,
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
                  <th
                    key={header.id}
                    style={{
                      width: header.index === 0 ? 40 : 'auto'
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
                      {row.getVisibleCells().map((cell, index) => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          {index == 3 && row.original.percent_holder && (
                            <Typography variant='h6'>
                              {row.original.percent_holder - Number(dataModify[row.index]?.selectShare)}%
                            </Typography>
                          )}
                          {index == 4 && dataModify[row.index]?.is_select && (
                            <CustomTextField
                              type='number'
                              label=''
                              className='min-w-[122px]'
                              onChange={e => handleChangeShareCredential(e.target.value, row.index)}
                              onKeyDown={e => {
                                if (e.key === '-' || e.key === 'e') e.preventDefault()
                              }}
                              value={dataModify[row.index]?.selectShare || ''}
                            />
                          )}
                        </td>
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

export default SelectNewProviderTable
