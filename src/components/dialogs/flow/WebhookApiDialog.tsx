import React, { useEffect } from 'react'
import {
  Container,
  Box,
  Select,
  MenuItem,
  TextField,
  Button,
  Tabs,
  Tab,
  IconButton,
  Checkbox,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Tooltip,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import SendIcon from '@mui/icons-material/Send'
import SaveIcon from '@mui/icons-material/Save'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { webhookTest, webhookUpdate } from '@/app/sevices/form/formServices'
import { useFetchGetFlowByIdQueryOption } from '@/queryOptions/form/formQueryOptions'
import { useDialog } from '@/hooks/useDialog'
// --- Interfaces for our state ---
interface KeyValue {
  id: string
  key: string
  value: string
  enabled: boolean
}

interface ApiResponse {
  status: number
  statusText: string
  headers: Headers
  body: any
}

// --- Custom Theme for a more modern look ---
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#64b5f6'
    },
    secondary: {
      main: '#f48fb1'
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e'
    }
  },
  typography: {
    fontFamily: 'Inter, sans-serif'
  }
})

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: '8px'
    }
  }
})

export type EnableSwitchProps = {
  value: boolean
  onChange: (next: boolean) => void
  label?: string
  disabled?: boolean
}

export function EnableSwitch({ value, onChange, label = 'Enable', disabled }: EnableSwitchProps) {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={value}
          onChange={e => onChange(e.target.checked)}
          inputProps={{ 'aria-label': label }}
          disabled={disabled}
        />
      }
      label={
        <Typography fontWeight={500}>
          {label}: {value ? 'ON' : 'OFF'}
        </Typography>
      }
    />
  )
}

// --- Reusable component for a Key-Value pair row ---
const KeyValueRow = ({
  item,
  onUpdate,
  onDelete
}: {
  item: KeyValue
  onUpdate: (item: KeyValue) => void
  onDelete: (id: string) => void
}) => (
  <Grid container spacing={1} alignItems='center' sx={{ mb: 1 }}>
    <Grid item xs={1}>
      <Checkbox checked={item.enabled} onChange={e => onUpdate({ ...item, enabled: e.target.checked })} size='small' />
    </Grid>
    <Grid item xs={4}>
      <StyledTextField
        fullWidth
        variant='outlined'
        size='small'
        placeholder='Key'
        value={item.key}
        onChange={e => onUpdate({ ...item, key: e.target.value })}
      />
    </Grid>
    <Grid item xs={6}>
      <StyledTextField
        fullWidth
        variant='outlined'
        size='small'
        placeholder='Value'
        value={item.value}
        onChange={e => onUpdate({ ...item, value: e.target.value })}
      />
    </Grid>
    <Grid item xs={1}>
      <Tooltip title='Delete'>
        <IconButton onClick={() => onDelete(item.id)} size='small'>
          <DeleteOutlineIcon />
        </IconButton>
      </Tooltip>
    </Grid>
  </Grid>
)

interface DateUseProps {
  id: string
  data: any
}
// --- Main App Component ---
export default function WebhookApiDialog({ id, data }: DateUseProps) {
  // console.log(data)
  // --- State Management ---
  const { closeDialog } = useDialog()
  const { data: flow } = useFetchGetFlowByIdQueryOption(data.id)
  const [method, setMethod] = React.useState('POST')
  const [url, setUrl] = React.useState('https://your-api.com')
  const [mainTab, setMainTab] = React.useState(1) // 0 for Headers, 1 for Body
  const [bodyTab, setBodyTab] = React.useState(1) // 0 for form-data, 1 for raw
  const [responseTab, setResponseTab] = React.useState(0) // 0 for Body, 1 for Headers
  const [enable, setEnable] = React.useState<boolean>(false)
  const [headers, setHeaders] = React.useState<KeyValue[]>([
    { id: crypto.randomUUID(), key: 'Content-Type', value: 'application/json', enabled: true }
  ])

  const [formData, setFormData] = React.useState<KeyValue[]>([
    { id: crypto.randomUUID(), key: '', value: '', enabled: true }
  ])

  const [rawJson, setRawJson] = React.useState(
    JSON.stringify(
      {
        form_data: {},
        data_merge: {}
      },
      null,
      2
    )
  )
  useEffect(() => {
    handleLoadConfig(flow?.result?.data?.webhook_api)
  }, [flow])

  // State for API response handling
  const [response, setResponse] = React.useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // State for the JSON config input
  // const [jsonConfigInput, setJsonConfigInput] = React.useState('')

  // --- Handler Functions for Key-Value pairs ---
  const handleUpdate = (
    id: string,
    updatedItem: KeyValue,
    setter: React.Dispatch<React.SetStateAction<KeyValue[]>>
  ) => {
    setter(prev => prev.map(item => (item.id === id ? updatedItem : item)))
  }

  const handleDelete = (id: string, setter: React.Dispatch<React.SetStateAction<KeyValue[]>>) => {
    setter(prev => prev.filter(item => item.id !== id))
  }

  const handleAdd = (setter: React.Dispatch<React.SetStateAction<KeyValue[]>>) => {
    setter(prev => [...prev, { id: crypto.randomUUID(), key: '', value: '', enabled: true }])
  }

  // --- Main "Send" Logic using Fetch API ---
  const handleSendRequest = async () => {
    // Reset state for new request
    // setIsLoading(true)
    // setError(null)
    // setResponse(null)

    // 1. Construct Headers
    const activeHeaders = headers
      .filter(h => h.enabled && h.key)
      .reduce(
        (acc, curr) => {
          acc[curr.key] = curr.value
          return acc
        },
        {} as Record<string, string>
      )

    // 2. Construct Body
    let bodyPayload: any = null
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (bodyTab === 0) {
        // form-data
        bodyPayload = formData
          .filter(f => f.enabled && f.key)
          .reduce(
            (acc, curr) => {
              acc[curr.key] = curr.value
              return acc
            },
            {} as Record<string, string>
          )
      } else {
        // raw json
        try {
          bodyPayload = JSON.parse(rawJson)
        } catch (e) {
          setError('The JSON in the body is not valid. Please correct it.')
          setIsLoading(false)
          return
        }
      }
    }

    // 3. Configure Fetch Request
    const requestOptions: any = {
      method: method,
      headers: activeHeaders,
      body: bodyPayload ? JSON.stringify(bodyPayload) : null
    }

    // For GET or HEAD requests, body must be null
    if (['GET', 'HEAD'].includes(method)) {
      requestOptions.body = null
    }

    const apiConfig = {
      enable,
      bodyTab,
      method,
      url,
      headers: activeHeaders,
      body: bodyPayload
    }

    const reswebhookUpdate = await webhookUpdate({ config: apiConfig, flow_id: data.id })

    console.log('--- API Configuration ---')
    console.log(JSON.stringify(apiConfig, null, 2))

    closeDialog(id)
    // setIsLoading(false)
  }

  // --- Handler to Load Configuration from JSON ---
  const handleLoadConfig = (config: any) => {
    if (!config) {
      setError('Please paste a JSON configuration to load.')
      return
    }
    try {
      // const config = data?.webhook_api
      setError(null)
      if (config.method && ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].includes(config.method)) {
        setMethod(config.method)
      }
      if (typeof config.url === 'string') {
        setUrl(config.url)
      }
      if (typeof config.headers === 'object' && config.headers !== null) {
        const newHeaders = Object.entries(config.headers).map(([key, value]) => ({
          id: crypto.randomUUID(),
          key,
          value: String(value),
          enabled: true
        }))
        setHeaders(newHeaders)
      } else {
        setHeaders([])
      }
      setEnable(config.enable)
      if (config.body) {
        setMainTab(1)
        const contentType = config.headers?.['Content-Type'] || config.headers?.['content-type'] || ''
        const isRawJson =
          contentType.includes('application/json') || typeof config.body !== 'object' || Array.isArray(config.body)

        if (isRawJson && config.bodyTab !== 0) {
          setRawJson(JSON.stringify(config.body, null, 2))
          setBodyTab(1)
        } else {
          const newFormData = Object.entries(config.body).map(([key, value]) => ({
            id: crypto.randomUUID(),
            key,
            value: String(value),
            enabled: true
          }))
          setFormData(newFormData)
          setBodyTab(0)
        }
      } else {
        setFormData([{ id: crypto.randomUUID(), key: '', value: '', enabled: true }])
        setRawJson('')
      }
    } catch (e) {
      setError('Invalid JSON format. Please check your input.')
    }
  }

  // --- Render Logic ---
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Typography variant='h4' gutterBottom component='h1' sx={{ fontWeight: 'bold' }}>
          API Webhook Builder
        </Typography>

        {/* --- Request Builder Panel --- */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl variant='outlined' sx={{ minWidth: 150 }}>
              <InputLabel id='method-select-label'>Method</InputLabel>
              <Select
                labelId='method-select-label'
                value={method}
                onChange={e => setMethod(e.target.value as string)}
                label='Method'
                sx={{ borderRadius: '8px' }}
              >
                {
                  // ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
                  ['POST', 'PUT', 'PATCH'].map(m => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            <StyledTextField
              fullWidth
              variant='outlined'
              placeholder='Enter request URL'
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
            {/* <Button
              variant='contained'
              color='primary'
              onClick={handleSendRequest}
              disabled={isLoading}
              endIcon={isLoading ? <CircularProgress size={20} color='inherit' /> : <SendIcon />}
              sx={{ minWidth: 120, borderRadius: '8px', fontWeight: 'bold' }}
            >
              {isLoading ? 'Sending...' : 'ทดสอบ'}
            </Button> */}
            <EnableSwitch value={enable} onChange={setEnable} />
            <Button
              variant='contained'
              color='primary'
              onClick={handleSendRequest}
              endIcon={<SaveIcon />}
              sx={{ minWidth: 120, borderRadius: '8px', fontWeight: 'bold' }}
            >
              บันทึก
            </Button>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={mainTab} onChange={(_, newValue) => setMainTab(newValue)}>
              <Tab label='Headers' />
              <Tab label='Body' />
            </Tabs>
          </Box>

          <Box hidden={mainTab !== 0} sx={{ pt: 2 }}>
            <Typography variant='subtitle2' color='text.secondary' sx={{ mb: 2 }}>
              Define request headers. Unchecked or empty keys will be ignored.
            </Typography>
            {headers.map(header => (
              <KeyValueRow
                key={header.id}
                item={header}
                onUpdate={item => handleUpdate(item.id, item, setHeaders)}
                onDelete={id => handleDelete(id, setHeaders)}
              />
            ))}
            <Button startIcon={<AddCircleOutlineIcon />} onClick={() => handleAdd(setHeaders)} sx={{ mt: 1 }}>
              Add Header
            </Button>
          </Box>

          <Box hidden={mainTab !== 1} sx={{ pt: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={bodyTab} onChange={(_, newValue) => setBodyTab(newValue)}>
                <Tab label='form-data' sx={{ display: 'none' }} />
                <Tab label='Response (JSON)' />
              </Tabs>
            </Box>
            <Box hidden={bodyTab !== 0} sx={{ pt: 2 }}>
              {formData.map(data => (
                <KeyValueRow
                  key={data.id}
                  item={data}
                  onUpdate={item => handleUpdate(item.id, item, setFormData)}
                  onDelete={id => handleDelete(id, setFormData)}
                />
              ))}
              <Button startIcon={<AddCircleOutlineIcon />} onClick={() => handleAdd(setFormData)} sx={{ mt: 1 }}>
                Add Field
              </Button>
            </Box>
            <Box hidden={bodyTab !== 1} sx={{ pt: 2 }}>
              <StyledTextField
                fullWidth
                multiline
                rows={10}
                variant='outlined'
                value={rawJson}
                onChange={e => setRawJson(e.target.value)}
                placeholder='Enter raw JSON body'
                disabled={true}
                sx={{ '& .MuiOutlinedInput-root': { fontFamily: 'monospace' } }}
              />
            </Box>
          </Box>
        </Paper>

        {/* --- Response Display Panel --- */}

        <Box sx={{ mt: 4, display: 'none' }}>
          <Typography variant='h5' gutterBottom component='h2' sx={{ fontWeight: 'bold' }}>
            Response
          </Typography>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', minHeight: '200px' }}>
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            )}
            {error && <Alert severity='error'>{error}</Alert>}
            {response && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography>Status:</Typography>
                  <Typography
                    component='span'
                    sx={{
                      fontWeight: 'bold',
                      color: response.status >= 200 && response.status < 300 ? 'success.main' : 'error.main'
                    }}
                  >
                    {response.status} {response.statusText}
                  </Typography>
                </Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={responseTab} onChange={(_, newValue) => setResponseTab(newValue)}>
                    <Tab label='Body' />
                    <Tab label='Headers' />
                  </Tabs>
                </Box>
                <Box hidden={responseTab !== 0} sx={{ pt: 2 }}>
                  <Box
                    component='pre'
                    sx={{
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      p: 2,
                      borderRadius: '8px',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      fontFamily: 'monospace'
                    }}
                  >
                    {typeof response.body === 'object' ? JSON.stringify(response.body, null, 2) : response.body}
                  </Box>
                </Box>
                <Box hidden={responseTab !== 1} sx={{ pt: 2 }}>
                  {Array.from(response.headers.entries()).map(([key, value]) => (
                    <Grid container spacing={1} key={key}>
                      <Grid item xs={4}>
                        <Typography sx={{ fontWeight: 'bold' }}>{key}:</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography sx={{ fontFamily: 'monospace' }}>{value}</Typography>
                      </Grid>
                    </Grid>
                  ))}
                </Box>
              </Box>
            )}
            {!isLoading && !error && !response && (
              <Typography color='text.secondary'>The server response will be displayed here.</Typography>
            )}
          </Paper>
        </Box>

        {/* --- Load Configuration Panel --- */}
        {/* <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', mt: 4, display: 'none' }}>
          <Typography variant='h6' gutterBottom component='h2'>
            Load Configuration from JSON
          </Typography>
          <StyledTextField
            fullWidth
            multiline
            rows={8}
            variant='outlined'
            value={jsonConfigInput}
            onChange={e => setJsonConfigInput(e.target.value)}
            placeholder='Paste a previously generated JSON configuration here'
            sx={{ '& .MuiOutlinedInput-root': { fontFamily: 'monospace' }, mb: 2 }}
          />
          <Button variant='outlined' color='secondary' onClick={handleLoadConfig}>
            Load Configuration
          </Button>
        </Paper> */}
      </Container>
    </ThemeProvider>
  )
}
