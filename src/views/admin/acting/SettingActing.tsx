/* eslint-disable react-hooks/exhaustive-deps */
'use client'
// FormatShowDate(row.original.updated_at)
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

import SelectActing from '@/views/admin/acting/SelectActing'

import DateEffective from '@/views/admin/acting/DateEffective'

import CustomTextField from '@/@core/components/mui/TextField'
import {
  useGetDepartmentExternalQueryOption,
  useGetPersonExternalQueryOption,
  useGetPositionExternalQueryOption,
  useFetchGetFormSignaturePermisionFieldsQueryOption,
  useGetActingListQueryOption,
  useSaveActingQueryOption,
  useDeleteActingQueryOption
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
import { formatToUTC } from '@/utils/formatDateTime'
import { FormatShowDate } from '@/utils/formatShowDate'
import data from '@/data/searchData'
import { date } from 'valibot'

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

const filterTypeOption: FilterOption[] = [
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
  // {
  //   id: 4,
  //   key: 'dataField',
  //   name: 'ฟิวด์'
  // }
]

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

// Define props for SettingSignDialog
// interface SettingSignDialogProps {
//   onClose: () => void
// }

const ActingsCellRenderer = (props: any) => {
  const { value } = props

  // Ensure value is an array before trying to map it
  if (!Array.isArray(value)) {
    return null // or return some default text
  }

  return (
    <div className='max-h-[100px] overflow-y-auto'>
      {value.map((acting, index) => (
        <div className='h-[25px] flex items-center mb-1' key={acting.pk}>
          {acting.typeId == '1' ? (
            <Person titleAccess={acting.type} />
          ) : acting.typeId == '2' ? (
            <Work titleAccess={acting.type} />
          ) : (
            <OtherHouses titleAccess={acting.type} />
          )}
          <span className='ml-2'>{acting.name}</span>
        </div>
      ))}
    </div>
  )
}

const ActingDateCellRenderer = (props: any) => {
  const { value } = props

  return <>{FormatShowDate(value)}</>
}

const SettingActing = () => {
  const { dictionary } = useDictionary()
  const gridRefSelectingMain = useRef<AgGridReact>(null)
  const { closeDialog, showDialog } = useDialog() // Assuming useDialog provides a closeDialog function
  const { mutateAsync: callDeleteActing } = useDeleteActingQueryOption()
  const { data: acting } = useGetActingListQueryOption({
    enabled: true
  })

  // Function to render step content

  const ActionsCellRenderer = (props: any) => {
    const { value } = props
    // console.log(value)
    return (
      <div>
        <Delete
          className='cursor-pointer'
          onClick={() => {
            showDialog({
              id: 'alertDeleteData',
              component: (
                <ConfirmAlert
                  id='alertDeleteData'
                  title={dictionary?.confirmDelete}
                  content1={dictionary?.confirmDeleteItem}
                  onClick={async () => {
                    const res = await callDeleteActing({
                      id: value
                    })
                  }}
                />
              ),

              size: 'sm'
            })
          }}
        />
        {/* <Edit className='cursor-pointer' /> */}
        {/*
        {value.map((acting, index) => (
          <div className='h-[25px] flex items-center mb-1' key={acting.pk}>
            {
              acting.typeId == '1' ? <Person titleAccess={acting.type} /> : acting.typeId == '2' ? <Work titleAccess={acting.type} /> : <OtherHouses titleAccess={acting.type} />
            }
            <span className="ml-2">{acting.name}</span>
          </div>
        ))} */}
      </div>
    )
  }
  const columnActingDefs = useMemo<any[]>(
    () => [
      {
        autoHeight: true,
        headerName: ' ',
        field: 'id',
        filter: false,
        cellRenderer: ActionsCellRenderer,
        // flex: 1
        width: 50
      },
      { autoHeight: true, headerName: 'ชื่อ', field: 'f_full_name_th', filter: false, flex: 1.5 },
      { autoHeight: true, headerName: 'ตำแหน่ง', field: 'f_position_name', filter: false, flex: 2 },
      { autoHeight: true, headerName: 'หน่วยงาน', field: 'department_name', filter: false, flex: 2 },
      {
        headerName: 'รักษาการแทน',
        field: 'actings', // Point the field directly to the array data
        cellRenderer: ActingsCellRenderer, // Use your custom renderer component
        autoHeight: true, // Tell this column to participate in auto-height
        wrapText: true, // Ensures text wraps if a single line is too long
        minWidth: 300,
        filter: false,
        flex: 2 // Allow column to grow
      },
      {
        autoHeight: true,
        headerName: 'วันที่ส่งผล',
        field: 'start_effective_date',
        filter: false,
        flex: 1,
        cellRenderer: ActingDateCellRenderer
      },
      {
        autoHeight: true,
        headerName: 'วันที่สิ้นสุด',
        field: 'end_effective_date',
        filter: false,
        flex: 1,
        cellRenderer: ActingDateCellRenderer
      }
    ],
    []
  )

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent className='min-h-[calc(100vh-160px)] flex flex-col gap-4'>
            <Grid container spacing={2} className='flex flex-col'>
              <Grid item xs={12} sx={{ justifyContent: 'space-between', display: 'flex' }}>
                <Typography variant='h5' className='text-left'>
                  ตั้งค่ารักษาการแทน
                </Typography>
                <Button
                  color='primary'
                  variant='contained'
                  onClick={() => {
                    showDialog({
                      id: 'alertProfileDialog',
                      component: <TwoStepWizard id='alertProfileDialog' />,
                      size: 'lg'
                    })
                  }}
                >
                  + {dictionary?.addPerson}
                </Button>
              </Grid>
            </Grid>

            <Grid item xs={12} className='px-6 space-y-4'>
              <div className='w-full border border-gray-300 rounded overflow-y-auto space-y-2 p-2 h-[700px]'>
                <AgGridReact
                  rowHeight={100}
                  domLayout='autoHeight'
                  ref={gridRefSelectingMain}
                  rowData={acting?.data || []} // Ensure rowData is an array, even if undefined
                  columnDefs={columnActingDefs}
                  // rowSelection={rowSelection.mode} // Pass only the mode string
                  // isRowSelectable={rowSelection.isRowSelectable} // Pass the function directly
                  // rowSelection={rowSelection}
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
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SettingActing

function TwoStepWizard({ id }: { id: string }) {
  // const gridRefSelecting = useRef<AgGridReact>(null)
  // const gridRefSelectingRemove = useRef<AgGridReact>(null)
  const { closeDialog } = useDialog()

  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [filterType, setFilterType] = useState<string>('person')
  const [searchText, setSearchText] = useState<string>('')
  const [selectedMoved, setSelectedMoved] = useState<DataItem[]>([])

  const [page2, setPage2] = useState<number>(1)
  const [pageSize2, setPageSize2] = useState<number>(10)
  const [filterType2, setFilterType2] = useState<string>('person')
  const [searchText2, setSearchText2] = useState<string>('')
  const [selectedMoved2, setSelectedMoved2] = useState<DataItem[]>([])

  const [startDatetime, setStartDatetime] = useState<Date | null | undefined>(null)
  const [endDatetime, setEndDatetime] = useState<Date | null | undefined>(null)

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <SelectActing
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            filterType={filterType}
            setFilterType={setFilterType}
            searchText={searchText}
            setSearchText={setSearchText}
            selectedMoved={selectedMoved}
            setSelectedMoved={setSelectedMoved}
            isPersonOnly={true}
            titleLabel={dictionary?.selectActingPerson}
          />
        )
      case 1:
        return (
          <SelectActing
            isPersonOnly={false}
            page={page2}
            setPage={setPage2}
            pageSize={pageSize2}
            setPageSize={setPageSize2}
            filterType={filterType2}
            setFilterType={setFilterType2}
            searchText={searchText2}
            setSearchText={setSearchText2}
            selectedMoved={selectedMoved2}
            setSelectedMoved={setSelectedMoved2}
            titleLabel={dictionary?.SelectThePersonPositionOrganization}
          />
        )
      case 2:
        return (
          <DateEffective
            startDatetime={startDatetime}
            setStartDatetime={setStartDatetime}
            endDatetime={endDatetime}
            setEndDatetime={setEndDatetime}
          />
        )
      default:
        return <Typography>Unknown step.</Typography>
    }
  }

  const { dictionary } = useDictionary()
  // const { dictionary } = useDictionary()
  const steps: string[] = [dictionary?.selectPerson, dictionary?.selectActingAssignment, dictionary?.setATimeFrame]

  const [activeStep, setActiveStep] = useState<number>(0)
  const { mutateAsync: callSaveActing } = useSaveActingQueryOption()

  const handleNext = async () => {
    setActiveStep(prev => prev + 1)

    if (activeStep == 2) {
      if (selectedMoved.length == 0) return
      if (selectedMoved2.length == 0) return

      if (startDatetime != null && endDatetime != null) {
        // console.log('selectedMoved', selectedMoved)
        // console.log('selectedMoved2', selectedMoved2)
        // console.log('startDatetime', formatToUTC(startDatetime))

        const saveActing = await callSaveActing({
          f_person_id: selectedMoved[0].id,
          start_effective_date: formatToUTC(startDatetime),
          end_effective_date: formatToUTC(endDatetime),
          status: 'active',
          actings: selectedMoved2
        })
        closeDialog(id)
        setActiveStep(0)
      }
    }
  }
  const handleBack = () => setActiveStep(prev => prev - 1)
  const handleFinish = () => setActiveStep(0)

  return (
    <Grid item xs={12} className='px-6 space-y-4 hi'>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper elevation={3} sx={{ mt: 3 }}>
        {activeStep === steps.length ? (
          <Box sx={{ p: 3 }}>
            <Typography sx={{ mb: 2 }}>All steps completed!</Typography>
            <Button onClick={handleFinish} variant='contained'>
              {dictionary?.finish}
            </Button>
          </Box>
        ) : (
          <Box>
            {getStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderTop: '1px solid #eee' }}>
              <Button disabled={activeStep === 0} onClick={handleBack} variant='outlined'>
                {dictionary?.back}
              </Button>

              <Button onClick={handleNext} variant='contained'>
                {activeStep === steps.length - 1 ? dictionary?.finish : dictionary?.next}
                {/* {dictionary?.next} */}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Grid>
  )
}
