'use client'
import React, { useRef } from 'react'
import { OndemandVideoOutlined } from '@mui/icons-material'
import { MAX_FILE_VIDEO_SIZE_MB } from '@/data/toolbox/toolboxMenu'
import { Button, IconButton, InputAdornment } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import { useFormStore } from '@/store/useFormStore'
import { numberToThaiText } from '@/utils/numberFormat'
// Defines the structure for items inside the 'data' array
interface Details {
  type: string
  label: string
  // Add any other properties that exist in 'details'
  [key: string]: any
}

// Defines the structure for the 'config' object
interface Config {
  details: Details
  // Add other properties if they exist
}

// Defines the structure for items inside the 'data' array
interface DataItem {
  id: string
  config: Config
}

// Defines the structure for objects inside the 'fields' array
interface Field {
  i: string
  data: DataItem[]
}

// Defines the structure for objects inside the 'form_details' array
interface FormDetail {
  parentKey: string
  fields: Field[]
}

// Defines the main data object structure
interface DataObject {
  form_details: FormDetail[]
}

// Defines the structure of the successful return value
interface FoundFieldDetails {
  i: string
  parentKey: string
  details: Details
}
function findFieldDetailsById(dataObject: DataObject, targetId: string): FoundFieldDetails | null {
  // Loop through each object in the 'form_details' array
  for (const detail of dataObject.form_details) {
    // Loop through each field in the 'fields' array of the current detail
    for (const field of detail.fields) {
      // Use .find() to find the data item with the matching id
      const foundDataItem = field.data.find(item => item.id === targetId)

      // If a match is found...
      if (foundDataItem) {
        // ...return an object with the required information.
        return {
          i: field.i,
          parentKey: detail.parentKey,
          details: foundDataItem.config.details
        }
      }
    }
  }

  // If no match is found after checking everything, return null.
  return null
}

const TextFieldForm = ({ item, parentKey, boxId, draft }: any) => {
  const updateValueOnly = useFormStore(state => state.updateValueOnly)
  const form = useFormStore(state => state.form)
  const errors = useFormStore(state => state.errors)

  const key = `${parentKey}-${boxId}-${item?.id}`
  const errorInput = errors[key]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    updateValueOnly(String(parentKey ?? ''), boxId ?? '', item?.id ?? '', newValue)

    // console.log('item', item)

    // console.log('form', form)
    // console.log('result', result)
    const linkFieldText = String(item?.config?.details?.linkField).trim()

    if (linkFieldText != '') {
      const linkFields = linkFieldText.split(',')

      for (const element of linkFields) {
        const selectItem = findFieldDetailsById(form, element.trim())

        // console.log('selectItem', selectItem)
        const changeValue = selectItem?.details?.changeNumberToText ? numberToThaiText(newValue) : newValue

        updateValueOnly(String(selectItem?.parentKey ?? ''), selectItem?.i ?? '', element ?? '', changeValue)
      }
    }

    // console.log(
    //   "String(parentKey ?? ''), boxId ?? '', item?.id ?? '', newValue)",
    //   String(parentKey ?? ''),
    //   boxId ?? '',
    //   item?.id ?? '',
    //   newValue
    // )
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
        isNumber={item?.config?.details?.isNumber}
        decimalPlaces={item?.config?.details?.decimalPlaces}
        linkField={item?.config?.details?.linkField}
        changeNumberToText={item?.config?.details?.changeNumberToText}
        inputProps={{
          readOnly: item?.config?.details?.readOnly,

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
