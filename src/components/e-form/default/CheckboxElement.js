'use client'
import { useDispatch } from 'react-redux'
import { useEffect, useRef } from 'react'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

const CheckboxElement = props => {
  const { config, id } = props

  const dispatch = useDispatch()

  const handleChangeChecked = (checked, index) => {
    // dispatch(setValueElementArray({ id, index, key: 'isChecked', value: checked }))
  }

  return (
    <FormGroup row={config?.details?.row}>
      {config?.details?.itemList &&
        config?.details?.itemList.map((item, idx) => {
          return (
            <FormControlLabel
              key={idx}
              label={item.name}
              control={
                <Checkbox
                  checked={item.isChecked}
                  name={item.name}
                  onChange={e => handleChangeChecked(e.target.checked, idx)}
                />
              }
            />
          )
        })}
    </FormGroup>
  )
}

export default CheckboxElement
