'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import React from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

// Style Imports
import { CardContent } from '@mui/material'

import styles from '@core/styles/table.module.css'

interface currencyData {
  id: number
  currency: string
  name: string
  offsetDeposit: string
  offsetWithdraw: string
  icon: string
}

// Column Definitions
const columnHelper = createColumnHelper<currencyData>()

const dataMockup: currencyData[] = [
  {
    id: 1,
    currency: 'usd',
    name: 'ดอลล่าร์สหรัฐ',
    offsetDeposit: '5%',
    offsetWithdraw: '5%',
    icon: 'usa'
  }
]

const columns = [
  columnHelper.accessor('id', {
    header: 'Provider',
    cell: info => {
      const row = info.row.original

      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={`/images/setting-website/currency/${row.icon}Icon.png`}
            alt={row.name}
            style={{ width: '24px', height: '24px', borderRadius: '8px' }}
          />
          <span>{row.name}</span>
        </div>
      )
    }
  }),
  columnHelper.accessor('name', {
    header: 'Currency',
    cell: info => {
      const row = info.row.original

      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>{row.name}</span>
        </div>
      )
    }
  }),
  columnHelper.accessor('offsetWithdraw', {
    header: 'Turnover (THB)',
    cell: info => info.getValue()
  }),
  columnHelper.accessor('offsetWithdraw', {
    header: 'Net Win/Loss (THB)',
    cell: info => info.getValue()
  }),
  columnHelper.accessor('offsetWithdraw', {
    header: 'API Royalty Fee',
    cell: info => info.getValue()
  }),
  columnHelper.accessor('offsetWithdraw', {
    header: 'Exchange Rate',
    cell: info => info.getValue()
  }),
  columnHelper.accessor('offsetWithdraw', {
    header: 'Total payment (THB)',
    cell: info => info.getValue()
  })
]

const InvoiceProviderByOneTable: React.FC = () => {
  // State
  const [data] = useState(dataMockup)

  // Table Hook
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
                  <tr>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default InvoiceProviderByOneTable
