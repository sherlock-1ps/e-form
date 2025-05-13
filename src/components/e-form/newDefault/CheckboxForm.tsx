'use client'
import { useDispatch } from 'react-redux'
import { useEffect, useRef } from 'react'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useFormStore } from '@/store/useFormStore'

const CheckboxForm = ({ item }: any) => {
  const updateDetails = useFormStore(state => state.updateDetails)
  const selectedField = useFormStore(state => state.selectedField)

  return (
    <div style={{ opacity: item?.config?.details?.isShow ? 1 : 0 }}>
      <FormGroup row={item?.config?.details?.row}>
        {item?.config?.details?.itemList &&
          item?.config?.details?.itemList.map((data: any, idx: number) => {
            return (
              <FormControlLabel
                disabled={!item?.config?.details?.isUse}
                key={idx}
                label={data.name}
                className='m-0'
                control={
                  <Checkbox
                    checked={data.isChecked}
                    name={data.name}
                    onChange={e => {
                      const newItemList = item.config.details.itemList.map((d: any, i: number) =>
                        i === idx ? { ...d, isChecked: e.target.checked } : d
                      )

                      updateDetails(
                        String(selectedField?.parentKey ?? ''),
                        selectedField?.boxId ?? '',
                        selectedField?.fieldId?.id ?? '',
                        {
                          itemList: newItemList
                        }
                      )
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
