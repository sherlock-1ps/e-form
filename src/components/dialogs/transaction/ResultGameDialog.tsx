// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import { Divider, Grid, Typography } from '@mui/material'

interface resultGameType {
  img: string
}

const ResultGameDialog = ({ img }: resultGameType) => {
  return (
    <Grid container className='flex flex-col' spacing={4}>
      <Grid item xs={12}>
        <Typography variant='h5'>Check Result</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <img src={img} alt='resultImg' />
      </Grid>
    </Grid>
  )
}

export default ResultGameDialog
