'use client'

import { Typography, Button, Autocomplete, IconButton } from '@mui/material'
import { Delete, Add, RouteOutlined } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useFlowStore } from '@/store/useFlowStore'
import CustomTextField from '@/@core/components/mui/TextField'
import { useDialog } from '@/hooks/useDialog'
import AddPathFlowDialog from '@/components/dialogs/flow/AddPathFlowDialog'
import AddSettingPermissionFlowDialog from '@/components/dialogs/flow/AddSettingPermissionFlowDialog'
import { useFetchFormQueryOption } from '@/queryOptions/form/formQueryOptions'
import { nanoid } from 'nanoid'

const ActivityFlowBar = () => {
  const { showDialog } = useDialog()
  const myDiagram = useFlowStore(state => state.myDiagram)
  const flow = useFlowStore(state => state.flow)
  const updateFlowNodeText = useFlowStore(state => state.updateFlowNodeText)
  const selectedField = useFlowStore(state => state.selectedField)
  const clearSelectedField = useFlowStore(state => state.clearSelectedField)
  const [inputValue, setInputValue] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(999)
  const { data: formList, isPending: pendingFormList } = useFetchFormQueryOption(page, pageSize)

  function generateUniqueKey() {
    return Date.now() + Math.floor(Math.random() * 1000)
  }

  console.log('selectedField', selectedField?.data?.form)

  useEffect(() => {
    if (selectedField?.key && myDiagram && flow) {
      // const nodeData = myDiagram.model.findNodeDataForKey(selectedField.key)

      const result = flow?.flow?.nodeDataArray.find(item => item.key == selectedField.key)
      // setInputValue(nodeData?.text || '')

      setInputValue(result?.text || '')
    }
  }, [selectedField, myDiagram, flow])

  const handleDelete = () => {
    if (!myDiagram) return

    const selectedNode = myDiagram.selection.first()
    if (selectedNode) {
      myDiagram.model.removeNodeData(selectedNode.data)
      clearSelectedField()
    }
  }

  const handleTextChange = (e: any) => {
    const newText = e.target.value
    setInputValue(newText)

    const nodeData = myDiagram?.model?.findNodeDataForKey(selectedField?.key)
    if (!nodeData || !myDiagram) return
    updateFlowNodeText(selectedField.key, newText)
    myDiagram.model.startTransaction('update text')
    myDiagram.model.setDataProperty(nodeData, 'text', newText)
    myDiagram.model.commitTransaction('update text')
  }

  const handleUpdateForm = (id: any) => {
    if (!myDiagram || !selectedField) return

    const nodeData = myDiagram.model.findNodeDataForKey(selectedField?.data?.key)
    if (!nodeData) return

    myDiagram.model.startTransaction('update form')
    myDiagram.model.setDataProperty(nodeData, 'form', id)
    myDiagram.model.commitTransaction('update form')
  }

  function addLinkToCurrentNode() {
    // const selectedNode = myDiagram.selection.first()

    if (selectedField) {
      const newLink = Date.now()

      const model = myDiagram.model
      // var location = selectedNode.data.location.split(' ')
      const location = selectedField.data.location.split(' ')

      let linkCount = 0
      selectedField.linksConnected.map((a: any) => {
        if (a.data.from == selectedField.key) {
          linkCount++
        }
      })

      location[1] = String(parseInt(location[1]) + 180)

      if (linkCount > 0) {
        if (linkCount % 2 == 0) {
          location[0] = String(parseInt(location[0]) + Math.ceil(linkCount / 2) * 150)
        } else {
          location[0] = String(parseInt(location[0]) - Math.ceil(linkCount / 2) * 150)
        }
      }
      const newPart = {
        key: generateUniqueKey(),
        text: 'Activity',
        figure: 'Rectangle',
        category: 'activity',
        components: JSON.stringify(['1', '2']),
        location: location.join(' ')
      }
      model.addNodeData(newPart)

      const newLinkData = {
        key: newLink,
        toPort: 'T',
        fromPort: 'B',
        from: selectedField.data.key,
        to: newPart.key,
        text: nanoid(4)
      }
      // pushLinkData(newLinkData)
      myDiagram.model.addLinkData(newLinkData)
    } else {
      console.log('No node is selected.')
    }
  }

  const handleDeletePath = (data: any) => {
    if (!myDiagram || !selectedField || !data) return

    const isLink = 'from' in data && 'to' in data

    myDiagram.startTransaction('delete selected')

    if (isLink) {
      const realLinkData = myDiagram.model.linkDataArray.find((l: any) => l.key == data.key)
      const link = myDiagram.findLinkForData(realLinkData)

      if (link) {
        myDiagram.remove(link)
      }
    }

    myDiagram.commitTransaction('delete selected')
  }

  return (
    <div className='w-[280px] min-w-[280px] bg-white flex flex-col transition-all border'>
      <section
        className='w-full h-[86px] flex justify-center items-center py-4 px-6'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <div className='flex-1 flex items-center justify-between'>
          <Typography variant='h6'>กระบวนการ (เอกสาร)</Typography>
          <Button startIcon={<Delete />} variant='contained' color='error' onClick={handleDelete}>
            ลบ
          </Button>
        </div>
      </section>

      <div className='w-full flex flex-col p-6 gap-4'>
        <div className='w-full flex flex-col pb-4 border-b'>
          <CustomTextField label='ข้อความกำกับ' value={inputValue} onChange={handleTextChange} />
        </div>

        <div className='w-full flex flex-col pb-4 border-b'>
          <Autocomplete
            fullWidth
            options={formList?.result?.data || []}
            getOptionLabel={option =>
              typeof option === 'object' && option !== null && 'name' in option ? option.name : ''
            }
            value={(formList?.result?.data || []).find((opt: any) => opt.id === selectedField?.data?.form) || null}
            isOptionEqualToValue={(option, value) => option?.id === (typeof value === 'object' ? value?.id : value)}
            onChange={(event, newValue) => {
              handleUpdateForm(newValue?.id ?? null)
            }}
            renderInput={params => <CustomTextField {...params} label='เลือกแบบฟอร์ม' placeholder='เลือก...' />}
          />
        </div>

        <div className='w-full flex items-center pb-4 border-b gap-4 justify-between'>
          <Typography variant='body2' className=' text-nowrap'>
            กำหนดผู้ใช้สิทธิ
          </Typography>
          <Button
            variant='contained'
            onClick={() => {
              showDialog({
                id: 'AddSettingPermissionFlowDialog',
                component: <AddSettingPermissionFlowDialog id='AddSettingPermissionFlowDialog' />,
                size: 'md'
              })
            }}
          >
            ตั้งค่าสิทธิ์
          </Button>
        </div>

        <div className='w-full flex flex-col pb-4 border-b gap-2'>
          <Typography variant='h6'>เส้นทางงาน</Typography>
          <div className='flex flex-col gap-1 max-h-[250px] overflow-auto'>
            {flow?.flow?.linkDataArray
              ?.filter(item => item?.from?.toString() === selectedField?.data?.key?.toString())
              .map((data, index) => (
                <div className='w-full px-2 bg-slate-300 rounded-md flex items-center justify-between' key={index}>
                  <div className='flex gap-2'>
                    <RouteOutlined />
                    <Typography className='truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[155px]'>
                      {data?.text ?? ''}
                    </Typography>
                  </div>
                  <IconButton color='error' onClick={() => handleDeletePath(data)}>
                    <Delete />
                  </IconButton>
                </div>
              ))}
          </div>

          <Button
            variant='contained'
            fullWidth
            startIcon={<Add />}
            onClick={() => {
              addLinkToCurrentNode()
            }}
          >
            เพิ่มเส้นทางงานใหม่
          </Button>

          <Button
            variant='contained'
            fullWidth
            startIcon={<Add />}
            onClick={() => {
              showDialog({
                id: 'AddPathFlowDialog',
                component: <AddPathFlowDialog id='AddPathFlowDialog' />,
                size: 'sm'
              })
            }}
          >
            ทดสอบ
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ActivityFlowBar
