'use client'
import { useState } from 'react'

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'

import { Title, Delete, Draw } from '@mui/icons-material'
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
import { useFormStore } from '@/store/useFormStore'
import { Button } from '@mui/material'
import { useDialog } from '@/hooks/useDialog'
import SettingSignDialog from '@/components/dialogs/form/SettingSignDialog'

const SignatureProperty = () => {
  const { showDialog } = useDialog()
  const form = useFormStore(state => state.form)
  const selectedField = useFormStore(state => state.selectedField)
  const updateDetails = useFormStore(state => state.updateDetails)

  const result = form?.form_details
    .flatMap(formItem => formItem.fields)
    .flatMap(field => field.data)
    .find(dataItem => dataItem.id === selectedField?.fieldId?.id)

  const handleChangeInput = (e: any) => {}

  return (
    <div>
      <BaseTitleProperty
        title='E-Signature'
        icon={<Draw sx={{ width: '32px', height: '32px' }} />}
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
        <Typography className='' variant='h6'>
          เป็นจุดลงนามแบบ
        </Typography>
        <RadioGroup
          row
          value={result?.config?.details?.signType}
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                signType: e.target.value
              }
            )
          }
          name='basic-radio'
          aria-label='basic-radio'
        >
          <FormControlLabel value='master' control={<Radio />} label='Master' />
          <FormControlLabel value='clone' control={<Radio />} label='Clone' />
        </RadioGroup>
        <CustomTextField
          label='ใช้การตั้งค่าเดียวกันกับ'
          placeholder={'ระบุ ID ของ E-Signature ต้นฉบับ'}
          value={result?.config?.details?.value || ''}
          onChange={handleChangeInput}
        />
      </section>
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <CustomTextField
          label='ป้ายกำกับ'
          placeholder='Placeholder'
          value={result?.config?.details?.tag?.value || ''}
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                tag: {
                  ...result?.config?.details?.tag,
                  value: e.target.value
                }
              }
            )
          }
        />

        <FormControlLabel
          control={
            <Switch
              checked={result?.config?.details?.signer?.isShow}
              onChange={() =>
                updateDetails(
                  String(selectedField?.parentKey ?? ''),
                  selectedField?.boxId ?? '',
                  selectedField?.fieldId?.id ?? '',
                  {
                    signer: {
                      ...result?.config?.details?.signer,
                      isShow: !result?.config?.details?.signer?.isShow
                    }
                  }
                )
              }
            />
          }
          label='แสดงชื่อ-สกุล ผู้ลงนาม'
        />
        <div className='flex gap-1'>
          <BaseFontSize placeholder={result?.config?.style?.fontSize} value={result?.config?.style?.fontSize} />
        </div>
        <FormControlLabel
          control={<Switch checked={result?.config?.details?.position?.isShow} />}
          label='แสดงตำแหน่ง ผู้ลงนาม'
          onChange={() =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                position: {
                  ...result?.config?.details?.position,
                  isShow: !result?.config?.details?.position?.isShow
                }
              }
            )
          }
        />

        <FormControlLabel
          control={<Switch checked={result?.config?.details?.date?.isShow} />}
          label='แสดงวันที่ลงนาม'
          onChange={() =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                date: {
                  ...result?.config?.details?.date,
                  isShow: !result?.config?.details?.date?.isShow
                }
              }
            )
          }
        />
      </section>
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <RadioGroup
          name='select-option'
          value={result?.config?.details?.setting?.defaultAssign}
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                setting: {
                  ...result?.config?.details?.setting,
                  defaultAssign: e.target.value
                }
              }
            )
          }
        >
          <div className='flex items-center justify-between gap-2'>
            <FormControlLabel value='owner' control={<Radio />} label='กำหนดเอง' />
            <Button
              variant='contained'
              color={result?.config?.details?.setting?.defaultAssign === 'owner' ? 'primary' : 'secondary'}
              disabled={result?.config?.details?.setting?.defaultAssign !== 'owner'}
              onClick={() => {
                showDialog({
                  id: 'alertSettingSignDialog',
                  component: <SettingSignDialog id='alertSettingSignDialog' onClick={() => {}} />,
                  size: 'sm'
                })
              }}
            >
              เลือก
            </Button>
          </div>

          <FormControlLabel value='clone' control={<Radio />} label='ให้ผู้ใช้กำหนด' />
        </RadioGroup>
      </section>
      <section className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'>
        <FormControlLabel control={<Switch defaultChecked />} label='Trigger Event' />
      </section>
    </div>
  )
}

export default SignatureProperty
