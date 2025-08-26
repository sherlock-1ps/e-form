import React, { useMemo, useState } from 'react'
import {
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Alert,
  Snackbar,
  Divider,
  InputAdornment
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DownloadIcon from '@mui/icons-material/Download'
import CleaningServicesIcon from '@mui/icons-material/CleaningServices'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import IosShareIcon from '@mui/icons-material/IosShare'
import TitleIcon from '@mui/icons-material/Title'
import * as js2xmlparser from 'js2xmlparser'

/**
 * JSON → XML converter with MUI
 * - Paste/Type JSON on the left
 * - See XML on the right
 * - Toggle pretty print, choose XML root name
 * - Download .xml file
 */
export default function JsonToXmlTool({ data }: any) {
  //   console.log('data', data)
  //   console.log('data?.form_data_detail[0] ', data?.form_data_detail[0])
  //   const exampleJson = `{
  // "user": {
  // "id": 123,
  // "name": "Alice",
  // "active": true,
  // "hobbies": ["reading", "biking"],
  // "address": {
  // "city": "Bangkok",
  // "country": "TH"
  // }
  // }
  // }`

  const newData = {
    form: data?.form_data_detail,
    flow: data?.flow,
    form_data: JSON.stringify(data?.current_data_detail_merge?.data_detail || {})
  }
  console.log('data', data)
  console.log('newData', newData)

  const [jsonInput, setJsonInput] = useState<string>(JSON.stringify(newData))
  const [rootName, setRootName] = useState<string>('root')
  const [pretty, setPretty] = useState<boolean>(true)
  const [fileName, setFileName] = useState<string>('data.xml')

  const [errorMsg, setErrorMsg] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)

  const xmlOutput = useMemo(() => {
    try {
      const obj = JSON.parse(jsonInput)
      const xml = js2xmlparser.parse(rootName || 'root', obj, {
        // format: { prettyPrint: pretty, indent: '  ', doubleQuotes: true },
        declaration: { include: true, encoding: 'UTF-8' }
      })
      return xml
    } catch (e: any) {
      console.log('error', e)
      return '' // invalid JSON → empty output
    }
  }, [jsonInput, rootName, pretty])

  const onDownload = () => {
    if (!xmlOutput) return
    const blob = new Blob([xmlOutput], { type: 'application/xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName && fileName.trim() ? fileName.trim() : 'data.xml'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const onCopy = async () => {
    if (!xmlOutput) return
    try {
      await navigator.clipboard.writeText(xmlOutput)
      setCopied(true)
    } catch (e: any) {
      setErrorMsg('คัดลอกไม่สำเร็จ: ' + (e?.message || 'unknown'))
    }
  }

  const onBeautifyJson = () => {
    try {
      const obj = JSON.parse(jsonInput)
      setJsonInput(JSON.stringify(obj, null, 2))
    } catch (e: any) {
      setErrorMsg('JSON ไม่ถูกต้อง จัดรูปแบบไม่ได้')
    }
  }

  const onClear = () => setJsonInput('')

  const jsonValid = useMemo(() => {
    try {
      JSON.parse(jsonInput)
      return true
    } catch {
      return false
    }
  }, [jsonInput])

  return (
    <Container maxWidth='lg' className='py-6'>
      <Paper elevation={2} className='p-5 rounded-2xl'>
        <Stack spacing={2}>
          <Stack direction='row' alignItems='center' justifyContent='space-between'>
            <Typography variant='h5' fontWeight={700}>
              XML (Extensible Markup Language)
            </Typography>
            <Stack direction='row' spacing={2} alignItems='center'>
              <FormControlLabel
                control={<Switch checked={pretty} onChange={e => setPretty(e.target.checked)} />}
                label='Pretty print'
              />
              <TextField
                size='small'
                label='Root tag'
                value={rootName}
                onChange={e => setRootName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <TitleIcon fontSize='small' />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                size='small'
                label='File name'
                value={fileName}
                onChange={e => setFileName(e.target.value)}
                InputProps={{ endAdornment: <InputAdornment position='end'>.xml</InputAdornment> }}
              />
              {/* <Button variant='contained' startIcon={<DownloadIcon />} onClick={onDownload} disabled={!xmlOutput}>
                Download XML
              </Button>
              <Button variant='outlined' startIcon={<ContentCopyIcon />} onClick={onCopy} disabled={!xmlOutput}>
                Copy XML
              </Button> */}
            </Stack>
          </Stack>

          <Divider />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6} sx={{ display: 'none' }}>
              <Stack spacing={1}>
                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                  <Typography variant='subtitle1' fontWeight={600}>
                    JSON Input
                  </Typography>
                  <Stack direction='row' spacing={1}>
                    <Button size='small' startIcon={<AutoFixHighIcon />} onClick={onBeautifyJson}>
                      Beautify
                    </Button>
                    <Button size='small' startIcon={<CleaningServicesIcon />} onClick={onClear}>
                      Clear
                    </Button>
                  </Stack>
                </Stack>

                <TextField
                  value={jsonInput}
                  onChange={e => setJsonInput(e.target.value)}
                  placeholder='{"name":"Alice","age":30,"hobbies":["reading","biking"]}'
                  multiline
                  minRows={20}
                  fullWidth
                  error={!jsonValid && jsonInput.length > 0}
                  helperText={!jsonValid && jsonInput.length > 0 ? 'JSON ไม่ถูกต้อง' : ''}
                  InputProps={{
                    sx: {
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
                    }
                  }}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={12}>
              <Stack spacing={1}>
                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                  <Typography variant='subtitle1' fontWeight={600}>
                    XML Output
                  </Typography>
                  <Typography variant='caption' color={xmlOutput ? 'success.main' : 'text.secondary'}>
                    {xmlOutput ? 'พร้อมดาวน์โหลด' : '— ไม่มีเอาต์พุต —'}
                  </Typography>
                </Stack>

                <TextField
                  value={xmlOutput}
                  placeholder='ผลลัพธ์ XML จะแสดงที่นี่'
                  multiline
                  minRows={20}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    sx: {
                      whiteSpace: 'pre',
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
                    }
                  }}
                />

                <Stack direction='row' spacing={1}>
                  <Button variant='contained' startIcon={<IosShareIcon />} onClick={onDownload} disabled={!xmlOutput}>
                    ดาวน์โหลดเป็น .xml
                  </Button>
                  <Button variant='outlined' startIcon={<ContentCopyIcon />} onClick={onCopy} disabled={!xmlOutput}>
                    คัดลอก
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>

          {/* <Alert severity={jsonValid ? 'info' : 'error'}>
            {jsonValid
              ? 'พิมพ์/วาง JSON ทางซ้าย ระบบจะสร้าง XML อัตโนมัติทางขวา'
              : 'รูปแบบ JSON ผิดพลาด: ตรวจสอบ comma, quote และเครื่องหมายปีกกา'}
          </Alert> */}
        </Stack>
      </Paper>

      <Snackbar
        open={!!errorMsg}
        onClose={() => setErrorMsg('')}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity='error' onClose={() => setErrorMsg('')}>
          {errorMsg}
        </Alert>
      </Snackbar>

      <Snackbar
        open={copied}
        onClose={() => setCopied(false)}
        autoHideDuration={1500}
        message='คัดลอกแล้ว'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  )
}
