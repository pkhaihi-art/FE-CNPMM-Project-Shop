import React from 'react'
import { Navbar } from '../features/navigation/components/Navbar'
import { AdminDashboard } from '../features/admin/components/AdminDashboard'

export const AdminDashboardPage = () => {
  return (
    <>
    <Navbar isProductList={true}/>
      <AdminDashboard />
    </>
  )
}
