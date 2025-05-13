'use client'

// React & Libs
import { useEffect, useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'

// MUI
import { Button, Grid, Typography } from '@mui/material'

// Custom Hooks & Components
import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'

// Props
interface signProps {
  id: string
  onClick: () => void
}

const ElectonicSignDialog = ({ id, onClick }: signProps) => {
  const { closeDialog } = useDialog()
  const sigPadRef = useRef<SignatureCanvas>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState('')
  const [canvasWidth, setCanvasWidth] = useState(800)

  const downloadSignature = () => {
    const dataUrl = sigPadRef.current?.getCanvas().toDataURL('image/png')

    if (!dataUrl) return

    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'signature.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Resize canvas based on actual width
  useEffect(() => {
    if (containerRef.current) {
      setCanvasWidth(containerRef.current.offsetWidth)
    }

    const handleResize = () => {
      if (containerRef.current) {
        setCanvasWidth(containerRef.current.offsetWidth)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const clear = () => {
    sigPadRef.current?.clear()
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant='h5' className='text-center'>
          ลงนาม - ลายมือชื่ออิเล็กทรอนิกส์ (ม.9)
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <CustomTextField
          rows={5}
          multiline
          fullWidth
          label='ความคิดเห็น'
          placeholder='ระบุความคิดเห็น...'
          value={formData}
          onChange={e => setFormData(e.target.value)}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant='body2' className=' text-textPrimary'>
          วาดลายเซ็น
        </Typography>

        <div
          id='signature-container'
          ref={containerRef}
          className='bg-gray-100 border border-gray-300 rounded-md overflow-hidden'
        >
          <SignatureCanvas
            penColor='black'
            ref={sigPadRef}
            canvasProps={{
              width: canvasWidth,
              height: 200,
              className: 'w-full h-[200px] bg-gray-100 rounded-md',
              style: { touchAction: 'none' }
            }}
          />
        </div>

        <div className='mt-2 flex justify-end gap-2'>
          <Button variant='outlined' color='primary' onClick={downloadSignature}>
            ดาวน์โหลดลายเซ็น
          </Button>
          <Button variant='outlined' color='primary' onClick={clear}>
            ล้างลายเซ็น
          </Button>
        </div>
      </Grid>

      <Grid item xs={12} className='flex items-center justify-end gap-2'>
        <Button variant='contained' color='secondary' onClick={() => closeDialog(id)}>
          ยกเลิก
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            closeDialog(id)
            onClick()
          }}
        >
          ยืนยัน
        </Button>
      </Grid>
    </Grid>
  )
}

export default ElectonicSignDialog
