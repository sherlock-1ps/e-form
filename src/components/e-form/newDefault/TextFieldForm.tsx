'use client'
import React, { useRef } from 'react'
import { OndemandVideoOutlined } from '@mui/icons-material'
import { MAX_FILE_VIDEO_SIZE_MB } from '@/data/toolbox/toolboxMenu'
import { Button, IconButton, InputAdornment } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import { useFormStore } from '@/store/useFormStore'

const TextFieldForm = ({ item, parentKey, boxId, draft }: any) => {
  const updateValueOnly = useFormStore(state => state.updateValueOnly)
  const errors = useFormStore(state => state.errors)

  const key = `${parentKey}-${boxId}-${item?.id}`
  const errorInput = errors[key]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    updateValueOnly(String(parentKey ?? ''), boxId ?? '', item?.id ?? '', newValue)
  }

  return (
    <form style={{ opacity: item?.config?.details?.isShow ? 1 : 0 }}>
      <CustomTextField
        fullWidth
        multiline
        error={draft && item?.config?.details?.isShow && item?.config?.details?.isUse ? !!errorInput : false}
        minRows={1}
        value={
          item?.config?.details?.value?.valueType == 'variable'
            ? draft
              ? item?.config?.details?.value?.value?.value
              : `{{${item?.config?.details?.value?.name}}}`
            : item?.config?.details?.value?.value
        }
        onChange={handleChange}
        label={item?.config?.details?.tag?.isShow && item?.config?.details?.tag?.value}
        disabled={!item?.config?.details?.isUse}
        helperText={item?.config?.details?.helperText?.isShow && item?.config?.details?.helperText?.value}
        placeholder={item?.config?.details?.placeholder?.isShow && item?.config?.details?.placeholder?.value}
        inputProps={{
          maxLength: item?.config?.details?.limit?.isLimit
            ? Number(item?.config?.details?.limit?.maxCharacter)
            : undefined
        }}
        sx={{
          '& .MuiInputBase-input': {
            fontSize: item?.config?.style?.fontSize ?? 16,
            color: item?.config?.style?.color ?? '#000',
            textAlign: item?.config?.style?.textAlign ?? 'start',
            fontWeight: item?.config?.style?.fontWeight ?? 'normal',
            fontStyle: item?.config?.style?.fontStyle ?? 'none',
            textDecoration: item?.config?.style?.textDecoration ?? 'none'
          }
        }}
      />
    </form>
  )
}

export default TextFieldForm
