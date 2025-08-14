'use client'
import { useDispatch } from 'react-redux'
import { useEffect, useRef } from 'react'

const TextField = props => {
  const { config, id } = props

  const dispatch = useDispatch()

  const handleChangeInput = e => {
    const newValue = e.target.value

    dispatch()
    // setValueElementObject({
    //   id: id,
    //   key: 'value',
    //   value: newValue
    // })
  }

  return (
    <div>

    </div>
  )
}

export default TextField
