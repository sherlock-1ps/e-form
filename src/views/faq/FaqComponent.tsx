/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useState, useMemo } from 'react'
import Grid from '@mui/material/Grid'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Card,
  CardContent,
  Divider,
  IconButton
} from '@mui/material'
import CustomAvatar from '@/@core/components/mui/Avatar'
import FaqHeader from '@views/pages/faq/FaqHeader'
import { useDictionary } from '@/contexts/DictionaryContext'

const FaqComponent = () => {
  const [searchValue, setSearchValue] = useState('')
  const { dictionary } = useDictionary()

  const faqs = [
    {
      question: 'Is there a subscription fee to access the games?',
      answer: 'mock up answer'
    },
    {
      question: 'Are the games compatible with multiple platforms?',
      answer:
        'Yes, many of the games we offer are compatible across multiple platforms. You can enjoy them on PC and some mobile devices. We ensure that our collection includes cross-platform support, so you can play with friends regardless of the platform. Please check the specific game’s details for platform compatibility.'
    },
    {
      question: 'Do I need any special hardware to play these games?',
      answer: 'mock up answer'
    },
    {
      question: 'How can I access the games you offer?',
      answer: 'mock up answer'
    },
    {
      question: 'What types of games do you offer?',
      answer: 'mock up answer'
    },
    {
      question: 'Are the games updated regularly?',
      answer: 'mock up answer'
    }
  ]

  const filteredFaqs = useMemo(() => {
    const search = searchValue.toLowerCase()

    return faqs.filter(faq => faq.question.toLowerCase().includes(search))
  }, [searchValue, faqs])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <FaqHeader searchValue={searchValue} setSearchValue={setSearchValue} />
      </Grid>

      <Grid item xs={12}>
        {filteredFaqs.length ? (
          filteredFaqs.map((faq, index) => (
            <Accordion key={index}>
              <AccordionSummary>
                <Typography>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography className='text-center mt-4'>No results found</Typography>
        )}
      </Grid>

      <Grid item xs={12}>
        <div className='flex justify-center items-center flex-col text-center gap-2 plb-6'>
          <Typography variant='h4'>{dictionary['faq']?.baseMessage1}</Typography>
          <Typography>{dictionary['faq']?.subMessage1}</Typography>
        </div>

        <Grid container spacing={6} className='mbs-6'>
          <Grid item xs={12} md={6}>
            <div className='flex justify-center items-center flex-col gap-4 p-6 rounded bg-actionHover'>
              <CustomAvatar variant='rounded' color='primary' skin='light' size={46}>
                <i className='tabler-brand-telegram text-[26px]' />
              </CustomAvatar>

              <div className='flex items-center flex-col gap-1'>
                <Typography variant='h5'>Telegram: @oneplaybetno1</Typography>
                <Typography>{dictionary['faq']?.subMessage2}</Typography>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className='flex justify-center items-center flex-col gap-4 p-6 rounded bg-actionHover'>
              <CustomAvatar variant='rounded' color='primary' skin='light' size={46}>
                <i className='tabler-mail text-[26px]' />
              </CustomAvatar>
              <div className='flex items-center flex-col gap-1'>
                <Typography variant='h5'>E-mail: oneplaybetno1@oneplay.com</Typography>
                <Typography>{dictionary['faq']?.subMessage3}</Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default FaqComponent
