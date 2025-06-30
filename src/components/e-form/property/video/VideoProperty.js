'use client'
import { useState, useMemo, useEffect } from 'react'

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'
import { Typography, Button, MenuItem } from '@mui/material'
import {
  FullscreenExitOutlined,
  ImageOutlined,
  FitScreenOutlined,
  Delete,
  OndemandVideoOutlined,
  DeleteOutlined
} from '@mui/icons-material'
import Switch from '@mui/material/Switch'

import CustomTextField from '@core/components/mui/TextField'
import BaseButton from '@/components/ui/button/BaseButton'
import BaseTitleProperty from '@components/e-form/property/BaseTitleProperty'
import { useFormStore } from '@/store/useFormStore.ts'
import { formSizeConfig } from '@configs/formSizeConfig'
import TriggerEventDialog from '@/components/dialogs/form/TriggerEventDialog'
import { useDialog } from '@/hooks/useDialog'
import { toolboxDocumentBaseMenu } from '@/data/toolbox/toolboxMenu'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import { toast } from 'react-toastify'
import SelectMediaVideoDialog from '@/components/dialogs/form/SelectMediaVideoDialog'
import { useDictionary } from '@/contexts/DictionaryContext'

const DebouncedInput = ({ value: initialValue, onChange, debounce = 750, maxLength, ...props }) => {
  const [value, setValue] = useState(initialValue)
  const { dictionary } = useDictionary()
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <CustomTextField
      {...props}
      value={value}
      onChange={e => {
        const input = e.target.value
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

const VideoProperty = ({ item }) => {
  const { dictionary } = useDictionary()
  const { showDialog } = useDialog()
  const form = useFormStore(state => state.form)
  const selectedField = useFormStore(state => state.selectedField)
  const updateDetails = useFormStore(state => state.updateDetails)
  const updateStyle = useFormStore(state => state.updateStyle)
  const updateId = useFormStore(state => state.updateId)
  const [isDuplicateId, setIsDuplicatedId] = useState(false)

  const result = form?.form_details
    .flatMap(formItem => formItem.fields)
    .flatMap(field => field.data)
    .find(dataItem => dataItem.id === selectedField?.fieldId?.id)

  const allIds = useMemo(() => {
    return form.form_details.flatMap(section => section.fields.flatMap(field => field.data.map(item => item.id)))
  }, [form])

  useEffect(() => {
    if (isDuplicateId) {
      setIsDuplicatedId(false)
    }
  }, [selectedField])

  return (
    <div>
      <BaseTitleProperty
        title='วีดีโอ'
        icon={<OndemandVideoOutlined sx={{ width: '32px', height: '32px' }} />}
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
      <section className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'>
        <Typography variant='h6'>{dictionary?.currentVideo} </Typography>
        <div className='flex items-center justify-between'>
          <Typography variant='body2'>
            {result?.config?.details?.value?.name ?? dictionary?.noVideoAvailable}
          </Typography>
          {result?.config?.details?.value?.value && (
            <Button
              variant='outlined'
              color='error'
              onClick={
                () =>
                  showDialog({
                    id: 'alertDialogConfirmToggleTrigger',
                    component: (
                      <ConfirmAlert
                        id='alertDialogConfirmToggleTrigger'
                        title='ลบวีดีโอ'
                        content1='คุณต้องการลบวีดีโอนี้ ใช่หรือไม่'
                        onClick={() => {
                          updateDetails(
                            String(selectedField?.parentKey ?? ''),
                            selectedField?.boxId ?? '',
                            selectedField?.fieldId?.id ?? '',
                            {
                              value: toolboxDocumentBaseMenu[3]?.config?.details?.value
                            }
                          )
                        }}
                      />
                    ),
                    size: 'sm'
                  })

                // updateValueOnly(String(selectedField?.parentKey ?? ''), selectedField?.boxId ?? '', item?.id ?? '', '')
              }
            >
              <DeleteOutlined style={{ color: 'red', fontSize: '20px' }} />
            </Button>
          )}
        </div>

        <Button
          fullWidth
          variant='contained'
          onClick={() => {
            showDialog({
              id: 'alertSelectMediaVideoDialog',
              component: <SelectMediaVideoDialog id='alertSelectMediaVideoDialog' />,
              size: 'lg'
            })
          }}
        >
          {dictionary?.selectVideo}
        </Button>
        <div className='w-full flex justify-around'>
          <FormControlLabel
            label={dictionary?.autoplay}
            control={
              <Checkbox
                checked={result?.config?.style?.autoPlay}
                onChange={e =>
                  updateStyle(
                    String(selectedField?.parentKey ?? ''),
                    selectedField?.boxId ?? '',
                    selectedField?.fieldId?.id ?? '',
                    { autoPlay: e.target.checked }
                  )
                }
              />
            }
          />

          <FormControlLabel
            label={dictionary?.loop}
            control={
              <Checkbox
                checked={result?.config?.style?.loop}
                onChange={e =>
                  updateStyle(
                    String(selectedField?.parentKey ?? ''),
                    selectedField?.boxId ?? '',
                    selectedField?.fieldId?.id ?? '',
                    { loop: e.target.checked }
                  )
                }
              />
            }
          />
        </div>

        <div>
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

export default VideoProperty
