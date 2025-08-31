'use client'

import { Typography, Button, Autocomplete } from '@mui/material'
import { Delete, Add } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useFlowStore } from '@/store/useFlowStore'
import CustomTextField from '@/@core/components/mui/TextField'
import { useDialog } from '@/hooks/useDialog'
import AddConditionFlowDialog from '@/components/dialogs/flow/AddConditionFlowDialog'
import AddSettingPermissionFlowDialog from '@/components/dialogs/flow/AddSettingPermissionFlowDialog'
import { getFormSignatureFields } from '@/app/sevices/form/formServices'

import OutlinedInput from '@mui/material/OutlinedInput'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

type Condition = {
  source1: string
  value1: string
  operator: string
  source3: string
  value3: string
}
const PathFlowBar = () => {
  const { showDialog } = useDialog()
  const myDiagram = useFlowStore(state => state.myDiagram)
  const flow = useFlowStore(state => state.flow)
  const updateFlowNodeText = useFlowStore(state => state.updateFlowNodeText)
  const selectedField = useFlowStore(state => state.selectedField)
  const updateFlowLinkText = useFlowStore(state => state.updateFlowLinkText)
  const [inputValueMinimumProgress, setInputValueMinimumProgress] = useState(1)
  const clearSelectedField = useFlowStore(state => state.clearSelectedField)
  const [inputValue, setInputValue] = useState('')
  const [linkRule, setLinkRule] = useState({ conditions: [], logicOperator: '' })
  const [linkResultSelect, setLinkResultSelect] = useState<any>({})
  const [activityFromAll, setActivityFromAll] = useState<any>({})
  const [activityFrom, setActivityFrom] = useState<any>({})
  const [signatureList, setSignatureList] = useState<any>([])
  const [signatureRemoveList, setSignatureRemoveList] = useState<string[]>([])
  const [userActiongList, setUserActiongList] = useState<string[]>([])

  const fnGetSignatureList = async (form: number) => {
    const signatureList = await getFormSignatureFields(form)
    setSignatureList(signatureList?.result?.data || [])
  }

  useEffect(() => {
    if (!selectedField || !myDiagram || !flow) return

    const isLink = 'from' in selectedField && 'to' in selectedField

    if (isLink) {
      const linkResult = flow?.flow?.linkDataArray.find(
        item => item.from === selectedField.from && item.to === selectedField.to
      )
      // console.log("flow?.flow",flow?.flow?.nodeDataArray)

      setLinkResultSelect(linkResult)
      setSignatureRemoveList(linkResult?.signatureRemove || [])
      setUserActiongList(linkResult?.userActionList || [])
      for (const activity of flow?.flow?.nodeDataArray) {
        if (activity.key == linkResult?.from) {
          fnGetSignatureList(activity.form)
          setActivityFromAll(activity)
          // console.log('activity', activity)
        }
      }

      setInputValue(linkResult?.text || '')
      setLinkRule(linkResult?.rule || { conditions: [], logicOperator: '' })
      // console.log(linkResult?.rule)
    } else {
      const nodeResult = flow?.flow?.nodeDataArray.find(item => item.key === selectedField.key)
      setInputValue(nodeResult?.text || '')
    }
  }, [selectedField, myDiagram, flow]) // <-- **เพิ่ม myDiagram และ flow ที่นี่**

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

  const handleTextChangeSignId = (signId: string) => {
    setLinkResultSelect((previousState: any) => ({
      ...previousState,
      signId
    }))

    myDiagram.model.startTransaction('update link signId')
    myDiagram.model.setDataProperty(selectedField, 'signId', signId)
    myDiagram.model.commitTransaction('update link signId')
  }

  const handleChangeSignatureRemoveList = (event: any) => {
    const {
      target: { value }
    } = event
    let newValue = typeof value === 'string' ? value.split(',') : value || []

    // "ไม่ลงนามในเอกสาร"
    if (newValue.indexOf('ไม่ลงนามในเอกสาร') > -1) {
      newValue = ['ไม่ลงนามในเอกสาร']
    }

    myDiagram.model.startTransaction('update link signatureRemove')
    myDiagram.model.setDataProperty(selectedField, 'signatureRemove', newValue)
    myDiagram.model.commitTransaction('update link signatureRemove')

    setSignatureRemoveList(newValue)
  }

  const handleChangeUserActionList = (event: any) => {
    const {
      target: { value }
    } = event
    const newValue = typeof value === 'string' ? value.split(',') : value || []

    myDiagram.model.startTransaction('update link userActionList')
    myDiagram.model.setDataProperty(selectedField, 'userActionList', newValue)
    myDiagram.model.commitTransaction('update link userActionList')

    setUserActiongList(newValue)
  }

  const handleTextChange = (e: any) => {
    const newText = e.target.value
    setInputValue(newText)

    if (!myDiagram || !selectedField) return
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

  const handleInputValueMinimumProgressTextChange = (e: any) => {
    const minimumProgress = parseInt(e.target.value)
    setInputValueMinimumProgress(minimumProgress)
    myDiagram.model.startTransaction('update minimum_progress')
    myDiagram.model.setDataProperty(selectedField, 'minimumProgress', minimumProgress)
    myDiagram.model.commitTransaction('update minimum_progress')
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
      <div className='w-full flex-col p-6 gap-4 hidden'>
        <div className='w-full flex flex-col pb-4 border-b'>
          <CustomTextField
            label='การดำเนินการขั้นต่ำ'
            value={inputValueMinimumProgress}
            onChange={handleInputValueMinimumProgressTextChange}
          />
        </div>
      </div>
      {/* xxxx:{linkResultSelect?.signId} */}

      <div className='w-full flex-col gap-2 flex pb-0 pr-6 pl-6'>
        {/* <div className='w-full flex flex-col pb-4 border-b'> */}
        {/* <CustomTextField label='จุดลงนาม' value={linkResultSelect?.signId} /> */}

        <Autocomplete
          fullWidth
          options={signatureList}
          getOptionLabel={(option: any) => option.id}
          // value={(formFieldList?.result?.data || []).find((opt: any) => opt.id === selectedField?.data?.form) || null}
          value={signatureList.find((opt: any) => opt.id === linkResultSelect?.signId) || null}
          // isOptionEqualToValue={(option, value) => option?.id === (typeof value === 'object' ? value?.id : value)}
          onChange={(event, newValue) => {
            handleTextChangeSignId(newValue?.id ?? null)
          }}
          renderInput={params => <CustomTextField {...params} label='ระบุจุดที่ลงนาม' placeholder='เลือก...' />}
        />
      </div>
      {/* </div> */}

      <div className='w-full flex-col p-6 gap-4 flex'>
        {/* <div className='w-full flex flex-col pb-4 border-b'> */}
        {/* <CustomTextField label='จุดลงนาม' value={linkResultSelect?.signId} /> */}
        <Typography>ยกเลิกจุดลงนาม</Typography>
        <FormControl>
          <Select
            fullWidth
            multiple
            size='small'
            displayEmpty
            value={signatureRemoveList}
            onChange={handleChangeSignatureRemoveList}
            input={<OutlinedInput />}
            renderValue={selected => {
              if (selected?.length === 0) {
                return <em>เลือกรายการยกเลิกจุดลงนาม</em>
              }

              return selected?.join(', ')
            }}
            // MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem disabled value=''>
              <em>เลือกรายการยกเลิกจุดลงนาม</em>
            </MenuItem>
            <MenuItem value='ไม่ลงนามในเอกสาร'>
              <em>ไม่ลงนามในเอกสาร</em>
            </MenuItem>

            {signatureList.map((name: any) => (
              <MenuItem key={name.id} value={name.id}>
                {name.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography>ผู้ที่มีสิทธิ์เห็นเส้นทาง</Typography>
        <Select
          fullWidth
          multiple
          size='small'
          displayEmpty
          value={userActiongList}
          onChange={handleChangeUserActionList}
          input={<OutlinedInput />}
          renderValue={selected => {
            if (selected?.length === 0) {
              return <em>เลือกผู้ที่มีสิทธิ์เห็นเส้นทาง</em>
            }

            // Filter out any selected pk that doesn't have a corresponding assignee
            const validSelected = selected.filter(pk => activityFromAll?.assignees?.some((v: any) => v.pk === pk))

            // Update the state if the list of selected values has changed
            // This is important to ensure the UI and state are in sync
            if (validSelected.length !== selected.length) {
              handleChangeUserActionList({ target: { value: validSelected } })
            }

            const selectedNames = validSelected.map(pk => {
              const assignee = activityFromAll?.assignees?.find((v: any) => v.pk === pk)
              return assignee ? assignee.name : ''
            })

            return selectedNames.join(', ')
          }}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem disabled value=''>
            <em>เลือกผู้ที่มีสิทธิ์เห็นเส้นทาง</em>
          </MenuItem>
          {activityFromAll?.assignees?.map((v: any) => (
            <MenuItem key={v.pk} value={v.pk}>
              {v.name}
            </MenuItem>
          ))}
        </Select>
      </div>

      {linkRule?.logicOperator !== '' ? (
        <div className='w-full flex flex-col p-6 gap-4'>
          <div className='w-full flex flex-col pb-4 border-b'>
            <h5>เงื่อนไข ({linkRule?.logicOperator})</h5>
            <ul>
              {linkRule?.conditions?.map((condition: Condition, j: number) => {
                const source1Text = condition.source1 === 'data' ? 'ฟิวด์: ' : 'ค่า: '
                const source2Text = condition.source3 === 'data' ? 'ฟิวด์: ' : 'ค่า: '

                return (
                  <li key={j}>
                    {`${source1Text}${condition.value1} ${condition.operator} ${source2Text}${condition.value3}`}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default PathFlowBar
