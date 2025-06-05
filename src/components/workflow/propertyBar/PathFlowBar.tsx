'use client'

import { Typography, Button, Autocomplete } from '@mui/material'
import { Delete, Add } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useFlowStore } from '@/store/useFlowStore'
import CustomTextField from '@/@core/components/mui/TextField'
import { useDialog } from '@/hooks/useDialog'
import AddConditionFlowDialog from '@/components/dialogs/flow/AddConditionFlowDialog'
import AddSettingPermissionFlowDialog from '@/components/dialogs/flow/AddSettingPermissionFlowDialog'

const PathFlowBar = () => {
  const { showDialog } = useDialog()
  const myDiagram = useFlowStore(state => state.myDiagram)
  const flow = useFlowStore(state => state.flow)
  const updateFlowNodeText = useFlowStore(state => state.updateFlowNodeText)
  const selectedField = useFlowStore(state => state.selectedField)
  const updateFlowLinkText = useFlowStore(state => state.updateFlowLinkText)

  const clearSelectedField = useFlowStore(state => state.clearSelectedField)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (!selectedField || !myDiagram || !flow) return

    const isLink = 'from' in selectedField && 'to' in selectedField

    if (isLink) {
      const linkResult = flow?.flow?.linkDataArray.find(
        item => item.from === selectedField.from && item.to === selectedField.to
      )

      setInputValue(linkResult?.text || '')
    } else {
      const nodeResult = flow?.flow?.nodeDataArray.find(item => item.key === selectedField.key)
      setInputValue(nodeResult?.text || '')
    }
  }, [selectedField])

  const handleDelete = () => {
    if (!myDiagram || !selectedField) return

    const isLink = 'from' in selectedField && 'to' in selectedField

    myDiagram.startTransaction('delete selected')

    if (isLink) {
      // 🔥 ลบ Link
      const link = myDiagram.findLinkForData(selectedField)
      console.log('link', link)

      if (link) {
        myDiagram.remove(link)
      }
    }

    myDiagram.commitTransaction('delete selected')

    clearSelectedField()
  }

  const handleTextChange = (e: any) => {
    const newText = e.target.value
    setInputValue(newText)

    if (!myDiagram || !selectedField) return

    // 🟡 หาว่า selectedField เป็น Link หรือ Node
    const isLink = 'from' in selectedField && 'to' in selectedField

    if (isLink) {
      // ✅ แก้ GoJS model
      myDiagram.model.startTransaction('update link text')
      myDiagram.model.setDataProperty(selectedField, 'text', newText)
      myDiagram.model.commitTransaction('update link text')

      // ✅ อัปเดต Zustand
      updateFlowLinkText(selectedField.from + '-' + selectedField.to, newText)
    } else {
      // ✅ อัปเดต Node ถ้าเป็น Node
      myDiagram.model.startTransaction('update node text')
      myDiagram.model.setDataProperty(selectedField, 'text', newText)
      myDiagram.model.commitTransaction('update node text')

      updateFlowNodeText(selectedField.key, newText)
    }
  }

  return (
    <div className='w-[280px] min-w-[280px] bg-white flex flex-col transition-all border'>
      <section
        className='w-full h-[86px] flex justify-center items-center py-4 px-6'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <div className='flex-1 flex items-center justify-between'>
          <Typography variant='h6'>เส้นทาง</Typography>
          <Button startIcon={<Delete />} variant='contained' color='error' onClick={handleDelete}>
            ลบ
          </Button>
        </div>
      </section>

      <div className='w-full flex flex-col p-6 gap-4'>
        <div className='w-full flex flex-col pb-4 border-b'>
          <CustomTextField label='ข้อความกำกับ' value={inputValue} onChange={handleTextChange} />
        </div>
      </div>
    </div>
  )
}

export default PathFlowBar
