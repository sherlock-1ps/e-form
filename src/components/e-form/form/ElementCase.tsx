'use client'
import React from 'react'
import TextLabel from '../newDefault/TextLabel'
import ImageForm from '../newDefault/ImageForm'
import VideoForm from '../newDefault/VideoForm'
import ButtonForm from '../newDefault/ButtonForm'
import TextFieldForm from '../newDefault/TextFieldForm'
import DatetimePickerForm from '../newDefault/DatetimePickerForm'
import LinkForm from '../newDefault/LinkForm'
import DropdownForm from '../newDefault/DropdownForm'
import CheckboxForm from '../newDefault/CheckboxForm'
import RadioForm from '../newDefault/RadioForm'
import SwitchForm from '../newDefault/SwitchForm'
import SignatureForm from '../newDefault/SignatureForm'
import UploadForm from '../newDefault/UploadForm'

const ElementCase = ({ item, draft = false }: any) => {
  const renderContent = (item: any) => {
    switch (item?.config?.details?.type) {
      case 'text':
        return <TextLabel item={item} draft={draft} />
      case 'image':
        return <ImageForm item={item} draft={draft} />
      case 'video':
        return <VideoForm item={item} draft={draft} />
      case 'button':
        return <ButtonForm item={item} draft={draft} />
      case 'textfield':
        return <TextFieldForm item={item} draft={draft} />
      case 'datetime':
        return <DatetimePickerForm item={item} draft={draft} />
      case 'upload':
        return <UploadForm item={item} draft={draft} />
      case 'link':
        return <LinkForm item={item} draft={draft} />
      case 'signature':
        return <SignatureForm item={item} draft={draft} />
      case 'dropdown':
        return <DropdownForm item={item} draft={draft} />
      case 'checkbox':
        return <CheckboxForm item={item} draft={draft} />
      case 'radio':
        return <RadioForm item={item} draft={draft} />
      case 'switch':
        return <SwitchForm item={item} draft={draft} />

      default:
        return null
    }
  }

  return renderContent(item)
}

export default ElementCase
