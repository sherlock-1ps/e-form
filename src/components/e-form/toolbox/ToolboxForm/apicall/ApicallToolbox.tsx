import { useApiCallStore } from '@/store/useApiCallStore'
import { Button, Chip, Grid, Typography } from '@mui/material'
const ApicallToolbox = () => {
  const { apiLists, selectedApi, setSelectedApi } = useApiCallStore()

  console.log('apiLists', apiLists)

  console.log('selectedApi', selectedApi)

  return (
    <Grid container>
      <Grid item xs={12} className='mb-2'>
        <Typography variant='h5'>จัดการ API</Typography>
      </Grid>
      <Grid item xs={12} className='mb-2'>
        <Button variant='outlined' onClick={() => setSelectedApi(null)}>
          ดูทั้งหมด
        </Button>
      </Grid>
      {apiLists &&
        apiLists.map((item, index) => {
          const isSelected = selectedApi?.url === item.url

          return (
            <Grid item xs={12} className='mb-2' key={index}>
              <Button
                variant='outlined'
                className={`w-full p-2 rounded-lg flex gap-1 items-center justify-between ${
                  isSelected ? ' bg-primaryLight' : ''
                }`}
                onClick={() => setSelectedApi(item)}
              >
                <div className='flex flex-col gap-2 flex-1 items-start'>
                  <Typography
                    variant='h6'
                    className='max-w-[130px]'
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant='body2'
                    className='max-w-[130px]'
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item.url}
                  </Typography>
                </div>
                <Chip label={item.method} color='success' size='small' variant='tonal' />
              </Button>
            </Grid>
          )
        })}
    </Grid>
  )
}

export default ApicallToolbox
