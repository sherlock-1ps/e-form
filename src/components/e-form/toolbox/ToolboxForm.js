'use client'
import React from 'react'

import { useDrag } from 'react-dnd'

const ToolboxItem = ({ label, config }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'box',
    item: { config },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  }))

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        margin: '10px',
        padding: '10px',
        background: '#e1e1e1',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}
    >
      {label}
    </div>
  )
}

const ToolboxForm = () => {
  return (
    <div>
      <h3>Form Elements </h3>
      <ToolboxItem
        label='Text Input'
        config={{ placeholder: 'input here', type: 'text', label: 'label: ', defaultValue: '', width: 300, height: 60 }}
      />
      <ToolboxItem label='Checkbox' config={{ placeholder: 'input here', type: 'checkbox', label: 'label: ' }} />
      <ToolboxItem label='Dropdown' config={{ placeholder: 'input here', type: 'dropdown', label: 'label: ' }} />
    </div>
  )
}

export default ToolboxForm
