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
import { useDictionary } from '@/contexts/DictionaryContext'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DownloadIcon from '@mui/icons-material/Download'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import * as XLSX from 'xlsx'

import { useFetchReportScoreQueryOption, useFetchGetFormQueryOption } from '@/queryOptions/form/formQueryOptions'

// import { getForm } from '@/app/sevices/form/formServices'

import { MobileDateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/th'
import newAdapter from '@/libs/newAdapter'

const layout = 'vertical'

const MockupSummaryConponent = ({ onBack }: any) => {
  const [usersSelected, setUsersSelected] = useState<any[]>([])

  // async function loadFormDetail() {
  //   const res = await getForm({ id: 54 })
  //   const formDetail = res?.result?.data || {}
  //   function getValuesByIds(ids) {
  //     const result = []
  //     formDetail.FormDetails.forEach(form => {
  //       form.detail.data.forEach(dataGroup => {
  //         dataGroup.fields.forEach(field => {
  //           if (field.data && field.data.length > 0) {
  //             field.data.forEach(dataItem => {
  //               if (ids.includes(dataItem.id)) {
  //                 if (dataItem.config && dataItem.config.details && dataItem.config.details.value) {
  //                   result.push({ title: dataItem.config.details.value.value, subTitle: '' })
  //                 }
  //               }
  //             })
  //           }
  //         })
  //       })
  //     })
  //     return result
  //   }

  //   const paramIds = ['name1', 'name2', 'name3', 'name4', 'name5', 'name6']
  //   const values = getValuesByIds(paramIds)
  //   setUsersSelected(values || [])
  // }
  // useEffect(() => {
  //   loadFormDetail()
  // }, [])

  const [dateStart, setDateStart] = useState<Dayjs | null>(() => dayjs().subtract(10, 'day'))
  const [dateEnd, setDateEnd] = useState<Dayjs | null>(() => dayjs())
  const [openStartTime, setOpenStartTime] = useState(false)
  const [openEndTime, setOpenEndTime] = useState(false)
  const { dictionary } = useDictionary()

  const formatToISOStringNoMs = (date: Date) => {
    return date.toISOString().split('.')[0] + 'Z'
  }

  const start_date = dateStart ? formatToISOStringNoMs(dateStart.toDate()) : ''
  const end_date = dateEnd ? formatToISOStringNoMs(dateEnd.toDate()) : ''

  const { data: reportData, isPending: pendingReport } = useFetchReportScoreQueryOption({
    form_version_id: 54,
    start_date,
    end_date
  })

  const { data: getForm, isPending: pendingform } = useFetchGetFormQueryOption({ id: 54 })

  const formDetail = getForm?.result?.data || {}

  function getValuesByIds(ids: any) {
    const result: any = []
    formDetail?.FormDetails?.forEach((form: any) => {
      form?.detail?.data.forEach((dataGroup: any) => {
        dataGroup?.fields.forEach((field: any) => {
          if (field?.data && field.data.length > 0) {
            field?.data.forEach((dataItem: any) => {
              if (ids.includes(dataItem.id)) {
                if (dataItem.config && dataItem?.config?.details && dataItem?.config?.details?.value) {
                  result.push({ title: dataItem.config.details.value.value, subTitle: '' })
                }
              }
            })
          }
        })
      })
    })
    return result
  }

  const mockupData: any = getValuesByIds([
    'name1',
    'name2',
    'name3',
    'name4',
    'name5',
    'name6',
    'name7',
    'name8',
    'name9',
    'name10'
  ])

  const rows: any = getValuesByIds([
    'subtitle1',
    'subtitle2',
    'subtitle3',
    'subtitle4',
    'subtitle5',
    'subtitle6',
    'subtitle7',
    'subtitle8',
    'subtitle9',
    'subtitle10',
    'subtitle11',
    'subtitle12',
    'subtitle13',
    'subtitle14',
    'subtitle15',
    'subtitle16'
  ])

  // const rows = [
  //   '1.1 การรับส่งเอกสาร ถูกต้องและรวดเร็ว',
  //   '1.2 ความรอบรู้ในการติดต่อประสานงาน',
  //   '1.3 การนัดหมายการประชุมให้ผู้บริหาร/หน่วยงานภายในกรม',
  //   '1.4 การอำนวยความสะดวกให้กับหน่วยงานภายในกรม',
  //   '1.5 มารยาทในการติดต่อประสานงาน',
  //   '1.6 การแก้ไขปัญหาเฉพาะหน้าในเรื่องต่างๆ',
  //   '1.7 ภาพรวมการให้บริการ'
  // ]
  // const mockupData = [
  //   {
  //     title: '1. นางสาววทันยา สัตยวณิช (แวว)',
  //     subTitle: '(หน้าห้องอธิบดีฯ โชติมา)'
  //   },
  //   {
  //     title: '2. นางสาวผุสรัตน์ ขวัญกุล (เพลง)',
  //     subTitle: '(หน้าห้องอธิบดีฯ โชติมา)'
  //   },
  //   {
  //     title: '3. นางสาววิรมน จันทร์เจริญ (วุ้น)',
  //     subTitle: '(หน้าห้องรองฯ รัชวิชญ์)'
  //   },
  //   {
  //     title: '4. นายพุฒิพงศ์ อินทร์ปรางค์ (ฟ้า)',
  //     subTitle: '(หน้าห้องรองฯ บุณิกา)'
  //   },
  //   {
  //     title: '5. นางสาวธารีรัตน์ ผดุงธรรม (บุ๋ม)',
  //     subTitle: '(หน้าห้องรองฯ บุณิกา)'
  //   },
  //   {
  //     title: '6. นางสาวเอื้อการย์ ตะสอน (ปลา)',
  //     subTitle: '(หน้าห้องรองฯ ธัชชญาน์พล)'
  //   }
  // ]
  const mockupDataWithScores = mockupData.map((person: any, index: any) => {
    const groupKey = `p${index + 1}`
    const groupScores = reportData?.result?.data?.score_by_group?.[groupKey] || {}
    const scores = Object.values(groupScores)

    const rowScores = rows.map((name: any, i: any) => ({
      name: name?.title || '',
      score: scores[i] ?? 0
    }))

    return {
      ...person,
      rows: rowScores
    }
  })

  const handleChangeStart = (newDate: Dayjs | null) => {
    setDateStart(newDate)
  }

  const handleChangeEnd = (newDate: Dayjs | null) => {
    setDateEnd(newDate)
  }

  // Function to handle the Excel export
  const handleExportToExcel = () => {
    if (!reportData?.result?.data) {
      alert('ไม่มีข้อมูลสำหรับส่งออก')
      return
    }

    const wb = XLSX.utils.book_new()

    // 1. Department Count Sheet
    const departmentData = reportData.result.data.department_count || []
    if (departmentData.length > 0) {
      const wsDept = XLSX.utils.json_to_sheet(
        departmentData.map((item: any) => ({
          หน่วยงาน: item.department_name,
          จำนวน: item.count
        }))
      )
      XLSX.utils.book_append_sheet(wb, wsDept, 'จำนวนตามหน่วยงาน')
    }

    // 2. Score Summary Sheet
    if (mockupDataWithScores.length > 0) {
      const headers = ['หัวข้อการประเมิน', ...mockupDataWithScores.map((p: any) => p.title)]
      const dataRows = rows.map((topicName: any, rowIndex: any) => {
        const scores = mockupDataWithScores.map((person: any) => person.rows[rowIndex]?.score || 0)
        return [topicName, ...scores]
      })
      const totals = mockupDataWithScores.map((person: any) =>
        person.rows.reduce((sum: any, row: any) => sum + row.score, 0)
      )
      const totalRow = ['รวม', ...totals]

      const excelData = [headers, ...dataRows, totalRow]
      const wsScores = XLSX.utils.aoa_to_sheet(excelData)
      XLSX.utils.book_append_sheet(wb, wsScores, 'สรุปผลคะแนน')
    }

    // Write the workbook and trigger the download
    XLSX.writeFile(wb, `สรุปผลการประเมิน_${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
  }

  return (
    <div className=' w-full min-h-screen relative'>
      <div className=' absolute left-0 top-0 z-10'>
        <div className='bg-primaryLight  rounded-lg'>
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
          <Grid container spacing={4} alignItems='center'>
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={newAdapter} adapterLocale='th'>
                <MobileDateTimePicker
                  open={openStartTime}
                  onClose={() => setOpenStartTime(false)}
                  value={dateStart}
                  onChange={handleChangeStart}
                  format='DD/MM/YYYY HH:mm'
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      placeholder: 'วันเวลาเริ่มต้น',
                      label: 'วันเวลาเริ่มต้น',
                      onClick: () => setOpenStartTime(true)
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={newAdapter} adapterLocale='th'>
                <MobileDateTimePicker
                  open={openEndTime}
                  onClose={() => setOpenEndTime(false)}
                  value={dateEnd}
                  onChange={handleChangeEnd}
                  format='DD/MM/YYYY HH:mm'
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      placeholder: 'วันเวลาสิ้นสุด',
                      label: 'วันเวลาสิ้นสุด',
                      onClick: () => setOpenEndTime(true)
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={4} className='hidden'>
              <Button variant='contained' color='success' onClick={handleExportToExcel} startIcon={<DownloadIcon />}>
                Download Excel
              </Button>
            </Grid>

            {reportData?.result?.data?.score_by_group ? (
              <>
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
                        {reportData?.result?.data?.department_count?.map((item: any, index: number) => (
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
                {mockupDataWithScores?.map((item: any, index: number) => {
                  return (
                    <Grid item xs={12} className='flex flex-col gap-1' key={index}>
                      <Typography variant='h6' fontWeight={600}>
                        {item.title}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {item?.subTitle}
                      </Typography>
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
                                sx={{
                                  fontWeight: 'bold',
                                  borderRight: '1px solid #000000',
                                  borderBottom: '1px solid #000000'
                                }}
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
                            {item?.rows.map((text: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell sx={{ borderRight: '1px solid #f0f0f0' }}>{text?.name}</TableCell>
                                <TableCell align='center'>{text?.score}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell align='center' sx={{ fontWeight: 'bold' }}>
                                รวม
                              </TableCell>
                              <TableCell align='center' sx={{ fontWeight: 'bold' }}>
                                {item.rows.reduce((sum: number, row: any) => sum + row.score, 0)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  )
                })}
              </>
            ) : (
              <Grid item xs={12}>
                <Typography variant='h6'>{dictionary?.noSearchResults}</Typography>
              </Grid>
            )}
          </Grid>
        </div>
      </div>
    </div>
  )
}

export default MockupSummaryConponent
