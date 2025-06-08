export const mapKeyValueForm = (formDetails: any[]): Record<string, string> => {
  const result: Record<string, string> = {}

  formDetails.forEach((section: any) => {
    section.fields.forEach((field: any) => {
      field.data.forEach((item: any) => {
        const type = item.config?.details?.type
        const id = item.id
        const value = item.config?.details?.value?.value

        if (type !== 'text' && id) {
          result[id] = value
        }
      })
    })
  })

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
