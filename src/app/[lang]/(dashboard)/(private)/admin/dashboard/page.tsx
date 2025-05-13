'use client'
import colorSchemes from '@/@core/theme/colorSchemes'
import AdminDashboardComponent from '@/views/admin/dashboard/AdminDashboardComponent'

const Page = () => {
  // const primaryColor = colorSchemes('default')?.light?.palette?.background?.backgroundBoard || 'white'

  return (
    <div>
      <AdminDashboardComponent />
    </div>
  )
}

export default Page
