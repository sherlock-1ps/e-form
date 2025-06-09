'use client'
import { useDispatch } from 'react-redux'
import { useRef, useState } from 'react'
import { OndemandVideoOutlined } from '@mui/icons-material'
import { MAX_FILE_VIDEO_SIZE_MB } from '@/data/toolbox/toolboxMenu'
import { Button } from '@mui/material'
import { useFormStore } from '@/store/useFormStore'

const ButtonForm = ({ item, parentKey, boxId, draft }: any) => {
  const updateValue = useFormStore(state => state.updateValue)
  const selectedField = useFormStore(state => state.selectedField)

  return (
    <div className='flex w-full' style={{ justifyContent: item?.config?.style?.textAlign }}>
      <Button
        variant='contained'
        className=''
        style={{
          opacity: item?.config?.details?.isShow ? 1 : 0,
          width: item?.config?.style?.width ? item?.config?.style?.width : item?.config?.style?.defaultWidth,
          height: item?.config?.style?.height ? item?.config?.style?.height : item?.config?.style?.defaultHeight,
          fontWeight: item?.config?.style?.fontWeight ?? 'normal',
          fontStyle: item?.config?.style?.fontStyle ?? 'none',
          textDecoration: item?.config?.style?.textDecoration ?? 'none'
        }}
        disabled={!item?.config?.details?.isUse}
      >
        {item?.config?.details?.value?.valueType == 'variable'
          ? `{{${item?.config?.details?.value?.name}}}`
          : item?.config?.details?.value?.value}
      </Button>
    </div>
  )
}

export default ButtonForm
