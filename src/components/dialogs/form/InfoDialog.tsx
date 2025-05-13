import { Grid, Typography } from '@mui/material'

interface InfoDialogProps {
  content: any
  title: string
}

const InfoDialog = ({ title, content }: InfoDialogProps) => {
  return (
    <Grid container className='flex flex-col' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>{title}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='body2' component='pre' sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
          {typeof content === 'object' ? JSON.stringify(content, null, 2) : content}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default InfoDialog
