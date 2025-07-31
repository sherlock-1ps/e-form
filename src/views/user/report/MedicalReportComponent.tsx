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
import { useFetchReportMedicalQueryOption } from '@/queryOptions/form/formQueryOptions'
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

const padZero = (num: any) => {
  return String(num).toString().padStart(2, '0')
}

const MockupReportComponent = ({ onBack }: any) => {
  const setWatchFormTrue = useWatchFormStore(state => state.setWatchFormTrue)
  const setWatchFormFalse = useWatchFormStore(state => state.setWatchFormFalse)
  const [dateStart, setDateStart] = useState<Dayjs | null>(() => dayjs().startOf('year'))
  const [openStartTime, setOpenStartTime] = useState(false)

  const selectedYear = dateStart ? dateStart.year() : dayjs().year()

  // Adjust date range for fiscal year: Oct of (year-1) to Sep of (year)
  const start_date = format(new Date(selectedYear - 1, 9, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'") // Start from October 1st of the previous year
  const end_date = format(new Date(selectedYear, 8, 30, 23, 59, 59), "yyyy-MM-dd'T'HH:mm:ss'Z'") // End on September 30th of the selected year

  const { data: medicalData, isPending: pendingReport } = useFetchReportMedicalQueryOption({
    start_date,
    end_date
  })

  // // Helper function to convert school type from code to text
  const convertValueStringArrayToType = (raw: any) => {
    try {
      if (raw == '1') return 'Normal'
      else if (raw == '2') return 'Electronic'

      return ''
    } catch (e) {
      return '' // Return empty string if parsing fails
    }
  }

  // Enrich the raw data with converted school types
  const enrichedData = medicalData?.result?.data?.map((item: any) => {
    // billType

    return { ...item }
  })

  const handleChangeStart = (newDate: Dayjs | null) => {
    setDateStart(newDate)
  }

  // Function to handle the Excel export
  const handleExportExcel = () => {
    if (!enrichedData || enrichedData.length === 0) {
      alert('ไม่มีข้อมูลสำหรับส่งออก') // Alert in Thai: "No data to export"
      return
    }

    const thaiYear = selectedYear + 543
    const excelData: any[][] = []

    // 1. Add Title and a blank row for spacing
    excelData.push([`รายงานเบิกจ่ายเงินสวัสดิการเกี่ยวกับค่ารักษาพยาบาล ปีงบประมาณ ${thaiYear}`])
    excelData.push([])

    // 2. Add Header Row
    const headers = [
      'ลำดับที่',
      'วันที่เข้าทำการรักษา',
      'สถานพยาบาล',
      'ชื่อ-นามสกุล ผู้ป่วย',
      'ประเภทใบเสร็จ',
      'เลขที่ใบเสร็จ',
      'วันที่ในใบเสร็จ',
      'จำนวนเงิน (บาท)',
      'ยอดเงินตามใบเสร็จรับเงิน'
    ]
    excelData.push(headers)

    // 3. Flatten and Add Data Rows
    let runningTotal = 0
    let seq = 1
    enrichedData.forEach((item: any) => {
      const diagnosisDate = item.diagnosis_start_date ? formatThaiDate(item.diagnosis_start_date, false) : '-'
      const hospital = item.hospital || '-'
      const patientName = `${item.f_first_name || ''} ${item.f_last_name || ''}`.trim()
      const bills = []

      for (let i = 1; i <= 20; i++) {
        const billNoKey = `bill_no${padZero(i)}`
        if (item[billNoKey] && item[billNoKey] !== '') {
          bills.push({
            type: convertValueStringArrayToType(item[`bill_type${padZero(i)}`]),
            no: item[billNoKey],
            date: item[`bill_date${padZero(i)}`] ? formatThaiDate(item[`bill_date${padZero(i)}`], false) : '-',
            amount: parseFloat(item[`bill_count${padZero(i)}`]) || 0
          })
        }
      }

      if (bills.length > 0) {
        bills.forEach(bill => {
          excelData.push([
            seq++,
            diagnosisDate,
            hospital,
            patientName,
            bill.type,
            bill.no,
            bill.date,
            formatNumber(bill.amount || 0),
            formatNumber(item.diagnosis_price)
          ])
          runningTotal += bill.amount
        })
      } else {
        // Handle claims with no individual bill details but a total amount
        const totalAmount = parseFloat(item.diagnosis_price) || 0
        excelData.push([seq++, diagnosisDate, hospital, patientName, '-', '-', '-', totalAmount])
        runningTotal += totalAmount
      }
    })

    // // 4. Add Total Rows
    // excelData.push(['', '', '', '', '', '', 'รวมทั้งสิ้น', runningTotal])
    // excelData.push(['', '', '', '', '', '', '(ตัวอักษร)', `(${numberToThaiText(runningTotal)})`])

    // 5. Create worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet(excelData)

    // Merge the title cell to span across all columns
    if (ws) {
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }]
    }

    // Set column widths for better readability
    ws['!cols'] = [
      { wch: 8 }, // A: ลำดับที่
      { wch: 20 }, // B: วันที่เข้าทำการรักษา
      { wch: 30 }, // C: สถานพยาบาล
      { wch: 30 }, // D: ชื่อ-นามสกุล ผู้ป่วย
      { wch: 15 }, // E: ประเภทใบเสร็จ
      { wch: 20 }, // F: เลขที่ใบเสร็จ
      { wch: 20 }, // G: วันที่ในใบเสร็จ
      { wch: 20 }, // H: จำนวนเงิน (บาท)
      { wch: 20 } // H: จำนวนเงิน (บาท)
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'รายงานค่ารักษาพยาบาล')

    // 6. Generate filename and trigger download
    const fileName = `รายงานค่ารักษาพยาบาล_ปีงบประมาณ${thaiYear}.xlsx`
    XLSX.writeFile(wb, fileName)
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
              <Button variant='contained' color='success' onClick={handleExportExcel} startIcon={<DownloadIcon />}>
                Download Excel
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='h6' fontWeight={600}>
                รายงานเบิกจ่ายเงินสวัสดิการเกี่ยวกับค่ารักษาพยาบาล ปีงบประมาณ {selectedYear + 543}
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
                        <TableCell sx={{ ...cellStyle, border: '1px solid #000000' }}>ลำดับที่</TableCell>
                        <TableCell sx={{ ...cellStyle, border: '1px solid #000000' }}>วันที่เข้าทำการรักษา</TableCell>
                        <TableCell sx={{ ...cellStyle, border: '1px solid #000000' }}>สถานพยาบาล</TableCell>
                        <TableCell sx={{ ...cellStyle, border: '1px solid #000000' }}>ชื่อ-นามสกุล ผู้ป่วย</TableCell>
                        <TableCell sx={{ ...cellStyle, border: '1px solid #000000' }}>ใบเสร็จรับเงิน</TableCell>
                        <TableCell sx={{ ...cellStyle, border: '1px solid #000000' }}>
                          ยอดเงินตามใบเสร็จรับเงิน
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {enrichedData?.map((item: any, index: number) => {
                        return (
                          <TableRow key={index}>
                            <TableCell sx={{ textAlign: 'center' }}>{index + 1}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {formatThaiDate(item.diagnosis_start_date, false)}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{item.hospital}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {item.f_first_name} {item.f_last_name}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {Array.from({ length: 20 }).map((_, indexItem) =>
                                item['bill_no' + padZero(indexItem + 1)] != '' ? (
                                  <Box
                                    key={'box-' + indexItem}
                                    sx={{
                                      height: 100,
                                      textAlign: 'left'
                                    }}
                                  >
                                    <Box>
                                      ประเภทใบเสร็จ :{' '}
                                      {convertValueStringArrayToType(item['bill_type' + padZero(indexItem + 1)])}{' '}
                                    </Box>
                                    <Box>เลขที่ : {item['bill_no' + padZero(indexItem + 1)]}</Box>
                                    <Box>
                                      วันที่ : {formatThaiDate(item['bill_date' + padZero(indexItem + 1)], false)}{' '}
                                    </Box>
                                    <Box>จำนวน : {item['bill_count' + padZero(indexItem + 1)]} </Box>
                                  </Box>
                                ) : null
                              )}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{formatNumber(item.diagnosis_price)}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{item.term}</TableCell>
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
