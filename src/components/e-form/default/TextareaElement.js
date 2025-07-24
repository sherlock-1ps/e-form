/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import CustomTextField from '@core/components/mui/TextField'

const TextareaElement = props => {
  const { config, id, readOnly = false, onSizeChange, onSetMinElement, isTriggerResize } = props
  const [inputWidth, setInputWidth] = useState('auto')
  const [inputHeight, setInputHeight] = useState('auto')

  const dispatch = useDispatch()
  const divRef = useRef(null)
  const textMeasureRef = useRef(null)

  const handleChangeInput = e => {
    console.log('e', e.target.value)
    dispatch()
    // setValueElement({
    //   id: id,
    //   key: 'value',
    //   value: e.target.value
    // })
    // updateInputWidth(e.target.value)
  }

  const updateInputWidth = text => {
    if (textMeasureRef.current) {
      textMeasureRef.current.textContent = text || config.details.placeholder || ''
      setInputWidth(`${textMeasureRef.current.offsetWidth + 4}px`) // Add some padding pixels
      onSizeChange(textMeasureRef.current.offsetWidth, textMeasureRef.current.offsetHeight)
      onSetMinElement(textMeasureRef.current.offsetWidth, textMeasureRef.current.offsetHeight)
    }
  }

  // const updateInitial = text => {
  //   if (textMeasureRef.current) {
  //     textMeasureRef.current.textContent = text || config.details.placeholder || ''
  //     onSetMinElement(textMeasureRef.current.offsetWidth, textMeasureRef.current.offsetHeight)
  //   }
  // }

  useEffect(() => {
    if (divRef.current) {
      console.log('divRef.current.offsetWidth', divRef.current.offsetWidth)
    }
    updateInputWidth(config.details.value)
  }, [config.style.fontWeight, config.style.fontSize])

  return (
    <div>
      <span
        ref={textMeasureRef}
        style={{
          ...config.style,
          position: 'absolute',
          visibility: 'hidden',
          height: 'auto',
          width: 'auto',
          whiteSpace: 'nowrap'
        }}
      />

      <CustomTextField
        ref={divRef}
        style={{
          width: isTriggerResize ? '100%' : inputWidth,
          minHeight: `${config.style.minHeight}px`
        }}
        InputProps={{
          style: {
            border: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${config.style.fontSize}px`,
            width: isTriggerResize ? '100%' : 'auto',
            minHeight: `${config.style.minHeight}px`,
            whiteSpace: 'nowrap',
            ...config.style
          }
        }}
        inputProps={{
          // Note the lowercase 'i', which is different from 'InputProps'
          style: {
            textAlign: config?.style?.textAlign || 'start' // This applies directly to the textarea or input element
          }
        }}
        multiline
        id='textarea-outlined'
        placeholder='Placeholder'
        label=''
        value={config.details.value || config.details.placeholder}
        onChange={handleChangeInput}
      />
    </div>
  )
}

export default TextareaElement
