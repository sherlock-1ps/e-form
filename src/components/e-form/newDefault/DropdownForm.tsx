'use client'
import { useEffect, useRef } from 'react'
import { Typography, Button, MenuItem } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import { useFormStore } from '@/store/useFormStore'

const DropdownForm = ({ item }: any) => {
  const updateValue = useFormStore(state => state.updateValue)
  const selectedField = useFormStore(state => state.selectedField)

  return (
    <div style={{ opacity: item?.config?.details?.isShow ? 1 : 0 }}>
      <CustomTextField
        select
        fullWidth
        disabled={!item?.config?.details?.isUse}
        label={item?.config?.details?.tag?.isShow && item?.config?.details?.tag?.value}
        id='dropdown-element'
        defaultValue={item?.config?.details?.placeholder?.isShow && item?.config?.details?.placeholder?.value}
        // slotprops={{
        //   select: {
        //     displayEmpty: true,
        //     multiple: true
        //   }
        // }}
        helperText={item?.config?.details?.helperText?.isShow && item?.config?.details?.helperText?.value}
        style={item?.config?.style || {}}
      >
        {item?.config?.details?.placeholder?.isShow && (
          <MenuItem value={0} disabled>
            <em className=' opacity-50'>{item?.config?.details?.placeholder?.name}</em>
          </MenuItem>
        )}

        {item?.config.details.itemList &&
          item?.config.details.itemList.map((item: any, idx: number) => {
            return (
              <MenuItem value={item.value} key={idx}>
                {item.name}
              </MenuItem>
            )
          })}
      </CustomTextField>
    </div>
  )
}

export default DropdownForm
