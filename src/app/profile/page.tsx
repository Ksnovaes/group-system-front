'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import MatchList from '@/components/match-list'
import { useAuth } from '@/contexts/AuthContext'

export default function ProfilePage() {
  const router = useRouter()
  const [matches, setMatches] = useState([])
  const { userId, logout } = useAuth()

  useEffect(() => {
    if (!userId) {
      router.push('/login')
    } else {
      fetchMatches()
    }
  }, [userId, router])

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/match/matches', {
        headers: {
          'user-id': userId || '',
        },
      })
      if (!response.ok) {
        throw new Error('Falha no fetch de partidas')
      }
      const data = await response.json()
      setMatches(data)
    } catch (error) {
      console.error('Erro no fetch de partidas:', error)
    }
  }

  const handleCreateMatch = () => {
    router.push('/create-match')
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!userId) {
    return null
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-6">Seu perfil</h1>
      <Button onClick={handleCreateMatch} className="mb-6 mr-4">Criar partida</Button>
      <Button onClick={handleLogout} variant="outline" className="mb-6">Sair</Button>
      <MatchList matches={matches} onJoin={fetchMatches} />
    </div>
  )
}

