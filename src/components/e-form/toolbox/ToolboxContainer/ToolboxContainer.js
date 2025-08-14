'use client'
import React from 'react'
import { useDrag } from 'react-dnd'
import { Grid, Typography } from '@mui/material'

import BaseButtonToolbox from '@/components/button/BaseButtonToolbox'

const demoConfig = {
  placeholder: 'input here',
  type: 'text',
  label: 'label: ',
  defaultValue: '',
  width: 300,
  height: 60
}

const DraggableToolboxItem = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'box',
    item: { config: item?.config || demoConfig },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  }))

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <BaseButtonToolbox icon={item.icon} label={item?.config?.details?.label} />
    </div>
  )
}

const ToolboxButtonContainer = ({ menu, title }) => {
  return (
    <Grid container className='mt-2'>
      <Grid item xs={12}>
        <Typography variant='body1' color='text.primary' className='font-[400]'>
          {title}
        </Typography>
      </Grid>

      <Grid item xs={12} className='py-4' sx={{ borderBottom: '1px solid #11151A1F' }}>
        <Grid container spacing={4} justifyContent='flex-start'>
          {menu.map((item, index) => {
            if (item.hiden !== true) {
              return (
                <Grid item xs={4} key={index}>
                  <DraggableToolboxItem item={item} />
                </Grid>
              )
            }
          })}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ToolboxButtonContainer
