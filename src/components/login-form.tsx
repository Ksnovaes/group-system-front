'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'

const formSchema = z.object({
  email: z.string().min(2, {
    message: 'O email precisa ter ao menos 50 caracteres.',
  }),
  senha: z.string().min(8, {
    message: 'A senha precisa ter ao menos 8 caracteres',
  }),
})

export default function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      senha: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
  
    try {
      console.log('Enviando para API Route:', values);
  
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      console.log('Resposta da API Route:', response.status, response.headers);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro da API Route:', errorText);
        throw new Error('Erro ao fazer login.');
      }
  
      const data = await response.json();
      console.log('Dados recebidos:', data);
  
      login(data.userId);
  
      toast({
        title: 'Logado com sucesso!',
        description: 'Bem-vindo novamente!',
      });
  
      router.push('/profile');
    } catch (error: any) {
      console.error('Erro no login:', error.message);
  
      toast({
        title: 'Falha no login',
        description: 'Cheque suas credenciais.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="senha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Digite sua senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Logando...' : 'Login'}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <p>Não tem uma conta? <Link href="/signup" className="text-primary hover:underline">Criar conta</Link></p>
      </div>
    </Form>
  )
}

