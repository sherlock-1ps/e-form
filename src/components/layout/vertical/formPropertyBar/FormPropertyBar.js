'use client'

import { useSelector } from 'react-redux'
import { useMemo } from 'react'

import GridProperty from '@/components/e-form/property/grid/GridProperty'
import ColumnBoxProperty from '@/components/e-form/property/columnBox/ColumnBoxProperty'
import TextProperty from '@/components/e-form/property/text/TextProperty'
import TextareaProperty from '@/components/e-form/property/textarea/TextareaProperty'
import ImageProperty from '@/components/e-form/property/image/ImageProperty'
import VideoProperty from '@/components/e-form/property/video/VideoProperty'
import TextfieldProperty from '@/components/e-form/property/textfield/TextfieldProperty'
import SelectProperty from '@/components/e-form/property/select/SelectProperty'
import ButtonProperty from '@/components/e-form/property/button/ButtonProperty'
import DatetimeProperty from '@/components/e-form/property/datetime/DatetimeProperty'
import LinkProperty from '@/components/e-form/property/link/LinkProperty'
import SignatureProperty from '@/components/e-form/property/signature/SignatureProperty'
import DropdownProperty from '@/components/e-form/property/dropdown/DropdownProperty'
import CheckboxProperty from '@/components/e-form/property/checkbox/CheckboxProperty'
import RadioProperty from '@/components/e-form/property/radio/RadioProperty'
import SwitchProperty from '@/components/e-form/property/switch/SwitchProperty'
import UploadProperty from '@/components/e-form/property/upload/UploadProperty'
import { useFormStore } from '@/store/useFormStore.ts'
import { usePathname } from 'next/navigation'

const FormPropertyBar = () => {
  const selectedField = useFormStore(state => state.selectedField)
  const pathname = usePathname()

  const renderedProperty = useMemo(() => {
    if (!selectedField?.fieldId && selectedField?.boxId) return <ColumnBoxProperty />

    if (!selectedField?.fieldId && !selectedField?.boxId) return <GridProperty parentKey={selectedField?.parentKey} />

    if (selectedField?.fieldId && selectedField?.fieldId?.config?.details?.type == 'text') {
      return <TextProperty item={selectedField?.fieldId} />
    }

    if (selectedField?.fieldId && selectedField?.fieldId?.config?.details?.type == 'image') {
      return <ImageProperty />
    }

    if (selectedField?.fieldId && selectedField?.fieldId?.config?.details?.type == 'video') {
      return <VideoProperty />
    }

    if (selectedField?.fieldId && selectedField?.fieldId?.config?.details?.type == 'button') {
      return <ButtonProperty />
    }

    if (selectedField?.fieldId && selectedField?.fieldId?.config?.details?.type == 'textfield') {
      return <TextfieldProperty />
    }

    if (selectedField?.fieldId && selectedField?.fieldId?.config?.details?.type == 'datetime') {
      return <DatetimeProperty />
    }

    if (selectedField?.fieldId && selectedField?.fieldId?.config?.details?.type == 'upload') {
      return <UploadProperty />
    }

    if (selectedField?.fieldId && selectedField?.fieldId?.config?.details?.type == 'link') {
      return <LinkProperty />
    }

    if (selectedField?.fieldId && selectedField?.fieldId?.config?.details?.type == 'signature') {
      return <SignatureProperty />
    }

    if (selectedField?.fieldId && selectedField?.fieldId?.config?.details?.type == 'dropdown') {
      return <DropdownProperty />
    }

    if (selectedField?.fieldId && selectedField?.fieldId?.config?.details?.type == 'checkbox') {
      return <CheckboxProperty />
    }

    if (selectedField?.fieldId && selectedField?.fieldId?.config?.details?.type == 'radio') {
      return <RadioProperty />
    }

    if (selectedField?.fieldId && selectedField?.fieldId?.config?.details?.type == 'switch') {
      return <SwitchProperty />
    }
  }, [selectedField])

  if (!pathname.includes('/admin/form')) return null

  return (
    selectedField?.parentKey && (
      <main className='max-w-[320px] w-full h-screen '>
        <div className='fixed bg-slate-50 top-0 bottom-0 right-0 min-w-[320px] max-w-[320px] overflow-auto'>
          {renderedProperty}
        </div>
      </main>
    )
  )
}

export default FormPropertyBar
