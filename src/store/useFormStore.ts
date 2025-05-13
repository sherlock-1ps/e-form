import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toolboxDocumentBaseMenu } from '@/data/toolbox/toolboxMenu'
import { v4 as uuidv4 } from 'uuid'
import { nanoid } from 'nanoid'

type SelectedField = {
  parentKey: string | number | null
  fieldId: any
  boxId: string | null
}

type FormObject = {
  parentKey: string
  fields: any[]
}

type FormVersion = {
  name: string
  version: string
  form_details: FormObject[]
}

type FormState = {
  form: FormVersion
  selectedField: SelectedField | null
  setForm: (newForm: FormObject) => void
  updateFormByKey: (key: string, fields: any[]) => void
  updateFieldData: (parentKey: string, fieldId: string, newData: any) => void
  updateValue: (parentKey: string, fieldId: string, dataId: string, newValue: string) => void
  updateStyle: (parentKey: string, fieldId: string, dataId: string, newStyle: Partial<any>) => void
  updateDetails: (parentKey: string, fieldId: string, dataId: string, newStyle: Partial<any>) => void
  updateFieldHeight: (parentKey: string, fieldId: string, newHeight: number) => void
  updatePadding: (parentKey: string, boxId: string, newPadding: Partial<{ top: number; bottom: number; left: number; right: number, allPadding: string }>) => void
  updateFormMeta: (meta: Partial<{ name: string; version: string }>) => void
  createForm: (name: string, version: string) => void
  addDefaultForm: () => void
  clearForm: () => void
  getSelectedDataItem: () => any | null
  setSelectedField: (field: SelectedField | null) => void
  clearSelectedField: () => void
  addFieldToForm: () => void
  deleteParentForm: (fieldId: string) => void
  deleteFormByKey: (parentKey: string) => void
  deleteFieldData: (parentKey: string, fieldId: string, dataId: string) => void
}

const createField = (index: number) => {
  const { icon, ...baseConfig } = toolboxDocumentBaseMenu[0]

  return {

    // i: uuidv4(),
    i: nanoid(8),

    x: index * 3,
    y: 0,
    // w: Number(process.env.NEXT_PUBLIC_GRID_LAYOUT_ROW_HEIGHT),
    w: Number(process.env.NEXT_PUBLIC_GRID_LAYOUT_WIDTH_CONTENT),
    h: 1,
    minH: 1,
    maxW: Number(process.env.NEXT_PUBLIC_GRID_LAYOUT_COL),
    // data: [{ ...toolboxDocumentBaseMenu[0], id: uuidv4() }],
    // data: [{ ...baseConfig, id: nanoid(8) }],
    data: [],
    padding: {
      allPadding: "all",
      top: Number(process.env.NEXT_PUBLIC_DEFAULT_PADDING),
      bottom: Number(process.env.NEXT_PUBLIC_DEFAULT_PADDING),
      left: Number(process.env.NEXT_PUBLIC_DEFAULT_PADDING),
      right: Number(process.env.NEXT_PUBLIC_DEFAULT_PADDING)
    }
  }
}

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      form: { name: "", version: "", form_details: [] },
      selectedField: null,
      setForm: (newForm) =>
        set((state) => ({
          form: {
            ...state.form,
            form_details: [...state.form.form_details, newForm]
          }
        })),
      updateFormMeta: (meta) =>
        set((state) => ({
          form: {
            ...state.form,
            ...meta
          }
        })),
      updateFormByKey: (parentKey: string, newFields: any[]) =>
        set((state) => ({
          form: {
            ...state.form,
            form_details: state.form.form_details.map((formItem) => {
              if (formItem.parentKey !== parentKey) return formItem

              const mergedFields = formItem.fields.map((oldField) => {
                const updated = newFields.find((f) => f.i === oldField.i)

                return updated ? { ...oldField, ...updated } : oldField
              })

              const newOnlyFields = newFields.filter(
                (f) => !formItem.fields.some((old) => old.i === f.i)
              )

              return {
                ...formItem,
                fields: [...mergedFields, ...newOnlyFields]
              }
            })
          }
        })),
      updateFieldData: (parentKey: string, fieldId: string, newData: any) =>
        set(state => {
          const updatedFormDetails = state.form.form_details.map(formItem => {
            if (formItem.parentKey !== parentKey) return formItem

            const updatedFields = formItem.fields.map(field => {
              if (field.i !== fieldId) return field

              return {
                ...field,
                data: [...(Array.isArray(field.data) ? field.data : []), newData]
              }
            })

            return {
              ...formItem,
              fields: updatedFields
            }
          })

          return {
            form: {
              ...state.form,
              form_details: updatedFormDetails
            }
          }
        }),
      updateFieldHeight: (parentKey, fieldId, newHeight) =>
        set(state => {
          const updatedFormDetails = state.form.form_details.map(formItem => {
            if (formItem.parentKey !== parentKey) return formItem

            const updatedFields = formItem.fields.map(field => {
              if (field.i !== fieldId) return field

              return {
                ...field,
                h: newHeight
              }
            })

            return {
              ...formItem,
              fields: updatedFields
            }
          })

          return {
            form: {
              ...state.form,
              form_details: updatedFormDetails
            }
          }
        }),

      updateValue: (parentKey, fieldId, dataId, newValue) =>
        set(state => {
          const updatedFormDetails = state.form.form_details.map(formItem => {
            if (formItem.parentKey !== parentKey) return formItem

            const updatedFields = formItem.fields.map(field => {
              if (field.i !== fieldId) return field

              const updatedData = (Array.isArray(field.data) ? field.data : []).map((dataItem: any) => {
                if (dataItem.id !== dataId) return dataItem

                return {
                  ...dataItem,
                  config: {
                    ...dataItem.config,
                    details: {
                      ...dataItem.config.details,
                      value: newValue
                    }
                  }
                }
              })

              return {
                ...field,
                data: updatedData
              }
            })

            return {
              ...formItem,
              fields: updatedFields
            }
          })

          return {
            form: {
              ...state.form,
              form_details: updatedFormDetails
            }
          }
        }),
      updateStyle: (parentKey, fieldId, dataId, newStyle) =>
        set(state => {
          const updatedFormDetails = state.form.form_details.map(formItem => {
            if (formItem.parentKey !== parentKey) return formItem

            const updatedFields = formItem.fields.map(field => {
              if (field.i !== fieldId) return field

              const updatedData = field.data.map((dataItem: any) => {
                if (dataItem.id !== dataId) return dataItem

                return {
                  ...dataItem,
                  config: {
                    ...dataItem.config,
                    style: {
                      ...(dataItem.config?.style ?? {}),
                      ...newStyle
                    }
                  }
                }
              })

              return {
                ...field,
                data: updatedData
              }
            })

            return {
              ...formItem,
              fields: updatedFields
            }
          })

          return {
            form: {
              ...state.form,
              form_details: updatedFormDetails
            }
          }
        }),
      updateDetails: (parentKey, fieldId, dataId, newDetails: Partial<any>) =>
        set(state => {
          const updatedFormDetails = state.form.form_details.map(formItem => {
            if (formItem.parentKey !== parentKey) return formItem

            const updatedFields = formItem.fields.map(field => {
              if (field.i !== fieldId) return field

              const updatedData = field.data.map((dataItem: any) => {
                if (dataItem.id !== dataId) return dataItem

                return {
                  ...dataItem,
                  config: {
                    ...dataItem.config,
                    details: {
                      ...dataItem.config.details,
                      ...newDetails
                    }
                  }
                }
              })

              return {
                ...field,
                data: updatedData
              }
            })

            return {
              ...formItem,
              fields: updatedFields
            }
          })

          return {
            form: {
              ...state.form,
              form_details: updatedFormDetails
            }
          }
        }),
      updatePadding: (parentKey, boxId, newPadding) =>
        set(state => {
          const updatedFormDetails = state.form.form_details.map(formItem => {
            if (formItem.parentKey !== parentKey) return formItem

            const updatedFields = formItem.fields.map(field => {
              if (field.i !== boxId) return field

              const currentPadding = field.padding || {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                allPadding: 'custom'
              }

              let updatedPadding = { ...currentPadding, ...newPadding }

              if (newPadding.allPadding === 'all') {
                const uniformValue = newPadding.top ?? currentPadding.top ?? 0
                updatedPadding = {
                  allPadding: 'all',
                  top: uniformValue,
                  bottom: uniformValue,
                  left: uniformValue,
                  right: uniformValue
                }
              }

              return {
                ...field,
                padding: updatedPadding
              }
            })

            return {
              ...formItem,
              fields: updatedFields
            }
          })

          return {
            form: {
              ...state.form,
              form_details: updatedFormDetails
            }
          }
        }),
      createForm: (name: string, version: string) =>
        set(() => ({
          form: {
            name,
            version,
            form_details: []
          },
          selectedField: {
            parentKey: null,
            fieldId: null,
            boxId: null
          }
        })),
      addDefaultForm: () =>
        set((state) => {
          const parentKey = nanoid(8)

          const fields = Array.from(
            { length: Number(process.env.NEXT_PUBLIC_GRID_LAYOUT_COL_NUMBER) },
            (_, i) => createField(i)
          )

          return {
            form: {
              ...state.form,

              form_details: [
                ...state.form.form_details,
                { parentKey, fields }
              ]
            },
            selectedField: {
              parentKey,
              fieldId: null,
              boxId: null
            }
          }
        }),
      getSelectedDataItem: () => {
        const { form, selectedField } = get()

        const field = form.form_details
          .find(f => f.parentKey === selectedField?.parentKey)
          ?.fields.find(f => f.i === selectedField?.boxId)

        return field?.data?.find((d: any) => d.id === selectedField?.fieldId?.id) ?? null
      },
      addFieldToForm: () =>
        set((state) => {
          const parentKey = state.selectedField?.parentKey
          if (!parentKey) return {}

          const updatedFormDetails = state.form.form_details.map((formItem) => {
            if (formItem.parentKey !== parentKey) return formItem

            const newField = createField(formItem.fields.length)
            const updatedFields = [...formItem.fields, newField]
            const newWidth = Number(process.env.NEXT_PUBLIC_GRID_LAYOUT_COL) / updatedFields.length

            const resizedFields = updatedFields.map((field, index) => ({
              ...field,
              w: newWidth,
              x: index * newWidth
            }))

            return {
              ...formItem,
              fields: resizedFields
            }
          })

          return {
            form: {
              ...state.form,
              form_details: updatedFormDetails
            }
          }
        }),
      deleteParentForm: (fieldId: string) =>
        set((state) => {
          const updatedFormDetails = state.form.form_details.map((formItem) => {
            const filteredFields = formItem.fields.filter((field) => field.i !== fieldId)

            // If no field was removed, return as-is
            if (filteredFields.length === formItem.fields.length) return formItem

            const newWidth =
              filteredFields.length > 0
                ? Number(process.env.NEXT_PUBLIC_GRID_LAYOUT_COL) / filteredFields.length
                : 3

            const resizedFields = filteredFields.map((field, index) => ({
              ...field,
              w: newWidth,
              x: index * newWidth
            }))

            return {
              ...formItem,
              fields: resizedFields
            }
          })

          const isSelectedDeleted = state.selectedField?.boxId === fieldId

          return {
            form: {
              ...state.form,
              form_details: updatedFormDetails
            },
            selectedField: isSelectedDeleted ? null : state.selectedField
          }
        }),
      deleteFormByKey: (parentKey: string) =>
        set((state) => {
          const updatedFormDetails = state.form.form_details.filter(
            (formItem) => formItem.parentKey !== parentKey
          )

          const isSelectedDeleted = state.selectedField?.parentKey === parentKey

          return {
            form: {
              ...state.form,
              form_details: updatedFormDetails
            },
            selectedField: isSelectedDeleted ? null : state.selectedField
          }
        }),
      deleteFieldData: (parentKey: string, fieldId: string, dataId: string) =>
        set(state => {
          const updatedFormDetails = state.form.form_details.map(formItem => {
            if (formItem.parentKey !== parentKey) return formItem

            const updatedFields = formItem.fields.map(field => {
              if (field.i !== fieldId) return field

              const filteredData = field.data.filter((dataItem: any) => dataItem.id !== dataId)

              return {
                ...field,
                data: filteredData
              }
            })

            return {
              ...formItem,
              fields: updatedFields
            }
          })

          const { selectedField } = state
          const isDeletedSelected =
            selectedField?.parentKey === parentKey &&
            selectedField?.boxId === fieldId &&
            selectedField?.fieldId?.id === dataId

          return {
            form: {
              ...state.form,
              form_details: updatedFormDetails
            },
            selectedField: isDeletedSelected ? null : selectedField
          }
        }),
      clearForm: () =>
        set(() => ({
          form: {
            name: "",
            version: '',
            form_details: []
          }
        })),
      setSelectedField: (field) =>
        set((state) => ({
          selectedField: {
            parentKey: field?.parentKey ?? state?.selectedField?.parentKey ?? null,
            fieldId: field?.fieldId ?? null,
            boxId: field?.boxId ?? state?.selectedField?.boxId ?? null
          }
        })),
      clearSelectedField: () =>
        set(() => ({
          selectedField: {
            parentKey: null,
            fieldId: null,
            boxId: null
          }
        })),
      setSelectedContainer: (parentKey: string) =>
        set(() => ({
          selectedField: {
            parentKey,
            fieldId: null,
            boxId: null
          }
        }))
    }),
    {
      name: 'form-storage',
      partialize: (state) => ({
        form: state.form
      })
    }
  )
)
