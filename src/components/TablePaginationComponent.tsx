import { MenuItem, Pagination, Typography } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import type { Table } from '@tanstack/react-table'
import { useDictionary } from '@/contexts/DictionaryContext'

interface TablePaginationComponentProps<TData> {
  table?: Table<TData>
  count: number
  page: number
  pageSize: number
  onPageChange: (newPage: number) => void
  onPageSizeChange: (newSize: number) => void
}

const TablePaginationComponent = <TData,>({
  table,
  count,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange
}: TablePaginationComponentProps<TData>) => {
  // const pageSize = table.getState().pagination.pageSize
  // const pageIndex = table.getState().pagination.pageIndex
  const { dictionary } = useDictionary()

  return (
    <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>
      <div className='flex gap-2 items-center'>
        <div className='flex items-center gap-2'>
          <Typography className='hidden sm:block'>{dictionary?.show}</Typography>
          <CustomTextField
            select
            value={pageSize}
            onChange={e => {
              const newSize = Number(e.target.value)
              // table.setPageSize(newSize)
              onPageChange(1)
              onPageSizeChange(newSize) // ✅ Trigger API call for new page size
            }}
            className='max-sm:is-full sm:is-[70px]'
          >
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={75}>75</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </CustomTextField>
        </div>
      </div>

      <Pagination
        shape='rounded'
        color='primary'
        variant='tonal'
        count={count}
        page={page} // ✅ Adjust for zero-based index
        onChange={(_, newPage) => {
          // table.setPageIndex(newPage - 1)
          onPageChange(newPage) // ✅ Trigger API call for new page
        }}
        showFirstButton
        showLastButton
      />
    </div>
  )
}

export default TablePaginationComponent
