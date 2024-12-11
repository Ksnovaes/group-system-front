'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { format, parse, isValid } from 'date-fns'
import { useAuth } from '@/contexts/AuthContext'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  nome: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  sobrenome: z.string().min(2, { message: 'O sobrenome deve ter pelo menos 2 caracteres.' }),
  nickname: z.string().min(2, { message: 'O apelido deve ter pelo menos 2 caracteres.'}),
  telefone: z.string().min(11, { message: 'O telefone deve ter pelo menos 2 caracteres.' }),
  sexo: z.enum(['MASCULINO', 'FEMININO', 'OUTRO'], { required_error: 'Selecione um gênero.' }),
  dataNascimento: z.date({ required_error: 'Selecione uma data de nascimento.' }),
  intensidade: z.enum(['LAZER', 'JOGADOR', 'AMBOS'], { required_error: 'Selecione a intensidade do seu jogo.' }),
})

type FormData = z.infer<typeof formSchema>

export default function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      nome: '',
      sobrenome: '',
      nickname: '',
      telefone: '',
      sexo: undefined,
      dataNascimento: undefined,
      intensidade: undefined,
    },
  })

  async function onSubmit(values: FormData) {
    setIsLoading(true)
    
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const result = await res.json();
      console.log('Registro feito com sucesso:', result);
      login(result.id);
      router.push('/profile');
    } catch (error) {
      console.error('Erro durante o registro:', error);
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
                <Input type="email" placeholder="Digite seu e-mail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Digite sua senha" {...field} />
              </FormControl>
              <FormDescription>
                A senha deve ter pelo menos 8 caracteres.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sobrenome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sobrenome</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu sobrenome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nickname</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu nickname" {...field} />
              </FormControl>
              <FormDescription>Este é o nome que será usado no aplicativo.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="Digite o seu telefone" {...field} />
              </FormControl>
              <FormDescription>(61) 90000-0000</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sexo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gênero</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu gênero" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MASCULINO">Male</SelectItem>
                  <SelectItem value="FEMININO">Female</SelectItem>
                  <SelectItem value="OUTRO">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dataNascimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de nascimento</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  placeholder="DD-MM-YYYY"
                  {...field}
                  value={field.value ? format(field.value, 'dd-MM-yyyy') : ''}
                  onChange={(e) => {
                    const date = parse(e.target.value, 'dd-MM-yyyy', new Date());
                    if (isValid(date)) {
                      field.onChange(date);
                    } else {
                      field.onChange(undefined);
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
              Por favor insira sua data de nascimento no formato DD-MM-YYYY
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="intensidade"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Intensidade do Jogo</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="LAZER" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Lazer
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="JOGADOR" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Jogador
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="AMBOS" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Ambos
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Cadastre-se'}
        </Button>
      </form>
    </Form>
  )
}

