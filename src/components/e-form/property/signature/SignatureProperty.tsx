'use client'
import React, { useState, useEffect, useMemo } from 'react'

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'

import { Title, Delete, Draw } from '@mui/icons-material'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Switch from '@mui/material/Switch'

import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import BaseDropdown from '@components/e-form/property/BaseDropdown'
import BaseColorPicker from '@components/e-form/property/BaseColorPicker'
import FormatText from '@components/e-form/property/FormatText'
import FormatTextPosition from '@components/e-form/property/FormatTextPosition'
import CustomTextField from '@core/components/mui/TextField'
import BaseButton from '@/components/ui/button/BaseButton'
import BaseTitleProperty from '@components/e-form/property/BaseTitleProperty'
import BaseFontSize from '@components/e-form/property/BaseFontSize'
import { useFormStore } from '@/store/useFormStore'
import { Button, FormGroup } from '@mui/material'
import { useDialog } from '@/hooks/useDialog'
import SettingSignDialog from '@/components/dialogs/form/SettingSignDialog'
import TriggerEventDialog from '@/components/dialogs/form/TriggerEventDialog'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import { toast } from 'react-toastify'
import { useDictionary } from '@/contexts/DictionaryContext'

const DebouncedInput = ({ value: initialValue, onChange, isEng = false, debounce = 550, maxLength, ...props }: any) => {
  const [value, setValue] = useState(initialValue)
  const { dictionary } = useDictionary()

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      // ตรวจสอบว่าเป็นฟังก์ชันก่อนเรียกใช้เสมอ
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

const SignatureProperty = () => {
  const { dictionary } = useDictionary()
  const { showDialog } = useDialog()
  const form = useFormStore(state => state.form)
  const selectedField = useFormStore(state => state.selectedField)
  const updateDetails = useFormStore(state => state.updateDetails)
  const updateValueOnly = useFormStore(state => state.updateValueOnly)
  const updateId = useFormStore(state => state.updateId)
  const [isDuplicateId, setIsDuplicatedId] = useState(false)

  const result = form?.form_details
    .flatMap(formItem => formItem.fields)
    .flatMap(field => field.data)
    .find(dataItem => dataItem.id === selectedField?.fieldId?.id)

  const allIds = useMemo(() => {
    return form.form_details.flatMap(section => section.fields.flatMap(field => field.data.map((item: any) => item.id)))
  }, [form])

  useEffect(() => {
    if (selectedField) {
      // เพิ่มเงื่อนไขตรวจสอบ selectedField เพื่อความปลอดภัย
      setIsDuplicatedId(false)
    }
  }, [selectedField]) // isDuplicateId ไม่จำเป็นต้องเป็น dependency ที่นี่ เพราะเราต้องการให้รันเมื่อ selectedField เปลี่ยนเท่านั้น

  return (
    <div>
      <BaseTitleProperty
        title='E-Signature'
        icon={<Draw sx={{ width: '32px', height: '32px' }} />}
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
          onChange={(newValue: any) => {
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
            if (isDuplicateId) {
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
        <Typography className='' variant='h6'>
          {dictionary?.signatureField}
        </Typography>
        <RadioGroup
          row
          value={result?.config?.details?.signType?.type}
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                signType: {
                  ...result?.config?.details?.signType,
                  type: e.target.value
                }
              }
            )
          }
          name='basic-radio'
          aria-label='basic-radio'
        >
          <FormControlLabel value='master' control={<Radio />} label='Master' />
          <FormControlLabel value='clone' control={<Radio />} label='Clone' />
        </RadioGroup>

        {result?.config?.details?.signType?.type == 'clone' && (
          <DebouncedInput
            label={dictionary?.useWithMasterId}
            placeholder={dictionary?.specifyOriginalESignatureId}
            value={result?.config?.details?.signType?.formId || ''}
            onChange={(newText: any) =>
              updateDetails(
                String(selectedField?.parentKey ?? ''),
                selectedField?.boxId ?? '',
                selectedField?.fieldId?.id ?? '',
                {
                  signType: {
                    ...result?.config?.details?.signType,
                    formId: newText
                  }
                }
              )
            }
          />
        )}
      </section>
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <FormControlLabel
          control={<Switch checked={result?.config?.details?.tag?.isShow} />}
          label={dictionary?.label}
          onChange={() =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                tag: {
                  ...result?.config?.details?.tag,
                  isShow: !result?.config?.details?.tag?.isShow
                }
              }
            )
          }
        />
        <CustomTextField
          label={dictionary?.label}
          placeholder='Placeholder'
          value={result?.config?.details?.tag?.value || ''}
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                tag: {
                  ...result?.config?.details?.tag,
                  value: e.target.value
                }
              }
            )
          }
        />
        <FormControlLabel
          control={<Switch checked={result?.config?.details?.endTag?.isShow} />}
          label={dictionary?.labelSuffix}
          onChange={() =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                endTag: {
                  ...result?.config?.details?.endTag,
                  isShow: !result?.config?.details?.endTag?.isShow
                }
              }
            )
          }
        />
        <CustomTextField
          label={dictionary?.labelSuffix}
          placeholder='Placeholder'
          value={result?.config?.details?.endTag?.value || ''}
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                endTag: {
                  ...result?.config?.details?.endTag,
                  value: e.target.value
                }
              }
            )
          }
        />
        <FormControlLabel
          control={<Switch checked={result?.config?.details?.position?.isShow} />}
          label={dictionary?.displayPosition}
          onChange={() =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                position: {
                  ...result?.config?.details?.position,
                  isShow: !result?.config?.details?.position?.isShow
                }
              }
            )
          }
        />
        <DebouncedInput
          label={dictionary?.position}
          placeholder={result?.config?.details?.position?.placeholder}
          value={result?.config?.details?.position?.value || ''}
          onChange={(newText: any) =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                position: {
                  ...result?.config?.details?.position,
                  value: newText
                }
              }
            )
          }
        />

        <FormControlLabel
          control={
            <Switch
              checked={result?.config?.details?.signer?.isShow}
              onChange={() =>
                updateDetails(
                  String(selectedField?.parentKey ?? ''),
                  selectedField?.boxId ?? '',
                  selectedField?.fieldId?.id ?? '',
                  {
                    signer: {
                      ...result?.config?.details?.signer,
                      isShow: !result?.config?.details?.signer?.isShow
                    }
                  }
                )
              }
            />
          }
          label={dictionary?.signerFullName}
        />
        <div className='flex gap-1'>
          <BaseFontSize placeholder={result?.config?.style?.fontSize} value={result?.config?.style?.fontSize} />
        </div>

        <FormControlLabel
          control={<Switch checked={result?.config?.details?.date?.isShow} />}
          label={dictionary?.signatureDate}
          onChange={() =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                date: {
                  ...result?.config?.details?.date,
                  isShow: !result?.config?.details?.date?.isShow
                }
              }
            )
          }
        />
      </section>

      {result?.config?.details?.signType?.type == 'master' && (
        <section
          className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
          style={{ borderBottom: '1.5px solid #11151A1F' }}
        >
          {/* <RadioGroup
            name='select-option'
            value={result?.config?.details?.setting?.defaultAssign}
            onChange={e =>
              updateDetails(
                String(selectedField?.parentKey ?? ''),
                selectedField?.boxId ?? '',
                selectedField?.fieldId?.id ?? '',
                {
                  setting: {
                    ...result?.config?.details?.setting,
                    defaultAssign: e.target.value
                  }
                }
              )
            }
          >
            <div className='flex items-center justify-between gap-2'>
              <FormControlLabel value='owner' control={<Radio />} label='กำหนดเอง' />
              <Button
                variant='contained'
                color={result?.config?.details?.setting?.defaultAssign === 'owner' ? 'primary' : 'secondary'}
                disabled={result?.config?.details?.setting?.defaultAssign === 'owner'}
                onClick={() => {
                  showDialog({
                    id: 'alertSettingSignDialog',
                    component: <SettingSignDialog id='alertSettingSignDialog' onClick={() => {}} />,
                    size: 'sm'
                  })
                }}
              >
                เลือก
              </Button>
            </div>

            <FormControlLabel value='clone' control={<Radio />} label='ให้ผู้ใช้กำหนด' />
          </RadioGroup> */}

          <FormControlLabel
            label={'ให้ผู้ใช้กำหนด'}
            className='m-0'
            control={
              <Checkbox
                checked={result?.config?.details?.setting?.isUserUse}
                name={'isUserUse'}
                onChange={e => {
                  updateDetails(
                    String(selectedField?.parentKey ?? ''),
                    selectedField?.boxId ?? '',
                    selectedField?.fieldId?.id ?? '',
                    {
                      setting: {
                        ...result?.config?.details?.setting,
                        isUserUse: e.target.checked
                      }
                    }
                  )
                }}
              />
            }
          />
        </section>
      )}
    </div>
  )
}

export default SignatureProperty
