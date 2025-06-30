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
import { Chip, IconButton, Switch, Tooltip } from '@mui/material'
import type { TextFieldProps } from '@mui/material/TextField'

import { toast } from 'react-toastify'
import { useDictionary } from '@/contexts/DictionaryContext'

import CustomTextField from '@/@core/components/mui/TextField'

import { useApiCallStore } from '@/store/useApiCallStore'
import { useDeleteApiMediaQueryOption } from '@/queryOptions/form/formQueryOptions'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
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

type ApiData = {
  id: number
  created_by: string
  created_at: string
  name: string
  method: 'get' | 'post' | 'put' | 'delete' | string
  url: string
  query_params: Record<string, any> | null
  authorization: string | null
  headers: any
  body: any
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
const columnHelper = createColumnHelper<ApiData>()

const ApiCallFormTable = ({ data, onEditApi, page, pageSize, setPage, setPageSize }: any) => {
  const { showDialog } = useDialog()
  const { dictionary } = useDictionary()
  const router = useRouter()
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')

  const setSelectedApi = useApiCallStore(state => state.setSelectedApi)

  const { mutateAsync } = useDeleteApiMediaQueryOption()

  // Hooks
  const { lang: locale } = useParams()

  const handleDelete = async (id: number) => {
    try {
      const response = await mutateAsync({ id })
      if (response?.code == 'SUCCESS') {
        toast.success('ลบ Api สำเร็จ!', { autoClose: 3000 })
      }
    } catch (error) {
      console.log('error', error)
      toast.error('ลบ Api ล้มเหลว!', { autoClose: 3000 })
    }
  }

  const columns = useMemo<ColumnDef<ApiData, any>[]>(
    () => [
      columnHelper.accessor('name', {
        header: 'ชื่อ API Call',
        cell: ({ row }) => <Typography variant='body1'>{row.original.name}</Typography>
      }),
      columnHelper.accessor('method', {
        header: 'ประเภท',
        cell: ({ row }) => <Typography variant='body1'>{row.original.method}</Typography>
      }),
      columnHelper.accessor('url', {
        header: 'URL',
        cell: ({ row }) => <Typography variant='body1'>{JSON.stringify(row.original.url)}</Typography>
      }),
      columnHelper.display({
        id: 'action',
        header: 'จัดการ',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton
              onClick={() => {
                setSelectedApi(row.original)
                onEditApi('edit')
              }}
            >
              <i className='tabler-pencil' />
            </IconButton>
            <IconButton
              className='text-error'
              onClick={() => {
                showDialog({
                  id: 'alertDeleteApiCall',
                  component: (
                    <ConfirmAlert
                      id='alertDeleteApiCall'
                      title={'ลบ API Call'}
                      content1={'คุณต้องการ API Call นี้ใช่หรือไม่'}
                      onClick={() => {
                        handleDelete(row.original.id)
                      }}
                    />
                  ),
                  size: 'sm'
                })
              }}
            >
              <i className='tabler-trash ' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

  const table = useReactTable({
    data: (data?.data as ApiData[]) || [],
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
      <DebouncedInput
        value={globalFilter ?? ''}
        onChange={value => setGlobalFilter(String(value))}
        placeholder={dictionary?.search}
        className='p-4'
      />

      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className=' bg-primaryLight  text-primary'>
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
        count={Math.ceil(data.total / pageSize)}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </Card>
  )
}

export default ApiCallFormTable
