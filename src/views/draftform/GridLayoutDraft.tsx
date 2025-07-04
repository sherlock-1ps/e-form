/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useState, forwardRef, useRef, useEffect, ForwardedRef } from 'react'
import GridLayout from 'react-grid-layout'
import Box from '@mui/material/Box'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { useDrop } from 'react-dnd'

import { formSizeConfig } from '@configs/formSizeConfig'
import { useFormStore } from '@/store/useFormStore'
import { DragHandle, AdsClick, SelectAllOutlined } from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'
import { v4 as uuidv4 } from 'uuid'
import { nanoid } from 'nanoid'
import DropppableBoxDraft from '@/components/e-form/form/DropppableBoxDraft'
import { Button } from '@mui/material'

type DroppableWrapperProps = {
  item: any
  parentKey: string
}
type DroppableBoxHandle = {
  resizeTrigger: () => void
}

const DroppableWrapper = React.forwardRef(
  ({ item, parentKey }: DroppableWrapperProps, ref: ForwardedRef<DroppableBoxHandle>) => {
    return (
      <div>
        <DropppableBoxDraft ref={ref} item={item} parentKey={parentKey} />
      </div>
    )
  }
)

DroppableWrapper.displayName = 'DroppableWrapper'

export default function GridLayoutDraft({ formElement }: any) {
  const form = useFormStore(state => state.form)
  const updateFormByKey = useFormStore(state => state.updateFormByKey)
  const updateFieldData = useFormStore(state => state.updateFieldData)
  const setSelectedField = useFormStore(state => state.setSelectedField)
  const selectedField = useFormStore(state => state.selectedField)
  const [layout, setLayout] = useState(formElement?.fields || [])

  const refMap = useRef(new Map())
  const setRef = (key: any, ref: any) => {
    if (ref) refMap.current.set(key, ref)
    else refMap.current.delete(key)
  }

  const handleLayoutChange = (newLayout: any) => {
    updateFormByKey(formElement.parentKey, newLayout)
  }

  const handleClickContainer = (key: any) => { }

  useEffect(() => {
    setLayout(formElement?.fields || [])
  }, [formElement])

  return (
    <form className={`relative border-2 border-transparent pb-[2px]`} id='hello'>
      {/* <IconButton
        onClick={() => {
          handleClickContainer(formElement?.parentKey)
        }}
        className=' absolute top-0 left-[-40px] bg-primaryLighter'
      >
        <AdsClick className=' text-primary' />
      </IconButton> */}

      <GridLayout
        className={`layout `}
        layout={layout}
        cols={Number(process.env.NEXT_PUBLIC_GRID_LAYOUT_COL)} //สัมพันธ์กันกับ row ของ cols แต่ละช่อง
        rowHeight={Number(process.env.NEXT_PUBLIC_GRID_LAYOUT_ROW_HEIGHT)}
        width={form?.layout === 'vertical' ? formSizeConfig.width : formSizeConfig.height}
        margin={[0, 0]}
        containerPadding={[0, 0]}
        isResizable={false}
        compactType='horizontal'
        draggableHandle='.drag-handle'
        // onLayoutChange={handleContentChange}
        onDragStop={(layout, oldItem, newItem, placeholder, e, element) => {
          handleLayoutChange(layout)
        }}
        onResizeStop={(layout, oldItem, newItem, placeholder, e, element) => {
          // console.log('resized:', {
          //   layout,
          //   oldItem,
          //   newItem, // ← ขนาดและตำแหน่งใหม่ของ item ที่ถูก resize
          //   placeholder,
          //   e,
          //   element
          // })

          handleLayoutChange(layout)
          const ref = refMap.current.get(newItem.i)
          if (ref?.resizeTrigger) {
            ref.resizeTrigger()
          }
        }}
      >

        {layout?.map((item: any) => (
          <Box key={item.i} className=' relative min-h-[12px] w-full'>
            <div className='w-full'>
              <DroppableWrapper
                key={item.i}
                item={item}
                parentKey={formElement?.parentKey}
                ref={ref => setRef(item.i, ref)}
              />
            </div>
          </Box>
        ))}
      </GridLayout>
    </form>
  )
}
