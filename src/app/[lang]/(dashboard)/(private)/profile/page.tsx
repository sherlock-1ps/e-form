// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Type Imports
import type { Data } from '@/types/pages/profileTypes'

// Component Imports
import UserProfile from '@views/pages/user-profile'

// Data Imports
import { getProfileData } from '@/app/server/actions'
import ProfileComponent from '@/views/profile/ProfileComponent'

const ProfilePage = async () => {
  // Vars
  const data = await getProfileData()

  return null

  return <ProfileComponent data={data} />
}

export default ProfilePage
