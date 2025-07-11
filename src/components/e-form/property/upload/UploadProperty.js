'use client'
import { useState, useEffect, useMemo } from 'react' // ไม่จำเป็นต้อง import useCallback ถ้าไม่ได้ใช้

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'
import { Typography, Button, MenuItem } from '@mui/material'
import { FullscreenExitOutlined, UploadFileOutlined, FitScreenOutlined, Delete } from '@mui/icons-material'
import Switch from '@mui/material/Switch'

import CustomTextField from '@core/components/mui/TextField'
import BaseButton from '@/components/ui/button/BaseButton'
import BaseTitleProperty from '@components/e-form/property/BaseTitleProperty'
import { useFormStore } from '@/store/useFormStore.ts'
import { formSizeConfig } from '@configs/formSizeConfig'
import { useDialog } from '@/hooks/useDialog'
import SelectFileUploadDialog from '@/components/dialogs/form/SelectFileUploadDialog'
import TriggerEventDialog from '@/components/dialogs/form/TriggerEventDialog'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import { toast } from 'react-toastify'
import { useFetchVariableQueryOption } from '@/queryOptions/form/formQueryOptions'
import { useDictionary } from '@/contexts/DictionaryContext'

const DebouncedInput = ({ value: initialValue, onChange, isEng = false, debounce = 750, maxLength, ...props }) => {
  const [value, setValue] = useState(initialValue)
  const { dictionary } = useDictionary() // dictionary ถูกใช้ใน JSX ไม่ได้ใช้ใน effect นี้

  // Effect สำหรับอัปเดต internal state 'value' เมื่อ 'initialValue' เปลี่ยน
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  // Effect สำหรับ debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      // 🚨 ตรวจสอบว่า onChange เป็นฟังก์ชันก่อนเรียกใช้
      if (typeof onChange === 'function') {
        onChange(value)
      } else {
        console.warn('onChange prop is not a function in DebouncedInput')
      }
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, onChange, debounce]) // <-- **แก้ไขตรงนี้: เพิ่ม onChange และ debounce**

  return (
    <CustomTextField
      {...props}
      value={value}
      onChange={e => {
        const input = e.target.value
        if (!isEng) {
          setValue(input)
          return
        }
        const isValid = /^[a-zA-Z0-9]*$/.test(input)
        if (isValid) {
          setValue(input)
        }
      }}
      inputProps={{
        ...(maxLength ? { maxLength } : {}),
        ...(props.inputProps || {})
      }}
    />
  )
}

const UploadProperty = () => {
  const { dictionary } = useDictionary()
  const { showDialog } = useDialog()
  const form = useFormStore(state => state.form)
  const selectedField = useFormStore(state => state.selectedField)
  const updateDetails = useFormStore(state => state.updateDetails)
  const updateStyle = useFormStore(state => state.updateStyle)
  const updateValueOnly = useFormStore(state => state.updateValueOnly)
  const updateId = useFormStore(state => state.updateId)
  const [isDuplicateId, setIsDuplicatedId] = useState(false)
  const { data: variableData } = useFetchVariableQueryOption(1, 999)

  const result = form?.form_details
    .flatMap(formItem => formItem.fields)
    .flatMap(field => field.data)
    .find(dataItem => dataItem.id === selectedField?.fieldId?.id)

  const allIds = useMemo(() => {
    return form.form_details.flatMap(section => section.fields.flatMap(field => field.data.map(item => item.id)))
  }, [form])

  useEffect(() => {
    // ต้องการให้รีเซ็ต isDuplicateId เมื่อ selectedField เปลี่ยน
    // และเมื่อ isDuplicateId เป็น true (หมายความว่าก่อนหน้านี้มี ID ซ้ำ)
    if (selectedField) {
      // เพิ่มเงื่อนไขตรวจสอบ selectedField เพื่อความปลอดภัย
      setIsDuplicatedId(false)
    }
  }, [selectedField]) // isDuplicateId ไม่จำเป็นต้องเป็น dependency ที่นี่ เพราะเราต้องการให้รันเมื่อ selectedField เปลี่ยนเท่านั้น

  return (
    <div>
      <BaseTitleProperty
        title='ไฟล์อัปโหลด'
        icon={<UploadFileOutlined sx={{ width: '32px', height: '32px' }} />}
        item={selectedField}
      />

      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <div className='w-full flex justify-around'>
          <FormControlLabel
            label={dictionary?.enable}
            control={
              <Checkbox
                checked={result?.config?.details?.isUse}
                onChange={e =>
                  updateDetails(
                    String(selectedField?.parentKey ?? ''),
                    selectedField?.boxId ?? '',
                    selectedField?.fieldId?.id ?? '',
                    {
                      isUse: !result?.config?.details?.isUse
                    }
                  )
                }
              />
            }
          />

          <FormControlLabel
            label={dictionary?.display}
            control={
              <Checkbox
                checked={result?.config?.details?.isShow}
                onChange={e =>
                  updateDetails(
                    String(selectedField?.parentKey ?? ''),
                    selectedField?.boxId ?? '',
                    selectedField?.fieldId?.id ?? '',
                    {
                      isShow: !result?.config?.details?.isShow
                    }
                  )
                }
              />
            }
          />
        </div>
        <DebouncedInput
          label='Component ID'
          placeholder='Placeholder'
          value={result?.id}
          error={isDuplicateId}
          maxLength={25}
          isEng
          onChange={newValue => {
            if (newValue === result?.id) return

            if (allIds.includes(newValue)) {
              toast.error('ID ซ้ำ กรุณาใช้ ID อื่น', { autoClose: 3000 })
              setIsDuplicatedId(true)

              return
            }

            if (newValue == '') {
              setIsDuplicatedId(true)

              return
            }
            // หาก isDuplicateId เป็น true แต่ newValue ไม่ซ้ำแล้ว ให้รีเซ็ตกลับเป็น false
            if (isDuplicateId && !allIds.includes(newValue)) {
              setIsDuplicatedId(false)
            }

            updateId(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              newValue
            )
          }}
        />
      </section>
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <FormControlLabel
          control={<Switch checked={result?.config?.details?.placeholder?.isShow} />}
          label={dictionary?.displayedText}
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                placeholder: {
                  ...result?.config?.details?.placeholder,
                  isShow: e.target.checked
                }
              }
            )
          }
        />
        <CustomTextField
          label={dictionary?.displayedText}
          placeholder='Placeholder'
          value={result?.config?.details?.placeholder?.value}
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                placeholder: {
                  ...result?.config?.details?.placeholder,
                  value: e.target.value
                }
              }
            )
          }
        />
        <Typography color='text.primary'>{dictionary?.displaySize} </Typography>
        <div className='flex gap-2'>
          <CustomTextField
            type='number'
            label={dictionary?.width}
            placeholder='100%'
            value={result?.config?.style?.width ?? ''}
            inputProps={{ max: formSizeConfig.width }}
            InputProps={{
              endAdornment: result?.config?.style?.width ? <p>px</p> : undefined
            }}
            onChange={e => {
              const raw = e.target.value
              const value = raw === '' ? '' : Math.min(Number(raw), formSizeConfig.width)

              updateStyle(
                String(selectedField?.parentKey ?? ''),
                selectedField?.boxId ?? '',
                selectedField?.fieldId?.id ?? '',
                { width: value }
              )
            }}
          />
          <CustomTextField
            type='number'
            label={dictionary?.height}
            placeholder='AUTO'
            value={result?.config?.style?.height ?? ''}
            InputProps={{
              endAdornment: result?.config?.style?.height ? <p>px</p> : undefined
            }}
            onChange={e => {
              const raw = e.target.value
              const value = raw === '' ? '' : Math.min(Number(raw))

              updateStyle(
                String(selectedField?.parentKey ?? ''),
                selectedField?.boxId ?? '',
                selectedField?.fieldId?.id ?? '',
                { height: value }
              )
            }}
          />
        </div>
      </section>
      <section className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5 '>
        <Typography color='text.primary'>{dictionary?.dataValidation} </Typography>
        <div className='flex  gap-2 justify-between items-center '>
          <Typography variant='body1'>{dictionary?.fileTypeDefinition} </Typography>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              showDialog({
                id: 'alertSelectFileUploadDialog',
                component: <SelectFileUploadDialog id='alertSelectFileUploadDialog' onClick={() => { }} />,
                size: 'sm'
              })
            }}
          >
            {dictionary?.selectFile}
          </Button>
        </div>
        <div className='flex  gap-2 justify-between items-center '>
          <Typography variant='body1' className=' text-nowrap'>
            {dictionary?.maxFileSize}
          </Typography>
          <CustomTextField
            type='number'
            value={result?.config?.details?.maxSize || ''}
            InputProps={{
              endAdornment: <p>MB</p>,
              inputProps: {
                min: 1,
                max: 20
              }
            }}
            onChange={e => {
              const raw = e.target.value
              const num = Number(raw)
              const value = raw === '' ? '' : Math.min(Math.max(num, 1), 20)

              updateDetails(
                String(selectedField?.parentKey ?? ''),
                selectedField?.boxId ?? '',
                selectedField?.fieldId?.id ?? '',
                {
                  maxSize: value
                }
              )
            }}
          />
        </div>

        <div className='flex  gap-1 justify-between items-center '>
          <FormControlLabel
            control={
              <Switch
                checked={result?.config?.details?.maxFileUpload > 0}
                onChange={e => {
                  updateDetails(
                    String(selectedField?.parentKey ?? ''),
                    selectedField?.boxId ?? '',
                    selectedField?.fieldId?.id ?? '',
                    {
                      maxFileUpload: e.target.checked ? 50 : undefined
                    }
                  )
                }}
              />
            }
            label={dictionary?.multipleFileUploadSupported}
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '12.5px',
                whiteSpace: 'nowrap'
              }
            }}
          />
          <CustomTextField
            select
            value={result?.config?.details?.maxFileUpload ?? ''}
            fullWidth
            type='number'
            label={dictionary?.maxQuantity}
            onChange={e => {
              const value = Number(e.target.value)
              updateDetails(
                String(selectedField?.parentKey ?? ''),
                selectedField?.boxId ?? '',
                selectedField?.fieldId?.id ?? '',
                {
                  maxFileUpload: value
                }
              )
            }}
          >
            <MenuItem value='' disabled>
              เลือก
            </MenuItem>

            {Array.from({ length: 50 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </CustomTextField>
        </div>

        <div className='hidden'>
          <FormControlLabel
            control={
              <Switch
                checked={result?.config?.details?.trigger?.isTrigger}
                onChange={() =>
                  showDialog({
                    id: 'alertDialogConfirmToggleTrigger',
                    component: (
                      <ConfirmAlert
                        id='alertDialogConfirmToggleTrigger'
                        title={dictionary?.changeTriggerEventStatus}
                        content1={dictionary?.confirmToggleTriggerEvent}
                        onClick={() => {
                          updateDetails(
                            String(selectedField?.parentKey ?? ''),
                            selectedField?.boxId ?? '',
                            selectedField?.fieldId?.id ?? '',
                            {
                              trigger: {
                                // ...result?.config?.details?.trigger,
                                isTrigger: !result?.config?.details?.trigger?.isTrigger
                              }
                            }
                          )
                        }}
                      />
                    ),
                    size: 'sm'
                  })
                }
              />
            }
            label='Trigger Event'
          />
        </div>
        {result?.config?.details?.trigger?.isTrigger && (
          <Button
            variant='contained'
            fullWidth
            onClick={() => {
              showDialog({
                id: 'TriggerEventDialog',
                component: <TriggerEventDialog id={'TriggerEventDialog'} />,
                size: 'xl'
              })
            }}
          >
            {dictionary?.configureTriggerEvent}
          </Button>
        )}
      </section>
    </div>
  )
}

export default UploadProperty
