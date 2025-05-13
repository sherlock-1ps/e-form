'use client'
import { useState } from 'react'

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'

import { ArticleOutlined, Delete } from '@mui/icons-material'
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

const TextareaProperty = ({ item }) => {
  const dispatch = useDispatch()
  const [selected, setSelected] = useState('')

  const handleDropdownChange = e => {
    setSelected(e.target.value)
  }

  const options = [
    { value: 'canvas', label: 'canvas' },
    { value: 'paper', label: 'paper' },
    { value: 'digital', label: 'digital' }
  ]

  const handleChangeInput = e => {
    const newValue = e.target.value
    // dispatch(
    //   setValueElement({
    //     id: item.id,
    //     key: 'value',
    //     value: newValue
    //   })
    // )
  }

  return (
    <div>
      <BaseTitleProperty title='หลายบรรทัด' icon={<ArticleOutlined sx={{ width: '32px', height: '32px' }} />} />
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <BaseDropdown label='ตำแหน่ง' options={options} defaultValue='canvas' onChange={handleDropdownChange} />
        <div className='w-full flex justify-around'>
          <FormControlLabel label='เปิดใช้งาน' control={<Checkbox defaultChecked name='basic-checked' />} />
          <FormControlLabel label='เปิดใช้งาน' control={<Checkbox defaultChecked name='basic-checked' />} />
        </div>
        <CustomTextField label='Component ID' placeholder='Placeholder' value={item.id} />
      </section>
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <RadioGroup row defaultValue='checked' name='basic-radio' aria-label='basic-radio'>
          <FormControlLabel value='checked' control={<Radio />} label='String' />
          <FormControlLabel value='unchecked' control={<Radio />} label='AppState' />
          <FormControlLabel value='test' control={<Radio />} label='API' />
        </RadioGroup>
        <CustomTextField
          label='ข้อความ'
          placeholder={item.config.details.placeholder}
          value={item.config.details.value || ''}
          onChange={handleChangeInput}
        />
        <div className='flex gap-1'>
          <BaseFontSize placeholder={item.config.style.fontSize} value={item.config.style.fontSize} id={item.id} />
          <BaseColorPicker label='สี' defaultColor={item.config.style.color} id={item.id} />
        </div>
        <div>
          <FormatText item={item.config.style} id={item.id} />
        </div>
        <div>
          <FormatTextPosition item={item.config.style} id={item.id} />
        </div>
      </section>
      <section className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'>
        <div>
          <FormControlLabel control={<Switch defaultChecked />} label='Trigger Event' />
        </div>
        <div>
          <div className='flex items-center gap-2'>
            <BaseButton text='เปลี่ยนแปลง' sx={{ display: 'flex', flex: 1 }} />
            <BaseButton text='ลบ' icon={Delete} iconPosition='right' color='error' sx={{ display: 'flex', flex: 1 }} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default TextareaProperty
