'use client'
import { useDispatch } from 'react-redux'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useFormStore } from '@/store/useFormStore'

const RadioForm = ({ item }: any) => {
  const updateDetails = useFormStore(state => state.updateDetails)
  const selectedField = useFormStore(state => state.selectedField)

  const handleChange = (event: any) => {
    const selectedValue = event.target.value

    // ❌ ถ้าเป็น default (value ว่าง) ไม่อัปเดต
    if (selectedValue === '') return

    updateDetails(
      String(selectedField?.parentKey ?? ''),
      selectedField?.boxId ?? '',
      selectedField?.fieldId?.id ?? '',
      {
        value: {
          ...item?.config?.details?.value,
          value: selectedValue
        }
      }
    )
  }

  const options =
    item?.config?.details?.value?.options?.length > 0
      ? item.config.details.value.options
      : [
          {
            name: 'Default Option',
            value: ''
          }
        ]

  return (
    <div style={{ opacity: item?.config?.details?.isShow ? 1 : 0 }}>
      <FormControl className='flex-wrap flex-row'>
        <RadioGroup
          row={item?.config?.details?.row}
          value={item?.config?.details?.value?.value}
          name='radio_form'
          aria-label='radio_form'
          onChange={handleChange}
        >
          {options.map((data: any, idx: number) => (
            <FormControlLabel
              key={idx}
              value={data.value}
              disabled={!item?.config?.details?.isUse}
              control={<Radio />}
              label={data.name}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  )
}

export default RadioForm
