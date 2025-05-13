/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useState, forwardRef, useRef, useEffect } from 'react'
import GridLayout from 'react-grid-layout'
import Box from '@mui/material/Box'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { useDrop } from 'react-dnd'

import { formSizeConfig } from '@configs/formSizeConfig'
import { useFormStore } from '@/store/useFormStore'
import { DragHandle, AdsClick } from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'

const DropAreaB = () => {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'box',
    drop: item => alert(`Dropped ${item.id} into Area B`),
    collect: monitor => ({
      isOver: monitor.isOver()
    })
  }))

  return (
    <div
      ref={dropRef}
      style={{
        width: 150,
        height: 150,
        backgroundColor: isOver ? 'lightgreen' : '#e0f0e0',
        border: '2px dashed green'
      }}
    >
      Drop B
    </div>
  )
}

export default function TestForm({ formElement }) {
  const updateFormByKey = useFormStore(state => state.updateFormByKey)
  const setSelectedContainer = useFormStore(state => state.setSelectedContainer)
  const selectedField = useFormStore(state => state.selectedField)
  const [layout, setLayout] = useState(formElement?.fields || [])

  const handleClickContainer = key => {
    setSelectedContainer(key)
  }

  return (
    <div className='relative'>
      <IconButton
        onClick={() => {
          handleClickContainer(formElement?.parentKey)
        }}
        className=' absolute top-0 left-[-40px] bg-primaryLighter'
      >
        <AdsClick className=' text-primary' />
      </IconButton>
      <DropAreaB />
    </div>
  )
}
