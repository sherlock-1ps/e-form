'use client'
import { useDispatch } from 'react-redux'
import { useEffect, useRef } from 'react'

import { Publish } from '@mui/icons-material'

const DefaultButton = props => {
  const { config, id } = props

  console.log('butttt', config)

  const dispatch = useDispatch()

  const handleChangeInput = e => {
    const newValue = e.target.value

    // dispatch(
    //   setValueElementObject({
    //     id: id,
    //     key: 'value',
    //     value: newValue
    //   })
    // )
  }

  return <div></div>
}

export default DefaultButton
