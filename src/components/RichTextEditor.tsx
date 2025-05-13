'use client'
import { useState } from 'react'

import { Box, Typography } from '@mui/material'
import 'react-quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'

const RichTextEditor = () => {
  const [value, setValue] = useState('')

  return (
    <Box className='w-full'>
      <Typography>รายละเอียด</Typography>
      <ReactQuill
        theme='snow'
        value={value}
        onChange={setValue}
        placeholder='รายละเอียด'
        modules={{
          toolbar: [['bold', 'italic'], [{ list: 'ordered' }, { list: 'bullet' }], [{ align: [] }]]
        }}
        style={{
          height: '150px',
          width: '100%',
          borderRadius: '8px',
          paddingBottom: '40px'
        }}
      />
      {/* Inline CSS */}
      <style>
        {`
          .ql-editor::before {
            color: rgba(255, 255, 255, 0.7) !important;
            font-style: italic;
          }
        `}
      </style>
    </Box>
  )
}

export default RichTextEditor
