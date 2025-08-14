/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useDispatch } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { Typography } from '@mui/material'

const TextLabel = props => {
  const { config, id, readOnly = false, onSizeChange, onSetMinElement, isTriggerResize, handleTriggerResize } = props
  const [minWidthText, setMinWidthText] = useState(null)

  const dispatch = useDispatch()
  const divRef = useRef(null)

  const handleChangeInput = () => {
    const newValue = divRef.current.textContent
    if (!readOnly) {
      handleTriggerResize(false)
      dispatch()
      // setValueElement({
      //   id: id,
      //   key: 'value',
      //   value: newValue
      // })
    }
    moveCaretToEnd()
    updateSize()
  }

  const handleSelectText = () => {
    if (divRef.current) {
      const range = document.createRange()
      range.selectNodeContents(divRef.current)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  const moveCaretToEnd = () => {
    if (divRef.current) {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(divRef.current)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  const updateSize = () => {
    if (divRef.current) {
      const { offsetWidth, offsetHeight } = divRef.current
      if (onSizeChange) {
        onSizeChange(offsetWidth, offsetHeight) // noti parent size changeeeee
      }
    }
  }

  useEffect(() => {
    if (divRef.current) {
      const { offsetWidth, offsetHeight } = divRef.current

      divRef.current.textContent = config?.details.value || config?.details?.placeholder || ''
      onSizeChange(offsetWidth, offsetHeight)
      onSetMinElement(offsetWidth, offsetHeight)
      setMinWidthText(offsetWidth)

      // moveCaretToEnd()
    }
  }, [config?.details.value, config?.style?.fontSize, config?.style?.fontWeight])

  return (
    <div>
      <Typography
        ref={divRef}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        style={{
          marginTop: '2px',
          // paddingTop: '8px',
          // paddingBottom: '8px',
          display: 'inline-block',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: `auto`,
          fontSize: `${config?.style?.fontSize}px`,
          minWidth: `${minWidthText}px`,
          minHeight: `${config?.style?.minHeight}px`,
          width: isTriggerResize ? '100%' : 'auto',
          whiteSpace: 'nowrap',
          ...config?.style
        }}
        onInput={handleChangeInput}
        onClick={handleSelectText}
        role='textbox'
        aria-placeholder={config?.details?.placeholder}
      >
        {config?.details?.value || config?.details?.placeholder}
      </Typography>
    </div>
  )
}

export default TextLabel
