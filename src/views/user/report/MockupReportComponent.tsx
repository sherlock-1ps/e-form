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
import { useEffect, useState } from 'react'
import CustomTextField from '@/@core/components/mui/TextField'
import { useFetchReportMedicalQueryOption } from '@/queryOptions/form/formQueryOptions'
import { format, formatDate, addDays, subDays, setHours, setMinutes } from 'date-fns'
import { useWatchFormStore } from '@/store/useFormScreenEndUserStore'
import { MobileDateTimePicker, LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/th'
import newAdapter from '@/libs/newAdapter'

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

const monthKey = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

const cellStyle = { padding: '4px', border: '1px solid #ccc' }

const MockupReportComponent = ({ onBack }: any) => {
  const setWatchFormTrue = useWatchFormStore(state => state.setWatchFormTrue)
  const setWatchFormFalse = useWatchFormStore(state => state.setWatchFormFalse)
  const [dateStart, setDateStart] = useState<Dayjs | null>(() => dayjs().startOf('year'))
  const [openStartTime, setOpenStartTime] = useState(false)

  const selectedYear = dateStart ? dateStart.year() : dayjs().year()

  const start_date = format(new Date(selectedYear - 1, 2, 13, 0, 0, 0), "yyyy-MM-dd'T'HH:mm:ss'Z'")
  const end_date = format(new Date(selectedYear, 7, 10, 15, 59, 59), "yyyy-MM-dd'T'HH:mm:ss'Z'")

  const { data: reportData, isPending: pendingReport } = useFetchReportMedicalQueryOption({
    form_version_id: 47,
    start_date,
    end_date
  })

  const handleChangeStart = (newDate: Dayjs | null) => {
    setDateStart(newDate)
    if (newDate) {
      const formattedDate = newDate.format('YYYY-MM-DDTHH:mm:ss')
    }
  }

  // **แก้ไขที่นี่**
  useEffect(() => {
    setWatchFormTrue()
    return () => setWatchFormFalse()
  }, [setWatchFormTrue, setWatchFormFalse]) // <-- เพิ่ม dependencies เข้าไป

  const enrichedData = reportData?.result?.data?.map((person: any) => ({
    ...person,
    data: person.data.map((detail: any) => {
      const createdDate = new Date(detail.created_at)
      const month = monthKey[createdDate.getMonth()]
      return { ...detail, month }
    })
  }))

  return (
    <div className=' w-full min-h-screen relative'>
      <div className=' absolute left-0 top-0 z-30'>
        <div className='bg-primaryLight  rounded-lg '>
          <Button
            color='primary'
            variant='contained'
            onClick={() => {
              setWatchFormFalse()
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
            padding: '64px 48px 64px 48px'
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <div className='w-full'>
                <LocalizationProvider dateAdapter={newAdapter} adapterLocale='th'>
                  <MobileDatePicker
                    open={openStartTime}
                    onClose={() => setOpenStartTime(false)}
                    value={dateStart}
                    onChange={handleChangeStart}
                    views={['year']} // ให้เลือกแค่ปี
                    openTo='year' // เปิดที่หน้าปีเลย
                    format='YYYY' // รูปแบบแสดงผล
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        placeholder: 'เลือกปี',
                        label: 'เลือกปี',
                        onClick: () => setOpenStartTime(true),
                        onFocus: () => {},
                        onBlur: () => {},
                        InputLabelProps: {},
                        InputProps: {
                          sx: {
                            '& .MuiInputAdornment-root': {
                              display: 'none'
                            }
                          }
                        }
                      }
                    }}
                  />
                </LocalizationProvider>
              </div>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='h6' fontWeight={600}>
                เลขที่การเบิกจ่าย ปี {selectedYear + 543}
              </Typography>
            </Grid>

            {enrichedData?.length > 0 ? (
              <Grid item xs={12}>
                <TableContainer
                  component={Paper}
                  variant='outlined'
                  sx={{
                    borderRadius: '0px',
                    overflow: 'hidden'
                  }}
                >
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell rowSpan={2} align='center' sx={{ ...cellStyle, border: '1px solid #000000' }}>
                          ลำดับ
                        </TableCell>
                        <TableCell rowSpan={2} sx={{ ...cellStyle, border: '1px solid #000000' }}>
                          ชื่อ - สกุล
                        </TableCell>
                        <TableCell rowSpan={2} sx={{ ...cellStyle, border: '1px solid #000000' }}>
                          ตำแหน่งปัจจุบัน
                        </TableCell>
                        <TableCell rowSpan={2} sx={{ ...cellStyle, border: '1px solid #000000' }}>
                          สำนัก
                        </TableCell>
                        <TableCell rowSpan={2} align='center' sx={{ ...cellStyle, border: '1px solid #000000' }}>
                          เบอร์โทร
                        </TableCell>
                        <TableCell rowSpan={2} align='center' sx={{ ...cellStyle, border: '1px solid #000000' }}>
                          อัตราค่าเช่าบ้าน
                        </TableCell>
                        <TableCell rowSpan={2} align='center' sx={{ ...cellStyle, border: '1px solid #000000' }}>
                          เช่าบ้านใหม่
                        </TableCell>
                        <TableCell colSpan={12} align='center' sx={{ ...cellStyle, border: '1px solid #000000' }}>
                          เลขฎีกาเบิกจ่าย ปี {selectedYear + 543}
                        </TableCell>
                        <TableCell rowSpan={2} align='center' sx={{ ...cellStyle, border: '1px solid #000000' }}>
                          จำนวนครั้งที่เบิก
                        </TableCell>
                        <TableCell rowSpan={2} align='center' sx={{ ...cellStyle, border: '1px solid #000000' }}>
                          เบิกจ่ายแล้ว
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        {months.map((month, i) => (
                          <TableCell key={i} align='center' sx={{ ...cellStyle, border: '1px solid #000000' }}>
                            {month}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {enrichedData?.map((item: any, index: number) => {
                        return (
                          <TableRow key={index}>
                            <TableCell align='center' sx={cellStyle}>
                              {index + 1}
                            </TableCell>
                            <TableCell sx={cellStyle}>
                              {item.f_first_name} {item.f_last_name}
                            </TableCell>
                            <TableCell sx={cellStyle}>{item.f_position_name}</TableCell>
                            <TableCell sx={cellStyle}>{item?.department_name}</TableCell>
                            <TableCell align='center' sx={cellStyle}>
                              {item.tel}
                            </TableCell>
                            <TableCell align='center' sx={cellStyle}>
                              {(() => {
                                const totalRent = item.data.reduce((sum: number, detail: any) => {
                                  const pay = parseFloat((detail.pay || '0').replace(/,/g, ''))
                                  return sum + (!isNaN(pay) ? pay : 0)
                                }, 0)
                                return totalRent > 0 ? totalRent.toLocaleString() : '-'
                              })()}
                            </TableCell>
                            <TableCell align='center' sx={cellStyle}>
                              -
                            </TableCell>

                            {months.map((month, i) => {
                              const key = monthKey[i]
                              const monthData = item.data.find((detail: any) => {
                                return detail.month === key && detail.deka_number
                              })

                              return (
                                <TableCell key={i} align='center' sx={cellStyle}>
                                  {monthData?.deka_number || ''}
                                </TableCell>
                              )
                            })}

                            <TableCell align='center' sx={cellStyle}>
                              {item.count || '-'}
                            </TableCell>
                            <TableCell align='center' sx={cellStyle}>
                              {(() => {
                                const total = item?.data?.reduce((sum: number, detail: any) => {
                                  const hasEnd = detail.current_activity_names?.includes('End')
                                  const pay = parseFloat((detail.pay || '0').replace(/,/g, ''))
                                  return sum + (hasEnd && !isNaN(pay) ? pay : 0)
                                }, 0)

                                return total > 0 ? total.toLocaleString() : '-'
                              })()}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      <TableRow>
                        <TableCell colSpan={months.length + 8} align='right' sx={{ fontWeight: 'bold', ...cellStyle }}>
                          รวม
                        </TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', ...cellStyle }}>
                          {enrichedData
                            ?.reduce((sum: number, person: any) => {
                              return (
                                sum +
                                person.data.reduce((innerSum: number, detail: any) => {
                                  const hasEnd = detail.current_activity_names?.includes('End')
                                  const pay = parseFloat((detail.pay || '0').replace(/,/g, ''))
                                  return innerSum + (hasEnd && !isNaN(pay) ? pay : 0)
                                }, 0)
                              )
                            }, 0)
                            .toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Typography>ไม่พบรายการ</Typography>
              </Grid>
            )}
          </Grid>
        </div>
      </div>
    </div>
  )
}

export default MockupReportComponent
