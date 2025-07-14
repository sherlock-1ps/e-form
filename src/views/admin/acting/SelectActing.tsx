/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState, useRef, useMemo, InputHTMLAttributes, Fragment } from 'react'
import {
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  TextField,
  Typography,
  Checkbox,
  Pagination,
  CardContent,
  Card,
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper
} from '@mui/material'

import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
// import { Grid, Typography, Button, CardContent, Card, CircularProgress, Pagination, IconButton } from '@mui/material'
import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import {
  useGetDepartmentExternalQueryOption,
  useGetPersonExternalQueryOption,
  useGetPositionExternalQueryOption,
  useFetchGetFormSignaturePermisionFieldsQueryOption,
  useGetActingListQueryOption
} from '@/queryOptions/form/formQueryOptions'
import { useFlowStore } from '@/store/useFlowStore'
import { createRoot } from 'react-dom/client'
import { AgGridReact } from 'ag-grid-react'
import { ArrowCircleLeft, ArrowCircleRight, Person, OtherHouses, Work, Delete, Edit } from '@mui/icons-material'
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  RowSelectionModule,
  ValidationModule,
  RowApiModule,
  TextFilterModule,
  CustomFilterModule,
  NumberFilterModule,
  DateFilterModule
  // ColDef, // Import ColDef for column definitions
  // IsRowSelectable
} from 'ag-grid-community'
import { useDictionary } from '@/contexts/DictionaryContext'

ModuleRegistry.registerModules([
  RowSelectionModule,
  ClientSideRowModelModule,
  RowApiModule,
  TextFilterModule,
  CustomFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ...(process.env.NODE_ENV !== 'production' ? [ValidationModule] : [])
])

// Define a type for your filter options
type FilterOption = {
  id: number
  key: string
  name: string
}

// Define a type for the data items in your lists and grids
interface DataItem {
  pk: string | number
  id: string | number
  name: string
  type: string
  typeId: string | number
}

// Define the props for DebouncedInput
interface DebouncedInputProps {
  value: string
  onChange: (value: string) => void
  isEng?: boolean
  debounce?: number
  maxLength?: number
  label?: string
  placeholder?: string
  inputProps?: InputHTMLAttributes<HTMLInputElement>
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  isEng = false,
  debounce = 550,
  maxLength,
  ...props
}: DebouncedInputProps) => {
  const [value, setValue] = useState<string>(initialValue)
  const { dictionary } = useDictionary()

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return (
    <CustomTextField
      {...props}
      value={value}
      onChange={e => {
        const input = e.target.value
        if (!isEng) {
          setValue(input)
          return
        }
        const isValid = /^[a-zA-Z0-9]*$/.test(input)
        if (isValid) {
          setValue(input)
        }
      }}
      inputProps={{
        ...(maxLength ? { maxLength } : {}),
        ...(props.inputProps || {})
      }}
    />
  )
}

const SelectActing = ({
  page,
  setPage,
  pageSize,
  setPageSize,
  filterType,
  setFilterType,
  searchText,
  setSearchText,
  selectedMoved,
  setSelectedMoved,
  isPersonOnly,
  titleLabel
}): JSX.Element => {
  const { dictionary } = useDictionary()

  let filterTypeOption: FilterOption[] = [
    {
      id: 1,
      key: 'person',
      name: 'บุคคล'
    },
    {
      id: 2,
      key: 'position',
      name: 'ตำแหน่ง'
    },
    {
      id: 3,
      key: 'department',
      name: 'หน่วยงาน'
    }
  ]

  if (isPersonOnly) {
    filterTypeOption = [
      {
        id: 1,
        key: 'person',
        name: 'บุคคล'
      }
    ]
  }

  // const selectedField = useFlowStore(state => state.selectedField)
  const gridRefSelecting = useRef<AgGridReact>(null)
  const gridRefSelectingRemove = useRef<AgGridReact>(null)

  // const [page, setPage] = useState<number>(1)
  // const [pageSize, setPageSize] = useState<number>(10)
  // const [filterType, setFilterType] = useState<string>('person')
  // const [searchText, setSearchText] = useState<string>('')

  // const [selectedMoved, setSelectedMoved] = useState<DataItem[]>(
  //   []
  // )
  const [searchTextSelected, setSearchTextSelected] = useState<string>('')

  const filteredSelectedMoved = selectedMoved.filter(item =>
    item.name.toLowerCase().includes(searchTextSelected.toLowerCase())
  )

  const { data: person } = useGetPersonExternalQueryOption(page, pageSize, searchText, {
    enabled: filterType === 'person'
  })
  const { data: position } = useGetPositionExternalQueryOption(page, pageSize, '', {
    enabled: filterType === 'position'
  })

  const { data: department } = useGetDepartmentExternalQueryOption(page, pageSize, '', {
    enabled: filterType === 'department'
  })

  const listData: Record<string, { data: DataItem[]; total: number } | undefined> = {
    person: person
      ? {
          data: person.data.map((p: any) => ({
            pk: `person-${p.id}`,
            id: p.id,
            name: p.name,
            type: 'บุคคล',
            typeId: '1'
          })),
          total: person.total
        }
      : undefined,
    position: position
      ? {
          data: position.data.map((pos: any) => ({
            pk: `position-${pos.id}`,
            id: pos.id,
            name: pos.name,
            type: 'ตำแหน่ง',
            typeId: '2'
          })),
          total: position.total
        }
      : undefined,
    department: department
      ? {
          data: department.data.map((dep: any) => ({
            pk: `department-${dep.id}`,
            id: dep.id,
            name: dep.name,
            type: 'หน่วยงาน',
            typeId: '3'
          })),
          total: department.total
        }
      : undefined
  }

  const lockRowSelectionByField = (currentSelectedData: DataItem[]) => {
    const isRowSelectable = (node: any) => {
      // Ensure node.data is of type DataItem
      const nodeDataItem = node.data as DataItem
      return currentSelectedData.findIndex(item => item.pk === nodeDataItem.pk) === -1
    }

    gridRefSelecting?.current?.api?.setGridOption('isRowSelectable', isRowSelectable)
    gridRefSelecting?.current?.api?.redrawRows() // Redraw rows to update checkbox states
  }
  //  singleRow isPersonOnly
  const rowSelection = useMemo(
    () =>
      ({
        mode: isPersonOnly ? 'singleRow' : 'multiRow',
        hideDisabledCheckboxes: true,
        isRowSelectable: (node: any) =>
          node.data ? selectedMoved.map(item => item.pk).indexOf(node.data.pk) === -1 : false
      }) as const, // Apply 'as const' to the entire object
    [selectedMoved]
  )

  const rowRemoveSelection = useMemo(
    () =>
      ({
        mode: isPersonOnly ? 'singleRow' : 'multiRow',
        hideDisabledCheckboxes: true
      }) as const, // Apply 'as const' to the entire object
    []
  )

  const moveSelected = () => {
    setSearchTextSelected('')
    const sel = gridRefSelecting.current?.api.getSelectedRows() as DataItem[] // Cast to DataItem[]
    setSelectedMoved(prev => {
      //   //  singleRow isPersonOnly
      const newItems = isPersonOnly ? [...sel] : [...prev, ...sel]
      // const newItems = [...sel]
      lockRowSelectionByField(newItems)
      return newItems
    })
  }

  const removeSelected = () => {
    setSearchTextSelected('')
    const sel = gridRefSelectingRemove.current?.api.getSelectedRows() as DataItem[] // Cast to DataItem[]
    setSelectedMoved(prev => {
      const newItems = prev.filter(item => !sel.some(remove => remove.pk === item.pk))
      lockRowSelectionByField(newItems)
      return newItems
    })
  }

  const handleUpdateActivity = () => {}

  // Effect to re-apply row selection logic when selectedMoved changes
  useEffect(() => {
    lockRowSelectionByField(selectedMoved)
  }, [selectedMoved, filterType, page, searchText]) // Add dependencies that might affect row data

  const columnDefs = useMemo<any[]>(
    () => [
      { headerName: 'ชื่อ', field: 'name', filter: false, flex: 1 },
      { headerName: 'ประเภท', field: 'type', filter: false, width: 100 },
      { headerName: 'รหัส', field: 'id', width: 70, filter: false }
    ],
    []
  )

  return (
    <Grid container spacing={2} className='flex flex-col'>
      <Grid item xs={12}>
        <Typography variant='h5' className='text-left' m={2}>
          {titleLabel}
        </Typography>
      </Grid>

      <Grid item xs={12} className='px-6 space-y-4 hi'>
        <FormControl component='fieldset'>
          <RadioGroup
            row
            value={filterType}
            onChange={e => {
              setFilterType(e.target.value)
              setPage(1)
              setSearchText('')
            }}
          >
            {filterTypeOption.map(option => (
              <FormControlLabel key={option.id} value={option.key} control={<Radio />} label={option.name} />
            ))}
          </RadioGroup>
        </FormControl>

        <div className='flex'>
          {/* Left List */}
          <div className='flex flex-col gap-2 w-1/2'>
            <Typography variant='h6' className='text-center'>
              รายการ
            </Typography>
            <DebouncedInput
              label={dictionary?.search}
              placeholder={'....'}
              value={searchText}
              onChange={newText => {
                setSearchText(newText)
              }}
            />
            <div className='w-full border border-gray-300 rounded overflow-y-auto space-y-2 p-2 h-[500px]'>
              <div className='w-full border border-gray-300 rounded overflow-y-auto space-y-2 p-2 h-[400px]'>
                <AgGridReact
                  rowHeight={30}
                  ref={gridRefSelecting}
                  rowData={listData[filterType]?.data || []} // Ensure rowData is an array, even if undefined
                  columnDefs={columnDefs}
                  // rowSelection={rowSelection.mode} // Pass only the mode string
                  // isRowSelectable={rowSelection.isRowSelectable} // Pass the function directly
                  rowSelection={rowSelection}
                  onRowSelected={event => {
                    console.log('Selected Row:', event.node.data)
                  }}
                  onSelectionChanged={event => {
                    // const selectedRows = event.api.getSelectedRows()
                    // console.log('All Selected Rows:', selectedRows)
                  }}
                  defaultColDef={{ sortable: true, filter: true }}
                />
              </div>

              <Pagination
                count={Math.ceil((listData[filterType]?.total || 0) / pageSize)}
                page={page}
                onChange={(_, value) => setPage(value)}
                size='small'
              />
            </div>
          </div>

          {/* Buttons */}
          <div className='flex flex-col justify-center items-center gap-4'>
            <Button variant='text' onClick={moveSelected}>
              <ArrowCircleRight fontSize='large' />
            </Button>

            <Button variant='text' onClick={removeSelected}>
              <ArrowCircleLeft fontSize='large' />
            </Button>
          </div>

          {/* Right List */}
          <div className='flex flex-col gap-2 w-1/2'>
            <Typography variant='h6' className='text-center'>
              รายการที่เลือก
            </Typography>
            <DebouncedInput
              label={dictionary?.search}
              placeholder={'....'}
              value={searchTextSelected}
              onChange={newText => setSearchTextSelected(newText)}
            />

            <div className='w-full border border-gray-300 rounded overflow-y-auto space-y-2 p-2 h-[400px]'>
              <AgGridReact
                ref={gridRefSelectingRemove}
                rowData={filteredSelectedMoved}
                columnDefs={columnDefs}
                // rowSelection={'multiple'} // Pass only the mode string
                // isRowSelectable={rowSelection} // Pass the function directly
                rowSelection={rowRemoveSelection}
                onRowSelected={event => {
                  // console.log('Selected Row:', event.node.data)
                }}
                onSelectionChanged={event => {
                  // const selectedRows = event.api.getSelectedRows()
                  // console.log('All Selected Rows:', selectedRows)
                }}
                defaultColDef={{ sortable: true, filter: true }}
              />
            </div>
          </div>
        </div>
      </Grid>

      {/* <Grid item xs={12} className='flex items-center justify-end gap-2 px-6'>
        <Button variant='contained' color='secondary' autoFocus onClick={() => {}}>
          {dictionary?.cancel}
        </Button>
        <Button variant='contained' onClick={handleUpdateActivity}>
          {dictionary?.confirm}
        </Button>
      </Grid> */}
    </Grid>
  )
}

export default SelectActing
