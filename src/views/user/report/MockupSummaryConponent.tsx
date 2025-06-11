import { formSizeConfig } from '@/configs/formSizeConfig'
import {
  Button,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { forwardRef, useState } from 'react'
import { formatDate } from 'date-fns'
import CustomTextField from '@/@core/components/mui/TextField'
import type { TextFieldProps } from '@mui/material/TextField'

const layout = 'vertical'
type CustomInputProps = TextFieldProps & {
  label?: string
  end: Date | number
  start: Date | number
}

const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  // Vars
  const startDate = props.start !== null ? formatDate(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${formatDate(props.end, 'MM/dd/yyyy')}` : null
  const value = `${startDate}${endDate !== null ? endDate : ''}`

  return <CustomTextField fullWidth inputRef={ref} label={props.label || ''} {...props} value={value} />
})

const MockupSummaryConponent = ({ onBack }: any) => {
  const [date, setDate] = useState<Date | undefined | null>(null)
  const rows = [
    '1.1 การรับส่งเอกสาร ถูกต้องและรวดเร็ว',
    '1.2 ความรอบรู้ในการติดต่อประสานงาน',
    '1.3 การนัดหมายการประชุมให้ผู้บริหาร/หน่วยงานภายในกรม',
    '1.4 การอำนวยความสะดวกให้กับหน่วยงานภายในกรม',
    '1.5 มารยาทในการติดต่อประสานงาน',
    '1.6 การแก้ไขปัญหาเฉพาะหน้าในเรื่องต่างๆ',
    '1.7 ภาพรวมการให้บริการ'
  ]

  const departmentData = [
    {
      department_name: 'ศูนย์สารสนเทศการเจรจาการค้าระหว่างประเทศ',
      count: 4
    }
  ]

  return (
    <div className=' w-full min-h-screen relative'>
      <div className=' absolute left-0 top-0'>
        <div className='bg-primaryLight  rounded-lg'>
          <Button
            color='primary'
            variant='contained'
            onClick={() => {
              onBack()
            }}
            startIcon={<ArrowBackIcon />}
          >
            ย้อนกลับ
          </Button>
        </div>
      </div>
      <div className='flex flex-1 items-center justify-center'>
        <div
          style={{
            width: layout === 'vertical' ? `${formSizeConfig.width}px` : `${formSizeConfig.height}px`,
            height: `auto`,
            minHeight: layout === 'vertical' ? `${formSizeConfig.height}px` : `${formSizeConfig.width}px`,
            position: 'relative',
            boxShadow: '0px 2px 8px 0px #11151A14',
            backgroundColor: 'white',
            padding: '64px'
          }}
        >
          <Grid container spacing={2}>
            {/* หัวข้อ */}
            <Grid item xs={4}>
              <AppReactDatepicker
                selected={date}
                dateFormat='dd/MM/yyyy'
                onChange={(date: Date | null) => setDate(date)}
                customInput={<CustomTextField label='เลือกวันที่' fullWidth />}
              />
            </Grid>

            <Grid item xs={12} className='my-4'>
              <Typography variant='h6' gutterBottom>
                จำนวนหนังสือตามหน่วยงาน
              </Typography>
              <TableContainer
                component={Paper}
                variant='outlined'
                sx={{
                  borderRadius: '0px',
                  overflow: 'hidden'
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ border: '1px solid #000000' }}>หน่วยงาน</TableCell>
                      <TableCell align='right' sx={{ border: '1px solid #000000' }}>
                        จำนวน
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {departmentData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ border: '1px solid #000000' }}>{item.department_name}</TableCell>
                        <TableCell align='right' sx={{ border: '1px solid #000000' }}>
                          {item.count}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6' fontWeight={600}>
                1. นางสาววทันยา สัตยวณิช (แวว)
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                (หน้าห้องอธิบดีฯ โชติมา)
              </Typography>
            </Grid>

            {/* ตาราง */}
            <Grid item xs={12}>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  border: '1px solid #000000',
                  borderRadius: '0px',
                  overflow: 'hidden'
                }}
              >
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        rowSpan={2}
                        sx={{ fontWeight: 'bold', borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}
                      >
                        หัวข้อการประเมิน
                      </TableCell>
                      <TableCell
                        colSpan={5}
                        align='center'
                        sx={{ fontWeight: 'bold', borderBottom: '1px solid #000000' }}
                      >
                        ครั้งที่ถูกคะแนนที่ถูกมอบให้
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align='center' sx={{ fontWeight: 'bold', borderBottom: '1px solid #000000' }}>
                        คะแนนรวม
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((text, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ borderRight: '1px solid #f0f0f0' }}>{text}</TableCell>
                        {[10].map((score, i) => (
                          <TableCell key={i} align='center'>
                            {score}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    {/* รวม */}
                    <TableRow>
                      <TableCell align='center' sx={{ fontWeight: 'bold' }}>
                        รวม
                      </TableCell>
                      <TableCell align='center' sx={{ fontWeight: 'bold' }}>
                        70
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  )
}

export default MockupSummaryConponent
