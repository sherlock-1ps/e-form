// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import { Autocomplete, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import { useDialog } from '@/hooks/useDialog'
import { useFormStore } from '@/store/useFormStore'
import CustomTextField from '@/@core/components/mui/TextField'
import { useFetchVariableQueryOption } from '@/queryOptions/form/formQueryOptions'
import { Form } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDictionary } from '@/contexts/DictionaryContext'

interface AddOptionDropdownProps {
  id: string
}

const AddOptionDropdownDialog = ({ id }: AddOptionDropdownProps) => {
  const { dictionary } = useDictionary()
  const { closeDialog } = useDialog()
  const form = useFormStore(state => state.form)
  const updateDetails = useFormStore(state => state.updateDetails)
  const selectedField = useFormStore(state => state.selectedField)
  const { data: variableData } = useFetchVariableQueryOption(1, 999)
  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  const [items, setItems] = useState<{ name: string; value: string }[]>([])
  const [defaultValue, setDefaultValue] = useState('')
  const [selectedVariable, setSelectedVariable] = useState({})
  const filterOptions = variableData?.result?.data?.filter((item: any) => item.variable_type == 'option')

  const handleAdd = () => {
    setItems((prev: any) => [...prev, { name, value }])
    setName('')
    setValue('')
  }

  const result = form?.form_details
    .flatMap(formItem => formItem.fields)
    .flatMap(field => field.data)
    .find(dataItem => dataItem.id === selectedField?.fieldId?.id)

  const handleSubmit = () => {
    const fieldId = selectedField?.fieldId?.id ?? ''
    const parentKey = String(selectedField?.parentKey ?? '')
    const boxId = selectedField?.boxId ?? ''
    const valueType = result?.config?.details?.value?.valueType

    if (valueType === 'custom') {
      if (items.length === 0) {
        toast.error('โปรดกรอกข้อมูลให้ครบถ้วน', { autoClose: 3000 })
        return
      }

      const isDefaultValueValid = items.some(item => item.value === defaultValue)

      if (!isDefaultValueValid) {
        toast.error('ค่า defaultValue ไม่ตรงกับรายการในตัวเลือก', { autoClose: 3000 })
        return
      }

      const updatedValue = {
        ...result?.config?.details?.value,
        value: {
          defaultValue,
          options: items
        }
      }

      updateDetails(parentKey, boxId, fieldId, { value: updatedValue })
      closeDialog(id)
      return
    }

    if (Object.keys(selectedVariable || {}).length === 0) {
      toast.error('โปรดเลือก Variable', { autoClose: 3000 })
      return
    }

    const updatedVariableValue = {
      ...result?.config?.details?.value,
      value: selectedVariable
    }

    updateDetails(parentKey, boxId, fieldId, { value: updatedVariableValue })
    closeDialog(id)
  }

  useEffect(() => {
    setName('')
    setValue('')
    setItems([])
    setDefaultValue('')
    setSelectedVariable({})
  }, [result])

  return (
    <Grid container className='flex  items-end' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>{dictionary?.addOption} </Typography>
      </Grid>
      <Grid item xs={12}>
        <RadioGroup
          row
          value={result?.config?.details?.value?.valueType}
          name='basic-radio'
          aria-label='basic-radio'
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                value: {
                  value: '',
                  valueType: e.target.value
                }
              }
            )
          }
        >
          <FormControlLabel value='custom' control={<Radio />} label='Custom' />
          <FormControlLabel value='variable' control={<Radio />} label='Variable' />
        </RadioGroup>
      </Grid>
      {result?.config?.details?.value?.valueType == 'custom' ? (
        <>
          {items?.length > 0 && (
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Default Value'
                placeholder='โปรดกรอกค่า Default ต้องตรงกับค่า value ที่เพิ่มด้านล่าง'
                value={defaultValue}
                onChange={e => {
                  setDefaultValue(e.target.value)
                }}
              />
            </Grid>
          )}
          {items?.length > 0 &&
            items.map((data, index) => (
              <Grid item xs={12} className='flex gap-2 items-center' key={index}>
                <Typography className='text-nowrap' variant='h6'>
                  ตัวเลือกที่ {index + 1}
                </Typography>

                <CustomTextField
                  fullWidth
                  label='name'
                  placeholder='กรอกชื่อ'
                  value={data?.name}
                  onChange={e => {
                    const newItems = [...items]
                    newItems[index].name = e.target.value
                    setItems(newItems)
                  }}
                />

                <CustomTextField
                  fullWidth
                  label='value'
                  placeholder={dictionary?.enterText}
                  value={data?.value}
                  onChange={e => {
                    const newItems = [...items]
                    newItems[index].value = e.target.value
                    setItems(newItems)
                  }}
                />
              </Grid>
            ))}
          <Grid item xs={12}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs>
                  <CustomTextField
                    fullWidth
                    label='name'
                    placeholder='กรอกชื่อ'
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs>
                  <CustomTextField
                    fullWidth
                    label='value'
                    placeholder={dictionary?.enterText}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                  />
                </Grid>
                <Grid item xs={1.2} className='self-end'>
                  <Button
                    fullWidth
                    variant='contained'
                    startIcon={<Add />}
                    onClick={handleAdd}
                    disabled={!name || !value}
                  >
                    เพิ่ม
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </>
      ) : (
        <Grid item xs={12}>
          {selectedVariable && Object.keys(selectedVariable).length > 0 && (
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Default Value'
                placeholder='โปรดกรอกค่า Default ต้องตรงกับค่า value ที่เพิ่มด้านล่าง'
                value={(selectedVariable as any)?.value?.value?.defaultValue ?? ''}
                disabled
                onChange={e => {
                  setDefaultValue(e.target.value)
                }}
              />
            </Grid>
          )}
          {(selectedVariable as any)?.value?.value?.options.length > 0 &&
            (selectedVariable as any)?.value?.value?.options.map((item: any, index: any) => {
              return (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={1.2} className=' self-center'>
                    <Typography className=' text-nowrap'>ตัวเลือกที่ {index + 1}</Typography>
                  </Grid>
                  <Grid item xs>
                    <CustomTextField fullWidth label='name' placeholder='กรอกชื่อ' value={item?.name} disabled />
                  </Grid>
                  <Grid item xs>
                    <CustomTextField
                      fullWidth
                      label='value'
                      placeholder={dictionary?.enterText}
                      value={item?.value}
                      disabled
                    />
                  </Grid>
                </Grid>
              )
            })}

          {filterOptions?.length > 0 ? (
            <Autocomplete
              fullWidth
              options={filterOptions || []}
              getOptionLabel={(option: any) => `{{${option.name}}}`}
              value={selectedVariable || null}
              onChange={(event, newValue) => {
                // updateDetails(
                //   String(selectedField?.parentKey ?? ''),
                //   selectedField?.boxId ?? '',
                //   selectedField?.fieldId?.id ?? '',
                //   {
                //     value: {
                //       ...result?.config?.details?.value,
                //       ...newValue
                //     }
                //   }
                // )
                setSelectedVariable(newValue || {})
              }}
              renderInput={params => <CustomTextField {...params} label='ตัวแปร' placeholder='เลือก...' />}
            />
          ) : (
            <Typography>ยังไม่มี variable option</Typography>
          )}
        </Grid>
      )}

      <Grid item xs={12} className='flex items-center  justify-end gap-2'>
        <Button
          variant='contained'
          color='secondary'
          onClick={() => {
            closeDialog(id)
          }}
        >
          ยกเลิก
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            handleSubmit()
          }}
        >
          ยืนยัน
        </Button>
      </Grid>
    </Grid>
  )
}

export default AddOptionDropdownDialog
