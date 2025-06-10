'use client'

import { useFormStore } from '@/store/useFormStore'
import { mapKeyValueForm } from '@/utils/mapKeyValueForm'
import AdminFormComponent from '@/views/admin/form/AdminFormComponent'
import { Button } from '@mui/material'

export default function Page() {
  // const form = useFormStore(state => state.form)

  // const hanldClick = () => {
  //   const resultMapValue = mapKeyValueForm(form?.form_details)
  //   console.log('test123', resultMapValue)
  // }
  return (
    <div>
      <AdminFormComponent />
      {/* <Button
        onClick={() => {
          hanldClick()
        }}
      >
        Click me
      </Button> */}
    </div>
  )
}
