'use client'
import { useDispatch } from 'react-redux'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useFormStore } from '@/store/useFormStore'
import { findFieldDetailsById } from '@/utils/mapKeyValueForm'

const RadioForm = ({ item, parentKey, boxId, draft }: any) => {
  const updateValueOnly = useFormStore(state => state.updateValueOnly)
  const updateValueDropdown = useFormStore(state => state.updateValueDropdown)
  const updateDetails = useFormStore(state => state.updateDetails)
  const selectedField = useFormStore(state => state.selectedField)
  const errors = useFormStore(state => state.errors)
  const key = `${parentKey}-${boxId}-${item?.id}`
  const errorInput = errors[key]
  const form = useFormStore(state => state.form)

  const handleChange = (event: any) => {
    if (!draft) return
    const selectedValue = event.target.value

    // ❌ ถ้าเป็น default (value ว่าง) ไม่อัปเดต
    if (selectedValue === '') return

    updateDetails(String(parentKey ?? ''), boxId ?? '', item?.id ?? '', {
      selectedValue: selectedValue
    })

    const linkFieldText = String(item?.config?.details?.linkField).trim()
    if (linkFieldText != '') {
      const linkFields = linkFieldText.split(',')
      for (const element of linkFields) {
        const selectItem = findFieldDetailsById(form, element.trim())
        // console.log('selectItem?.details?.type', selectItem?.details?.type)

        if (selectItem?.details?.type == 'dropdown') {
          updateValueDropdown(String(selectItem?.parentKey ?? ''), selectItem?.i ?? '', element ?? '', selectedValue)
        } else {
          updateValueOnly(String(selectItem?.parentKey ?? ''), selectItem?.i ?? '', element ?? '', selectedValue)
        }
      }
    }
  }

  // linkField

  const options =
    item?.config?.details?.value?.options?.length > 0
      ? item.config.details.value.options
      : item?.config?.details?.value?.value?.value?.value?.options?.length > 0
        ? item?.config?.details?.value?.value?.value?.value?.options
        : [
            {
              name: 'Default Option',
              value: ''
            }
          ]

  return (
    <div style={{ opacity: item?.config?.details?.isShow ? 1 : 0 }}>
      <FormControl
        className='flex-wrap flex-row w-full'
        // error={errorInput}
        sx={{
          ...(errorInput && {
            border: '1px solid',
            borderColor: 'error.main',
            borderRadius: 1
          })
        }}
      >
        <RadioGroup
          row={item?.config?.details?.row}
          defaultValue={''}
          value={item?.config?.details?.selectedValue}
          name='radio_form'
          aria-label='radio_form'
          onChange={handleChange}
          className='w-full justify-between'
        >
          {options.map((data: any, idx: number) => (
            <FormControlLabel
              key={idx}
              value={data.value}
              disabled={!item?.config?.details?.isUse}
              control={<Radio />}
              label={data.name}
              sx={{ mt: 0.3, mb: 0.4 }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  )
}

export default RadioForm
