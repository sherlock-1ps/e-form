'use client'
import { useDispatch } from 'react-redux'
import { useEffect, useRef } from 'react'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useFormStore } from '@/store/useFormStore'
import FormControl from '@mui/material/FormControl'
const CheckboxForm = ({ item, parentKey, boxId, draft }: any) => {
  const updateDetails = useFormStore(state => state.updateDetails)
  const selectedField = useFormStore(state => state.selectedField)

  const errors = useFormStore(state => state.errors)
  const key = `${parentKey}-${boxId}-${item?.id}`
  const errorInput = errors[key]

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
      <FormControl
        // error={errorInput}
        component='fieldset'
        variant='standard'
        className='w-full'
        sx={{
          ...(errorInput && {
            border: '1px solid',
            borderColor: 'error.main', // ใช้สี error จาก theme ของ MUI
            borderRadius: 1 // ทำให้ขอบมน
            // p: 2 // เพิ่ม padding ด้านใน
          })
        }}
      >
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

                      const filteredList = newCheckedList.filter((value: any) => value !== '')

                      updateDetails(String(parentKey ?? ''), boxId ?? '', item?.id ?? '', {
                        value: {
                          ...item?.config?.details?.value,
                          checkedList: filteredList
                        }
                      })
                    }}
                  />
                }
              />
            )
          })}
        </FormGroup>
      </FormControl>
    </div>
  )
}

export default CheckboxForm
