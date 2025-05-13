/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useImperativeHandle, useEffect, useRef, ForwardedRef } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useFormStore } from '@/store/useFormStore'
import ElementCase from './ElementCase'

export type DroppableBoxHandle = {
  resizeTrigger: () => void
}

type DroppableBoxProps = {
  item: any
  parentKey: string
}

const DropppableBoxDraft = forwardRef(
  ({ item, parentKey }: DroppableBoxProps, ref: ForwardedRef<DroppableBoxHandle>) => {
    const boxRef = useRef<HTMLDivElement>(null)
    const setSelectedField = useFormStore(state => state.setSelectedField)
    const selectedField = useFormStore(state => state.selectedField)
    const updateFieldHeight = useFormStore(state => state.updateFieldHeight)

    const recalculateHeight = () => {
      setTimeout(() => {
        const el = boxRef.current
        if (!el) return
        const heightInPx = el.offsetHeight
        const rowHeight = Number(process.env.NEXT_PUBLIC_GRID_LAYOUT_ROW_HEIGHT)
        const calculatedH = Math.floor(heightInPx / rowHeight)
        if (calculatedH !== item.h) {
          updateFieldHeight(parentKey, item.i, calculatedH)
        }
      }, 210)
    }

    useEffect(() => {
      recalculateHeight()
    }, [item])

    useImperativeHandle(ref, () => ({
      resizeTrigger: recalculateHeight
    }))

    return (
      <Box
        ref={boxRef}
        className='min-h-[30px]'
        style={{
          paddingTop: `${item?.padding?.top ?? 0}px`,
          paddingBottom: `${item?.padding?.bottom ?? 0}px`,
          paddingLeft: `${item?.padding?.left ?? 0}px`,
          paddingRight: `${item?.padding?.right ?? 0}px`
        }}
      >
        {/* {item?.data?.length === 0 && (
          <Typography variant='body1' className='text-textDisabled'>
            ว่าง
          </Typography>
        )} */}

        {item?.data?.map((fieldData: any, index: number) => (
          <div
            key={index}
            onClick={() => {
              setSelectedField({
                parentKey,
                fieldId: fieldData,
                boxId: item.i
              })
            }}
            style={{
              border: '1px dashed transparent',
              borderColor: selectedField?.fieldId?.id === fieldData.id ? '#0463EA' : 'transparent',
              boxSizing: 'border-box'
            }}
          >
            <ElementCase item={fieldData} draft />
          </div>
        ))}
      </Box>
    )
  }
)

DropppableBoxDraft.displayName = 'DropppableBoxDraft'
export default DropppableBoxDraft
