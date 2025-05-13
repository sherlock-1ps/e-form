/* eslint-disable react-hooks/exhaustive-deps */
'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { Data } from '@/types/pages/profileTypes'

// Component Imports
import { Button, Card, CardContent, Chip, Divider, Radio, RadioGroup, Switch, Typography } from '@mui/material'
import { useDialog } from '@/hooks/useDialog'
import ChangePasswordDialog from '@/components/dialogs/profile/ChangePasswordDialog'
import ProifileLogTable from './ProifileLogTable'
import GoogleAuthVerifyDialog from '@/components/dialogs/profile/GoogleAuthVerifyDialog'
import EmailAuthVerifyDialog from '@/components/dialogs/profile/EmailAuthVerifyDialog'
import { useDictionary } from '@/contexts/DictionaryContext'
import { useAuthStore } from '@/store/useAuthStore'
import {
  useDisabled2FaMutationOption,
  useFetch2FaMutationOption,
  useSearchLogProfileMutationOption
} from '@/queryOptions/profile/profileQueryOptions'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import { toast } from 'react-toastify'
import { fetchProfile } from '@/app/sevices/profile/profileServices'
import Axios from '@/libs/axios/axios'

const ProfileComponent = ({ data }: { data?: Data }) => {
  const { showDialog } = useDialog()
  const { dictionary } = useDictionary()
  const profileData = useAuthStore(state => state.profile)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [currentTab, setCurrentTab] = useState('profile')
  const [isEnable2FA, setIsEnable2FA] = useState(profileData?.is_two_fa)
  const [verify2Fa, setVerify2Fa] = useState(profileData?.two_fa_type ?? '')

  const { mutate, data: loginLogData, isPending, reset } = useSearchLogProfileMutationOption()
  const { mutateAsync } = useDisabled2FaMutationOption()

  const { data: twoFaList, isPending: pendingTwoFaList, error: errorTwoFaList } = useFetch2FaMutationOption()

  useEffect(() => {
    if (currentTab == 'profile') {
      setPage(1)
      setPageSize(10)
      reset()

      return
    } else if (currentTab == 'secure') {
      reset()

      return
    } else {
      mutate({
        email: profileData?.email ?? '',
        page,
        pageSize
      })
    }
  }, [page, pageSize, currentTab])

  const handleToggleVerify = async (newValue: boolean) => {
    if (newValue) {
      setIsEnable2FA(newValue)
      setVerify2Fa('google')
    } else if (profileData?.is_two_fa) {
      try {
        const response = await mutateAsync()
        if (response?.code == 'SUCCESS') {
          setIsEnable2FA(false)
          setVerify2Fa('')
          toast.success('disabled success!', { autoClose: 3000 })
          const resultProfile = await fetchProfile()
          if (resultProfile?.data) {
            useAuthStore.getState().setProfile(resultProfile.data)
          } else {
            toast.error('failed to get profile ,please login again', { autoClose: 3000 })
            const response = await Axios.get('/logout')

            if (response?.data?.code == 'SUCCESS') {
              useAuthStore.getState().clearTokens()
            }
          }
        }
      } catch (error) {
        toast.error('failed to disabled', { autoClose: 3000 })
      }
    } else {
      setIsEnable2FA(newValue)
      setVerify2Fa('')
    }
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case 'profile':
        return (
          <Grid item xs={12} sm className='flex flex-col gap-8'>
            <Typography variant='h4'>{dictionary['profile']?.titleProfile}</Typography>
            <Divider />
            <Typography variant='h5'>{dictionary['profile']?.accountDetail}</Typography>

            <div className='flex gap-9 justify-stretch'>
              <div className='flex flex-col gap-1'>
                <Typography>{dictionary['profile']?.emailInfo}</Typography>
                <Typography variant='h6'>{profileData?.email}</Typography>
              </div>
            </div>

            <div className='flex gap-9 justify-stretch'>
              <div className='flex flex-col gap-1'>
                <Typography>Role</Typography>
                <Typography variant='h6'>{profileData?.role?.role_name}</Typography>
              </div>
            </div>

            <Divider />
            <Typography variant='h5'>{dictionary['profile']?.operatorInfo}</Typography>

            <div className='flex gap-9 justify-stretch'>
              <div className='flex flex-col gap-1'>
                <Typography>Operator Prefix</Typography>
                <Typography variant='h6'>{profileData?.operator_prefix}</Typography>
              </div>
              <div className='flex flex-col gap-1'>
                <Typography>{dictionary['operator']?.operatorName}</Typography>
                <Typography variant='h6'>{profileData?.operator_name}</Typography>
              </div>
            </div>

            <div className='flex gap-9 justify-stretch'>
              <div className='flex flex-col gap-1'>
                <Typography>Email address</Typography>
                <Typography variant='h6'>{profileData?.email}</Typography>
              </div>
              <div className='flex flex-col gap-1'>
                <Typography>{dictionary?.currency}</Typography>
                <Typography variant='h6'>{profileData?.currency_code}</Typography>
              </div>
            </div>

            <div className='flex gap-9 justify-stretch'>
              <div className='flex flex-col gap-1'>
                <Typography>{dictionary?.country}</Typography>
                <Typography variant='h6'>{profileData?.country_code}</Typography>
              </div>
              <div className='flex flex-col gap-1'>
                <Typography>{dictionary?.timezone}</Typography>
                <Typography variant='h6'>{profileData?.timezone}</Typography>
              </div>
            </div>
            {profileData?.contract && (
              <div className='flex flex-col gap-1'>
                <Typography>{dictionary?.contract}</Typography>
                <Typography variant='h6'>{profileData.contract}</Typography>
              </div>
            )}

            <Button
              variant='contained'
              onClick={() => {
                showDialog({
                  id: 'ChangePasswordDialog',
                  component: <ChangePasswordDialog id='ChangePasswordDialog' />
                })
              }}
            >
              {dictionary['profile']?.changePassword}
            </Button>
          </Grid>
        )

      case 'secure':
        return (
          <Grid item xs={12} sm className='flex flex-col gap-8'>
            <div className='flex flex-col gap-2'>
              <Typography variant='h4'>{dictionary['profile']?.twoFa}</Typography>
              <Typography variant='body1'>{dictionary['profile']?.twoFaDetail}</Typography>
            </div>
            <Divider />
            <div className='flex gap-1 items-center'>
              <Switch
                checked={isEnable2FA}
                onChange={e => {
                  const newValue = e.target.checked

                  showDialog({
                    id: 'confirmEnable2Fa',
                    component: (
                      <ConfirmAlert
                        id='confirmEnable2Fa'
                        title={`${dictionary['profile']?.sureTwoFa} ${newValue ? dictionary?.enable : dictionary?.disabled} 2FA?`}
                        content1=''
                        onClick={() => {
                          handleToggleVerify(newValue)
                        }}
                      />
                    ),
                    size: 'sm'
                  })
                }}
              />
              <Typography>{isEnable2FA ? dictionary?.enable : dictionary?.disabled}</Typography>
            </div>
            <Typography variant='h5'>{dictionary['profile']?.selectTwoFa}</Typography>
            <Divider />
            {pendingTwoFaList && <p>Loading...</p>}
            {errorTwoFaList && <p>{errorTwoFaList?.message}</p>}
            <RadioGroup
              value={verify2Fa}
              onChange={e => {
                const selected = e.target.value

                if (!isEnable2FA) {
                  return
                }

                setVerify2Fa(selected)
              }}
              className='flex flex-col gap-8'
            >
              {twoFaList?.data?.map((item: any, index: number) => (
                <div className='flex flex-col' key={index}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm>
                      <div className='flex gap-4 items-center'>
                        <Radio value={item.code} />
                        {item.code === 'google' ? (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='42'
                            height='39'
                            viewBox='0 0 42 39'
                            fill='none'
                          >
                            <g clipPath='url(#clip0_1402_86135)'>
                              <path
                                d='M41.9365 19.4995C41.9365 21.4476 40.3573 23.0269 38.4092 23.0269H26.2341L21 12.4437L26.6495 2.65875C27.6235 0.971739 29.7807 0.393686 31.4678 1.3676L31.4684 1.36799C33.1556 2.34197 33.7338 4.49928 32.7597 6.18643L27.1103 15.9722H38.4092C40.3573 15.9722 41.9365 17.5515 41.9365 19.4995Z'
                                fill='#1A73E8'
                              />
                              <path
                                d='M31.4684 37.6316L31.4677 37.632C29.7807 38.6059 27.6235 38.0278 26.6495 36.3408L21 26.5559L15.3504 36.3408C14.3764 38.0278 12.2193 38.6059 10.5322 37.632L10.5315 37.6316C8.84433 36.6576 8.26619 34.5003 9.24021 32.8132L14.8897 23.0274L21 22.7998L27.1102 23.0274L32.7597 32.8132C33.7337 34.5003 33.1556 36.6576 31.4684 37.6316Z'
                                fill='#EA4335'
                              />
                              <path
                                d='M21 12.4437L19.407 16.7687L14.8897 15.9722L9.24021 6.18644C8.26619 4.49928 8.84433 2.34197 10.5315 1.36799L10.5322 1.3676C12.2193 0.393686 14.3764 0.97174 15.3504 2.65875L21 12.4437Z'
                                fill='#FBBC04'
                              />
                              <path
                                d='M20.0897 15.9727L15.9934 23.0273H3.59082C1.64272 23.0273 0.0634766 21.4481 0.0634766 19.5C0.0634766 17.5519 1.64272 15.9727 3.59082 15.9727H20.0897Z'
                                fill='#34A853'
                              />
                              <path d='M27.1102 23.0275H14.8896L20.9999 12.4443L27.1102 23.0275Z' fill='#185DB7' />
                            </g>
                            <defs>
                              <clipPath id='clip0_1402_86135'>
                                <rect width='42' height='37.9355' fill='white' transform='translate(0 0.532227)' />
                              </clipPath>
                            </defs>
                          </svg>
                        ) : (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='34'
                            height='34'
                            viewBox='0 0 34 34'
                            fill='none'
                          >
                            <g clipPath='url(#clip0_1402_86148)'>
                              <path
                                d='M29.1956 13.4131L17 21.3044L4.80437 13.4131V1.21751C4.79596 0.829718 5.10352 0.508575 5.49131 0.500168C5.50147 0.499967 5.51162 0.499967 5.52178 0.500168H28.4782C28.866 0.491761 29.1872 0.799319 29.1956 1.18711C29.1958 1.19727 29.1958 1.20742 29.1956 1.21758V13.4131Z'
                                fill='#F1F2F2'
                              />
                              <path d='M4.80433 13.4132L0.5 10.5436L4.80433 6.23926V13.4132Z' fill='#F6B445' />
                              <path d='M33.4999 10.5436L29.1956 13.4132V6.23926L33.4999 10.5436Z' fill='#F6B445' />
                              <path
                                d='M29.1957 13.349L33.5 10.5439V30.6308C33.4986 31.3918 33.197 32.1213 32.6606 32.6611L27.7609 27.7613L19.8696 19.87L19.6687 19.5615L29.1957 13.349Z'
                                fill='#FED049'
                              />
                              <path
                                d='M27.7608 27.7613L32.6605 32.661C32.1208 33.1974 31.3912 33.499 30.6303 33.5003H3.36959C2.60866 33.499 1.87908 33.1974 1.33936 32.661L6.23909 27.7613L14.1303 19.87L14.3312 19.5615L16.9999 21.3048L19.6686 19.5615L19.8695 19.87L27.7608 27.7613Z'
                                fill='#F6B445'
                              />
                              <path
                                d='M14.3315 19.5615L14.1306 19.87L6.23932 27.7613L1.33959 32.661C0.803228 32.1213 0.501589 31.3917 0.500244 30.6308V10.5439L14.3315 19.5615Z'
                                fill='#FED049'
                              />
                              <path
                                d='M24.8914 17.7173C29.6458 17.7173 33.5 13.8631 33.5 9.10865C33.5 4.35423 29.6458 0.5 24.8914 0.5C20.1369 0.5 16.2827 4.35423 16.2827 9.10865C16.2827 13.8631 20.1369 17.7173 24.8914 17.7173Z'
                                fill='#0463EA'
                              />
                              <path
                                d='M25.4799 13.3417C25.0837 13.3417 24.7625 13.0205 24.7625 12.6243V7.50785L23.7259 8.19944C23.3962 8.41936 22.9507 8.33038 22.7308 8.0007C22.5109 7.67108 22.5999 7.22558 22.9296 7.00566L25.0817 5.57091C25.4113 5.35098 25.8568 5.43996 26.0766 5.76951C26.1553 5.88741 26.1973 6.02602 26.1973 6.1678V12.6243C26.1973 13.0205 25.8761 13.3417 25.4799 13.3417Z'
                                fill='#F1F2F2'
                              />
                            </g>
                            <defs>
                              <clipPath id='clip0_1402_86148'>
                                <rect width='33' height='33' fill='white' transform='translate(0.5 0.5)' />
                              </clipPath>
                            </defs>
                          </svg>
                        )}
                        <Typography variant='h6'>{item.name}</Typography>
                      </div>
                    </Grid>

                    {isEnable2FA && verify2Fa === item.code && profileData?.two_fa_type != item.code && (
                      <Grid item xs={12} sm className='flex items-center justify-end'>
                        <div className='flex items-center gap-2'>
                          <Typography>{dictionary['profile']?.enableTwofa}</Typography>
                          <Button
                            variant='contained'
                            onClick={() => {
                              showDialog({
                                id: `VerifyDialog`,
                                component:
                                  item.code === 'google' ? (
                                    <GoogleAuthVerifyDialog id='VerifyDialog' />
                                  ) : (
                                    <EmailAuthVerifyDialog id='VerifyDialog' email={profileData?.email || ''} />
                                  )
                              })
                            }}
                          >
                            {dictionary?.verify}
                          </Button>
                        </div>
                      </Grid>
                    )}
                  </Grid>
                </div>
              ))}
            </RadioGroup>
          </Grid>
        )

      case 'log':
        return (
          <Grid item xs={12} sm className='flex flex-col gap-8'>
            <Typography variant='h4'>Login Log</Typography>
            <Divider />
            {isPending && <Typography variant='h6'>Loading...</Typography>}

            {loginLogData?.code == 'SUCCESS' && (
              <ProifileLogTable
                data={loginLogData?.data || { list: [] }}
                page={page}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
              />
            )}
          </Grid>
        )

      default:
        return null
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}></Grid>
      <Grid item xs={12} className='flex flex-col gap-6'>
        <Card>
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={3} className='flex flex-col gap-2'>
                <Button
                  variant={currentTab == 'profile' ? 'contained' : 'outlined'}
                  className='w-full flex items-center justify-start '
                  onClick={() => {
                    setCurrentTab('profile')
                  }}
                  startIcon={<i className='tabler-user' />}
                >
                  {dictionary['profile']?.titleProfile}
                </Button>
                <Button
                  variant={currentTab == 'secure' ? 'contained' : 'outlined'}
                  className='w-full flex items-center justify-start'
                  onClick={() => {
                    setCurrentTab('secure')
                  }}
                  startIcon={<i className='tabler-lock' />}
                >
                  {dictionary?.security}
                </Button>
                <Button
                  variant={currentTab == 'log' ? 'contained' : 'outlined'}
                  className='w-full flex items-center justify-start'
                  onClick={() => {
                    setCurrentTab('log')
                  }}
                  startIcon={<i className='tabler-history' />}
                >
                  Login Log
                </Button>
              </Grid>
              {renderTabContent()}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ProfileComponent
