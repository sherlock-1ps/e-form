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
import EditorForm from '../newDefault/EditorForm'
import DatePickerForm from '../newDefault/DatePickerForm'
import DataGridForm from '../newDefault/DataGridForm'

const ElementCase = ({ item, draft = false, parentKey, boxId }: any) => {
  const renderContent = (item: any) => {
    switch (item?.config?.details?.type) {
      case 'text':
        return <TextLabel item={item} parentKey={parentKey} boxId={boxId} draft={draft} />
      case 'editor':
        return <EditorForm item={item} parentKey={parentKey} boxId={boxId} draft={draft} />
      case 'image':
        return <ImageForm item={item} parentKey={parentKey} boxId={boxId} draft={draft} />
      case 'video':
        return <VideoForm item={item} parentKey={parentKey} boxId={boxId} draft={draft} />
      case 'button':
        return <ButtonForm item={item} parentKey={parentKey} boxId={boxId} draft={draft} />
      case 'textfield':
        return <TextFieldForm item={item} parentKey={parentKey} boxId={boxId} draft={draft} />
      case 'date':
        return <DatePickerForm item={item} parentKey={parentKey} boxId={boxId} draft={draft} />
      case 'datetime':
        return <DatetimePickerForm item={item} parentKey={parentKey} boxId={boxId} draft={draft} />
      case 'upload':
        return <UploadForm item={item} parentKey={parentKey} boxId={boxId} draft={draft} />
      case 'link':
        return <LinkForm item={item} parentKey={parentKey} boxId={boxId} draft={draft} />
      case 'signature':
        return <SignatureForm item={item} parentKey={parentKey} boxId={boxId} draft={draft} />
      case 'dataGrid':
        return
      // return <DataGridForm item={item} parentKey={parentKey} boxId={boxId} draft={draft} />

      case 'dropdown':
        return <DropdownForm item={item} parentKey={parentKey} boxId={boxId} draft={draft} />
      case 'checkbox':
        return <CheckboxForm item={item} parentKey={parentKey} boxId={boxId} draft={draft} />
      case 'radio':
        return <RadioForm item={item} parentKey={parentKey} boxId={boxId} draft={draft} />
      case 'switch':
        return <SwitchForm item={item} parentKey={parentKey} boxId={boxId} draft={draft} />

      default:
        return null
    }
  }

  return renderContent(item)
}

export default ElementCase
