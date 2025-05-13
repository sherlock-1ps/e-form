'use client'
import dynamic from 'next/dynamic'

import ToolboxTab from '@/components/e-form/toolbox/ToolboxTab/ToolboxTab'

const DocumentToolbox = dynamic(() => import('@/components/e-form/toolbox/ToolboxForm/document/DocumentToolbox'))
const PopupToolbox = dynamic(() => import('@/components/e-form/toolbox/ToolboxForm/popup/PopupToolbox'))
const AppstateToolbox = dynamic(() => import('@/components/e-form/toolbox/ToolboxForm/appState/AppstateToolbox'))
const ApicallToolbox = dynamic(() => import('@/components/e-form/toolbox/ToolboxForm/apicall/ApicallToolbox'))
const MediaToolbox = dynamic(() => import('@/components/e-form/toolbox/ToolboxForm/media/MediaToolbox'))

const tabContentList = () => ({
  document: <DocumentToolbox />,
  popup: <PopupToolbox />,
  appState: <AppstateToolbox />,
  apiCall: <ApicallToolbox />,
  media: <MediaToolbox />
})

const ToolboxFormNavigation = () => {
  return (
    <main className=' bg-white flex flex-1 overflow-auto'>
      <ToolboxTab tabContentList={tabContentList()} />
    </main>
  )
}

export default ToolboxFormNavigation
