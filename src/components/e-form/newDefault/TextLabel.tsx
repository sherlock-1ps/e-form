/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useFormStore } from '@/store/useFormStore'
import React, { useRef, useState, useEffect } from 'react'

type TextLabelProps = {
  item: any
  draft?: boolean
}

const TextLabel: React.FC<TextLabelProps> = ({ item, draft }) => {
  const divRef = useRef<HTMLDivElement>(null)
  const updateValue = useFormStore(state => state.updateValue)
  const selectedField = useFormStore(state => state.selectedField)
  const [text, setText] = useState(item?.config?.details?.value || '')
  const [isFocused, setIsFocused] = useState(false)

  const placeholder = item?.config?.details?.placeholder || ''

  const handleInput = () => {
    const rawText = divRef.current?.innerText || ''
    const newText = rawText.trim() === '' ? '' : rawText

    setText(newText)
    updateValue(String(selectedField?.parentKey ?? ''), selectedField?.boxId ?? '', item?.id ?? '', newText)
  }

  useEffect(() => {
    const details = item?.config?.details
    if (!details) return

    let newText = ''

    if (details.valueType === 'variable' && details?.trigger?.value) {
      const triggerValue = details.trigger?.value?.value
      const triggerName = details.trigger?.name

      if (draft) {
        newText = triggerValue || ''
      } else {
        newText = triggerName ? `{{${triggerName}}}` : ''
      }
    } else {
      newText = details.value || ''
    }

    if (!isFocused) {
      setText(newText)
      if (divRef.current) {
        divRef.current.innerText = newText
      }
    }
  }, [item?.config?.details])

  return (
    <div className='relative w-full' style={{ opacity: item?.config?.details?.isShow ? 1 : 0 }}>
      {text === '' && !draft && (
        <div
          className='absolute pointer-events-none text-gray-400'
          style={{
            fontSize: item?.config?.style?.fontSize ?? 16,
            textAlign: item?.config?.style?.textAlign ?? 'start',
            padding: 0,
            margin: 0
          }}
        >
          {placeholder}
        </div>
      )}

      <div
        ref={divRef}
        contentEditable={item?.config?.details?.isUse && !draft}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onInput={item?.config?.details?.isUse ? handleInput : undefined}
        className='relative'
        style={{
          outline: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
          width: '100%',
          fontSize: item?.config?.style?.fontSize ?? 16,
          color: item?.config?.style?.color ?? '#000',
          textAlign: item?.config?.style?.textAlign ?? 'start',
          fontWeight: item?.config?.style?.fontWeight ?? 'normal',
          fontStyle: item?.config?.style?.fontStyle ?? 'none',
          textDecoration: item?.config?.style?.textDecoration ?? 'none',
          background: 'transparent',
          minHeight: '23.5px'
        }}
      />
    </div>
  )
}

export default TextLabel
