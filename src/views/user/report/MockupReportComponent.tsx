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
import { useState } from 'react'
import CustomTextField from '@/@core/components/mui/TextField'
import { useFetchReportMedicalQueryOption } from '@/queryOptions/form/formQueryOptions'
import { format, formatDate } from 'date-fns'

const houseData = [
  {
    no: 1,
    name: 'นางปนรรดา คุวามนต์',
    position: 'นว.คค.ชก.',
    org: 'พพ.',
    tel: '7817',
    rent: 6000,
    note: '',
    jan: '5,000',
    count: 1,
    paid: '5,000'
  },
  {
    no: 2,
    name: 'นางสาวอัจฉลา เย็นบุตร',
    position: 'นว.คค.ปก.',
    org: 'อย.',
    tel: '7373',
    rent: 5000
  },
  {
    no: 3,
    name: 'นางสาวณัฐณิชา ตันสกุล',
    position: 'นว.คค.ชก.',
    org: 'อย.',
    tel: '7466',
    rent: 5000,
    note: 'ฏฐ435'
  },
  {
    no: 14,
    name: 'นางสาวหมือนฝัน รอบคอบ',
    position: 'นว.คค.ชพ.',
    org: 'อบ.',
    tel: '7661',
    rent: 6000,
    count: '',
    paid: '9,000'
  }
]

const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']

const MockupReportComponent = ({ onBack }: any) => {
  const [year, setYear] = useState<Date | undefined | null>(new Date())

  const selectedYear = year ? year.getFullYear() : new Date().getFullYear()

  const start_date = format(new Date(selectedYear - 1, 2, 13, 0, 0, 0), "yyyy-MM-dd'T'HH:mm:ss'Z'")
  const end_date = format(new Date(selectedYear, 7, 10, 15, 59, 59), "yyyy-MM-dd'T'HH:mm:ss'Z'")

  const { data: reportData, isPending: pendingReport } = useFetchReportMedicalQueryOption({
    form_version_id: 54,
    start_date,
    end_date
  })

  return (
    <div className=' w-full min-h-screen relative'>
      <div className=' absolute left-0 top-0 z-30'>
        <div className='bg-primaryLight  rounded-lg '>
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
            width: `${formSizeConfig.height}px`,
            height: `auto`,
            minHeight: `${formSizeConfig.width}px`,
            position: 'relative',
            boxShadow: '0px 2px 8px 0px #11151A14',
            backgroundColor: 'white',
            padding: '64px'
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <AppReactDatepicker
                selected={year}
                showYearPicker
                dateFormat='yyyy'
                onChange={(date: Date | null) => setYear(date)}
                customInput={<CustomTextField label='เลือกปี' fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6' fontWeight={600}>
                เลขที่การเบิกจ่าย ปี 2568
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper} sx={{ border: '1px solid #ccc' }}>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell align='center'>ลำดับ</TableCell>
                      <TableCell>ชื่อ - สกุล</TableCell>
                      <TableCell>ตำแหน่งปัจจุบัน</TableCell>
                      <TableCell>สำนัก</TableCell>
                      <TableCell align='center'>เบอร์โทร</TableCell>
                      <TableCell align='center'>อัตราค่าเช่าบ้าน</TableCell>
                      <TableCell align='center'>เช่าบ้านใหม่</TableCell>
                      {months.map((m, i) => (
                        <TableCell key={i} align='center'>
                          {m}
                        </TableCell>
                      ))}
                      <TableCell align='center'>จำนวนครั้งที่เบิก</TableCell>
                      <TableCell align='center'>เบิกจ่ายแล้ว</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {houseData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell align='center'>{item.no}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.position}</TableCell>
                        <TableCell>{item.org}</TableCell>
                        <TableCell align='center'>{item.tel}</TableCell>
                        <TableCell align='center'>{item.rent?.toLocaleString()}</TableCell>
                        <TableCell align='center'>{item.note || '-'}</TableCell>
                        {months.map((_, i) => (
                          <TableCell key={i} align='center'>
                            {i === 0 && item.jan ? item.jan : ''}
                          </TableCell>
                        ))}
                        <TableCell align='center'>{item.count || '-'}</TableCell>
                        <TableCell align='center'>{item.paid || '-'}</TableCell>
                      </TableRow>
                    ))}
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

export default MockupReportComponent
