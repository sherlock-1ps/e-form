'use client'

import { useFormStore } from '@/store/useFormStore.ts'
import { useState } from 'react'
import {
  Typography,
  IconButton,
  Box,
  Card,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Collapse
} from '@mui/material'
import { CancelOutlined, BuildCircleOutlined, Add, CheckCircleOutline } from '@mui/icons-material'
import BaseButton from '@/components/ui/button/BaseButton'
import { useDictionary } from '@/contexts/DictionaryContext'

const CustomOption = ({ label, onEdit, onDelete }) => {
  const { dictionary } = useDictionary()
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1D1E2214',
        borderRadius: 2,
        padding: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={onDelete}>
          <CancelOutlined sx={{ color: 'red' }} />
        </IconButton>
        <Typography>{label}</Typography>
      </Box>
      <IconButton onClick={onEdit}>
        <BuildCircleOutlined sx={{ color: 'black' }} />
      </IconButton>
    </Box>
  )
}

const EnhancedOption = ({ label, index, item, selectedField, updateDetails, onBack, onDelete }) => {
  const { dictionary } = useDictionary()
  const handleLabelChange = e => {
    const updatedList = [...item?.config?.details?.itemList]
    updatedList[index].name = e.target.value

    updateDetails(
      String(selectedField?.parentKey ?? ''),
      selectedField?.boxId ?? '',
      selectedField?.fieldId?.id ?? '',
      {
        itemList: updatedList
      }
    )
  }

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        border: '1px solid var(--mui-palette-primary-main)'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 36,
              height: 36,
              backgroundColor: '#FF4C51',
              borderRadius: 1,
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <IconButton onClick={onDelete}>
              <CancelOutlined sx={{ color: 'white' }} />
            </IconButton>
          </Box>
          <Typography variant='body1'>{label}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 36,
            height: 36,
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            borderRadius: 1
          }}
        >
          <IconButton onClick={onBack}>
            <CheckCircleOutline sx={{ color: '#0463EA' }} />
          </IconButton>
        </Box>
      </Box>

      <RadioGroup row defaultValue='checked' name='basic-radio' aria-label='basic-radio'>
        <FormControlLabel value='checked' control={<Radio />} label='String' />
        <FormControlLabel value='unchecked' control={<Radio />} label='AppState' />
        <FormControlLabel value='test' control={<Radio />} label='API' />
      </RadioGroup>

      <Box>
        <Typography variant='body2' sx={{ marginBottom: 1 }}>
          {dictionary?.text}
        </Typography>
        <TextField fullWidth variant='outlined' size='small' value={label} onChange={handleLabelChange} />
      </Box>
    </Card>
  )
}

const ChoiceBox = ({ item }) => {
  const { dictionary } = useDictionary()
  const selectedField = useFormStore(state => state.selectedField)
  const updateDetails = useFormStore(state => state.updateDetails)

  const handleEdit = index => {
    const newList = [...item?.config?.details?.itemList]
    newList[index].enhanced = true
    updateDetails(
      String(selectedField?.parentKey ?? ''),
      selectedField?.boxId ?? '',
      selectedField?.fieldId?.id ?? '',
      { itemList: newList }
    )
  }

  const handleBack = index => {
    const newList = [...item?.config?.details?.itemList]
    newList[index].enhanced = false
    updateDetails(
      String(selectedField?.parentKey ?? ''),
      selectedField?.boxId ?? '',
      selectedField?.fieldId?.id ?? '',
      { itemList: newList }
    )
  }

  const handleAddOption = () => {
    const newList = [...item?.config?.details?.itemList, { name: 'ตัวเลือกใหม่', value: '', enhanced: true }]
    updateDetails(
      String(selectedField?.parentKey ?? ''),
      selectedField?.boxId ?? '',
      selectedField?.fieldId?.id ?? '',
      { itemList: newList }
    )
  }

  const handleDelete = index => {
    const newList = item?.config?.details?.itemList.filter((_, i) => i !== index)
    updateDetails(
      String(selectedField?.parentKey ?? ''),
      selectedField?.boxId ?? '',
      selectedField?.fieldId?.id ?? '',
      { itemList: newList }
    )
  }

  return (
    <>
      <Typography>ตัวเลือก</Typography>
      {item?.config?.details?.itemList.map((option, idx) => (
        <Collapse key={idx} in={true} timeout={300}>
          {option.enhanced ? (
            <EnhancedOption
              label={option.name}
              index={idx}
              item={item}
              selectedField={selectedField}
              updateDetails={updateDetails}
              onBack={() => handleBack(idx)}
              onDelete={() => handleDelete(idx)}
            />
          ) : (
            <CustomOption label={option.name} onEdit={() => handleEdit(idx)} onDelete={() => handleDelete(idx)} />
          )}
        </Collapse>
      ))}
      <BaseButton
        text={dictionary?.addOption}
        icon={Add}
        iconPosition='left'
        color='secondary'
        onClick={handleAddOption}
      />
    </>
  )
}

export default ChoiceBox
