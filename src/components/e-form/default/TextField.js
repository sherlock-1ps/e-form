'use client'
import { useDispatch } from 'react-redux'
import { useEffect, useRef } from 'react'

const TextField = props => {
  const { config, id } = props

  const dispatch = useDispatch()

  const handleChangeInput = e => {
    const newValue = e.target.value

    dispatch()
    // setValueElementObject({
    //   id: id,
    //   key: 'value',
    //   value: newValue
    // })
  }

  return (
    <div>
      {/* <CustomTextFieldForm
        width={config?.style?.minWidth}
        label={config?.details?.tag?.isShow ? config?.details?.tag?.value : ''}
        placeholder={config?.details?.placeholder?.isShow ? config?.details?.placeholder.value : ''}
        helperText={config?.details?.helperText?.isShow ? config?.details?.helperText.value : ''}
        InputLabelProps={{
          style: {
            fontSize: '15px'
          }
        }}
        value={config?.details?.value?.isShow ? config.details.value.value : ''}
        onChange={handleChangeInput}
      /> */}
    </div>
  )
}

export default TextField
