'use client'
import { useState } from 'react'

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'

import { GridViewOutlined, Delete } from '@mui/icons-material'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Switch from '@mui/material/Switch'

import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import BaseDropdown from '@components/e-form/property/BaseDropdown'
import BaseColorPicker from '@components/e-form/property/BaseColorPicker'
import FormatText from '@components/e-form/property/FormatText'
import FormatTextPosition from '@components/e-form/property/FormatTextPosition'
import CustomTextField from '@core/components/mui/TextField'
import BaseButton from '@/components/ui/button/BaseButton'
import BaseTitleProperty from '@components/e-form/property/BaseTitleProperty'
import BaseFontSize from '@components/e-form/property/BaseFontSize'
import { useDispatch } from 'react-redux'
import { Button } from '@mui/material'
import { useFormStore } from '@/store/useFormStore'

const GridProperty = ({ parentKey }: any) => {
  const form = useFormStore(state => state.form)
  const addFieldToForm = useFormStore(state => state.addFieldToForm)
  const deleteParentForm = useFormStore(state => state.deleteParentForm)
  const deleteFormByKey = useFormStore(state => state.deleteFormByKey)
  const currentForm = form.form_details.find(f => f?.parentKey === parentKey)

  const handleDeleteField = (item: any) => {
    deleteParentForm(item.i)
  }

  const handleDeleteForm = (key: any) => {
    deleteFormByKey(key)
  }

  return (
    <div>
      <section
        className='w-full h-[86px] flex justify-center items-center py-4 px-6'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <div className='flex-1 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <GridViewOutlined sx={{ width: '32px', height: '32px' }} />
            <Typography variant='h5'>Grid</Typography>
          </div>
          <Button
            startIcon={<Delete />}
            variant='contained'
            color='error'
            onClick={() => {
              handleDeleteForm(currentForm?.parentKey)
            }}
          >
            ลบ
          </Button>
        </div>
      </section>
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <div className='w-full flex justify-between items-center'>
          <CustomTextField label='Grid ID' placeholder='Placeholder' value={parentKey} disabled />
        </div>
      </section>
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        {currentForm &&
          currentForm?.fields.map((item, index) => {
            return (
              <div className='w-full flex justify-between items-center' key={item?.i}>
                <Typography variant='h6'>คอลัมน์ที่ {index + 1}</Typography>
                <Button
                  startIcon={<Delete />}
                  variant='outlined'
                  color='error'
                  onClick={() => {
                    handleDeleteField(item)
                  }}
                >
                  ลบ
                </Button>
              </div>
            )
          })}

        <Button variant='contained' fullWidth onClick={addFieldToForm}>
          เพิ่มคอลัมน์
        </Button>
      </section>

      {/* <section className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'>
        <div>
          <FormControlLabel control={<Switch defaultChecked />} label='Trigger Event' />
        </div>
        <div>
          <div className='flex items-center gap-2'>
            <BaseButton text='เปลี่ยนแปลง' sx={{ display: 'flex', flex: 1 }} />
            <BaseButton text='ลบ' icon={Delete} iconPosition='right' color='error' sx={{ display: 'flex', flex: 1 }} />
          </div>
        </div>
      </section> */}
    </div>
  )
}

export default GridProperty
