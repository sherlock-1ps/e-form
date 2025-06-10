
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
