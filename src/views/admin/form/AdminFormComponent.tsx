/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useEffect, useState } from 'react'

import { useFormStore } from '@/store/useFormStore'
import { Card, CardContent, Grid } from '@mui/material'
import FormNavbarContent from '@/components/layout/vertical/navbar/FormNavbarContent'
import { useToolboxTabStore } from '@/store/useToolboxTabStore'
import { NewFormContainer } from '@components/e-form/form/NewFormContainer'
import { VariableFormComponent } from '@/components/e-form/form/options/VariableFormComponent'
import { ApiCallFormComponent } from '@/components/e-form/form/options/ApiCallFormComponent'
import MediaFormComponent from '@/components/e-form/form/options/MediaFormComponent'

const AdminFormComponent = () => {
  const formData = useFormStore(state => state.form)
  const { activeTab, setActiveTab } = useToolboxTabStore()
  const { clear } = useToolboxTabStore()
  const clearSelectedField = useFormStore(state => state.clearSelectedField)
  const clearForm = useFormStore(state => state.clearForm)

  useEffect(() => {
    return () => {
      clear()
      clearSelectedField()
      clearForm()
    }
  }, [])

  return (
    <div className=' flex gap-6 flex-col items-center'>
      {activeTab == 'document' && (
        <Card className='w-full'>
          <CardContent className='py-2 px-4'>
            <FormNavbarContent />
          </CardContent>
        </Card>
      )}

      {activeTab == 'document' && <NewFormContainer formElements={formData} />}
      {activeTab == 'appState' && <VariableFormComponent />}
      {activeTab == 'apiCall' && <ApiCallFormComponent />}
      {activeTab == 'media' && <MediaFormComponent />}
    </div>
  )
}

export default AdminFormComponent
