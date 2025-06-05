/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'
import {
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  TextField,
  Typography,
  Checkbox,
  Pagination
} from '@mui/material'
import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import {
  useGetDepartmentExternalQueryOption,
  useGetPersonExternalQueryOption,
  useGetPositionExternalQueryOption
} from '@/queryOptions/form/formQueryOptions'

interface AddSettingPermissionFlowDialogProps {
  id: string
}

const mockData = Array.from({ length: 27 }, (_, i) => ({
  id: i + 1,
  name: `ชื่อที่ ${i + 1}`,
  type: i % 3 === 0 ? 'บุคคล' : i % 3 === 1 ? 'ตำแหน่ง' : 'หน่วยงาน'
}))

const filterTypeOption = [
  {
    id: 1,
    key: 'person',
    name: 'บุคคล'
  },
  {
    id: 2,
    key: 'position',
    name: 'ตำแหน่ง'
  },
  {
    id: 3,
    key: 'department',
    name: 'หน่วยงาน'
  }
]

const DebouncedInput = ({ value: initialValue, onChange, isEng = false, debounce = 550, maxLength, ...props }: any) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <CustomTextField
      {...props}
      value={value}
      onChange={e => {
        const input = e.target.value
        if (!isEng) {
          setValue(input)

          return
        }
        const isValid = /^[a-zA-Z0-9]*$/.test(input)
        if (isValid) {
          setValue(input)
        }
      }}
      inputProps={{
        ...(maxLength ? { maxLength } : {}),
        ...(props.inputProps || {})
      }}
    />
  )
}

const AddSettingPermissionFlowDialog = ({ id }: AddSettingPermissionFlowDialogProps) => {
  const { closeDialog } = useDialog()

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(100)
  const [filterType, setFilterType] = useState('person')
  const [searchText, setSearchText] = useState('')
  const [leftList, setLeftList] = useState<any[]>([])
  const [rightList, setRightList] = useState<any[]>([])
  const [selectedLeft, setSelectedLeft] = useState<any[]>([])
  const [selectedRight, setSelectedRight] = useState<any[]>([])

  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'type' | null; direction: 'asc' | 'desc' | null }>({
    key: null,
    direction: null
  })

  const [sortConfigRight, setSortConfigRight] = useState<{
    key: 'name' | 'type' | null
    direction: 'asc' | 'desc' | null
  }>({
    key: null,
    direction: null
  })

  const { data: personLists } = useGetPersonExternalQueryOption(page, pageSize, '', '', {
    enabled: filterType === 'person'
  })
  const { data: positionLists } = useGetPositionExternalQueryOption(page, pageSize, '', '', {
    enabled: filterType === 'position'
  })

  const { data: departmentLists } = useGetDepartmentExternalQueryOption(page, pageSize, '', '', {
    enabled: filterType === 'department'
  })

  const handleSortRight = (key: 'name' | 'type') => {
    setSortConfigRight(prev => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' }
        if (prev.direction === 'desc') return { key: null, direction: null }
      }
      return { key, direction: 'asc' }
    })
  }

  const sortedRightList = [...rightList].sort((a, b) => {
    if (!sortConfigRight.key || !sortConfigRight.direction) return 0
    const valA = a[sortConfigRight.key]!.toLowerCase()
    const valB = b[sortConfigRight.key]!.toLowerCase()
    if (valA < valB) return sortConfigRight.direction === 'asc' ? -1 : 1
    if (valA > valB) return sortConfigRight.direction === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (key: 'name' | 'type') => {
    setSortConfig(prev => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' }
        if (prev.direction === 'desc') return { key: null, direction: null }
      }
      return { key, direction: 'asc' }
    })
  }

  useEffect(() => {
    let filtered = mockData.filter(item => {
      const textMatch =
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.type.toLowerCase().includes(searchText.toLowerCase())
      const matchesType = item.type === filterType
      return matchesType && textMatch
    })

    if (sortConfig.key && sortConfig.direction) {
      filtered = [...filtered].sort((a, b) => {
        const key = sortConfig.key as 'name' | 'type'
        const valA = a[key].toLowerCase()
        const valB = b[key].toLowerCase()
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    setLeftList(filtered.filter(i => !rightList.some(r => r.id === i.id)))
  }, [filterType, searchText, sortConfig, rightList])

  useEffect(() => {
    setPage(1)
  }, [filterType])

  const transferSelectedToRight = () => {
    let toMove: any[] = []
    let mapped: any[] = []

    if (filterType === 'person') {
      toMove =
        personLists?.items?.data.filter((item: any) => selectedLeft.some(i => i.F_PERSON_ID === item.F_PERSON_ID)) || []
      mapped = toMove.map((item: any) => ({
        id: item.F_PERSON_ID,
        name: `${item.F_FIRST_NAME} ${item.F_LAST_NAME}`,
        type: item.F_POSITION_NAME || '-'
      }))
    } else if (filterType === 'position') {
      toMove =
        positionLists?.items?.data.filter((item: any) =>
          selectedLeft.some(i => i.F_POSITION_ID === item.F_POSITION_ID)
        ) || []
      mapped = toMove.map((item: any) => ({
        id: item.F_POSITION_ID,
        name: item.F_POSITION_NAME,
        type: '-'
      }))
    } else if (filterType === 'department') {
      toMove =
        departmentLists?.items?.data.filter((item: any) => selectedLeft.some(i => i.F_DEPT_ID === item.F_DEPT_ID)) || []
      mapped = toMove.map((item: any) => ({
        id: item.F_DEPARTMENT_ID,
        name: item.F_DEPARTMENT_NAME,
        type: '-'
      }))
    }

    const updatedRight = [...rightList, ...mapped.filter((i: any) => !rightList.some(r => r.id === i.id))]

    console.log('updatedRight', updatedRight)

    setRightList(updatedRight)
    setSelectedLeft([])
  }

  console.log('selectedLeft', selectedLeft)

  const transferSelectedToLeft = () => {
    const remaining = rightList.filter(item => !selectedRight.includes(item.id))
    setRightList(remaining)
    setSelectedRight([])
  }

  const toggleLeftSelect = (item: any) => {
    let newItem
    let key

    if (filterType === 'person') {
      newItem = { F_PERSON_ID: item.F_PERSON_ID }
      key = 'F_PERSON_ID'
    } else if (filterType === 'position') {
      newItem = { F_POSITION_ID: item.F_POSITION_ID }
      key = 'F_POSITION_ID'
    } else if (filterType === 'department') {
      newItem = { F_DEPT_ID: item.F_DEPT_ID }
      key = 'F_DEPT_ID'
    }

    console.log('newItem', newItem)
    console.log('key', key)

    if (!newItem || !key) return

    setSelectedLeft(prev => {
      const exists = prev.some(i => i[key] === newItem[key])
      return exists ? prev.filter(i => i[key] !== newItem[key]) : [...prev, newItem]
    })
  }

  const toggleRightSelect = (id: number) => {
    setSelectedRight(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]))
  }

  const toggleAllLeftSelect = () => {
    const ids = personLists?.items?.data
      .filter((item: any) => !rightList.some(r => r.id === item.F_PERSON_ID)) // ⛔ กรองออกก่อน
      .map((item: any) => item.F_PERSON_ID)

    const allSelected = ids.every((id: any) => selectedLeft.includes(id))

    setSelectedLeft(
      allSelected ? selectedLeft.filter(id => !ids.includes(id)) : [...new Set([...selectedLeft, ...ids])]
    )
  }

  const toggleAllRightSelect = () => {
    const ids = rightList.map(item => item.id)
    const allSelected = ids.every(id => selectedRight.includes(id))
    setSelectedRight(allSelected ? [] : [...ids])
  }

  return (
    <Grid container spacing={2} className='flex flex-col'>
      <Grid item xs={12}>
        <Typography variant='h5' className='text-center'>
          ตั้งค่าสิทธิ
        </Typography>
      </Grid>

      <Grid item xs={12} className='px-6 space-y-4'>
        <FormControl component='fieldset'>
          <RadioGroup row value={filterType} onChange={e => setFilterType(e.target.value)}>
            {filterTypeOption.map(option => (
              <FormControlLabel key={option.id} value={option.key} control={<Radio />} label={option.name} />
            ))}
          </RadioGroup>
        </FormControl>

        <div className='flex  '>
          {/* Left List */}
          <div className='flex flex-col gap-2 w-1/2'>
            <Typography variant='h6' className='text-center'>
              สิทธิที่สามารถเลือกได้
            </Typography>
            <DebouncedInput
              label='ค้นหา'
              placeholder={'....'}
              value={''}
              onChange={(newText: any) => setSearchText(newText)}
            />
            <div className='w-full flex items-center px-2 font-semibold text-sm text-gray-700'>
              <button
                className='w-1/6 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 border border-gray-300'
                onClick={toggleAllLeftSelect}
              >
                เลือก
              </button>
              <button
                className='w-2/5 text-left px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 border border-gray-300 ml-2'
                onClick={() => handleSort('name')}
              >
                ชื่อ{' '}
                {sortConfig.key === 'name' &&
                  (sortConfig.direction === 'asc' ? '▲' : sortConfig.direction === 'desc' ? '▼' : '')}
              </button>
              <button
                className='w-2/5 text-left px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 border border-gray-300 ml-2'
                onClick={() => handleSort('type')}
              >
                ตำแหน่ง{' '}
                {sortConfig.key === 'type' &&
                  (sortConfig.direction === 'asc' ? '▲' : sortConfig.direction === 'desc' ? '▼' : '')}
              </button>
            </div>
            <div className='w-full border border-gray-300 rounded overflow-y-auto space-y-2 p-2 h-[380px]'>
              {filterType === 'person' &&
                personLists?.items?.data?.map((item: any, index: number) => {
                  const isMoved = rightList.some(r => r.id === item.F_PERSON_ID)
                  return (
                    <div key={index} className='flex items-center'>
                      <Checkbox
                        checked={selectedLeft.some(i => i.F_PERSON_ID === item.F_PERSON_ID)}
                        disabled={isMoved}
                        onChange={() => toggleLeftSelect(item)}
                      />
                      <Typography className={`w-2/5 ${isMoved ? 'text-textDisabled' : 'text-black'}`}>
                        {item.F_FIRST_NAME} {item.F_LAST_NAME}
                      </Typography>
                      <Typography className={`w-2/5 ${isMoved ? 'text-textDisabled' : 'text-black'}`}>
                        {item.F_POSITION_NAME}
                      </Typography>
                    </div>
                  )
                })}

              {filterType === 'position' &&
                positionLists?.items?.data?.map((item: any, index: number) => {
                  const isMoved = rightList.some(r => r.id === item.F_POSITION_ID)
                  return (
                    <div key={index} className='flex items-center'>
                      <Checkbox
                        checked={selectedLeft.some(i => i.F_POSITION_ID === item.F_POSITION_ID)}
                        disabled={isMoved}
                        onChange={() => toggleLeftSelect(item)}
                      />
                      <Typography className={`w-1/5 ${isMoved ? 'text-textDisabled' : 'text-black'}`}>
                        {item.F_POSITION_ID}
                      </Typography>
                      <Typography className={`w-3/5 ${isMoved ? 'text-textDisabled' : 'text-black'}`}>
                        {item.F_POSITION_NAME}
                      </Typography>
                    </div>
                  )
                })}

              {filterType === 'department' &&
                departmentLists?.items?.data?.map((item: any, index: number) => {
                  const isMoved = rightList.some(r => r.id === item.F_DEPT_ID)
                  return (
                    <div key={index} className='flex items-center'>
                      <Checkbox
                        checked={selectedLeft.some(i => i.F_DEPT_ID === item.F_DEPT_ID)}
                        disabled={isMoved}
                        onChange={() => toggleLeftSelect(item)}
                      />
                      <Typography className={`w-1/5 ${isMoved ? 'text-textDisabled' : 'text-black mr-2'}`}>
                        {item.F_DEPT_ID}
                      </Typography>
                      <Typography className={`w-3/5 ${isMoved ? 'text-textDisabled' : 'text-black'}`}>
                        {item.DEPARTMENT_NAME ?? '-'}
                      </Typography>
                    </div>
                  )
                })}
            </div>
            <div className='flex justify-center mt-2'>
              <Pagination
                count={
                  filterType === 'person'
                    ? (personLists?.items?.last_page ?? 1)
                    : filterType === 'position'
                      ? (positionLists?.items?.last_page ?? 1)
                      : (departmentLists?.items?.last_page ?? 1)
                }
                page={page}
                onChange={(_, value) => setPage(value)}
                size='small'
              />
            </div>
          </div>

          {/* Buttons */}
          <div className='flex flex-col justify-center items-center gap-4'>
            <Button variant='text' onClick={transferSelectedToRight}>
              ▶
            </Button>
            <Button variant='text' onClick={transferSelectedToLeft}>
              ◀
            </Button>
          </div>

          {/* Right List */}
          <div className='flex flex-col gap-2 w-1/2'>
            <Typography variant='h6' className='text-center'>
              สิทธิที่เลือกแล้ว
            </Typography>
            <DebouncedInput
              label='ค้นหา'
              placeholder={'....'}
              value={''}
              onChange={(newText: any) => setSearchText(newText)}
            />
            <div className='w-full flex items-center px-2 font-semibold text-sm text-gray-700'>
              <button
                className='w-1/6 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 border border-gray-300'
                onClick={toggleAllRightSelect}
              >
                เลือก
              </button>
              <button
                className='w-2/5 text-left px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 border border-gray-300 ml-2'
                onClick={() => handleSortRight('name')}
              >
                ชื่อ{' '}
                {sortConfigRight.key === 'name' &&
                  (sortConfigRight.direction === 'asc' ? '▲' : sortConfigRight.direction === 'desc' ? '▼' : '')}
              </button>
              <button
                className='w-2/5 text-left px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 border border-gray-300 ml-2'
                onClick={() => handleSortRight('type')}
              >
                ตำแหน่ง{' '}
                {sortConfigRight.key === 'type' &&
                  (sortConfigRight.direction === 'asc' ? '▲' : sortConfigRight.direction === 'desc' ? '▼' : '')}
              </button>
            </div>
            <div className='w-full border border-gray-300 rounded overflow-y-auto space-y-2 p-2 h-[380px]'>
              {sortedRightList.map(item => (
                <div key={item.id} className='flex space-x-4 items-center'>
                  <Checkbox checked={selectedRight.includes(item.id)} onChange={() => toggleRightSelect(item.id)} />
                  <Typography className='w-2/5 text-black'>{item.name}</Typography>
                  <Typography className='w-2/5 text-black'>{item.type}</Typography>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Grid>

      <Grid item xs={12} className='flex items-center justify-end gap-2 px-6'>
        <Button variant='contained' color='secondary' onClick={() => closeDialog(id)}>
          ยกเลิก
        </Button>
        <Button variant='contained' onClick={() => closeDialog(id)}>
          ยืนยัน
        </Button>
      </Grid>
    </Grid>
  )
}

export default AddSettingPermissionFlowDialog
