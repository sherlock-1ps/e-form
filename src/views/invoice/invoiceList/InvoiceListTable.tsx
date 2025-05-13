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
import { useDialog } from '@/hooks/useDialog'
import { Switch } from '@mui/material'
import UploadPaymentInvoiceDialog from '@/components/dialogs/invoice/UploadPaymentInvoiceDialog'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type InvoiceTypeWithAction = InvoiceType & {
  action?: string
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

const dataMock = [
  {
    id: 1,
    issuedDate: 837,
    address: '7777 Mendez Plains',
    company: 'Hall-Robbins PLC',
    companyEmail: 'don85@johnson.com',
    country: 'USA',
    contact: '(616) 865-4180',
    name: 'เติมงาน รับเพิ่มทันที',
    service: 'Software Development',
    total: 3428,
    avatar: '',
    avatarColor: 'primary',
    invoiceStatus: 'Paid',
    balance: '$724',
    dueDate: '23 Feb 2025',
    group: 3,
    bonus: 0,
    bank: {
      bankNumber: '987-2-32454-2',
      bankName: 'Alice Johnson',
      bankImage: 'kbank'
    }
  },
  {
    id: 2,
    issuedDate: 254,
    address: '04033 Wesley Wall Apt. 961',
    company: 'Mccann LLC and Sons',
    companyEmail: 'brenda49@taylor.info',
    country: 'Haiti',
    contact: '(226) 204-8287',
    name: 'โปรแรง! เติมงาน รับสิทธิพิเศษทันที',
    service: 'UI/UX Design & Development',
    total: 5219,
    avatar: '/images/avatars/1.png',
    invoiceStatus: 'Downloaded',
    balance: 0,
    dueDate: '15 Feb 2025',
    group: 1,
    bonus: 0,
    bank: {
      bankNumber: '987-2-32454-2',
      bankName: 'Elijah Nguyen',
      bankImage: 'kbank'
    }
  },
  {
    id: 3,
    issuedDate: 793,
    address: '5345 Robert Squares',
    company: 'Leonard-Garcia and Sons',
    companyEmail: 'smithtiffany@powers.com',
    country: 'Denmark',
    contact: '(955) 676-1076',
    name: 'ดีลพิเศษ เติมงาน รับโบนัสทันที',
    service: 'Unlimited Extended License',
    total: 3719,
    avatar: '/images/avatars/2.png',
    invoiceStatus: 'Paid',
    balance: 0,
    dueDate: '03 Feb 2025',
    group: 4,
    bonus: 10,
    bank: {
      bankNumber: '987-2-32454-2',
      bankName: 'Bob Smith',
      bankImage: 'kbank'
    }
  },
  {
    id: 4,
    issuedDate: 316,
    address: '19022 Clark Parks Suite 149',
    company: 'Smith, Miller and Henry LLC',
    companyEmail: 'mejiageorge@lee-perez.com',
    country: 'Cambodia',
    contact: '(832) 323-6914',
    name: 'โปรโมชั่นสุดคุ้ม รับงานฟรีทันที',
    service: 'Software Development',
    total: 4749,
    avatar: '/images/avatars/3.png',
    invoiceStatus: 'Sent',
    balance: 0,
    dueDate: '11 Feb 2025',
    group: 5,
    bonus: 0,
    bank: {
      bankNumber: '987-2-32454-2',
      bankName: 'Charlie Brown',
      bankImage: 'kbank'
    }
  },
  {
    id: 5,
    issuedDate: 465,
    address: '8534 Saunders Hill Apt. 583',
    company: 'Garcia-Cameron and Sons',
    companyEmail: 'brandon07@pierce.com',
    country: 'Martinique',
    contact: '(970) 982-3353',
    name: 'ช้อปครบ รับของแถมฟรีทันที',
    service: 'UI/UX Design & Development',
    total: 4056,
    avatar: '/images/avatars/4.png',
    invoiceStatus: 'Draft',
    balance: '$815',
    dueDate: '30 Feb 2025',
    group: 2,
    bonus: 0,
    bank: {
      bankNumber: '987-2-32454-2',
      bankName: 'Diana Prince',
      bankImage: 'kbank'
    }
  },
  {
    id: 6,
    issuedDate: 192,
    address: '661 Perez Run Apt. 778',
    company: 'Burnett-Young PLC',
    companyEmail: 'guerrerobrandy@beasley-harper.com',
    country: 'Botswana',
    contact: '(511) 938-9617',
    name: 'เติมงาน รับเพิ่มทันที',
    service: 'UI/UX Design & Development',
    total: 2771,
    avatar: '',
    avatarColor: 'secondary',
    invoiceStatus: 'Paid',
    balance: 0,
    dueDate: '24 Feb 2025',
    group: 1,
    bonus: 0,
    bank: {
      bankNumber: '987-2-32454-2',
      bankName: 'Elijah Nguyen',
      bankImage: 'kbank'
    }
  },
  {
    id: 7,
    issuedDate: 879,
    address: '074 Long Union',
    company: 'Wilson-Lee LLC',
    companyEmail: 'williamshenry@moon-smith.com',
    country: 'Montserrat',
    contact: '(504) 859-2893',
    name: 'โปรแรง! เติมงาน รับสิทธิพิเศษทันที',
    service: 'UI/UX Design & Development',
    total: 2713,
    avatar: '',
    avatarColor: 'success',
    invoiceStatus: 'Draft',
    balance: '$407',
    dueDate: '22 Feb 2025',
    group: 5,
    bonus: 10,
    bank: {
      bankNumber: '987-2-32454-2',
      bankName: 'Bob Smith',
      bankImage: 'kbank'
    }
  },
  {
    id: 8,
    issuedDate: 540,
    address: '5225 Ford Cape Apt. 840',
    company: 'Schwartz, Henry and Rhodes Group',
    companyEmail: 'margaretharvey@russell-murray.com',
    country: 'Oman',
    contact: '(758) 403-7718',
    name: 'โปรโมชั่นสุดคุ้ม รับงานฟรีทันที',
    service: 'Template Customization',
    total: 4309,
    avatar: '/images/avatars/5.png',
    invoiceStatus: 'Paid',
    balance: '-$205',
    dueDate: '10 Feb 2025',
    group: 3,
    bonus: 0,
    bank: {
      bankNumber: '987-2-32454-2',
      bankName: 'Alice Johnson',
      bankImage: 'kbank'
    }
  },
  {
    id: 9,
    issuedDate: 701,
    address: '23717 James Club Suite 277',
    company: 'Henderson-Holder PLC',
    companyEmail: 'dianarodriguez@villegas.com',
    country: 'Cambodia',
    contact: '(292) 873-8254',
    name: 'ดีลพิเศษ เติมงาน รับโบนัสทันที',
    service: 'Software Development',
    total: 3367,
    avatar: '/images/avatars/6.png',
    invoiceStatus: 'Downloaded',
    balance: 0,
    dueDate: '24 Feb 2025',
    group: 4,
    bonus: 0,
    bank: {
      bankNumber: '987-2-32454-2',
      bankName: 'Charlie Brown',
      bankImage: 'kbank'
    }
  },
  {
    id: 10,
    issuedDate: 150,
    address: '4528 Myers Gateway',
    company: 'Page-Wise PLC',
    companyEmail: 'bwilson@norris-brock.com',
    country: 'Guam',
    contact: '(956) 803-2008',
    name: 'ช้อปครบ รับของแถมฟรีทันที',
    service: 'Software Development',
    total: 4776,
    avatar: '/images/avatars/7.png',
    invoiceStatus: 'Downloaded',
    balance: '$305',
    dueDate: '02 Feb 2025',
    group: 2,
    bonus: 0,
    bank: {
      bankNumber: '987-2-32454-2',
      bankName: 'Diana Prince',
      bankImage: 'kbank'
    }
  },
  {
    id: 11,
    issuedDate: 150,
    address: '4528 Myers Gateway',
    company: 'Page-Wise PLC',
    companyEmail: 'bwilson@norris-brock.com',
    country: 'Guam',
    contact: '(956) 803-2008',
    name: 'ช้อปครบ รับของแถมฟรีทันที',
    service: 'Software Development',
    total: 4776,
    avatar: '/images/avatars/7.png',
    invoiceStatus: 'Downloaded',
    balance: '$305',
    dueDate: '02 Feb 2025',
    group: 2,
    bonus: 0,
    bank: {
      bankNumber: '987-2-32454-2',
      bankName: 'Diana Prince',
      bankImage: 'kbank'
    }
  }
]

// Column Definitions
const columnHelper = createColumnHelper<InvoiceTypeWithAction>()

const InvoiceListTable = () => {
  const { showDialog } = useDialog()
  // States
  const [status, setStatus] = useState<InvoiceType['invoiceStatus']>('')
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[dataMock])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const { lang: locale } = useParams()

  const columns = useMemo<ColumnDef<InvoiceTypeWithAction, any>[]>(
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

      columnHelper.accessor('id', {
        header: 'No.',
        cell: ({ row }) => <Typography variant='h6'>6000</Typography>
      }),
      columnHelper.accessor('id', {
        header: 'Credential',
        cell: ({ row }) => <Typography variant='h6'>OPB1</Typography>
      }),
      columnHelper.accessor('company', {
        header: 'Invoice Name',

        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography variant='h6'>{row.original.company}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('total', {
        header: 'Total Payment',
        cell: ({ row }) => <Typography variant='h6'>816,123</Typography>
      }),
      columnHelper.accessor('country', {
        header: 'Status',
        cell: ({ row }) => <Typography variant='h6'>GMT+7</Typography>
      }),
      columnHelper.accessor('country', {
        header: 'Payment',
        cell: ({ row }) => <Typography variant='h6'>Thailand</Typography>
      }),
      columnHelper.accessor('balance', {
        header: 'Invoice Date',
        cell: ({ row }) => {
          return (
            <div className='flex gap-1 items-center'>
              <Switch checked={true} onChange={() => {}} />
              <Typography>Jan 1, 2025</Typography>
            </div>
          )
        }
      }),

      columnHelper.accessor('action', {
        header: '',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'Upload Payment',
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () =>
                      showDialog({
                        id: 'UploadPaymentInvoiceDialog',
                        component: <UploadPaymentInvoiceDialog id='UploadPaymentInvoiceDialog' onClick={() => {}} />,
                        size: 'sm'
                      })
                  }
                },
                {
                  text: (
                    <Link
                      href={{
                        pathname: `/${locale}/invoice/invoicelist/id`,
                        query: { invoiceId: '7784547' }
                      }}
                      className='text-secondary no-underline transition-transform duration-300 ease-in-out hover:scale-105'
                      onClick={e => e.stopPropagation()}
                    >
                      View Invoice
                    </Link>
                  )
                },
                {
                  text: 'Download as PDF',
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary'
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
    [data, filteredData]
  )

  const table = useReactTable({
    data: filteredData as InvoiceType[],
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

  useEffect(() => {
    const filteredData = data?.filter(invoice => {
      if (status && invoice.invoiceStatus.toLowerCase().replace(/\s+/g, '-') !== status) return false

      return true
    })

    setFilteredData(filteredData)
  }, [status, data])

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
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* <TablePagination
        component={() => (
          <>
            <TablePaginationComponent table={table} />
          </>
        )}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
      /> */}
    </Card>
  )
}

export default InvoiceListTable
