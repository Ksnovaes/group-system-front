'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'

const formSchema = z.object({
  tituloPartida: z.string().min(10, { message: 'O título precisa ter ao menos 10 caracteres' }),
  descricaoPartida: z.string().min(20, { message: 'A descrição precisa ter ao menos 20 caracteres' }),
  endereco_id: z.string().uuid({ message: 'Endereço inválido' }),
  dataPartida: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Formato de data inválido.' }),
})

export default function CreateMatchPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { userId } = useAuth()

  useEffect(() => {
    if (!userId) {
      router.push('/login')
    }
  }, [userId, router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tituloPartida: '',
      descricaoPartida: '',
      endereco_id: '',
      dataPartida: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId || '',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Falha ao criar partida.')
      }

      router.push('/profile')
    } catch (error) {
      console.error('Erro criando partida:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!userId) {
    return null // or a loading spinner
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <h1 className="text-3xl font-bold mb-6">Criar partida</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="tituloPartida"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título da partida</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o título da partida" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="descricaoPartida"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição da partida</FormLabel>
                <FormControl>
                  <Textarea placeholder="Digite a descrição da partida" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endereco_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input placeholder="Insira o endereço" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dataPartida"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data e horário da partida</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Criando...' : 'Criar partida'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

