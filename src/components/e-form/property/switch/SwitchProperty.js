'use client'
import { useState } from 'react'

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'
import { Typography, MenuItem, Card, Box, IconButton, RadioGroup, Radio, TextField } from '@mui/material'
import { ToggleOnOutlined, Delete, CancelOutlined, CheckCircleOutline } from '@mui/icons-material'
import Switch from '@mui/material/Switch'
import { useDispatch } from 'react-redux'

import BaseTitleProperty from '@components/e-form/property/BaseTitleProperty'
import CustomTextField from '@core/components/mui/TextField'
import BaseButton from '@/components/ui/button/BaseButton'
import ChoiceBox from '@/components/e-form/property/select/ChoiceBox'
import { useFormStore } from '@/store/useFormStore.ts'

const SwitchProperty = () => {
  const form = useFormStore(state => state.form)
  const selectedField = useFormStore(state => state.selectedField)
  const updateDetails = useFormStore(state => state.updateDetails)

  const result = form?.form_details
    .flatMap(formItem => formItem.fields)
    .flatMap(field => field.data)
    .find(dataItem => dataItem.id === selectedField?.fieldId?.id)

  const handleChange = event => {
    const newValue = event.target.value // แปลง string เป็น boolean

    updateDetails(
      String(selectedField?.parentKey ?? ''),
      selectedField?.boxId ?? '',
      selectedField?.fieldId?.id ?? '',
      {
        value: newValue
      }
    )
  }

  return (
    <div>
      <BaseTitleProperty
        title='สวิตซ์'
        icon={<ToggleOnOutlined sx={{ width: '24px', height: '24px' }} />}
        item={selectedField}
      />
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <div className='w-full flex justify-around'>
          <FormControlLabel
            label='เปิดใช้งาน'
            control={
              <Checkbox
                checked={result?.config?.details?.isUse}
                onChange={e =>
                  updateDetails(
                    String(selectedField?.parentKey ?? ''),
                    selectedField?.boxId ?? '',
                    selectedField?.fieldId?.id ?? '',
                    {
                      isUse: !result?.config?.details?.isUse
                    }
                  )
                }
              />
            }
          />

          <FormControlLabel
            label='แสดงผล'
            control={
              <Checkbox
                checked={result?.config?.details?.isShow}
                onChange={e =>
                  updateDetails(
                    String(selectedField?.parentKey ?? ''),
                    selectedField?.boxId ?? '',
                    selectedField?.fieldId?.id ?? '',
                    {
                      isShow: !result?.config?.details?.isShow
                    }
                  )
                }
              />
            }
          />
        </div>
        <CustomTextField label='Component ID' placeholder='Placeholder' value={selectedField?.fieldId?.id} />
      </section>
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <CustomTextField select fullWidth defaultValue='' label='เก็บข้อมูลไปที่' id='select-position'>
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </CustomTextField>
      </section>

      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <Card
          elevation={3}
          sx={{
            borderRadius: 2,
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            border: '1px solid var(--mui-palette-primary-main)'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Typography variant='body1' color={'text.primary'}>
                ข้อความ
              </Typography>
            </Box>
          </Box>

          <RadioGroup row defaultValue='checked' name='basic-radio' aria-label='basic-radio'>
            <FormControlLabel value='checked' control={<Radio />} label='String' />
            <FormControlLabel value='unchecked' control={<Radio />} label='AppState' />
            <FormControlLabel value='test' control={<Radio />} label='API' />
          </RadioGroup>

          <Box>
            <Typography variant='body2' sx={{ marginBottom: 1 }}>
              รายละเอียด
            </Typography>
            <TextField
              fullWidth
              variant='outlined'
              size='small'
              placeholder='Placeholder'
              value={result?.config?.details?.text ?? ''}
              onChange={e =>
                updateDetails(
                  String(selectedField?.parentKey ?? ''),
                  selectedField?.boxId ?? '',
                  selectedField?.fieldId?.id ?? '',
                  {
                    text: e.target.value
                  }
                )
              }
            />
          </Box>
        </Card>
      </section>

      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <Typography variant='body2'>ค่าเริ่มต้น</Typography>
        <RadioGroup
          row
          value={result?.config?.details?.value}
          name='basic-radio'
          aria-label='basic-radio'
          onChange={handleChange}
        >
          <FormControlLabel value='0' control={<Radio />} label='ปิด' />
          <FormControlLabel value='1' control={<Radio />} label='เปิด' />
        </RadioGroup>
      </section>

      <section className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'>
        <div>
          <FormControlLabel control={<Switch defaultChecked />} label='Trigger Event' />
        </div>
      </section>
    </div>
  )
}

export default SwitchProperty
