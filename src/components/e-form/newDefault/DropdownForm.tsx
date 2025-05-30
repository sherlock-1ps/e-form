'use client'

import { Typography, Button, MenuItem } from '@mui/material'
import CustomTextField from '@core/components/mui/TextField'
import { useFormStore } from '@/store/useFormStore'

const DropdownForm = ({ item }: any) => {
  const updateValue = useFormStore(state => state.updateValue)
  const selectedField = useFormStore(state => state.selectedField)

  // ✅ ดึงค่า defaultValue และ options อย่างชัดเจน
  const defaultValue =
    item?.config?.details?.value?.value?.value?.value?.defaultValue ??
    item?.config?.details?.value?.value?.defaultValue ??
    ''

  const options =
    item?.config?.details?.value?.value?.value?.value?.options ?? item?.config?.details?.value?.value?.options ?? []

  return (
    <div style={{ opacity: item?.config?.details?.isShow ? 1 : 0 }}>
      <CustomTextField
        select
        fullWidth
        disabled={!item?.config?.details?.isUse}
        label={item?.config?.details?.tag?.isShow ? item?.config?.details?.tag?.value : undefined}
        value={
          item?.config?.details?.keyValue?.realValue?.trim() === ''
            ? defaultValue
            : item?.config?.details?.keyValue?.realValue
        }
        // defaultValue={defaultValue}
        helperText={item?.config?.details?.helperText?.isShow && item?.config?.details?.helperText?.value}
        style={item?.config?.style || {}}
      >
        {/* ✅ แสดง placeholder ถ้ามี */}
        {item?.config?.details?.placeholder?.isShow && (
          <MenuItem value='' disabled>
            <em className='opacity-50'>{item?.config?.details?.placeholder?.name}</em>
          </MenuItem>
        )}

        {/* ✅ แสดงรายการตัวเลือก */}
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
