'use client'

// React Imports
import { forwardRef, useState, useEffect, FocusEvent, ChangeEvent } from 'react'

// MUI Imports
import { styled } from '@mui/material/styles'
import type { TextFieldProps } from '@mui/material/TextField'
import TextField from '@mui/material/TextField'
import { renderProfileTemplate } from '@/utils/viewPermissionRoutes'
// import { numberToThaiText } from '@/utils/numberFormat' // หากต้องการใช้งาน ให้เอา comment ออก

// Styled component for the TextField
const TextFieldStyled = styled(TextField)<TextFieldProps>(({ theme }) => ({
  // ... All existing styles remain unchanged ...
  '& .MuiInputLabel-root': {
    transform: 'none',
    width: 'fit-content',
    maxWidth: '100%',
    lineHeight: 1.153,
    position: 'relative',
    paddingTop: '2.5px',
    fontSize: theme.typography.body2.fontSize,
    marginBottom: theme.spacing(1),
    color: 'var(--mui-palette-text-primary)',
    '&:not(.Mui-error).MuiFormLabel-colorPrimary.Mui-focused': {
      color: 'var(--mui-palette-primary-main) !important'
    },
    '&.Mui-disabled': {
      color: 'var(--mui-palette-text-disabled)'
    },
    '&.Mui-error': {
      color: 'var(--mui-palette-error-main)'
    }
  },
  '& .MuiInputBase-root': {
    backgroundColor: 'transparent !important',
    border: `1px solid var(--mui-palette-customColors-inputBorder)`,
    '&:not(.Mui-focused):not(.Mui-disabled):not(.Mui-error):hover': {
      borderColor: 'var(--mui-palette-action-active)'
    },
    '&:before, &:after': {
      display: 'none'
    },
    '&.MuiInputBase-sizeSmall': {
      borderRadius: 'var(--mui-shape-borderRadius)'
    },
    '&.Mui-error': {
      borderColor: 'var(--mui-palette-error-main)'
    },
    '&.Mui-focused': {
      borderWidth: 2,
      '& .MuiInputBase-input:not(.MuiInputBase-readOnly):not([readonly])::placeholder': {
        transform: 'translateX(4px)'
      },
      '& :not(textarea).MuiFilledInput-input': {
        padding: '6.25px 13px'
      },
      '&:not(.Mui-error).MuiInputBase-colorPrimary': {
        borderColor: 'var(--mui-palette-primary-main)',
        boxShadow: 'var(--mui-customShadows-primary-sm)'
      },
      '&.MuiInputBase-colorSecondary': {
        borderColor: 'var(--mui-palette-secondary-main)'
      },
      '&.MuiInputBase-colorInfo': {
        borderColor: 'var(--mui-palette-info-main)'
      },
      '&.MuiInputBase-colorSuccess': {
        borderColor: 'var(--mui-palette-success-main)'
      },
      '&.MuiInputBase-colorWarning': {
        borderColor: 'var(--mui-palette-warning-main)'
      },
      '&.MuiInputBase-colorError': {
        borderColor: 'var(--mui-palette-error-main)'
      },
      '&.Mui-error': {
        borderColor: 'var(--mui-palette-error-main)'
      }
    },
    '&.Mui-disabled': {
      backgroundColor: 'var(--mui-palette-action-hover) !important'
    }
  },

  // Adornments
  '& .MuiInputAdornment-root': {
    marginBlockStart: '0px !important',
    '&.MuiInputAdornment-positionStart + .MuiInputBase-input:not(textarea)': {
      paddingInlineStart: '0px !important'
    }
  },
  '& .MuiInputBase-inputAdornedEnd.MuiInputBase-input': {
    paddingInlineEnd: '0px !important'
  },

  '& .MuiInputBase-sizeSmall.MuiInputBase-adornedStart.Mui-focused': {
    paddingInlineStart: '13px',
    '& .MuiInputBase-input': {
      paddingInlineStart: '0px !important'
    }
  },
  '& .MuiInputBase-sizeSmall.MuiInputBase-adornedStart:not(.MuiAutocomplete-inputRoot)': {
    paddingInlineStart: '14px'
  },
  '& .MuiInputBase-sizeSmall.MuiInputBase-adornedEnd:not(.MuiAutocomplete-inputRoot)': {
    paddingInlineEnd: '14px'
  },
  '& .MuiInputBase-sizeSmall.MuiInputBase-adornedEnd.Mui-focused:not(.MuiAutocomplete-inputRoot)': {
    paddingInlineEnd: '13px',
    '& .MuiInputBase-input': {
      paddingInlineEnd: '0px !important'
    }
  },
  '& :not(.MuiInputBase-sizeSmall).MuiInputBase-adornedStart.Mui-focused': {
    paddingInlineStart: '15px',
    '& .MuiInputBase-input': {
      paddingInlineStart: '0px !important'
    }
  },
  '& :not(.MuiInputBase-sizeSmall).MuiInputBase-adornedStart': {
    paddingInlineStart: '16px'
  },
  '& :not(.MuiInputBase-sizeSmall).MuiInputBase-adornedEnd.Mui-focused': {
    paddingInlineEnd: '15px',
    '& .MuiInputBase-input': {
      paddingInlineEnd: '0px !important'
    }
  },
  '& :not(.MuiInputBase-sizeSmall).MuiInputBase-adornedEnd': {
    paddingInlineEnd: '16px'
  },
  '& .MuiInputAdornment-sizeMedium': {
    'i, svg': {
      fontSize: '1.25rem'
    }
  },

  '& .MuiInputBase-input': {
    '&:not(textarea).MuiInputBase-inputSizeSmall': {
      padding: '7.25px 14px'
    },
    '&:not(.MuiInputBase-readOnly):not([readonly])::placeholder': {
      transition: theme.transitions.create(['opacity', 'transform'], {
        duration: theme.transitions.duration.shorter
      })
    }
  },
  '& :not(.MuiInputBase-sizeSmall).MuiInputBase-root': {
    borderRadius: '8px',
    fontSize: '17px',
    lineHeight: '1.41',
    '& .MuiInputBase-input': {
      padding: '10.8px 16px'
    },
    '&.Mui-focused': {
      '& .MuiInputBase-input': {
        padding: '9.8px 15px'
      }
    }
  },
  '& .MuiFormHelperText-root': {
    lineHeight: 1.154,
    margin: theme.spacing(1, 0, 0),
    fontSize: theme.typography.body2.fontSize,
    '&.Mui-error': {
      color: 'var(--mui-palette-error-main)'
    },
    '&.Mui-disabled': {
      color: 'var(--mui-palette-text-disabled)'
    }
  },

  // For Select
  '& .MuiSelect-select.MuiInputBase-inputSizeSmall, & .MuiNativeSelect-select.MuiInputBase-inputSizeSmall': {
    '& ~ i, & ~ svg': {
      inlineSize: '1.125rem',
      blockSize: '1.125rem'
    }
  },
  '& .MuiSelect-select': {
    minHeight: 'unset !important',
    lineHeight: '1.4375em',
    '&.MuiInputBase-input': {
      paddingInlineEnd: '32px !important'
    }
  },
  '& .Mui-focused .MuiSelect-select': {
    '& ~ i, & ~ svg': {
      right: '0.9375rem'
    }
  },

  '& .MuiSelect-select:focus, & .MuiNativeSelect-select:focus': {
    backgroundColor: 'transparent'
  },

  // For Autocomplete
  '& :not(.MuiInputBase-sizeSmall).MuiAutocomplete-inputRoot': {
    paddingBlock: '5.55px',
    '& .MuiAutocomplete-input': {
      paddingInline: '8px !important',
      paddingBlock: '5.25px !important'
    },
    '&.Mui-focused .MuiAutocomplete-input': {
      paddingInlineStart: '7px !important'
    },
    '&.Mui-focused': {
      paddingBlock: '4.55px !important'
    },
    '& .MuiAutocomplete-endAdornment': {
      top: 'calc(50% - 12px)'
    }
  },
  '& .MuiAutocomplete-inputRoot.MuiInputBase-sizeSmall': {
    paddingBlock: '4.75px !important',
    paddingInlineStart: '10px',
    '&.Mui-focused': {
      paddingBlock: '3.75px !important',
      paddingInlineStart: '9px',
      '.MuiAutocomplete-input': {
        paddingBlock: '2.5px',
        paddingInline: '3px !important'
      }
    },
    '& .MuiAutocomplete-input': {
      paddingInline: '3px !important'
    }
  },
  '& .MuiAutocomplete-inputRoot': {
    display: 'flex',
    gap: '0.25rem',
    '& .MuiAutocomplete-tag': {
      margin: 0
    }
  },
  '& .MuiAutocomplete-inputRoot.Mui-focused .MuiAutocomplete-endAdornment': {
    right: '.9375rem'
  },

  // For Textarea
  '& .MuiInputBase-multiline': {
    '&.MuiInputBase-sizeSmall': {
      padding: '6px 14px',
      '&.Mui-focused': {
        padding: '5px 13px'
      }
    },
    '& textarea.MuiInputBase-inputSizeSmall:placeholder-shown': {
      overflowX: 'hidden'
    }
  }
}))

// Define the props for the component
type CustomTextFieldProps = TextFieldProps & {
  isNumber?: boolean
  decimalPlaces?: number
  linkField?: string
  defaultFieldValue?: string
  changeNumberToText?: boolean
}

const CustomTextField = forwardRef((props: CustomTextFieldProps, ref) => {
  // Destructure props
  const {
    size = 'small',
    InputLabelProps,
    linkField,
    InputProps,
    isNumber = false,
    changeNumberToText = false,
    decimalPlaces = 0,
    value,
    defaultFieldValue,
    onBlur,
    onChange,
    onFocus,
    ...rest
  } = props


    // console.log("props.placeholder",props.placeholder)


  // State to hold the value displayed in the input
  const [internalValue, setInternalValue] = useState(value)
  // State to track if the input is focused
  const [isFocused, setIsFocused] = useState(false)

  // Helper to format a value into a number string with commas
  const formatValue = (val: any) => {
    if (val === null || val === undefined || val === '' || isNaN(parseFloat(String(val).replace(/,/g, '')))) {
      return ''
    }
    const num = parseFloat(String(val).replace(/,/g, ''))
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    })
  }

  // Helper to remove formatting for editing
  const unformatValue = (val: any) => {
    if (val === null || val === undefined) return ''
    return String(val).replace(/,/g, '')
  }

  // Effect to sync with the parent component's `value` prop.
  useEffect(() => {
    // Only update if the input is not focused, to allow the user to type freely.
    if (!isFocused) {
      if (defaultFieldValue != '' && value == '' && defaultFieldValue) {
        setInternalValue(renderProfileTemplate(defaultFieldValue))
      } else {
        const formattedParentValue = isNumber ? formatValue(value) : value
        if (formattedParentValue !== internalValue) {
          setInternalValue(formattedParentValue)
        }
      }
    }
  }, [value, isNumber, isFocused, decimalPlaces, internalValue]) // Added internalValue to dependency array

  // When the input gains focus, set the focused state and show the raw number.
  const handleFocus = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(true)
    if (isNumber) {
      setInternalValue(unformatValue(internalValue))
    }
    if (onFocus) {
      onFocus(e)
    }
  }

  // When the input loses focus, unset the focused state and apply formatting.
  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false)

    if (isNumber) {
      const rawValue = unformatValue(e.target.value)
      const formattedValue = formatValue(rawValue)
      setInternalValue(formattedValue)

      const eventForParent = {
        ...e,
        target: { ...e.target, value: rawValue }
      }

      if (onBlur) {
        onBlur(eventForParent)
      }
    } else {
      if (onBlur) {
        onBlur(e)
      }
    }
  }

  // As the user types, update the internal state directly.
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const currentValue = e.target.value

    // if (changeNumberToText) {
    //   if (currentValue === '' || /^\d*\.?\d*$/.test(currentValue)) {
    //     setInternalValue(currentValue)
    //     if (onChange) {
    //       const thaiText = numberToThaiText(currentValue) // Assuming numberToThaiText exists
    //       const eventForParent = { ...e, target: { ...e.target, value: thaiText } }
    //       onChange(eventForParent)
    //     }
    //   }
    // } else
    if (isNumber) {
      // Allow only numbers and a single decimal point
      if (currentValue === '' || /^\d*\.?\d*$/.test(currentValue)) {
        setInternalValue(currentValue)
        if (onChange) {
          const eventForParent = {
            ...e,
            target: { ...e.target, value: currentValue }
          }
          onChange(eventForParent)
        }
      }
    } else {
      setInternalValue(currentValue)
      if (onChange) {
        onChange(e)
      }
    }
  }

  return (
    <TextFieldStyled
      size={size}
      inputRef={ref}
      {...rest}
      variant='filled'
      value={internalValue ?? ''}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      InputLabelProps={{ ...InputLabelProps, shrink: true }}
      InputProps={{
        ...InputProps,
        ...(isNumber && { inputMode: 'decimal' })
      }}
    />
  )
})

export default CustomTextField
