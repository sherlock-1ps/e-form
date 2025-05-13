// MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Type Imports
import type { ProfileHeaderType } from '@/types/pages/profileTypes'

const UserProfileHeader = ({ data }: { data?: ProfileHeaderType }) => {
  return (
    <Card>
      <CardMedia image={'/images/avatars/moodengImage.png'} className='bs-[250px]' />
      <CardContent className='flex gap-5 justify-center flex-col items-center md:items-end md:flex-row !pt-0 md:justify-start'>
        <div className='flex rounded-bs-md mbs-[-40px] border-[5px] mis-[-5px] border-be-0  border-backgroundPaper bg-backgroundPaper'>
          <img
            height={120}
            width={120}
            src={'/images/avatars/dogeImage.webp'}
            className='rounded'
            alt='Profile Background'
          />
        </div>
        <div className='flex is-full justify-start self-end flex-col items-center gap-6 sm-gap-0 sm:flex-row sm:justify-between sm:items-end '>
          <div className='flex flex-col items-center sm:items-start gap-2'>
            <Typography variant='h4'>XPB ONEPLAYBET</Typography>
            <div className='flex flex-wrap gap-6 justify-center sm:justify-normal'>
              <div className='flex items-center gap-2'>
                <i className='tabler-user-circle' />
                <Typography className='font-medium'>OWNER</Typography>
              </div>
              {/* <div className='flex items-center gap-2'>
                <i className='tabler-map-pin' />
                <Typography className='font-medium'>{data?.location}</Typography>
              </div> */}
              <div className='flex items-center gap-2'>
                <i className='tabler-registered' />
                <Typography className='font-medium'>ลงทะเบียนวันที่ 14/02/2568</Typography>
              </div>
            </div>
          </div>
          {/* <Button variant='contained' className='flex gap-2'>
            <i className='tabler-user-check !text-base'></i>
            <span>Connected</span>
          </Button> */}
        </div>
      </CardContent>
    </Card>
  )
}

export default UserProfileHeader
