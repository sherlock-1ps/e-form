'use client'

import { useState, useEffect } from 'react'
import CustomTextField from '@/@core/components/mui/TextField'
import { useDialog } from '@/hooks/useDialog'
import { Info } from '@mui/icons-material'
import {
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
  Autocomplete
} from '@mui/material'
import { useFlowStore } from '@/store/useFlowStore'
import { useFetchGetFormSignatureFieldsQueryOption } from '@/queryOptions/form/formQueryOptions'
import { useDictionary } from '@/contexts/DictionaryContext'

interface AddPathFlowDialogProps {
  id?: string
  onClose?: any
  // formFieldList: any
}

const AddPathFlowDialog = ({ id, onClose }: AddPathFlowDialogProps) => {
  const { dictionary } = useDictionary()
  const { closeDialog } = useDialog()
  const [enabled, setEnabled] = useState(false)
  const [minimumProgress, setMinimumProgress] = useState(1)
  const [radioValue, setRadioValue] = useState<'sign' | 'custom'>('custom')

  const myDiagram = useFlowStore(state => state.myDiagram)
  const [linkName, setLinkName] = useState('')
  const [signId, setSignId] = useState('')

  const selectedField = useFlowStore(state => state.selectedField)
  const nodeData = myDiagram.model.findNodeDataForKey(selectedField?.data?.key)
  const { data: formFieldList } = useFetchGetFormSignatureFieldsQueryOption(nodeData.form)
  // const [inputValueMinimumProgress, setInputValueMinimumProgress] = useState(1)
  useEffect(() => {
    setEnabled(false)
    setMinimumProgress(1)
  }, [radioValue])

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
        key: Date.now() + Math.floor(Math.random() * 1000),
        text: 'Activity',
        figure: 'Rectangle',
        category: 'activity',
        // components: JSON.stringify(['1', '2']),
        location: location.join(' '),
        form: nodeData.form,
        assignees_requestor: false,
        can_not_save: false,
        assignees_user: [],
        assignees_department: [],
        assignees_position: []
      }
      model.addNodeData(newPart)

      const newLinkData = {
        key: newLink,
        toPort: 'T',
        fromPort: 'B',
        from: selectedField.data.key,
        to: newPart.key,
        text: linkName,
        signId,
        minimumProgress
      }
      // pushLinkData(newLinkData)
      myDiagram.model.addLinkData(newLinkData)
    } else {
      console.log('No node is selected.')
    }

    // closeDialog(id)
    onClose()
  }

  // console.log('formFieldList', formFieldList)

  return (
    <Grid container className='flex flex-col' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5' className='text-center'>
          เส้นทางงาน
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='body2' className='text-center'>
          กำหนดเส้นทางงานและการดำเนินการให้กระบวนการนี้
        </Typography>
      </Grid>

      <Grid item xs={12} className='flex items-center justify-center'>
        <RadioGroup
          row
          value={radioValue}
          name='path-type'
          onChange={e => setRadioValue(e.target.value as 'sign' | 'custom')}
        >
          <FormControlLabel value='custom' control={<Radio />} label='กำหนดเอง' />
          <FormControlLabel value='sign' control={<Radio />} label='ลงนาม/ระบุจุดลงนาม' />
        </RadioGroup>
      </Grid>

      <Grid item xs={12}>
        <CustomTextField
          fullWidth
          label='ชื่อเส้นทางงาน'
          placeholder=''
          value={linkName}
          onChange={e => {
            setLinkName(e.target.value)
          }}
        />
      </Grid>

      {radioValue == 'sign' && (
        <Grid item xs={12}>
          {/* <CustomTextField fullWidth label='ระบุจุดที่ลงนาม' placeholder='' /> */}

          <Autocomplete
            fullWidth
            options={formFieldList?.result?.data || []}
            getOptionLabel={option => option.id}
            // value={(formFieldList?.result?.data || []).find((opt: any) => opt.id === selectedField?.data?.form) || null}
            value={(formFieldList?.result?.data || []).find((opt: any) => opt.id === signId) || null}
            // isOptionEqualToValue={(option, value) => option?.id === (typeof value === 'object' ? value?.id : value)}
            onChange={(event, newValue) => {
              // console.log('newValue', newValue)
              // handleUpdateForm(newValue?.id ?? null)
              setSignId(newValue?.id ?? null)
            }}
            renderInput={params => <CustomTextField {...params} label='ระบุจุดที่ลงนาม' placeholder='เลือก...' />}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <div className='items-center gap-3 hidden'>
          <Switch checked={enabled} onChange={e => setEnabled(e.target.checked)} color='primary' />
          <Typography className={enabled ? 'text-gray-800' : 'text-gray-400'}>
            กำหนดให้มีจำนวนขั้นต่ำของการดำเนินการเพื่อทำงานต่อ
          </Typography>
          {enabled && (
            <div className='flex flex-col items-start'>
              <Typography variant='body2'>การดำเนินการขั้นต่ำ</Typography>
              <TextField
                type='number'
                value={minimumProgress}
                onChange={e => setMinimumProgress(Number(e.target.value))}
                size='small'
                inputProps={{ min: 1 }}
              />
            </div>
          )}
        </div>
      </Grid>

      {radioValue == 'sign' && (
        <Grid item xs={12}>
          <Card className='bg-[#E9E5FB] rounded-xl'>
            <CardContent className='flex gap-3 p-6 items-start text-[#5B50C3]'>
              <Info className='mt-1 w-5 h-5' />
              <div className='space-y-1 text-sm leading-6 font-thin'>
                <p className='font-medium'>ลงนาม</p>
                <ul className='list-disc list-inside space-y-1'>
                  <li>การดำเนินการลงนาม ในรูปแบบของ Electronic Sign</li>
                  <li>ใช้ได้กับ e-Form ที่มีการกำหนด E-Signature ไว้ในฟอร์มแล้วเท่านั้น</li>
                  <li>ต้องระบุ ID ของ E-Signature ที่จะลงนาม</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </Grid>
      )}

      <Grid item xs={12} className='flex items-center  justify-end gap-2'>
        <Button
          autoFocus
          variant='contained'
          color='secondary'
          onClick={() => {
            // closeDialog(id)
            onClose()
          }}
        >
          {dictionary?.cancel}
        </Button>
        <Button variant='contained' onClick={addLinkToCurrentNode}>
          {dictionary?.confirm}
        </Button>
      </Grid>
    </Grid>
  )
}

export default AddPathFlowDialog
