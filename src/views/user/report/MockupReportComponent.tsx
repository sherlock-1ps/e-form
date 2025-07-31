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
import DownloadIcon from '@mui/icons-material/Download'
import { useEffect, useState } from 'react'
import { useFetchReportHouseRentQueryOption } from '@/queryOptions/form/formQueryOptions'
import { format } from 'date-fns'
import { useWatchFormStore } from '@/store/useFormScreenEndUserStore'
import { MobileDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/th'
import newAdapter from '@/libs/newAdapter'
import * as XLSX from 'xlsx'

// Original month key for data mapping from API
const monthKey = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

// **แก้ไขที่นี่**: กำหนดเดือนตามปีงบประมาณ (ต.ค. - ก.ย.)
const fiscalMonths = ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.']
const fiscalMonthKeys = ['oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep']

const fiscalFullMonths = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม'
]

const cellStyle = { padding: '4px', border: '1px solid #ccc' }

const MockupReportComponent = ({ onBack }: any) => {
  const setWatchFormTrue = useWatchFormStore(state => state.setWatchFormTrue)
  const setWatchFormFalse = useWatchFormStore(state => state.setWatchFormFalse)
  const [dateStart, setDateStart] = useState<Dayjs | null>(() => dayjs().startOf('year'))
  const [openStartTime, setOpenStartTime] = useState(false)

  const selectedYear = dateStart ? dateStart.year() : dayjs().year()

  // Adjust date range for fiscal year if necessary, e.g., Oct of (year-1) to Sep of (year)
  const start_date = format(new Date(selectedYear - 1, 9, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'") // Start from October of previous year
  const end_date = format(new Date(selectedYear, 8, 30, 23, 59, 59), "yyyy-MM-dd'T'HH:mm:ss'Z'") // End on September of selected year

  const { data: reportData, isPending: pendingReport } = useFetchReportHouseRentQueryOption({
    form_version_id: 47,
    start_date,
    end_date
  })

  const handleChangeStart = (newDate: Dayjs | null) => {
    setDateStart(newDate)
  }

  useEffect(() => {
    setWatchFormTrue()
    return () => setWatchFormFalse()
  }, [setWatchFormTrue, setWatchFormFalse])

  const enrichedData = reportData?.result?.data?.map((person: any) => ({
    ...person,
    data: person.data.map((detail: any) => {
      const createdDate = new Date(detail.created_at)
      // fiscalFullMonths

      // const month = monthKey[createdDate.getMonth()] // Still maps using original keys

      const monthIndex = fiscalFullMonths.indexOf(detail.month)

      const month = monthKey[monthIndex]

      console.log('{ ...detail, month }', { ...detail, month })

      return { ...detail, month }
    })
  }))

  const handleExportExcel = () => {
    if (!enrichedData) return

    // **แก้ไขที่นี่**: ใช้ fiscalMonths สำหรับ header ใน Excel
    const header = [
      'ลำดับ',
      'ชื่อ - สกุล',
      'ตำแหน่งปัจจุบัน',
      'สำนัก',
      'อัตราค่าเช่าบ้าน',
      'เช่าบ้านใหม่',
      ...fiscalMonths,
      'จำนวนครั้งที่เบิก',
      'เบิกจ่ายแล้ว'
    ]

    const dataForExport = enrichedData.map((item: any, index: number) => {
      const totalRent = item.data.reduce((sum: number, detail: any) => {
        const pay = parseFloat((detail.pay || '0').replace(/,/g, ''))
        return sum + (!isNaN(pay) ? pay : 0)
      }, 0)

      const totalPaid = item?.data?.reduce((sum: number, detail: any) => {
        const hasEnd = detail.current_activity_names?.includes('End')
        const hasEnd2 = detail.current_activity_names?.includes('จนท. ลงนามรับเงิน')
        const pay = parseFloat((detail.pay || '0').replace(/,/g, ''))
        return sum + ((hasEnd || hasEnd2) && !isNaN(pay) ? pay : 0)
      }, 0)

      // **แก้ไขที่นี่**: ดึงข้อมูลรายเดือนตามลำดับของ fiscalMonthKeys
      const monthlyData = fiscalMonthKeys.map(key => {
        const monthDataItem = item.data.find((detail: any) => detail.month === key && detail.deka_number)
        return monthDataItem?.deka_number || ''
      })

      return [
        index + 1,
        `${item.f_first_name} ${item.f_last_name}`,
        item.f_position_name,
        item?.department_name,
        totalRent > 0 ? totalRent : '-',
        '-',
        ...monthlyData,
        item.count || '-',
        totalPaid > 0 ? totalPaid : '-'
      ]
    })

    const totalPaidSum = enrichedData
      .reduce((sum: number, person: any) => {
        return (
          sum +
          person.data.reduce((innerSum: number, detail: any) => {
            const hasEnd = detail.current_activity_names?.includes('End')
            const hasEnd2 = detail.current_activity_names?.includes('จนท. ลงนามรับเงิน')
            const pay = parseFloat((detail.pay || '0').replace(/,/g, ''))
            return innerSum + ((hasEnd || hasEnd2) && !isNaN(pay) ? pay : 0)
          }, 0)
        )
      }, 0)
      .toLocaleString()

    const footer = ['รวม', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', totalPaidSum]

    const ws = XLSX.utils.aoa_to_sheet([header, ...dataForExport, footer])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, `รายงานปี ${selectedYear + 543}`)
    XLSX.writeFile(wb, `รายงานการเบิกจ่าย_ปีงบประมาณ_${selectedYear + 543}.xlsx`)
  }

  return (
    <div className=' w-full min-h-screen relative'>
      <div className=' absolute left-0 top-0 z-30'>
        <div className='bg-primaryLight rounded-lg '>
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
          <Grid container spacing={4} alignItems='center'>
            <Grid item xs={4}>
              <div className='w-full'>
                <LocalizationProvider dateAdapter={newAdapter} adapterLocale='th'>
                  <MobileDatePicker
                    open={openStartTime}
                    onClose={() => setOpenStartTime(false)}
                    value={dateStart}
                    onChange={handleChangeStart}
                    views={['year']}
                    openTo='year'
                    format='YYYY'
                    label='เลือกปีงบประมาณ'
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        placeholder: 'เลือกปีงบประมาณ',
                        onClick: () => setOpenStartTime(true)
                      }
                    }}
                  />
                </LocalizationProvider>
              </div>
            </Grid>

            <Grid item xs={4}>
              <Button
                variant='contained'
                color='success'
                onClick={handleExportExcel}
                startIcon={<DownloadIcon />}
                disabled={!enrichedData || enrichedData.length === 0}
              >
                Download Excel
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='h6' fontWeight={600}>
                เลขที่การเบิกจ่าย ปีงบประมาณ {selectedYear + 543}
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
                          อัตราค่าเช่าบ้าน
                        </TableCell>
                        <TableCell rowSpan={2} align='center' sx={{ ...cellStyle, border: '1px solid #000000' }}>
                          เช่าบ้านใหม่
                        </TableCell>
                        {/* **แก้ไขที่นี่**: ปรับ colSpan และ title */}
                        <TableCell
                          colSpan={fiscalMonths.length}
                          align='center'
                          sx={{ ...cellStyle, border: '1px solid #000000' }}
                        >
                          เลขฎีกาเบิกจ่าย ปีงบประมาณ {selectedYear + 543}
                        </TableCell>
                        <TableCell rowSpan={2} align='center' sx={{ ...cellStyle, border: '1px solid #000000' }}>
                          จำนวนครั้งที่เบิก
                        </TableCell>
                        <TableCell rowSpan={2} align='center' sx={{ ...cellStyle, border: '1px solid #000000' }}>
                          เบิกจ่ายแล้ว
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        {/* **แก้ไขที่นี่**: แสดง header เดือนตามปีงบประมาณ */}
                        {fiscalMonths.map((month, i) => (
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
                            {/* **แก้ไขที่นี่**: แสดงข้อมูลตามลำดับเดือนของปีงบประมาณ */}
                            {fiscalMonthKeys.map((key, i) => {
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
                                  const hasEnd2 = detail.current_activity_names?.includes('จนท. ลงนามรับเงิน')
                                  const pay = parseFloat((detail.pay || '0').replace(/,/g, ''))
                                  return sum + ((hasEnd || hasEnd2) && !isNaN(pay) ? pay : 0)
                                }, 0)
                                return total > 0 ? total.toLocaleString() : '-'
                              })()}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      <TableRow>
                        {/* **แก้ไขที่นี่**: ปรับ colSpan ของ footer */}
                        <TableCell
                          colSpan={fiscalMonths.length + 7}
                          align='right'
                          sx={{ fontWeight: 'bold', ...cellStyle }}
                        >
                          รวม
                        </TableCell>
                        <TableCell colSpan={2} align='center' sx={{ fontWeight: 'bold', ...cellStyle }}>
                          {enrichedData
                            ?.reduce((sum: number, person: any) => {
                              return (
                                sum +
                                person.data.reduce((innerSum: number, detail: any) => {
                                  const hasEnd = detail.current_activity_names?.includes('End')
                                  const hasEnd2 = detail.current_activity_names?.includes('จนท. ลงนามรับเงิน')
                                  const pay = parseFloat((detail.pay || '0').replace(/,/g, ''))
                                  return innerSum + ((hasEnd || hasEnd2) && !isNaN(pay) ? pay : 0)
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
