'use client'
import React, { useEffect, useRef } from 'react'
import { useFormStore } from '@/store/useFormStore'

type LinkFormProps = {
  item: any
  draft?: boolean
}

const LinkForm: React.FC<LinkFormProps> = ({ item, draft }) => {
  const divRef = useRef<HTMLDivElement>(null)
  const secondDivRef = useRef<HTMLDivElement>(null)
  const updateValue = useFormStore(state => state.updateValue)
  const selectedField = useFormStore(state => state.selectedField)

  const placeholder = item?.config?.details?.placeholder || ''
  const value = item?.config?.details?.value || ''
  const isEditable = item?.config?.details?.isUse
  const isCut = item?.config?.details?.isCutLink

  const handleInput = () => {
    const target = isCut ? secondDivRef.current : divRef.current
    const rawText = target?.innerText || ''
    const newText = rawText.trim()
    updateValue(String(selectedField?.parentKey ?? ''), selectedField?.boxId ?? '', item?.id ?? '', newText)
  }

  useEffect(() => {
    const target = isCut ? secondDivRef.current : divRef.current

    if (target && document.activeElement !== target) {
      if (target.innerText !== value) {
        target.innerText = value
      }
    }
  }, [value, isCut])

  const sharedStyle = {
    fontSize: item?.config?.style?.fontSize ?? 16,
    textAlign: item?.config?.style?.textAlign ?? 'start',
    color: item?.config?.style?.color ?? '#000',
    textDecoration: item?.config?.style?.textDecoration ?? 'none',
    fontWeight: item?.config?.style?.fontWeight ?? 'normal',
    fontStyle: item?.config?.style?.fontStyle ?? 'none',
    minHeight: '23.5px'
  }

  const showPlaceholder = value.trim() === ''

  return (
    <div className='relative w-full' style={{ opacity: item?.config?.details?.isShow ? 1 : 0 }}>
      {showPlaceholder && (
        <div
          className='absolute pointer-events-none text-gray-400'
          style={{
            fontSize: item?.config?.style?.fontSize ?? 16,
            textAlign: item?.config?.style?.textAlign ?? 'start',
            textDecoration: 'underline'
          }}
        >
          {placeholder}
        </div>
      )}

      {isCut ? (
        draft ? (
          <a
            href={value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-ellipsis overflow-hidden whitespace-nowrap block'
            style={{ ...sharedStyle, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {value}
          </a>
        ) : (
          <div
            ref={secondDivRef}
            contentEditable={isEditable}
            onInput={isEditable ? handleInput : undefined}
            className='text-ellipsis overflow-hidden whitespace-nowrap'
            style={sharedStyle}
          />
        )
      ) : draft ? (
        <a
          href={value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`}
          target='_blank'
          rel='noopener noreferrer'
          className='block'
          style={{ ...sharedStyle, cursor: 'pointer', textDecoration: 'underline' }}
        >
          {value}
        </a>
      ) : (
        <div
          ref={divRef}
          contentEditable={isEditable}
          onInput={isEditable ? handleInput : undefined}
          className='relative'
          style={sharedStyle}
        />
      )}
    </div>
  )
}

export default LinkForm
