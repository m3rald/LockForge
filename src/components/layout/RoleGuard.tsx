import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { UserRole } from '../../lib/types'

export function RoleGuard({ children, requiredRole }: { children: React.ReactNode, requiredRole: UserRole }) {
  const navigate = useNavigate()
  const { isConnected } = useAccount()
  const role = localStorage.getItem('lockforge_role') as UserRole

  useEffect(() => {
    if (!isConnected) {
      navigate('/')
      return
    }

    if (!role) {
      navigate('/select-role')
      return
    }

    if (requiredRole && role !== requiredRole) {
      navigate(role === 'buyer' ? '/buyer' : '/seller')
    }
  }, [isConnected, role, navigate, requiredRole])

  if (!isConnected || !role || (requiredRole && role !== requiredRole)) {
    return null
  }

  return <>{children}</>
}
