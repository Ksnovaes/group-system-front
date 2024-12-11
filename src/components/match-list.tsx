import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

type Match = {
  id: string
  tituloPartida: string
  descricaoPartida: string
  dataPartida: string
  criador: {
    id: string
    nome: string
  }
}

type MatchListProps = {
  matches: Match[]
  onJoin: () => void
}

export default function MatchList({ matches, onJoin }: MatchListProps) {
  const [joiningId, setJoiningId] = useState<string | null>(null)
  const [leavingId, setLeavingId] = useState<string | null>(null)
  const { userId } = useAuth()

  const handleJoin = async (matchId: string) => {
    setJoiningId(matchId)
    try {
      const response = await fetch(`/api/participant/${matchId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId || '',
        },
      })
      if (!response.ok) {
        throw new Error('Falha ao entrar na partida')
      }
      onJoin()
    } catch (error) {
      console.error('Erro entrando na partida:', error)
    } finally {
      setJoiningId(null)
    }
  }

  const handleLeave = async (matchId: string) => {
    setLeavingId(matchId)
    try {
      const response = await fetch(`/api/participant/${matchId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId || '',
        },
      })
      if (!response.ok) {
        throw new Error('Falha ao sair da partida')
      }
      onJoin() // Refresh the match list
    } catch (error) {
      console.error('Erro ao sair da partida:', error)
    } finally {
      setLeavingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <Card key={match.id}>
          <CardHeader>
            <CardTitle>{match.tituloPartida}</CardTitle>
            <CardDescription>Criado por: {match.criador.nome}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{match.descricaoPartida}</p>
            <p className="mt-2">Data: {new Date(match.dataPartida).toLocaleString()}</p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleJoin(match.id)} 
              disabled={joiningId === match.id}
              className="mr-2"
            >
              {joiningId === match.id ? 'Entrando...' : 'Entrar na partida'}
            </Button>
            <Button
              onClick={() => handleLeave(match.id)}
              disabled={leavingId === match.id}
              variant="outline"
            >
              {leavingId === match.id ? 'Saindo...' : 'Sair da partida'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

