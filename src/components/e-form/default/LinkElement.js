'use client'
import { useDispatch } from 'react-redux'
import { useEffect, useRef } from 'react'
import { Typography } from '@mui/material'

const LinkElement = props => {
  const { config, id, readOnly = false } = props

  const dispatch = useDispatch()
  const divRef = useRef(null)

  const handleChangeInput = () => {
    const newValue = divRef.current.textContent
    if (!readOnly) {
      dispatch()
      // setValueElement({
      //   id: id,
      //   key: 'value',
      //   value: newValue
      // })
    }
    moveCaretToEnd()
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

  useEffect(() => {
    if (divRef.current) {
      divRef.current.textContent = config.details.value || config.details.placeholder || ''
      moveCaretToEnd()
    }
  }, [config.details.value, config.details.placeholder])

  return (
    <div>
      <Typography
        ref={divRef}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        style={{
          paddingTop: '8px',
          paddingBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${config.style.fontSize}px`,
          minHeight: config.style.minHeight,
          width: 'auto',
          whiteSpace: 'nowrap',
          ...config.style
        }}
        onInput={handleChangeInput}
        onClick={handleSelectText}
        role='textbox'
        aria-placeholder={config.details.placeholder}
      >
        {config.details.value || ' '}
      </Typography>
    </div>
  )
}

export default LinkElement
