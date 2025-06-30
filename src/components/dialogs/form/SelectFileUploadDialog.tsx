// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  Typography
} from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { useState } from 'react'
import { useFormStore } from '@/store/useFormStore'
import { useDictionary } from '@/contexts/DictionaryContext'

interface selectFileUploadDialogProps {
  id: string
  onClick: () => void
}
const FILE_TYPES = {
  image: {
    label: 'ภาพ',
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  },
  video: {
    label: 'วีดีโอ',
    extensions: ['.mp4', '.mov', '.avi']
  },
  document: {
    label: 'เอกสาร',
    extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv']
  }
}

const SelectFileUploadDialog = ({ id, onClick }: selectFileUploadDialogProps) => {
  const { dictionary } = useDictionary()
  const { closeDialog } = useDialog()
  const form = useFormStore(state => state.form)
  const selectedField = useFormStore(state => state.selectedField)
  const updateDetails = useFormStore(state => state.updateDetails)
  const [groupEnabled, setGroupEnabled] = useState<Record<string, boolean>>({
    image: true,
    video: true,
    document: true
  })

  const result = form?.form_details
    .flatMap(formItem => formItem.fields)
    .flatMap(field => field.data)
    .find(dataItem => dataItem.id === selectedField?.fieldId?.id)

  const fileType = result?.config?.details?.fileType || []

  const handleToggle = (ext: string) => {
    const newTypes = fileType.includes(ext) ? fileType.filter((e: any) => e !== ext) : [...fileType, ext]

    updateDetails(
      String(selectedField?.parentKey ?? ''),
      selectedField?.boxId ?? '',
      selectedField?.fieldId?.id ?? '',
      {
        fileType: newTypes
      }
    )
  }

  const toggleGroup = (group: string) => {
    const isEnabled = groupEnabled[group]
    const groupExts = FILE_TYPES[group as keyof typeof FILE_TYPES].extensions

    const updatedFileType = isEnabled
      ? fileType.filter((ext: any) => !groupExts.includes(ext))
      : [...fileType, ...groupExts.filter((ext: any) => !fileType.includes(ext))]

    setGroupEnabled(prev => ({
      ...prev,
      [group]: !isEnabled
    }))

    updateDetails(
      String(selectedField?.parentKey ?? ''),
      selectedField?.boxId ?? '',
      selectedField?.fieldId?.id ?? '',
      {
        fileType: updatedFileType
      }
    )
  }

  return (
    <Grid container className='flex flex-col' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>เลือกประเภทไฟล์</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={12} className='mt-4 w-full flex items-center justify-center'>
        <FormControl component='fieldset'>
          <Grid container spacing={4}>
            {Object.entries(FILE_TYPES).map(([key, { label, extensions }]) => (
              <Grid item xs={12} sm={4} key={key}>
                <FormControlLabel
                  control={<Checkbox checked={groupEnabled[key]} onChange={() => toggleGroup(key)} />}
                  label={
                    <Typography variant='body1' fontWeight={600}>
                      {label}
                    </Typography>
                  }
                />
                <FormGroup sx={{ pl: 2 }}>
                  {extensions.map(ext => (
                    <FormControlLabel
                      key={ext}
                      disabled={!groupEnabled[key]}
                      control={<Checkbox checked={fileType.includes(ext)} onChange={() => handleToggle(ext)} />}
                      label={ext}
                    />
                  ))}
                </FormGroup>
              </Grid>
            ))}
          </Grid>
        </FormControl>
      </Grid>

      <Grid item xs={12} className='flex items-center justify-end gap-2'>
        <Button variant='contained' color='secondary' onClick={() => closeDialog(id)}>
          {dictionary?.cancel}
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            closeDialog(id)
            onClick()
          }}
        >
          {dictionary?.confirm}
        </Button>
      </Grid>
    </Grid>
  )
}

export default SelectFileUploadDialog
