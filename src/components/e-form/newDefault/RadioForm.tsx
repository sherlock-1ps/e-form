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
    updateDetails(
      String(selectedField?.parentKey ?? ''),
      selectedField?.boxId ?? '',
      selectedField?.fieldId?.id ?? '',
      {
        value: event.target.value
      }
    )
  }

  return (
    <div style={{ opacity: item?.config?.details?.isShow ? 1 : 0 }}>
      <FormControl className='flex-wrap flex-row'>
        <RadioGroup
          row={item?.config?.details?.row}
          value={item?.config?.details?.value}
          name='radio_form'
          aria-label='radio_form'
          onChange={handleChange}
        >
          {item?.config?.details?.itemList.map((data: any, idx: number) => (
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
