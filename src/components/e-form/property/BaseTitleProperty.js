'use client'
import { Typography, Button } from '@mui/material'
import { CloseOutlined, Delete } from '@mui/icons-material'
import { useFormStore } from '@/store/useFormStore.ts'

const BaseTitleProperty = ({ title, icon, item }) => {
  const deleteFieldData = useFormStore(state => state.deleteFieldData)

  const handleDeleteData = () => {
    if (item) {
      deleteFieldData(item?.parentKey, item?.boxId, item?.fieldId?.id)
    }
  }

  return (
    <section
      className='w-full h-[86px] flex justify-center items-center py-4 px-6'
      style={{ borderBottom: '1.5px solid #11151A1F' }}
    >
      <div className='flex-1 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {icon}
          <Typography variant='h5'>{title}</Typography>
        </div>
        <Button startIcon={<Delete />} variant='contained' color='error' onClick={handleDeleteData}>
          ลบ
        </Button>
      </div>
    </section>
  )
}

export default BaseTitleProperty
