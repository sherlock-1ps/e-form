'use client'
import { Card, CardContent, Grid, Typography } from '@mui/material'

const CardNotFoundData = ({ name }: { name: string }) => {
  return (
    <Card className='min-h-40 h-full'>
      <CardContent className='h-full'>
        <Grid container alignItems='center' justifyContent='center' className='h-full'>
          <Grid item>
            <Typography variant='h6' textAlign='center'>
              {`Not found ${name}`}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CardNotFoundData
