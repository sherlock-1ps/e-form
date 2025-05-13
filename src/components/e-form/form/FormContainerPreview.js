'use client'
import React, { useCallback, useEffect } from 'react'

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

const styles = {
  width: `${formSizeConfig.width}px`,
  height: `${formSizeConfig.height}px`,

  // border: `2px solid ${formSizeConfig.border}`,
  position: 'relative',
  backgroundColor: 'white',
  borderRadius: '4px',
  boxShadow: '0px 2px 8px 0px #11151A14'
}

export function snapToGrid(x, y) {
  const snappedX = Math.round(x / formSizeConfig.gridLine) * formSizeConfig.gridLine
  const snappedY = Math.round(y / formSizeConfig.gridLine) * formSizeConfig.gridLine

  return [snappedX, snappedY]
}

export const FormContainerPreview = ({ formElements, index }) => {
  const dispatch = useDispatch()

  const moveBox = useCallback(
    (id, left, top) => {
      dispatch(
        updateElements({
          id,
          updates: { left, top }
        })
      )
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
        const delta = monitor.getDifferenceFromInitialOffset()

        const vLeft = isNaN(item.left) ? -200 : item.left
        const vTop = isNaN(item.top) ? 80 : item.top

        let left = Math.round(vLeft + delta.x)
        let top = Math.round(vTop + delta.y)

        if (left < 0) {
          left = 0
        }

        if (top < 0) {
          top = 0
        }

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

  const handleSetCurrentProperty = id => {}

  return (
    <div ref={drop} style={styles}>
      {formElements?.formElements[index].map(item => {
        return (
          <Box
            key={item.id}
            id={item.id}
            left={item.left}
            top={item.top}
            hideSourceOnDrag={false}
            item={item}
            preview={true}
            onSetCurrentProperty={() => {
              handleSetCurrentProperty(item.id)
            }}
          >
            <Element {...item} preview={true} />
          </Box>
        )
      })}
    </div>
  )
}
