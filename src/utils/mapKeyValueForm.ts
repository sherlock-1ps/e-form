import { formatThaiDate } from './formatDateTime'
import { FormatShowDate } from './formatShowDate'

export const mapKeyValueForm = (formDetails: any[]): Record<string, string> => {
  const result: Record<string, string> = {}
  const excludedTypes = new Set(['text', 'editor', 'image', 'video', 'button', 'upload', 'link', 'signature'])

  for (const section of formDetails) {
    for (const field of section.fields || []) {
      for (const item of field.data || []) {
        const { id, config } = item
        const type = config?.details?.type
        const value = config?.details?.value?.value

        if (!id) continue

        if (type === 'dropdown') {
          const realValue = config?.details?.keyValue?.realValue
          const defaultValue = config?.details?.value?.value?.defaultValue

          if (realValue?.trim()) {
            result[id] = realValue
          } else if (defaultValue?.trim()) {
            result[id] = defaultValue
          } else {
            result[id] = ''
          }
          continue
        }
        if (type === 'checkbox') {
          result[id] = config?.details?.value?.checkedList
          continue
        }

        if (type === 'radio') {
          result[id] = config?.details?.selectedValue
          continue
        }

        if (!excludedTypes.has(type)) {
          result[id] = value
        }
      }
    }
  }

  return result
}

export const updateFormValueByKey = (formDetails: any[], dataDetail: any) => {
  return formDetails.map(section => ({
    ...section,
    fields: section.fields.map((field: any) => ({
      ...field,
      data: field.data.map((item: any) => {
        const updateValue = dataDetail[item.id]

        if (updateValue !== undefined) {
          return {
            ...item,
            config: {
              ...item.config,
              details: {
                ...item.config.details,
                value: {
                  ...item.config.details.value,
                  value: updateValue
                }
              }
            }
          }
        }

        return item
      })
    }))
  }))
}

export const applyKeyValueToForm = (formDetails: any[], values: Record<string, any>): any[] => {
  return formDetails.map(section => ({
    ...section,
    fields: section.fields.map((field: any) => ({
      ...field,
      data: field.data.map((item: any) => {
        const id = item.id
        if (!id || !(id in values)) return item

        const newValue = values[id]
        const type = item.config?.details?.type

        const newDetails = { ...item.config?.details }

        if (type === 'dropdown') {
          newDetails.keyValue = {
            ...newDetails.keyValue,
            realValue: newValue
          }
        } else if (type === 'checkbox') {
          newDetails.value = {
            ...newDetails.value,
            checkedList: newValue
          }
        } else if (type === 'radio') {
          newDetails.selectedValue = newValue
        } else if (newDetails?.value?.value !== undefined) {
          newDetails.value = {
            ...newDetails.value,
            value: newValue
          }
        }

        return {
          ...item,
          config: {
            ...item.config,
            details: newDetails
          }
        }
      })
    }))
  }))
}

export const updateSignature = (
  formDetails: any[],
  valuesToUpdate: Record<
    string,
    {
      department_name: string
      person_id: string
      person_name: string
      position_name: string
      signed_date: string
      is_current: boolean
      signature_base64: string
      signature: string
    }
  >
) => {
  return formDetails.map(section => ({
    ...section,
    fields: section.fields.map((field: any) => ({
      ...field,
      data: field.data.map((item: any) => {
        const id = item.id
        const signerInfo = valuesToUpdate[id]

        if (id && signerInfo) {
          return {
            ...item,
            config: {
              ...item.config,
              details: {
                ...item.config?.details,
                date: {
                  ...item.config?.details?.date,
                  value: formatThaiDate(signerInfo?.signed_date, false) ?? ''
                },
                position: {
                  ...item.config?.details?.position,
                  value: signerInfo?.position_name ?? ''
                },
                signer: {
                  ...signerInfo,
                  ...item.config?.details?.signer,
                  value: signerInfo?.person_name ?? '',
                  imgValue: `${process.env.NEXT_PUBLIC_SIGNER_IMAGE_URL}/${signerInfo?.person_id}`
                }
              }
            }
          }
        }

        return item
      })
    }))
  }))
}
