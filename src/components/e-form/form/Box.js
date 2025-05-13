'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useDrag } from 'react-dnd'
import Typography from '@mui/material/Typography'

// import { paddingAroundElement } from '@/configs/formSizeConfig'
import zIndex from '@mui/material/styles/zIndex'

const style = {
  border: '1px solid #0463EA3D'
}

const styleActive = {
  border: '1.5px dashed #3682EE',
  backgroundColor: '#0463EA14'
}

export const Box = ({
  id,
  left,
  top,
  hideSourceOnDrag,
  item,
  onSetCurrentProperty,
  preview = false,
  children,
  isResizing
}) => {
  const currentProperty = useSelector(state => state.form.currentProperty)

  const [{ isDragging, opacity }, drag] = useDrag(
    () => ({
      type: 'box',
      item: { id, left, top },
      canDrag: !isResizing,
      collect: monitor => ({
        isDragging: monitor.isDragging(),
        opacity: monitor.isDragging() ? 0.35 : 1
      })
    }),
    [id, left, top, isResizing]
  )

  useEffect(() => {
    if (preview) {
      return
    }
    onSetCurrentProperty()
  }, [])

  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />
  }

  return (
    <main
      ref={drag}
      className='box'
      style={{
        ...(preview
          ? {}
          : {
              // ...(currentProperty === id ? styleActive : style),
              cursor: 'move',
              position: 'absolute',
              left,
              top,
              opacity,
              backgroundColor: 'white'
            })
      }}
    >
      <div
        data-testid='box'
        onClick={onSetCurrentProperty}
        style={{
          ...(preview
            ? { left, top, position: 'absolute', padding: `0px` }
            : {
                ...(currentProperty === id ? styleActive : style),
                padding: `0px`
              })
        }}
      >
        {!preview &&
          (currentProperty === id ? (
            <div
              className='w-[auto] absolute px-1 py-0.5 left-[-1.5px] top-0'
              style={{
                backgroundColor: '#0463EA3D',
                border: '1.5px solid #3682EE',
                zIndex: 1,
                transform: 'translateY(-100%)'
              }}
            >
              <Typography color='#0463EA' fontSize={10} fontWeight={500}>
                {item?.config?.details?.type}
              </Typography>
            </div>
          ) : (
            <div className='w-[auto] h-[10px] absolute left-5% top-0'>
              <Typography color='#0463EA61' fontSize={8} fontWeight={500} gutterBottom>
                {item?.config?.details?.type}
              </Typography>
            </div>
          ))}

        {children}
      </div>
    </main>
  )
}
