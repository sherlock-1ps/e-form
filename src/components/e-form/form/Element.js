'use client'
import React, { useState } from 'react'
import { ResizableBox } from 'react-resizable'
import TextLabel from '@components/e-form/default/TextLabel.js'
import TextareaElement from '@components/e-form/default/TextareaElement.js'
import TextField from '@components/e-form/default/TextField.js'
import ImageForm from '@components/e-form/default/ImageForm.js'
import VideoForm from '@components/e-form/default/VideoForm.js'
import DatetimePickerForm from '@components/e-form/default/DatetimePickerForm.js'
import DefaultButton from '@components/e-form/default/DefaultButton.js'
import LinkElement from '@components/e-form/default/LinkElement.js'
import DropdownElement from '@components/e-form/default/DropdownElement.js'
import CheckboxElement from '@components/e-form/default/CheckboxElement.js'
import RadioElement from '@components/e-form/default/RadioElement.js'
import SwitchElement from '@components/e-form/default/SwitchElement.js'

const Element = props => {
  const { id, config, preview = false, setIsResizing, left, top } = props
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [minWidthResize, setMinWidthResize] = useState(config?.style?.minWidth || 0)
  const [minHeightResize, setMinHeightResize] = useState(config?.style?.minHeight || 0)
  const [isTriggerResize, setIsTriggerResize] = useState(false)

  const onResizeStart = () => {
    setIsResizing(true)
  }

  const onResizeStop = (event, { size }) => {
    console.log(event)

    setIsResizing(false)
    const { width, height } = size

    console.log('Updated element size:', { id, width, height })
    // Dispatch or update state logic can be added here
    handleSizeChange(width, height)
    handleTriggerResize(true)
  }

  const handleSizeChange = (contentWidth, contentHeight) => {
    setWidth(Math.max(contentWidth))
    setHeight(Math.max(contentHeight))
  }
  const handleSetMinElement = (minWidth, minHeight) => {
    setMinWidthResize(minWidth)
    setMinHeightResize(minHeight)
  }
  const handleTriggerResize = bool => {
    setIsTriggerResize(bool)
  }

  const renderContent = () => {
    switch (config?.details?.type) {
      case 'text':
        return (
          <TextLabel
            {...props}
            readOnly={preview}
            onSizeChange={(contentWidth, contentHeight) => handleSizeChange(contentWidth, contentHeight)}
            onSetMinElement={(minWidth, minHeight) => handleSetMinElement(minWidth, minHeight)}
            isTriggerResize={isTriggerResize}
            handleTriggerResize={handleTriggerResize}
          />
        )
      case 'textarea':
        return (
          <TextareaElement
            {...props}
            readOnly={preview}
            onSizeChange={(contentWidth, contentHeight) => handleSizeChange(contentWidth, contentHeight)}
            onSetMinElement={(minWidth, minHeight) => handleSetMinElement(minWidth, minHeight)}
            isTriggerResize={isTriggerResize}
            handleTriggerResize={handleTriggerResize}
          />
        )
      case 'image':
        return <ImageForm {...props} />
      case 'video':
        return <VideoForm {...props} />
      case 'button':
        return <DefaultButton {...props} />
      case 'textfield':
        return <TextField {...props} />
      case 'datetime':
        return <DatetimePickerForm {...props} />
      case 'link':
        return <LinkElement {...props} />
      case 'dropdown':
        return <DropdownElement {...props} />
      case 'checkbox':
        return <CheckboxElement {...props} />
      case 'radio':
        return <RadioElement {...props} />
      case 'switch':
        return <SwitchElement {...props} />
      default:
        return null
    }
  }

  return preview ? (
    renderContent()
  ) : (
    <ResizableBox
      width={width}
      height={height}
      resizeHandles={['se']}
      minConstraints={[Math.max(minWidthResize), Math.max(minHeightResize)]}
      // maxConstraints={[
      //   formSizeConfig.width - left - 1 * 2,
      //   formSizeConfig.height - top - 1 * 2
      // ]}
      onResizeStart={onResizeStart}
      onResizeStop={onResizeStop}
      className='resizable-box'
    >
      {renderContent()}
    </ResizableBox>
  )
}

export default Element
