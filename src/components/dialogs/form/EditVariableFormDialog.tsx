'use client'

// MUI Imports
import Button from '@mui/material/Button'
import { Divider, Grid, MenuItem, Switch, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useEditVariableQueryOption } from '@/queryOptions/form/formQueryOptions'

interface EditVariableFormDialogProps {
  id: string
  data: any
}

const dataTypes = [
  { label: 'ข้อความ', value: 'string' },
  { label: 'ตัวเลข', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'วันที่', value: 'date' },
  { label: 'วันที่และเวลา', value: 'datetime' },
  { label: 'ตัวเลือก', value: 'option' },
  { label: 'Json', value: 'json' },
  { label: 'Array', value: 'array' }
]

function EditVariableFormDialog({ id, data }: EditVariableFormDialogProps) {
  const router = useRouter()
  const { closeDialog } = useDialog()
  const { lang: locale } = useParams()
  const [nameVariable, setNameVariable] = useState(data?.name ?? '')
  const [type, setType] = useState(data?.variable_type ?? '')
  const [value, setValue] = useState<any>(data?.value?.value ?? '')

  const [tempKey, setTempKey] = useState('')
  const [tempVal, setTempVal] = useState('')
  const { mutateAsync: editVariable } = useEditVariableQueryOption()

  const handleCreateVariable = async () => {
    const isOption = type === 'option'

    const isEmptyValue =
      value === '' ||
      value === null ||
      (isOption && (!value.defaultValue || !Array.isArray(value.options) || value.options.length === 0))

    const isDefaultKeyMissing =
      isOption && value.defaultValue && !value.options?.some((opt: any) => opt.value === value.defaultValue)

    if (!nameVariable.trim()) {
      return toast.error('กรุณาระบุชื่อตัวแปร', { autoClose: 3000 })
    }

    if (!type) {
      return toast.error('กรุณาเลือกประเภทข้อมูล', { autoClose: 3000 })
    }

    if (isEmptyValue) {
      return toast.error('กรุณากรอกค่าของตัวแปรให้ครบถ้วน', { autoClose: 3000 })
    }

    if (isDefaultKeyMissing) {
      return toast.error('ค่า default ต้องตรงกับ Key ที่อยู่ในรายการตัวเลือก', { autoClose: 3000 })
    }

    const request = {
      id: data.id,
      name: nameVariable,
      variableType: type,
      value: {
        value
      }
    }

    try {
      const response = await editVariable(request)
      if (response?.code == 'SUCCESS') {
        toast.success('แก้ไข Variable สำเร็จ!', { autoClose: 3000 })
        closeDialog(id)
      }
    } catch (error) {
      console.error('❌ create failed', error)
      toast.error('แก้ไข Variable ล้มเหลว!', { autoClose: 3000 })
    }
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant='h5' className=''>
          เพิ่มตัวแปรใหม่
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <CustomTextField
          fullWidth
          value={nameVariable}
          label='ชื่อตัวแปร'
          placeholder='ตั้งชื่อตัวแปร'
          onChange={e => {
            setNameVariable(e.target.value)
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <CustomTextField
          select
          fullWidth
          value={type}
          onChange={e => {
            setType(e.target.value)
            setValue('')
          }}
          label='ประเภทข้อมูล'
          SelectProps={{
            displayEmpty: true
          }}
        >
          <MenuItem value='' disabled>
            <em className='opacity-50'>ข้อมูล</em>
          </MenuItem>

          {dataTypes.map(type => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </CustomTextField>
      </Grid>
      {type &&
        (() => {
          switch (type) {
            case 'string':
              return (
                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    label='กำหนดข้อความ'
                    placeholder='ใส่ข้อความ'
                    value={value}
                    onChange={e => setValue(e.target.value)}
                  />
                </Grid>
              )
            case 'number':
              return (
                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    type='number'
                    label='กำหนดตัวเลข'
                    placeholder='ใส่ตัวเลข'
                    value={value}
                    onChange={e => setValue(Number(e.target.value))}
                  />
                </Grid>
              )
            case 'boolean':
              return (
                <Grid item xs={12}>
                  <Typography>ค่าเริ่มต้น (Boolean)</Typography>
                  <div className='flex items-center gap-2'>
                    <Switch checked={value === true} onChange={e => setValue(e.target.checked)} />
                    <Typography variant='body2'>{value ? 'true' : 'false'}</Typography>
                  </div>
                </Grid>
              )
            case 'date':
              return (
                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    type='date'
                    label='เลือกวันที่เริ่มต้น'
                    value={value}
                    onChange={e => setValue(e.target.value)}
                  />
                </Grid>
              )
            case 'datetime':
              return (
                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    type='datetime-local'
                    label='เลือกวันและเวลาเริ่มต้น'
                    value={value}
                    onChange={e => setValue(e.target.value)}
                  />
                </Grid>
              )
            case 'option':
              return (
                <>
                  <Grid item xs={12}>
                    <Typography variant='body2'>เพิ่มตัวเลือก</Typography>
                    <div className='flex gap-2'>
                      <CustomTextField
                        fullWidth
                        label='Name'
                        value={tempVal}
                        onChange={e => setTempVal(e.target.value)}
                      />
                      <CustomTextField
                        fullWidth
                        label='Value'
                        value={tempKey}
                        onChange={e => setTempKey(e.target.value)}
                      />

                      <Button
                        variant='outlined'
                        onClick={() => {
                          if (tempKey.trim() && tempVal.trim()) {
                            setValue((prev: any) => ({
                              ...prev,
                              options: [...(prev.options || []), { value: tempKey.trim(), name: tempVal.trim() }]
                            }))
                            setTempKey('')
                            setTempVal('')
                          }
                        }}
                      >
                        เพิ่ม
                      </Button>
                    </div>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant='body2'>รายการตัวเลือก:</Typography>
                    <ul className='list-disc ml-5'>
                      {(value.options || []).map((opt: any, index: number) => (
                        <li key={index} className='flex justify-between items-center'>
                          <span>
                            {opt.name} : {opt.value}
                          </span>
                          <Button
                            size='small'
                            color='error'
                            onClick={() =>
                              setValue((prev: any) => ({
                                ...prev,
                                options: prev.options.filter((_: any, i: number) => i !== index)
                              }))
                            }
                          >
                            ลบ
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </Grid>

                  <Grid item xs={12}>
                    <CustomTextField
                      fullWidth
                      label='ค่า default'
                      placeholder='กรอก Value ที่ต้องการใช้เป็นค่าเริ่มต้น'
                      value={value?.defaultValue}
                      onChange={e =>
                        setValue((prev: any) => ({
                          ...prev,
                          defaultValue: e.target.value
                        }))
                      }
                      helperText='*ต้องเป็น Value ที่อยู่ในตัวเลือก'
                    />
                  </Grid>
                </>
              )
            case 'array':
              return (
                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    multiline
                    minRows={4}
                    label='กำหนด array'
                    placeholder='["item1", "item2"]'
                    value={value}
                    onChange={e => {
                      try {
                        const parsed = JSON.parse(e.target.value)
                        setValue(parsed)
                      } catch {
                        setValue(e.target.value)
                      }
                    }}
                  />
                </Grid>
              )
            case 'json':
              return (
                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    multiline
                    minRows={4}
                    label='กำหนด JSON'
                    placeholder='{"key":"value"}'
                    value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                    onChange={e => {
                      try {
                        const parsed = JSON.parse(e.target.value)
                        setValue(parsed)
                      } catch {
                        setValue(e.target.value)
                      }
                    }}
                  />
                </Grid>
              )
            default:
              return null
          }
        })()}

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
        <Button variant='contained' onClick={handleCreateVariable}>
          ยืนยัน
        </Button>
      </Grid>
    </Grid>
  )
}

export default EditVariableFormDialog
