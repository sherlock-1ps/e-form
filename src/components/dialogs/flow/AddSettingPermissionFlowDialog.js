/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
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
  Pagination
} from '@mui/material'
import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import {
  useGetDepartmentExternalQueryOption,
  useGetPersonExternalQueryOption,
  useGetPositionExternalQueryOption
} from '@/queryOptions/form/formQueryOptions'
import { useFlowStore } from '@/store/useFlowStore'
import { createRoot } from 'react-dom/client'
import { AgGridReact } from 'ag-grid-react'

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

  //  ColumnMenuModule,
  //  ColumnsToolPanelModule,
  // ContextMenuModule,
  //  RowGroupingModule
} from 'ag-grid-community'

// import 'ag-grid-community/styles/ag-grid.css'
// import 'ag-grid-community/styles/ag-theme-alpine.css'
// import { ColumnDef } from '@tanstack/react-table'

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

const filterTypeOption = [
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
  },
  {
    id: 4,
    key: 'dataField',
    name: 'ฟิวด์'
  }
]

const dataFieldValue = [{ pk: '1-4', id: 1, name: 'เจ้าของเรื่อง', type: 'ฟิวด์', typeId: '4' }]
const dataField = {
  data: dataFieldValue,
  total: dataFieldValue.length
}

const DebouncedInput = ({ value: initialValue, onChange, isEng = false, debounce = 550, maxLength, ...props }) => {
  const [value, setValue] = useState(initialValue)

  // useEffect(() => {
  //   setValue(initialValue)
  // }, [initialValue])

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     onChange(value)
  //   }, debounce)

  //   return () => clearTimeout(timeout)
  // }, [value])

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

// const columnDefs: ColDef[] = [
//   { headerName: 'เลือก', checkboxSelection: true },
//   { headerName: 'ชื่อ', field: 'name', filter: true },
//   { headerName: 'ตำแหน่ง', field: 'position', filter: true }
// ]

/*
  const { data: personLists } = useGetPersonExternalQueryOption(page, pageSize, '', '', {
    enabled: filterType === 'person'
  })

  const { data: positionLists } = useGetPositionExternalQueryOption(page, pageSize, '', '', {
    enabled: filterType === 'position'
  })

  const { data: departmentLists } = useGetDepartmentExternalQueryOption(page, pageSize, '', '', {
    enabled: filterType === 'department'
  })
*/

const AddSettingPermissionFlowDialog = ({ id }) => {
  const { closeDialog } = useDialog()
  const myDiagram = useFlowStore(state => state.myDiagram)
  const selectedField = useFlowStore(state => state.selectedField)
  const gridRefSelecting = useRef(null)
  const gridRefSelectingRemove = useRef(null)
  const [page, setPage] = useState(1)
  // const [selectedData, setSelectedData] = useState([])
  const [selectedMoved, setSelectedMoved] = useState([...(selectedField?.data?.assignees ?? [])])

  const columnDefs = useMemo(
    () => [
      { headerName: 'ชื่อ', field: 'name', filter: false },
      { headerName: 'ประเภท', field: 'type', filter: false },
      { headerName: 'รหัส', field: 'id', width: 70, filter: false }
    ],
    []
  )

  const [pageSize, setPageSize] = useState(10)
  const [filterType, setFilterType] = useState('person')

  const [searchText, setSearchText] = useState('')

  const { data: person } = useGetPersonExternalQueryOption(page, pageSize, '', searchText, {
    enabled: filterType === 'person'
  })
  const { data: position } = useGetPositionExternalQueryOption(page, pageSize, '', '', {
    enabled: filterType === 'position'
  })

  const { data: department } = useGetDepartmentExternalQueryOption(page, pageSize, '', '', {
    enabled: filterType === 'department'
  })

  const listData = {
    person,
    position,
    department,
    dataField
  }

  const lockRowSelectionByField = selectedData => {
    gridRefSelecting.current?.api.setGridOption('rowSelection', {
      mode: 'multiRow',
      isRowSelectable: node => {
        return selectedData.map(item => item.pk).indexOf(node.data.pk) === -1
      },
      hideDisabledCheckboxes: true
    })
  }

  const rowSelection = useMemo(
    () => ({
      mode: 'multiRow',
      hideDisabledCheckboxes: true,
      isRowSelectable: node => (node.data ? selectedMoved.map(item => item.pk).indexOf(node.data.pk) === -1 : false)
    }),
    []
  )

  const rowRemoveSelection = useMemo(
    () => ({
      mode: 'multiRow',
      hideDisabledCheckboxes: true
      // isRowSelectable: node => (node.data ? selectedData.map(item => item.pk).indexOf(node.data.pk) === -1 : false)
    }),
    []
  )

  const moveSelected = () => {
    const sel = gridRefSelecting.current?.api.getSelectedRows()
    setSelectedMoved(prev => {
      const newItems = [...prev, ...sel]
      lockRowSelectionByField(newItems)
      return newItems
    })
  }
  const removeSelected = () => {
    const sel = gridRefSelectingRemove.current?.api.getSelectedRows()
    setSelectedMoved(prev => {
      const newItems = prev.filter(item => !sel.some(remove => remove.pk === item.pk))
      lockRowSelectionByField(newItems)
      return newItems
    })
  }

  const handleUpdateActivity = () => {
    if (!myDiagram || !selectedField) return

    const nodeData = myDiagram.model.findNodeDataForKey(selectedField?.data?.key)
    if (!nodeData) return

    // assignees_requestor: true,
    // assignees_user: [1000,2000],
    // assignees_department: [],
    // assignees_position: []

    const assigneesUser = [],
      assigneesPosition = [],
      assigneesDepartment = []

    let assigneesRequestor = false

    for (const item of selectedMoved) {
      if (item.typeId == '1') assigneesUser.push(parseInt(item.id))
      else if (item.typeId == '2') assigneesPosition.push(String(item.id))
      else if (item.typeId == '3') assigneesDepartment.push(String(item.id))
      else if (item.typeId == '4' && item.id === 1) {
        assigneesRequestor = true
      }
    }
    myDiagram.model.startTransaction('update activity')

    myDiagram.model.setDataProperty(nodeData, 'assignees_user', assigneesUser)
    myDiagram.model.setDataProperty(nodeData, 'assignees_position', assigneesPosition)
    myDiagram.model.setDataProperty(nodeData, 'assignees_department', assigneesDepartment)
    myDiagram.model.setDataProperty(nodeData, 'assignees_requestor', assigneesRequestor)
    myDiagram.model.setDataProperty(nodeData, 'assignees', selectedMoved)

    myDiagram.model.commitTransaction('update activity')
    console.log('selectedMoved', selectedMoved)
    closeDialog(id)
  }

  // console.log('selectedField', selectedField.data.assignees)

  return (
    <Grid container spacing={2} className='flex flex-col'>
      <Grid item xs={12}>
        <Typography variant='h5' className='text-center'>
          ตั้งค่าสิทธิ
        </Typography>
      </Grid>

      <Grid item xs={12} className='px-6 space-y-4'>
        <FormControl component='fieldset'>
          <RadioGroup
            row
            value={filterType}
            onChange={e => {
              setFilterType(e.target.value)
              setPage(1)
              // lockRowSelectionByField(selectedMoved)
            }}
          >
            {filterTypeOption.map(option => (
              <FormControlLabel key={option.id} value={option.key} control={<Radio />} label={option.name} />
            ))}
          </RadioGroup>
        </FormControl>

        <div className='flex  '>
          {/* Left List */}
          <div className='flex flex-col gap-2 w-1/2'>
            <Typography variant='h6' className='text-center'>
              รายการ
            </Typography>
            <DebouncedInput
              label='ค้นหา'
              placeholder={'....'}
              value={''}
              onChange={newText => {
                setSearchText(newText)
              }}
            />
            <div className='w-full border border-gray-300 rounded overflow-y-auto space-y-2 p-2 h-[500px]'>
              <div className='w-full border border-gray-300 rounded overflow-y-auto space-y-2 p-2 h-[400px]'>
                <AgGridReact
                  rowHeight={30}
                  ref={gridRefSelecting}
                  rowData={listData[filterType]?.data}
                  columnDefs={columnDefs}
                  // rowSelection='multiple'
                  rowSelection={rowSelection}
                  onRowSelected={event => {
                    console.log('Selected Row:', event.node.data)
                  }}
                  onSelectionChanged={event => {
                    // const selectedRows = event.api.getSelectedRows()
                    // setSelectedData(selectedRows)
                    // console.log('All Selected Rows:', selectedRows)
                  }}
                  defaultColDef={{ sortable: true, filter: true }}
                />
              </div>

              <Pagination
                count={Math.ceil(listData[filterType]?.total / pageSize)}
                page={page}
                onChange={(_, value) => setPage(value)}
                size='small'
              />
            </div>
          </div>

          {/* Buttons */}
          <div className='flex flex-col justify-center items-center gap-4'>
            <Button variant='text' onClick={moveSelected}>
              {'▶'}
            </Button>

            <Button variant='text' onClick={removeSelected}>
              {'◀'}
            </Button>
          </div>

          {/* Right List */}
          <div className='flex flex-col gap-2 w-1/2'>
            <Typography variant='h6' className='text-center'>
              รายการที่เลือก
            </Typography>
            <DebouncedInput
              label='ค้นหา'
              placeholder={'....'}
              value={''}
              onChange={newText => setSearchText(newText)}
            />

            <div className='w-full border border-gray-300 rounded overflow-y-auto space-y-2 p-2 h-[400px]'>
              <AgGridReact
                ref={gridRefSelectingRemove}
                rowData={selectedMoved}
                columnDefs={columnDefs}
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

      <Grid item xs={12} className='flex items-center justify-end gap-2 px-6'>
        <Button variant='contained' color='secondary' onClick={() => closeDialog(id)}>
          ยกเลิก
        </Button>
        <Button variant='contained' onClick={handleUpdateActivity}>
          ยืนยัน
        </Button>
      </Grid>
    </Grid>
  )
}

export default AddSettingPermissionFlowDialog
