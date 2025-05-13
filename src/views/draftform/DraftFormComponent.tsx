/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useCallback, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { formSizeConfig } from '@configs/formSizeConfig.js'
import 'react-resizable/css/styles.css'
import { useFormStore } from '@/store/useFormStore'

const GridLayoutDraft = dynamic(() => import('./GridLayoutDraft'), {
  ssr: false
})

const DraftFormComponent = () => {
  const form = useFormStore(state => state.form)
  const selectedField = useFormStore(state => state.selectedField)

  return (
    <div
      style={{
        width: `${formSizeConfig.width}px`,
        height: `auto`,
        minHeight: `${formSizeConfig.height}px`,
        position: 'relative',
        borderRadius: '4px',
        boxShadow: '0px 2px 8px 0px #11151A14',
        backgroundColor: 'white'
      }}
    >
      {form?.form_details?.length > 0 && (
        <>
          {form?.form_details?.length > 0 &&
            form?.form_details?.map(item => {
              {
                return <GridLayoutDraft formElement={item} key={item.parentKey} />
              }
            })}
        </>
      )}
    </div>
  )
}
export default DraftFormComponent
