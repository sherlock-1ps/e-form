'use client'

// React Imports
import React, { useState } from 'react'

// MUI Imports

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

// Style Imports
import { CardContent } from '@mui/material'

import styles from '@core/styles/table.module.css'

interface ProviderData {
  id: number
  providerId: string
  providerName: string
  type: string
  image: string
  typeCalculate: string
  division: string
  subRows?: any // Updated type to allow optional subRows
}

interface Props {
  keyProp?: string
}

// Column Definitions
const columnHelper = createColumnHelper<ProviderData>()

const dataMockup: ProviderData[] = [
  {
    id: 1,
    providerId: 'pg',
    providerName: 'Sa Gaming Casino',
    type: 'slot',
    image: 'provider1',
    typeCalculate: 'คำนวนยอดเสีย',
    division: '5%',
    subRows: [
      { id: 11, providerName: 'Sub Provider 1', image: 'sub1', typeCalculate: '5%', division: 'ส่วนแบ่งขั้นที่ 1' },
      { id: 12, providerName: 'Sub Provider 2', image: 'sub2', typeCalculate: '1%', division: 'ส่วนแบ่งขั้นที่ 2' }
    ]
  },
  {
    id: 2,
    providerId: 'pg',
    providerName: 'WM Casino',
    type: 'slot',
    image: 'provider2',
    typeCalculate: 'คำนวนยอดเสีย',
    division: '5%',
    subRows: [
      { id: 21, providerName: 'Sub Provider A', image: 'subA', typeCalculate: '10%', division: 'ส่วนแบ่งขั้นที่ 1' }
    ]
  },
  {
    id: 3,
    providerId: 'pg',
    providerName: 'Dream Gaming Casino',
    type: 'slot',
    image: 'provider3',
    typeCalculate: 'คำนวนยอดเสีย',
    division: '4%'
  },
  {
    id: 4,
    providerId: 'pg',
    providerName: 'Sexy Gaming Casino',
    type: 'slot',
    image: 'provider4',
    typeCalculate: 'คำนวนยอดเสีย',
    division: '4%'
  },
  {
    id: 5,
    providerId: 'pg',
    providerName: 'King Maker',
    type: 'casino',
    image: 'provider5',
    typeCalculate: 'คำนวนยอดเสีย',
    division: '8%'
  },
  {
    id: 6,
    providerId: 'pg',
    providerName: 'EBET',
    type: 'casino',
    image: 'provider6',
    typeCalculate: 'คำนวนยอดเสีย',
    division: '8%'
  },
  {
    id: 7,
    providerId: 'pg',
    providerName: 'ALLBET',
    type: 'sport',
    image: 'provider7',
    typeCalculate: 'คำนวนยอดเสีย',
    division: '8%'
  },
  {
    id: 8,
    providerId: 'pg',
    providerName: 'Pragmatic Casino',
    type: 'casino',
    image: 'provider3',
    typeCalculate: 'คำนวนยอดเสีย',
    division: '4%'
  },
  {
    id: 9,
    providerId: 'pg',
    providerName: 'PG Slot game',
    type: 'lottery',
    image: 'provider5',
    typeCalculate: 'คำนวนยอดเสีย',
    division: '4%'
  },
  {
    id: 10,
    providerId: 'pg',
    providerName: 'Spinix',
    type: 'lottery',
    image: 'provider1',
    typeCalculate: 'คำนวนยอดเสีย',
    division: '4%'
  }
]

const columns = [
  columnHelper.accessor('id', {
    header: 'ค่ายเกม',
    cell: info => {
      const row = info.row.original

      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={`/images/setting-website/provider/${row.image}.png`}
            alt={row.providerName}
            style={{ width: '40px', height: '40px', borderRadius: '8px' }}
          />
          <span>{row.providerName}</span>
        </div>
      )
    }
  }),
  columnHelper.accessor('division', {
    header: 'เปอร์เซ็นการคืน',
    cell: info => {
      const row = info.row.original

      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>{row.division}</span>
          {row.subRows && (
            <IconButton size='small' onClick={() => info.row.toggleExpanded()}>
              {info.row.getIsExpanded() ? (
                <i className='tabler-arrow-up text-[20px]' />
              ) : (
                <i className='tabler-arrow-down text-[20px]' />
              )}
            </IconButton>
          )}
        </div>
      )
    }
  }),
  columnHelper.accessor('typeCalculate', {
    cell: info => info.getValue(),
    header: 'วิธีการคำนวน'
  })
]

const SettingCashbackProviderTable: React.FC<Props> = ({ keyProp }) => {
  // State
  const [data] = useState(() => dataMockup.filter(item => item.type === keyProp))

  // Table Hook
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSubRows: row => row.subRows || [],
    filterFns: {
      fuzzy: () => false
    }
  })

  return (
    <Card>
      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className='bg-primary text-white'>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <React.Fragment key={row.id}>
                  {/* Main Row */}
                  <tr>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>

                  {/* Sub-Rows (if available) */}
                  {row.getIsExpanded() && row.subRows?.length > 0 && (
                    <tr>
                      <td colSpan={columns.length}>
                        <table style={{ width: '100%', borderRadius: '8px', padding: '10px' }}>
                          <tbody>
                            {row.subRows.map(subRow => (
                              <tr key={subRow.id}>
                                {subRow.getVisibleCells().map(subCell => (
                                  <td key={subCell.id}>
                                    {subCell.column.id === 'id'
                                      ? null
                                      : flexRender(subCell.column.columnDef.cell, subCell.getContext())}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default SettingCashbackProviderTable
