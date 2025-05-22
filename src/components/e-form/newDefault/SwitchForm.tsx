'use client'
import { useEffect, useRef } from 'react'
import Switch from '@mui/material/Switch'
import FormGroup from '@mui/material/FormGroup'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useFormStore } from '@/store/useFormStore'

const SwitchForm = ({ item, draft }: any) => {
  const updateDetails = useFormStore(state => state.updateDetails)
  const selectedField = useFormStore(state => state.selectedField)

  console.log(item)

  return (
    <div style={{ opacity: item?.config?.details?.isShow ? 1 : 0 }}>
      <FormControlLabel
        disabled={!item?.config?.details?.isUse}
        control={
          <Switch
            checked={
              item?.config?.details?.value?.valueType == 'variable'
                ? item?.config?.details?.value?.value?.value
                : item?.config?.details?.value?.value
            }
            onChange={e => {
              updateDetails(
                String(selectedField?.parentKey ?? ''),
                selectedField?.boxId ?? '',
                selectedField?.fieldId?.id ?? '',
                {
                  value: {
                    ...item?.config?.details?.value,
                    value: e.target.checked
                  }
                }
              )
            }}
          />
        }
        label={
          draft
            ? item?.config?.details?.value?.name
            : item?.config?.details?.value?.valueType == 'variable'
              ? `{{${item?.config?.details?.value?.name}}}`
              : item?.config?.details?.value?.name
        }
      />
    </div>
  )
}

export default SwitchForm
