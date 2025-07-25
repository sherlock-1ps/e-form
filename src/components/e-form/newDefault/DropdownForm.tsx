'use client'

import { MenuItem } from '@mui/material'
import CustomTextField from '@core/components/mui/TextField'
import { useFormStore } from '@/store/useFormStore'
import React from 'react' // 👈 เพิ่มการ import React

import { findFieldDetailsById } from '@/utils/mapKeyValueForm'

const DropdownForm = ({ item, parentKey, boxId, draft }: any) => {
  const updateValueDropdown = useFormStore(state => state.updateValueDropdown)
  // const updateValueOnly = useFormStore(state => state.updateValueOnly)
  const form = useFormStore(state => state.form)
  const defaultValue =
    item?.config?.details?.value?.value?.value?.value?.defaultValue ??
    item?.config?.details?.value?.value?.defaultValue ??
    ''

  const options =
    item?.config?.details?.value?.value?.value?.value?.options ?? item?.config?.details?.value?.value?.options ?? []

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateValueDropdown(String(parentKey ?? ''), boxId ?? '', item?.id ?? '', event.target.value)

    const linkFieldText = String(item?.config?.details?.linkField).trim()
    if (linkFieldText != '') {
      const linkFields = linkFieldText.split(',')

      for (const element of linkFields) {
        const selectItem = findFieldDetailsById(form, element.trim())

        updateValueDropdown(String(selectItem?.parentKey ?? ''), selectItem?.i ?? '', element ?? '', event.target.value)
      }
    }
  }

  return (
    <div style={{ opacity: item?.config?.details?.isShow ? 1 : 0 }}>
      <CustomTextField
        select
        fullWidth
        disabled={!item?.config?.details?.isUse}
        label={item?.config?.details?.tag?.isShow ? item?.config?.details?.tag?.value : undefined}
        linkField={item?.config?.details?.linkField}
        value={
          item?.config?.details?.keyValue?.realValue?.trim() === ''
            ? defaultValue
            : (item?.config?.details?.keyValue?.realValue ?? '') // 👈 เพิ่ม ?? '' เพื่อป้องกันค่า undefined
        }
        helperText={item?.config?.details?.helperText?.isShow && item?.config?.details?.helperText?.value}
        style={item?.config?.style || {}}
        onChange={handleChange} // ✅ 2. ส่งฟังก์ชัน handleChange ให้กับ CustomTextField
      >
        {item?.config?.details?.placeholder?.isShow && (
          <MenuItem value='' disabled>
            <em className='opacity-50'>{item?.config?.details?.placeholder?.name}</em>
          </MenuItem>
        )}

        {options.map((opt: any, idx: number) => (
          <MenuItem value={opt.value} key={idx}>
            {opt.name}
          </MenuItem>
        ))}
      </CustomTextField>
    </div>
  )
}

export default DropdownForm
