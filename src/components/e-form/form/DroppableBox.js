/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useFormStore } from '@/store/useFormStore'
import ElementCase from './ElementCase'

const DroppableBox = forwardRef(({ item, isOver, parentKey }, ref) => {
  const boxRef = useRef()
  const setSelectedField = useFormStore(state => state.setSelectedField)
  const selectedField = useFormStore(state => state.selectedField)
  const updateFieldHeight = useFormStore(state => state.updateFieldHeight)

  const recalculateHeight = () => {
    if (boxRef.current) {
      setTimeout(() => {
        if (!boxRef.current) return
        const heightInPx = boxRef.current.offsetHeight
        const rowHeight = Number(process.env.NEXT_PUBLIC_GRID_LAYOUT_ROW_HEIGHT)
        const calculatedH = Math.floor(heightInPx / rowHeight)

        // console.log(`[resizeTrigger] item ${item.i}: ${heightInPx} h=${calculatedH}`)

        if (calculatedH !== item.h) {
          updateFieldHeight(parentKey, item.i, calculatedH)
        }
      }, 210)
    }
  }

  useEffect(() => {
    recalculateHeight()
  }, [item])

  React.useImperativeHandle(ref, () => ({
    resizeTrigger: recalculateHeight
  }))

  const hanldeSelectField = data => {
    setSelectedField({
      parentKey: parentKey,
      fieldId: data,
      boxId: item?.i
    })
  }

  return (
    <Box
      ref={el => {
        boxRef.current = el
        if (typeof ref === 'function') ref(el)
        else if (ref) ref.current = el
      }}
      className='min-h-[30px] '
      style={{
        backgroundColor:
          isOver || (selectedField?.boxId == item.i && !selectedField?.fieldId) ? 'rgb(4, 99, 234, 0.08)' : '',
        paddingTop: `${item?.padding?.top ?? 0}px`,
        paddingBottom: `${item?.padding?.bottom ?? 0}px`,
        paddingLeft: `${item?.padding?.left ?? 0}px`,
        paddingRight: `${item?.padding?.right ?? 0}px`
      }} // padding ของแต่ละ col naja
    >
      {item?.data?.length == 0 && (
        <Typography variant='body1' className=' text-textDisabled'>
          ว่าง
        </Typography>
      )}

      {item?.data &&
        item?.data.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                hanldeSelectField(item)
              }}
              style={{
                border: '1px dashed transparent', // ให้มีกรอบตลอด เพราะถ้าใส่ตอนเช็ค height มันจะขยับไปมา
                borderColor: selectedField?.fieldId?.id === item.id ? '#0463EA' : 'transparent',
                boxSizing: 'border-box'
              }}
            >
              <ElementCase item={item} />
            </div>
          )
        })}
    </Box>
  )
})

DroppableBox.displayName = 'DroppableBox'
export default DroppableBox
