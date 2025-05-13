'use client'
import { useState } from 'react'

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'
import { Typography, Button, MenuItem } from '@mui/material'
import { CloseOutlined, ArrowDropDownCircleOutlined, Delete } from '@mui/icons-material'
import Switch from '@mui/material/Switch'

import BaseTitleProperty from '@components/e-form/property/BaseTitleProperty'
import CustomTextField from '@core/components/mui/TextField'
import BaseButton from '@/components/ui/button/BaseButton'
import ChoiceBox from '@/components/e-form/property/select/ChoiceBox'

const SelectProperty = () => {
  return (
    <div>
      <BaseTitleProperty
        title='ตัวเลือก: รายการ'
        icon={<ArrowDropDownCircleOutlined sx={{ width: '24px', height: '24px' }} />}
      />
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <CustomTextField select fullWidth defaultValue='' label='ตำแหน่ง' id='select-position'>
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </CustomTextField>

        {/* <BaseDropdown label='ตำแหน่ง' options={options} defaultValue='canvas' /> */}
        <div className='w-full flex justify-around'>
          <FormControlLabel label='เปิดใช้งาน' control={<Checkbox defaultChecked name='basic-checked' />} />
          <FormControlLabel label='เปิดใช้งาน' control={<Checkbox defaultChecked name='basic-checked' />} />
        </div>
        <CustomTextField label='Component ID' placeholder='Placeholder' />
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
        <FormControlLabel control={<Switch defaultChecked />} label='ป้ายกำกับ' />
        <CustomTextField label='ข้อความที่แสดง' placeholder='Placeholder' />
        <FormControlLabel control={<Switch defaultChecked />} label='ข้อความตัวอย่าง' />
        <CustomTextField label='ข้อความที่แสดง' placeholder='Placeholder' />
        <FormControlLabel control={<Switch defaultChecked />} label='ข้อความช่วยเหลือ' />
        <CustomTextField label='ข้อความที่แสดง' placeholder='Placeholder' />
      </section>
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <Typography>การตรวจสอบข้อมูล</Typography>
        <FormControlLabel control={<Switch defaultChecked />} label='จำเป็นต้องเลือก' />
      </section>
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <ChoiceBox />
      </section>
      <section className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'>
        <div>
          <FormControlLabel control={<Switch defaultChecked />} label='Trigger Event' />
        </div>

        <div className='flex items-center gap-2'>
          <BaseButton text='เปลี่ยนแปลง' sx={{ display: 'flex', flex: 1 }} />
          <BaseButton text='ลบ' icon={Delete} iconPosition='right' color='error' sx={{ display: 'flex', flex: 1 }} />
        </div>
      </section>
    </div>
  )
}

export default SelectProperty
