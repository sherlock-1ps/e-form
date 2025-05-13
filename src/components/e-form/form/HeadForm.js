'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { ExpandMoreOutlined, DeleteOutline as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { Button, List, ListItem, ListItemText, IconButton, Typography, Collapse } from '@mui/material'

import { addNewForm, deleteForm, changeCurrentForm } from '@/redux-store/slices/formSlice.js'

const HeadForm = () => {
  const dispatch = useDispatch()
  const currentForm = useSelector(state => state.form)
  const mainRef = useRef(null)
  const [pages, setPages] = useState([
    { id: 1, name: 'หน้า 1', selected: true },
    { id: 2, name: 'หน้า 2', selected: false }
  ])
  const [isShowPages, setIsShowPages] = useState(false)

  const handleAddPage = () => {
    dispatch(addNewForm())
  }

  const handleDeletePage = id => {
    dispatch(deleteForm(id))
  }

  const handleSelectPage = index => {
    dispatch(changeCurrentForm(index))
  }

  const handleClickOutside = event => {
    if (mainRef.current && !mainRef.current.contains(event.target)) {
      setIsShowPages(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <main className='relative flex'>
      <div ref={mainRef}>
        <Button
          variant='contained'
          type='submit'
          color='primary'
          onClick={() => {
            setIsShowPages(!isShowPages)
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: 0,
            width: '148px'
          }}
        >
          <Typography color='white'>จัดการหน้า</Typography>
          <ExpandMoreOutlined
            sx={{
              color: 'white',
              transform: isShowPages ? 'rotate(180deg)' : 'unset',
              transition: 'transform 0.3s ease'
            }}
          />
        </Button>
        <Collapse in={isShowPages} timeout='auto' unmountOnExit sx={{ zIndex: '999' }}>
          <div
            style={{
              width: '148px',
              padding: '8px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              position: 'absolute',
              marginTop: '4px',
              zIndex: '2'
            }}
          >
            <List className='p-0'>
              {(currentForm.formElements.length === 0
                ? [{ id: 1, name: 'หน้า 1', selected: true }]
                : currentForm.formElements
              ).map((page, idx) => (
                <ListItem
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: currentForm.currentForm == idx ? '#0463EA29' : 'transparent',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    padding: '2px 16px 2px 16px '
                  }}
                  onClick={() => handleSelectPage(idx)}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant='body1'
                        style={{
                          color: page.selected ? '#1976d2' : '#757575',
                          fontWeight: page.selected ? 'bold' : 'normal'
                        }}
                      >
                        หน้า {idx + 1}
                      </Typography>
                    }
                  />
                  <IconButton
                    onClick={e => {
                      e.stopPropagation()
                      handleDeletePage(idx)
                    }}
                    size='small'
                    style={{ color: '#f44336' }}
                  >
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <Button
              variant='outlined'
              fullWidth
              endIcon={<AddIcon />}
              onClick={handleAddPage}
              style={{
                color: '#1976d2',
                borderColor: '#1976d2',
                fontSize: '13px',
                marginTop: '4px'
              }}
            >
              เพิ่มหน้าใหม่
            </Button>
          </div>
        </Collapse>
      </div>
    </main>
  )
}

export default HeadForm
