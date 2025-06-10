'use client'
import { useDispatch } from 'react-redux'
import { useEffect, useRef } from 'react'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useFormStore } from '@/store/useFormStore'

const CheckboxForm = ({ item, parentKey, boxId, draft }: any) => {
  const updateDetails = useFormStore(state => state.updateDetails)
  const selectedField = useFormStore(state => state.selectedField)

  const options =
    item?.config?.details?.value?.options?.length > 0
      ? item.config.details.value.options
      : item?.config?.details?.value?.value?.value?.value?.options?.length > 0
        ? item?.config?.details?.value?.value?.value?.value?.options
        : [
            {
              name: 'Default',
              isChecked: false
            }
          ]

  return (
    <div style={{ opacity: item?.config?.details?.isShow ? 1 : 0 }}>
      <FormGroup row={item?.config?.details?.row} className='w-full justify-between'>
        {options.map((data: any, idx: number) => {
          return (
            <FormControlLabel
              disabled={!item?.config?.details?.isUse}
              key={idx}
              label={data.name}
              className='m-0 '
              control={
                <Checkbox
                  checked={
                    Array.isArray(item?.config?.details?.value?.checkedList)
                      ? item.config.details.value.checkedList.includes(data.value)
                      : false
                  }
                  name={data.name}
                  onChange={e => {
                    if (!draft) return
                    if (!data.value) return

                    const checked = e.target.checked
                    const currentCheckedList = item?.config?.details?.value?.checkedList || []

                    const newCheckedList = checked
                      ? [...currentCheckedList, data.value]
                      : currentCheckedList.filter((v: any) => v !== data.value)

                    updateDetails(String(parentKey ?? ''), boxId ?? '', item?.id ?? '', {
                      value: {
                        ...item?.config?.details?.value,
                        checkedList: newCheckedList
                      }
                    })
                  }}
                />
              }
            />
          )
        })}
      </FormGroup>
    </div>
  )
}

export default CheckboxForm
