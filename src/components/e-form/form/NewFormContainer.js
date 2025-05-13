/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useCallback, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

import { useDispatch } from 'react-redux'

import { useDrop } from 'react-dnd'

import { ResizableBox } from 'react-resizable'

import { Typography, Button } from '@mui/material'

import { Add } from '@mui/icons-material'

import { Box } from './Box.js'

import TextLabel from '@components/e-form/default/TextLabel.js'
import Element from '@components/e-form/form/Element.js'

import { formSizeConfig } from '@configs/formSizeConfig.js'
import { toolboxDocumentBaseMenu } from '@/data/toolbox/toolboxMenu'
import 'react-resizable/css/styles.css'
import { useFormStore } from '@/store/useFormStore.ts'

const GridLayoutForm = dynamic(() => import('@/components/e-form/form/GridLayoutForm'), {
  ssr: false
})

const TestForm = dynamic(() => import('@/components/e-form/form/test'), {
  ssr: false
})

const styles = {
  width: `${formSizeConfig.width}px`,
  height: `auto`,
  minHeight: `${formSizeConfig.height}px`,
  position: 'relative',
  borderRadius: '4px',
  boxShadow: '0px 2px 8px 0px #11151A14'
}

export const NewFormContainer = ({ formElements }) => {
  const form = useFormStore(state => state.form)
  const selectedField = useFormStore(state => state.selectedField)
  const addDefaultForm = useFormStore(state => state.addDefaultForm)

  const handleSetForm = () => {
    addDefaultForm()
  }
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'container',
    // drop: item => alert(`Dropped ${item.id} into Area B`),
    drop: addDefaultForm,

    collect: monitor => ({
      isOver: monitor.isOver()
    })
  }))

  return (
    <div
      style={{
        ...styles,
        backgroundColor: isOver ? 'rgb(4, 99, 234, 0.08)' : 'white',
        border: isOver ? '2px dashed #0463EA' : 'none'
      }}
      ref={dropRef}
    >
      {formElements?.form_details?.length > 0 ? (
        <>
          {form.form_details.length > 0 &&
            form?.form_details?.map((item, index) => {
              {
                return <GridLayoutForm formElement={item} key={index} />
              }

              {
                /* return <TestForm formElement={item} key={index} /> */
              }
            })}
        </>
      ) : (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}
          className='flex flex-col gap-2 items-center'
        >
          <Button onClick={handleSetForm} className='w-[60px]' variant='outlined' color='primary'>
            <Add className='w-[42px]' />
          </Button>
          <Typography variant='h6' color='primary' style={{ opacity: 0.7 }}>
            ลากเครื่องมือ Grid จากทางด้านซ้ายมาวาง <br /> เพื่อเพิ่มองค์ประกอบในฟอร์มของคุณ
          </Typography>
        </div>
      )}
    </div>
  )
}
