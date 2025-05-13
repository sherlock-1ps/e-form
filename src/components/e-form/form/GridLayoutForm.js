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
import { DragHandle, AdsClick, SelectAllOutlined } from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'
import DroppableBox from './DroppableBox'
import { v4 as uuidv4 } from 'uuid'
import { nanoid } from 'nanoid'

const DroppableWrapper = React.forwardRef(({ item, onDrop, parentKey }, ref) => {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'box',
    drop: draggedItem => {
      const id = nanoid(8)
      const resultItem = { ...draggedItem, id }
      onDrop(item.i, resultItem)
    },
    collect: monitor => ({
      isOver: monitor.isOver()
    })
  }))

  return (
    <div ref={dropRef}>
      <DroppableBox ref={ref} item={item} isOver={isOver} parentKey={parentKey} />
    </div>
  )
})
DroppableWrapper.displayName = 'DroppableWrapper'

export default function GridLayoutForm({ formElement }) {
  const updateFormByKey = useFormStore(state => state.updateFormByKey)
  const updateFieldData = useFormStore(state => state.updateFieldData)
  const setSelectedField = useFormStore(state => state.setSelectedField)
  const setSelectedContainer = useFormStore(state => state.setSelectedContainer)
  const selectedField = useFormStore(state => state.selectedField)
  const [layout, setLayout] = useState(formElement?.fields || [])

  const refMap = useRef(new Map())
  const setRef = (key, ref) => {
    if (ref) refMap.current.set(key, ref)
    else refMap.current.delete(key)
  }

  const handleLayoutChange = newLayout => {
    updateFormByKey(formElement.parentKey, newLayout)
  }

  const handleDrop = (boxId, droppedItem) => {
    updateFieldData(formElement.parentKey, boxId, droppedItem)
  }

  const handleClickContainer = key => {
    setSelectedContainer(key)
  }

  useEffect(() => {
    setLayout(formElement?.fields || [])
  }, [formElement])

  const handleClickBox = item => {
    setSelectedField({
      parentKey: formElement?.parentKey,
      fieldId: null,
      boxId: item?.i
    })
  }

  return (
    <div
      className={`relative ${
        selectedField?.parentKey === formElement.parentKey
          ? 'border-2 border-dashed border-primary'
          : 'border-2 border-transparent'
      } pb-[2px]`}
    >
      <IconButton
        onClick={() => {
          handleClickContainer(formElement?.parentKey)
        }}
        className=' absolute top-0 left-[-40px] bg-primaryLighter'
      >
        <AdsClick className=' text-primary' />
      </IconButton>

      <GridLayout
        className={`layout `}
        layout={layout}
        cols={Number(process.env.NEXT_PUBLIC_GRID_LAYOUT_COL)} //สัมพันธ์กันกับ row ของ cols แต่ละช่อง
        rowHeight={Number(process.env.NEXT_PUBLIC_GRID_LAYOUT_ROW_HEIGHT)}
        width={formSizeConfig.width}
        margin={[0, 0]}
        containerPadding={[0, 0]}
        isResizable={true}
        compactType='horizontal'
        draggableHandle='.drag-handle'
        // onLayoutChange={handleContentChange}
        onDragStop={(layout, oldItem, newItem, placeholder, e, element) => {
          handleLayoutChange(layout)
        }}
        onResizeStop={(layout, oldItem, newItem, placeholder, e, element) => {
          console.log('resized:', {
            layout,
            oldItem,
            newItem, // ← ขนาดและตำแหน่งใหม่ของ item ที่ถูก resize
            placeholder,
            e,
            element
          })

          handleLayoutChange(layout)
          const ref = refMap.current.get(newItem.i)
          if (ref?.resizeTrigger) {
            ref.resizeTrigger()
          }
        }}
      >
        {layout?.map(item => (
          <Box key={item.i} className=' relative min-h-[12px] w-full'>
            <DragHandle className='drag-handle absolute w-[15px] h-[15px] rounded-full top-0 right-0 text-primary cursor-move z-50' />
            <button
              className='absolute w-[15px] h-[15px] rounded-full top-0 right-[16px] bg-transparent cursor-pointer z-50'
              onClick={() => {
                handleClickBox(item)
              }}
            >
              <SelectAllOutlined className='w-full h-full text-primary' />
            </button>

            <div className='w-full'>
              <DroppableWrapper
                key={item.i}
                item={item}
                onDrop={handleDrop}
                parentKey={formElement?.parentKey}
                ref={ref => setRef(item.i, ref)}
              />
            </div>
          </Box>
        ))}
      </GridLayout>
    </div>
  )
}
