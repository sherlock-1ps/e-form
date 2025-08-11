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
  Paper,
  Box
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DownloadIcon from '@mui/icons-material/Download'
import { useEffect, useState } from 'react'
import { useFetchReportEducationQueryOption } from '@/queryOptions/form/formQueryOptions'
import { format } from 'date-fns'
import { useWatchFormStore } from '@/store/useFormScreenEndUserStore'
import { MobileDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/th'
import newAdapter from '@/libs/newAdapter'
import * as XLSX from 'xlsx'
import { formatThaiDate } from '@/utils/formatDateTime'
import { numberToThaiText, formatNumber } from '@/utils/numberFormat'

const cellStyle = { padding: '4px', border: '1px solid #ccc', textAlign: 'center' }
const cellStyleLeft = { padding: '4px', border: '1px solid #ccc' }

const MockupReportComponent = ({ onBack }: any) => {
  const setWatchFormTrue = useWatchFormStore(state => state.setWatchFormTrue)
  const setWatchFormFalse = useWatchFormStore(state => state.setWatchFormFalse)
  const [dateStart, setDateStart] = useState<Dayjs | null>(() => dayjs().startOf('year'))
  const [openStartTime, setOpenStartTime] = useState(false)

  const selectedYear = dateStart ? dateStart.year() : dayjs().year()

  // Adjust date range for fiscal year: Oct of (year-1) to Sep of (year)
  const start_date = format(new Date(selectedYear - 1, 9, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'") // Start from October 1st of the previous year
  const end_date = format(new Date(selectedYear, 8, 30, 23, 59, 59), "yyyy-MM-dd'T'HH:mm:ss'Z'") // End on September 30th of the selected year

  const { data: educationData, isPending: pendingReport } = useFetchReportEducationQueryOption({
    start_date,
    end_date
  })

  // Helper function to convert school type from code to text
  const convertValueStringArrayToType = (raw: any) => {
    try {
      if (raw == '1') return 'ราชการ'
      else if (raw == '2') return 'เอกชน รับเงินอุดหนุน'
      else if (raw == '3') return 'เอกชน ไม่รับเงินอุดหนุน'

      return ''
    } catch (e) {
      return '' // Return empty string if parsing fails
    }
  }

  // Enrich the raw data with converted school types
  const enrichedData = educationData?.result?.data?.map((item: any) => {
    const child1_school_type = convertValueStringArrayToType(item.child1_school_type)
    const child2_school_type = convertValueStringArrayToType(item.child2_school_type)
    const child3_school_type = convertValueStringArrayToType(item.child3_school_type)

    return { ...item, child1_school_type, child2_school_type, child3_school_type }
  })

  const handleChangeStart = (newDate: Dayjs | null) => {
    setDateStart(newDate)
  }

  // Function to handle the Excel export
  const handleExportToExcel = () => {
    if (!enrichedData || enrichedData.length === 0) {
      alert('ไม่มีข้อมูลสำหรับส่งออก')
      return
    }

    // Flatten the data so each child has its own row
    const flattenedData: any[] = []
    enrichedData.forEach((item: any) => {
      const parentName = `${item.f_full_name_th}`

      if (item.child1_name) {
        flattenedData.push({
          'ชื่อ-สกุล ผู้มีสิทธิ': parentName,
          บุตร: item.child1_name,
          สถานศึกษา: item.child1_school,
          ประเภทสถานศึกษา: item.child1_school_type,
          วันเกิดบุตร: formatThaiDate(item.child1_birthday, false),
          เลขที่ใบเสร็จรับเงิน: item.child1_bill_no,
          จำนวนตามใบเสร็จรับเงิน: item.child1_bill_price,
          จำนวนเงินที่เบิก: item.withdraw_total, // Assuming withdrawn amount is the same as bill price
          ภาคเรียนที่: item.term
        })
      }
      if (item.child2_name) {
        flattenedData.push({
          'ชื่อ-สกุล ผู้มีสิทธิ': parentName,
          บุตร: item.child2_name,
          สถานศึกษา: item.child2_school,
          ประเภทสถานศึกษา: item.child2_school_type,
          วันเกิดบุตร: formatThaiDate(item.child2_birthday, false),
          เลขที่ใบเสร็จรับเงิน: item.child2_bill_no,
          จำนวนตามใบเสร็จรับเงิน: item.child2_bill_price,
          จำนวนเงินที่เบิก: item.withdraw_total,
          ภาคเรียนที่: item.term
        })
      }
      if (item.child3_name) {
        flattenedData.push({
          'ชื่อ-สกุล ผู้มีสิทธิ': parentName,
          บุตร: item.child3_name,
          สถานศึกษา: item.child3_school,
          ประเภทสถานศึกษา: item.child3_school_type,
          วันเกิดบุตร: formatThaiDate(item.child3_birthday, false),
          เลขที่ใบเสร็จรับเงิน: item.child3_bill_no,
          จำนวนตามใบเสร็จรับเงิน: item.child3_bill_price,
          จำนวนเงินที่เบิก: item.withdraw_total,
          ภาคเรียนที่: item.term
        })
      }
    })

    // Create a new worksheet from the flattened data
    const ws = XLSX.utils.json_to_sheet(flattenedData)

    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'รายงานค่าการศึกษาบุตร')

    // Write the workbook and trigger the download
    XLSX.writeFile(wb, `รายงานค่าการศึกษาบุตร_${selectedYear + 543}.xlsx`)
  }

  useEffect(() => {
    setWatchFormTrue()
    return () => setWatchFormFalse()
  }, [setWatchFormTrue, setWatchFormFalse])

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
              <Button variant='contained' color='success' onClick={handleExportToExcel} startIcon={<DownloadIcon />}>
                Download Excel
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='h6' fontWeight={600}>
                รายงานเบิกจ่ายเงินสวัสดิการเกี่ยวกับค่าการศึกษาบุตร ปีงบประมาณ {selectedYear + 543}
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
                        <TableCell sx={{ ...cellStyle, border: '1px solid #000000' }}>
                          ชื่อ-สกุล ผู้มีสิทธิ/บุตร/สถานศึกษา
                        </TableCell>
                        <TableCell sx={{ ...cellStyle, border: '1px solid #000000' }}>วันเกิดบุตร</TableCell>
                        <TableCell sx={{ ...cellStyle, border: '1px solid #000000' }}>เลขที่ใบเสร็จรับเงิน</TableCell>
                        <TableCell sx={{ ...cellStyle, border: '1px solid #000000' }}>จำนวนตามใบเสร็จรับเงิน</TableCell>
                        <TableCell sx={{ ...cellStyle, border: '1px solid #000000' }}>จำนวนเงินที่เบิก</TableCell>
                        <TableCell sx={{ ...cellStyle, border: '1px solid #000000' }}>ภาคเรียนที่</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {enrichedData?.map((item: any, index: number) => {
                        // Note: There's a bug here where child1_name is checked for all three child blocks.
                        // This should be corrected to check child2_name and child3_name respectively.
                        return (
                          <TableRow key={index}>
                            <TableCell sx={cellStyleLeft}>
                              <Box sx={{ height: 25 }}>
                                <b>{item.f_full_name_th}</b>
                              </Box>

                              {String(item.child1_name) != '' ? (
                                <Box sx={{ height: 80 }}>
                                  <Box>บุตรลำดับที่ 1 {item.child1_name} </Box>
                                  <Box>สถานศึกษา : {item.child1_school} </Box>
                                  <Box>ประเภท : {item.child1_school_type} </Box>
                                </Box>
                              ) : null}

                              {String(item.child2_name) != '' ? (
                                <Box sx={{ height: 80 }}>
                                  <Box>บุตรลำดับที่ 2 {item.child2_name} </Box>
                                  <Box>สถานศึกษา : {item.child2_school} </Box>
                                  <Box>ประเภท : {item.child2_school_type} </Box>
                                </Box>
                              ) : null}

                              {String(item.child3_name) != '' ? (
                                <Box sx={{ height: 80 }}>
                                  <Box>บุตรลำดับที่ 3 {item.child3_name} </Box>
                                  <Box>สถานศึกษา : {item.child3_school} </Box>
                                  <Box>ประเภท : {item.child3_school_type} </Box>
                                </Box>
                              ) : null}
                            </TableCell>
                            <TableCell sx={cellStyle}>
                              <Box sx={{ height: 25 }}> </Box>
                              {String(item.child1_name) != '' ? (
                                <Box sx={{ height: 80 }}> {formatThaiDate(item.child1_birthday, false)}</Box>
                              ) : null}
                              {String(item.child2_name) != '' ? (
                                <Box sx={{ height: 80 }}> {formatThaiDate(item.child2_birthday, false)}</Box>
                              ) : null}
                              {String(item.child3_name) != '' ? (
                                <Box sx={{ height: 80 }}> {formatThaiDate(item.child3_birthday, false)}</Box>
                              ) : null}
                            </TableCell>
                            <TableCell sx={cellStyle}>
                              <Box sx={{ height: 25 }}> </Box>
                              {String(item.child1_name) != '' ? (
                                <Box sx={{ height: 80 }}> {item.child1_bill_no}</Box>
                              ) : null}
                              {String(item.child2_name) != '' ? (
                                <Box sx={{ height: 80 }}> {item.child2_bill_no}</Box>
                              ) : null}
                              {String(item.child3_name) != '' ? (
                                <Box sx={{ height: 80 }}> {item.child3_bill_no}</Box>
                              ) : null}
                            </TableCell>
                            <TableCell sx={cellStyle}>
                              <Box sx={{ height: 25 }}> </Box>
                              {String(item.child1_name) != '' ? (
                                <Box sx={{ height: 80 }}> {formatNumber(item.child1_bill_price)}</Box>
                              ) : null}
                              {String(item.child2_name) != '' ? (
                                <Box sx={{ height: 80 }}> {formatNumber(item.child2_bill_price)}</Box>
                              ) : null}
                              {String(item.child3_name) != '' ? (
                                <Box sx={{ height: 80 }}> {formatNumber(item.child3_bill_price)}</Box>
                              ) : null}
                            </TableCell>

                            <TableCell sx={cellStyle}>
                              <Box sx={{ height: 25 }}> </Box>
                              {String(item.child1_name) != '' ? (
                                <Box sx={{ height: 80 }}> {formatNumber(item.withdraw_total)}</Box>
                              ) : null}
                              {String(item.child2_name) != '' ? (
                                <Box sx={{ height: 80 }}> {formatNumber(item.withdraw_total)}</Box>
                              ) : null}
                              {String(item.child3_name) != '' ? (
                                <Box sx={{ height: 80 }}> {formatNumber(item.withdraw_total)}</Box>
                              ) : null}
                            </TableCell>

                            <TableCell sx={{ textAlign: 'center' }}>
                              <Box sx={{ height: 25 }}> </Box>
                              <Box sx={{ height: 80 }}> {item.term}</Box>
                            </TableCell>
                          </TableRow>
                        )
                      })}
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
