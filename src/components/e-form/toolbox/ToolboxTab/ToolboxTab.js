'use client'
import { useState } from 'react'

import { Tab, Typography } from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import {
  InsertDriveFileOutlined,
  SmsFailedOutlined,
  RuleFolderOutlined,
  WebhookOutlined,
  PermMediaOutlined
} from '@mui/icons-material'

import CustomTabList from '@/@core/components/mui/TabList'
import { useToolboxTabStore } from '@/store/useToolboxTabStore'
import { useFormStore } from '@/store/useFormStore'

const ToolboxTab = ({ tabContentList }) => {
  const { activeTab, setActiveTab } = useToolboxTabStore()
  const clearSelectedField = useFormStore(state => state.clearSelectedField)

  const handleChange = (event, value) => {
    setActiveTab(value)

    clearSelectedField()
  }

  return activeTab === undefined ? null : (
    <TabContext value={activeTab}>
      <main style={{ backgroundColor: '#11151A14' }} className='flex  flex-1 '>
        <CustomTabList
          onChange={handleChange}
          orientation='vertical'
          pill='true'
          sx={{ width: '45px !important', minWidth: '42px !important' }}
          className='max-w-[45px] p-0 m-0 pt-1'
        >
          <Tab
            disableRipple
            disableTouchRipple
            sx={{
              width: '42px !important',
              minWidth: '42px !important',
              padding: '0 !important',
              height: '129px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            label={
              <div className='flex items-center justify-center gap-1.5 transform -rotate-90 whitespace-nowrap'>
                <InsertDriveFileOutlined />
                <div>เอกสาร</div>
              </div>
            }
            value='document'
          />

          {/* <Tab
            disableRipple
            disableTouchRipple
            sx={{
              width: '42px !important',
              minWidth: '42px !important',
              padding: '0 !important',
              height: '129px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            label={
              <div className='flex  items-center justify-center gap-1.5 transform -rotate-90 whitespace-nowrap'>
                <SmsFailedOutlined />
                ป๊อปอัพ
              </div>
            }
            value='popup'
          /> */}
          <Tab
            disableRipple
            disableTouchRipple
            sx={{
              width: '42px !important',
              minWidth: '42px !important',
              padding: '0 !important',
              height: '129px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            label={
              <div className='flex items-center justify-center gap-1.5 transform -rotate-90 whitespace-nowrap'>
                <RuleFolderOutlined />
                ตัวแปร
              </div>
            }
            value='appState'
          />
          <Tab
            disableRipple
            disableTouchRipple
            sx={{
              width: '42px !important',
              minWidth: '42px !important',
              padding: '0 !important',
              height: '129px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            label={
              <div className='flex  items-center justify-center gap-1.5 transform -rotate-90 whitespace-nowrap'>
                <WebhookOutlined />
                Api call
              </div>
            }
            value='apiCall'
          />

          <Tab
            disableRipple
            disableTouchRipple
            sx={{
              width: '42px !important',
              minWidth: '42px !important',
              padding: '0 !important',
              height: '129px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            label={
              <div className='flex  items-center justify-center gap-1.5 transform -rotate-90 whitespace-nowrap'>
                <PermMediaOutlined />
                คลังมีเดีย
              </div>
            }
            value='media'
          />
        </CustomTabList>
        <section className='flex flex-1 bg-white'>
          <TabPanel value={activeTab} className='px-3 py-6'>
            {tabContentList[activeTab]}
          </TabPanel>
        </section>
      </main>
    </TabContext>
  )
}

export default ToolboxTab
