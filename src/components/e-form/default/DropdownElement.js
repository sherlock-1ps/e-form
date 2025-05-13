'use client'
import { useDispatch } from 'react-redux'
import { useEffect, useRef } from 'react'
import { Typography, Button, MenuItem } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'

const DropdownElement = props => {
  const { config, id } = props

  const dispatch = useDispatch()

  return (
    <div>
      <CustomTextField
        select
        fullWidth
        label={config?.details?.tag?.isShow && config?.details?.tag?.value}
        id='dropdown-element'
        defaultValue={config?.details?.example?.isShow && config?.details?.example?.value}
        slotprops={{
          select: {
            displayEmpty: true,
            multiple: true
          }
        }}
        helperText={config?.details?.helperText?.isShow && config?.details?.helperText?.value}
        style={config?.style || {}}
      >
        {config?.details?.example?.isShow && (
          <MenuItem value={config?.details?.value || 0}>
            <em>{config?.details?.example?.name || 'ตัวเลือก ....'}</em>
          </MenuItem>
        )}

        {config.details.itemList &&
          config.details.itemList.map((item, idx) => {
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

export default DropdownElement
