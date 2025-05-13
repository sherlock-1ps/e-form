/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useCallback, useRef, useState } from 'react'

import { useDispatch } from 'react-redux'

import { useDrop } from 'react-dnd'

import { ResizableBox } from 'react-resizable'

import { Typography } from '@mui/material'

import { Add } from '@mui/icons-material'

import BaseButton from '@/components/ui/button/BaseButton'

import { Box } from './Box.js'

import TextLabel from '@components/e-form/default/TextLabel.js'
import Element from '@components/e-form/form/Element.js'

import { formSizeConfig } from '@configs/formSizeConfig.js'
import { addElements, updateElements, setCurrentProperty } from '@/redux-store/slices/formSlice.js'
import 'react-resizable/css/styles.css'
import zIndex from '@mui/material/styles/zIndex.js'

const styles = {
  width: `${formSizeConfig.width}px`,
  height: `${formSizeConfig.height}px`,

  // border: `2px solid ${formSizeConfig.border}`,
  position: 'relative',
  backgroundColor: 'white',
  borderRadius: '4px',
  boxShadow: '0px 2px 8px 0px #11151A14'
  // backgroundSize: `${formSizeConfig.gridLine}px ${formSizeConfig.gridLine}px`,
  // backgroundImage: `
  //   linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
  //   linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
  // `,
  // zIndex: 1
}

export function snapToGrid(x, y) {
  const snappedX = Math.round(x / formSizeConfig.gridLine) * formSizeConfig.gridLine
  const snappedY = Math.round(y / formSizeConfig.gridLine) * formSizeConfig.gridLine

  return [snappedX, snappedY]
}

export const FormContainer = ({ formElements }) => {
  const dropRef = useRef(null)
  const [isResizing, setIsResizing] = useState(false)
  const dispatch = useDispatch()

  const moveBox = useCallback(
    (id, left, top) => {
      dispatch(
        updateElements({
          id,
          updates: { left, top }
        })
      )

      dispatch(setCurrentProperty(id))
    },
    [formElements]
  )

  const ToolsRender = props => {
    const { id, config } = props
    let setTTL

    const onResize = (event, { node, size, handle }) => {
      // const { width, height } = size
      // const val = { ...props, config: { ...config, width, height } }
      // const updateNewElement = { ...{ [id]: val } }
      // clearTimeout(setTTL)
      // setTTL = setTimeout(() => {
      //   // setFormElements(prev => ({ ...prev, ...updateNewElement }))
      // }, 500)
    }

    const newId = 'I' + id

    return (
      <ResizableBox onResize={onResize} width={config.width} height={config.height}>
        {/* <div key={'key' + newId}>
          {config.label} <input {...config} name={newId} id={newId} />
        </div> */}
        <TextLabel {...props} />
      </ResizableBox>
    )
  }

  const handleDropElement = useCallback(
    item => {
      const { config } = item

      const id = 'T' + Date.now()

      const val = {
        id,
        top: 10,
        left: 0,
        config,
        ...item
      }

      const newElement = {
        [id]: val
      }

      dispatch(addElements(val))
    },
    [formElements]
  )

  const [, drop] = useDrop(
    () => ({
      accept: 'box',
      drop(item, monitor) {
        const clientOffset = monitor.getClientOffset()
        if (!clientOffset) return

        const container = dropRef.current?.getBoundingClientRect()
        if (!container) return

        const delta = monitor.getDifferenceFromInitialOffset()

        const vLeft = isNaN(item.left) ? -200 : item.left
        const vTop = isNaN(item.top) ? 80 : item.top

        let left
        let top

        if (typeof item.left === 'number' && typeof item.top === 'number') {
          left = Math.round(vLeft + delta.x)
          top = Math.round(vTop + delta.y)
        } else {
          left = Math.round(clientOffset.x - container.left)
          top = Math.round(clientOffset.y - container.top)
        }

        if (left < 0) left = 0
        if (top < 0) top = 0
        ;[left, top] = snapToGrid(left, top)

        if (!item.id) {
          item = handleDropElement({ ...item, left, top }, monitor)

          return
        }

        moveBox(item.id, left, top)

        return undefined
      }
    }),
    [moveBox]
  )

  const handleSetCurrentProperty = id => {
    dispatch(setCurrentProperty(id))
  }

  drop(dropRef)

  return (
    <div ref={dropRef} style={styles}>
      {!formElements?.formElements[formElements.currentForm].some(innerArray => innerArray.length !== 0) ? (
        <section className='w-full h-full flex items-center justify-center'>
          <div className='flex flex-col gap-2 items-center'>
            <BaseButton icon={Add} color='secondary' sx={{ width: '30px' }} />
            <Typography variant='h6' color='primary' style={{ opacity: 0.7 }}>
              ลากเครื่องมือจากทางด้านซ้ายมาวาง <br /> เพื่อเพิ่มองค์ประกอบในฟอร์มของคุณ
            </Typography>
          </div>
        </section>
      ) : (
        formElements?.formElements[formElements.currentForm].map(item => {
          return (
            <Box
              key={item.id}
              id={item.id}
              left={item.left}
              top={item.top}
              item={item}
              isResizing={isResizing}
              onSetCurrentProperty={() => {
                handleSetCurrentProperty(item.id)
              }}
            >
              <Element {...item} isResizing={isResizing} setIsResizing={setIsResizing} />
            </Box>
          )
        })
      )}
    </div>
  )
}
