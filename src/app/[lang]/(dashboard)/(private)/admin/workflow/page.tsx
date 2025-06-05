'use client'
import dynamic from 'next/dynamic'

const AdminWorkflowComponent = dynamic(() => import('@/views/admin/workflow/AdminWorkflowComponent'))

const AdminWorkflowPage = () => {
  return <AdminWorkflowComponent />
}

export default AdminWorkflowPage
