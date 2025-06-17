'use client'

import { Typography } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import type { SvgIconComponent } from '@mui/icons-material'

type CardCountProps = {
  title: string
  count: number
  baseColor: string
  hoverColor?: string
  textColor?: string
  icon: SvgIconComponent
  path: string
}

const CardCount = ({ title, count, baseColor, hoverColor, textColor, icon: Icon, path }: CardCountProps) => {
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params
  const id = Math.random().toString(36).substring(2, 9)
  const className = `card-count-${id}`
  const computedHover = hoverColor || baseColor.replace(/[\d.]+\)$/g, '0.5)')

  return (
    <>
      <style>
        {`
          .${className} {
            background-color: ${baseColor};
            transition: background-color 0.5s ease;
          }
          .${className}:hover {
            background-color: ${computedHover};
          }
        `}
      </style>

      <div
        className={`${className} w-full rounded-sm px-6 py-4 flex items-center justify-between h-[115px] shadow-sm cursor-pointer`}
        onClick={() => {
          router.push(`/${locale}/${path}`)
        }}
      >
        <Icon style={{ fontSize: 64, color: textColor }} />

        <div className='flex flex-col items-end justify-center gap-1'>
          <Typography variant='h2' className='leading-none' style={{ color: textColor }}>
            {count}
          </Typography>
          <Typography variant='h5' style={{ color: textColor }}>
            {title}
          </Typography>
        </div>
      </div>
    </>
  )
}

export default CardCount
