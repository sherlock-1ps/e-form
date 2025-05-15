import { Grid, Typography } from '@mui/material'

interface ShowImageDialogProps {
  image: any
}

const ShowImageDialog = ({ image }: ShowImageDialogProps) => {
  return (
    <Grid container className='max-w-[750px] '>
      <Grid item xs={12}>
        <img src={image} alt='preview' className='w-full rounded mb-4 object-contain' />
      </Grid>
    </Grid>
  )
}

export default ShowImageDialog
