import { Grid, Typography } from '@mui/material'

interface ShowImageDialogProps {
  data: any
}

const ShowImageDialog = ({ data }: ShowImageDialogProps) => {
  const isImage = data?.media_type?.includes('image')
  const isVideo = data?.media_type?.includes('video')

  return (
    <Grid container className='max-w-[750px]'>
      <Grid item xs={12}>
        {isImage && <img src={data?.url_file_download} alt='preview' className='w-full rounded mb-4 object-contain' />}
        {isVideo && (
          <video controls src={data?.url_file_download} className='w-full rounded mb-4 object-contain'>
            Your browser does not support the video tag.
          </video>
        )}
        {!isImage && !isVideo && (
          <Typography variant='body2' className='text-center'>
            ไม่สามารถแสดงไฟล์ประเภทนี้ได้
          </Typography>
        )}
      </Grid>
    </Grid>
  )
}

export default ShowImageDialog
