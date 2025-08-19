'use client'

import { MenuItem } from '@mui/material'
import CustomTextField from '@core/components/mui/TextField'
import { useFormStore } from '@/store/useFormStore'
import React from 'react' // 👈 เพิ่มการ import React
import { numberToThaiText } from '@/utils/numberFormat'
import { findFieldDetailsById } from '@/utils/mapKeyValueForm'

const DropdownForm = ({ item, parentKey, boxId, draft }: any) => {
  const updateValueDropdown = useFormStore(state => state.updateValueDropdown)
  const updateValueOnly = useFormStore(state => state.updateValueOnly)
  const updateDetails = useFormStore(state => state.updateDetails)
  // const updateValueOnly = useFormStore(state => state.updateValueOnly)
  const form = useFormStore(state => state.form)
  const defaultValue =
    item?.config?.details?.value?.value?.value?.value?.defaultValue ??
    item?.config?.details?.value?.value?.defaultValue ??
    ''
  const key = `${parentKey}-${boxId}-${item?.id}`
  const errors = useFormStore(state => state.errors)
  const errorInput = errors[key]
  const options =
    item?.config?.details?.value?.value?.value?.value?.options ?? item?.config?.details?.value?.value?.options ?? []

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateValueDropdown(String(parentKey ?? ''), boxId ?? '', item?.id ?? '', event.target.value)
    // selectItem?.details?.type == 'checkbox'
    const linkFieldText = String(item?.config?.details?.linkField).trim()
    if (linkFieldText != '') {
      const linkFields = linkFieldText.split(',')

      for (const element of linkFields) {
        const selectItem = findFieldDetailsById(form, element.trim())

        // console.log(selectItem?.details?.type)

        if (selectItem?.details?.type == 'dropdown') {
          updateValueDropdown(
            String(selectItem?.parentKey ?? ''),
            selectItem?.i ?? '',
            element ?? '',
            event.target.value
          )
        } else if (selectItem?.details?.type == 'radio') {
          updateDetails(String(selectItem?.parentKey ?? ''), selectItem?.i ?? '', element ?? '', {
            selectedValue: event.target.value
          })
        } else if (selectItem?.details?.type == 'checkbox') {
          updateDetails(String(selectItem?.parentKey ?? ''), selectItem?.i ?? '', element ?? '', {
            value: {
              ...selectItem?.details?.value,
              checkedList: [event.target.value]
            }
          })
        } else {
          const changeValue = selectItem?.details?.changeNumberToText
            ? numberToThaiText(event.target.value)
            : event.target.value
          updateValueOnly(String(selectItem?.parentKey ?? ''), selectItem?.i ?? '', element ?? '', changeValue)
          // updateValueOnly(String(selectItem?.parentKey ?? ''), selectItem?.i ?? '', element ?? '', event.target.value)
        }
      }
    }
  }

  return (
    <div style={{ opacity: item?.config?.details?.isShow ? 1 : 0 }}>
      <CustomTextField
        error={!!errorInput}
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
