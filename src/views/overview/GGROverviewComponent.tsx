'use client'
// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'
import { Divider, ToggleButton, ToggleButtonGroup } from '@mui/material'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Vars
const series = [
  {
    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 61))
  }
]

const GGROverviewComponent = () => {
  // Vars
  const infoColor = 'var(--mui-palette-primary-main)'

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: { enabled: false },
    grid: {
      strokeDashArray: 6,
      borderColor: 'var(--mui-palette-divider)',
      xaxis: {
        lines: { show: true }
      },
      yaxis: {
        lines: { show: false }
      },
      padding: {
        top: -10,
        left: 0,
        right: 13,
        bottom: 8
      }
    },
    stroke: {
      width: 3,
      lineCap: 'butt',
      curve: 'straight'
    },
    colors: [infoColor],
    markers: {
      size: 4,
      strokeWidth: 3,
      colors: infoColor,
      strokeColors: 'transparent',
      discrete: [
        {
          size: 5.5,
          seriesIndex: 0,
          strokeColor: infoColor,
          fillColor: 'var(--mui-palette-background-paper)',
          dataPointIndex: series[0].data.length - 1
        }
      ]
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      labels: { show: false }
    }
  }

  return (
    <Card>
      <CardHeader
        title='GGR Provider'
        subheader=''
        className='pbe-0'
        action={
          <ToggleButtonGroup
            size='small'
            exclusive
            value={'day'}
            onChange={(e, val) => {
              if (val !== null) {
                console.log('Selected:', val)
              }
            }}
            sx={{
              backgroundColor: 'action.hover',
              borderRadius: '20px',
              overflow: 'hidden',
              height: 36,
              '& .MuiToggleButton-root': {
                px: 2.5,
                py: 0.5,
                fontSize: 13,
                fontWeight: 500,
                color: 'info.main',
                border: 0,
                '&.Mui-selected': {
                  color: '#fff',
                  backgroundColor: 'primary'
                },
                '&:hover': {
                  backgroundColor: 'info.light'
                }
              }
            }}
          >
            <ToggleButton value='day'>Day</ToggleButton>
            <ToggleButton value='month'>Month</ToggleButton>
            <ToggleButton value='year'>Year</ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <Divider className='py-2' />
      <CardContent className='flex flex-col'>
        <div className='flex items-center justify-between flex-wrap gap-x-4 gap-y-0.5'>
          <Typography variant='body2' color='text.primary'>
            Date : Mar 20, 2025
          </Typography>
          <Typography variant='body2' color='success.main'>
            GGR: 56,046 THB
          </Typography>
        </div>
        <AppReactApexCharts type='line' height={192} width='100%' options={options} series={series} />
        {/* <div className='flex items-center justify-between flex-wrap gap-x-4 gap-y-0.5'>
          <Typography variant='h4' color='text.primary'>
            624k
          </Typography>
          <Typography variant='body2' color='success.main'>
            +8.2%
          </Typography>
        </div> */}
      </CardContent>
    </Card>
  )
}

export default GGROverviewComponent
