// api/match/index.ts

import { NextResponse } from 'next/server'

const BASE_URL = 'http://localhost:8080/api/matches' 

export async function GET() {
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Falha no fetch de partidas')
    }

    const matches = await response.json()
    return NextResponse.json(matches)
  } catch (error) {
    console.error('Erro dando fetch nas partidas:', error)
    return NextResponse.json({ error: 'Falha ao dar fetch nas partidas' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': request.headers.get('user-id') || '',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error('Falha ao criar partida')
    }

    const match = await response.json()
    return NextResponse.json(match)
  } catch (error) {
    console.error('Erro criando partida', error)
    return NextResponse.json({ error: 'Falha ao criar partida' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { matchId } = await request.json()
    const response = await fetch(`${BASE_URL}/${matchId}/join`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'user-id': request.headers.get('user-id') || '',
      },
    })

    if (!response.ok) {
      throw new Error('Falha ao entrar na partida')
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro entrando na partida:', error)
    return NextResponse.json({ error: 'Falha entrando na partida' }, { status: 500 })
  }
}
