'use client'

// React & Libs
import { useEffect, useRef, useState } from 'react'
import SignatureCanvasComponent from 'react-signature-canvas' // <-- แก้ไขตรงนี้: เปลี่ยนชื่อเป็น SignatureCanvasComponent

// MUI
import { Button, Grid, Typography } from '@mui/material'

// Custom Hooks & Components
import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import { useParams, useRouter } from 'next/navigation'
import { useDictionary } from '@/contexts/DictionaryContext'

// Props
interface signProps {
  id: string
  onSave: (comment: string, signType: string, base64Signature: string) => Promise<any>
  signType: string
}

const ElectonicSignDialog = ({ id, onSave, signType }: signProps) => {
  const { dictionary } = useDictionary()
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params
  const { closeDialog } = useDialog()
  const sigPadRef = useRef<SignatureCanvasComponent>(null) // <-- อัปเดต type reference
  const containerRef = useRef<HTMLDivElement>(null)

  const [comment, setComment] = useState('')
  const [canvasWidth, setCanvasWidth] = useState(800)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // const [base64Sing, setBase64Sing] = useState("")

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

  const getSignature = () => {
    if (sigPadRef.current?.isEmpty()) {
      toast.error(dictionary?.pleaseDrawSignatureFirst, { autoClose: 3000 })
      return { status: false, base64: '' }
    }
    const dataURL = sigPadRef.current?.toDataURL('image/png')

    // setSignatureBase64(dataURL)
    // setBase64Sing(dataURL || "")

    return { status: true, base64: dataURL || '' }
  }

  const handleConfirm = async () => {
    // console.log(getSignature())

    // return;
    const base64Value = getSignature()
    if (!base64Value.status) return

    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const response = await onSave(comment, signType, base64Value.base64)
      if (response?.code === 'SUCCESS') {
        toast.success(dictionary?.saveSuccessful, { autoClose: 3000 })
        closeDialog(id)
        closeDialog('iframeDialog')
        router.push(`/${locale}/user/allTask`)
      }
    } catch (err) {
      console.error('save failed', err)
      toast.error(dictionary?.saveFailed, { autoClose: 3000 })
    } finally {
      setIsSubmitting(false)
    }
  }

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

  const clear = () => sigPadRef.current?.clear()

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
          label={dictionary?.comment}
          placeholder={dictionary?.typeYourCommentHere}
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant='body2' className=' text-textPrimary'>
          วาดลายเซ็น
        </Typography>
        {/* <button onClick={() => { saveSignature() }}>xxx</button> */}
        {/* <img src={base64Sing}></img> */}
        <div ref={containerRef} className='bg-gray-100 border border-gray-300 rounded-md overflow-hidden'>
          <SignatureCanvasComponent // <-- แก้ไขตรงนี้: ใช้ชื่อใหม่
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
        <Button variant='contained' color='secondary' onClick={() => closeDialog(id)} disabled={isSubmitting}>
          {dictionary?.cancel}
        </Button>
        <Button variant='contained' onClick={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? dictionary?.saving : dictionary?.confirm}
        </Button>
      </Grid>
    </Grid>
  )
}

export default ElectonicSignDialog
