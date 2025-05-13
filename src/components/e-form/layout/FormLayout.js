/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { FormContainer } from '../form/formContainer'
import { NewFormContainer } from '../form/NewFormContainer'
import HeadForm from '@components/e-form/form/HeadForm'
import 'react-resizable/css/styles.css'
import { useFormStore } from '@/store/useFormStore'

const LayoutForm = () => {
  const dispatch = useDispatch()
  const formElements = useSelector(state => state.form)
  const formData = useFormStore(state => state.form)

  useEffect(() => {
    return () => {
      // dispatch(deleteCurrentProperty())
    }
  }, [])

  return (
    <main className='flex flex-col items-center justify-center gap-6 relative'>
      <section className='w-full '>
        <HeadForm />
      </section>
      <NewFormContainer formElements={formData} />
    </main>
  )
}

export default LayoutForm
