'use client'
import React from 'react'

const BaseDropdown = ({ label, options, defaultValue, onChange }) => {
  return (
    <div className='w-full'>
      <label className='block text-sm font-medium text-gray-600 mb-1'>{label}</label>

      <div className='relative'>
        <select
          defaultValue={defaultValue}
          onChange={onChange}
          className='w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none'
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4 text-gray-600'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7' />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default BaseDropdown
