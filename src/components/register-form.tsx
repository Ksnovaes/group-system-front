'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { format, parse, isValid } from 'date-fns'

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
  nome: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  sobrenome: z.string().min(2, { message: 'Surname must be at least 2 characters.' }),
  nickname: z.string().min(2, { message: 'Nickname must be at least 2 characters. '}),
  apelido: z.string().min(2, { message: 'Nickname must be at least 2 characters.' }),
  telefone: z.string().min(11, { message: 'Telefone must be at least 2 characters.' }),
  sexo: z.enum(['MASCULINO', 'FEMININO', 'OUTRO'], { required_error: 'Please select a gender.' }),
  dataNascimento: z.date({ required_error: 'Please select a birthdate.' }),
  intensidade: z.enum(['LAZER', 'JOGADOR', 'AMBOS'], { required_error: 'Please select your game intensity.' }),
})

type FormData = z.infer<typeof formSchema>

export default function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      nome: '',
      sobrenome: '',
      nickname: '',
      apelido: '',
      telefone: '',
      sexo: undefined,
      dataNascimento: undefined,
      intensidade: undefined,
    },
  })

  async function onSubmit(values: FormData) {
    setIsLoading(true)
    
    try {
      // Here you send the entire form data to your backend
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values), // Send all form values here
      });
  
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
  
      const result = await res.json();
      console.log('Registration successful:', result);
      router.push('/login'); // Redirect to login page after successful registration
    } catch (error) {
      console.error('Error during registration:', error);
      // Handle error (e.g., show error message to user)
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
                <Input type="email" placeholder="Enter your email" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormDescription>
                Password must be at least 8 characters long.
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
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
              <FormLabel>Surname</FormLabel>
              <FormControl>
                <Input placeholder="Enter your surname" {...field} />
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
                <Input placeholder="Enter your nickname" {...field} />
              </FormControl>
              <FormDescription>This is the name that will be used in the app.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apelido"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nickname</FormLabel>
              <FormControl>
                <Input placeholder="Enter your nickname" {...field} />
              </FormControl>
              <FormDescription>This is the name that will be used in the app.</FormDescription>
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
                <Input placeholder="Enter your telefone" {...field} />
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
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
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
              <FormLabel>Birthdate</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  placeholder="YYYY-MM-DD"
                  {...field}
                  value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const date = parse(e.target.value, 'yyyy-MM-dd', new Date());
                    if (isValid(date)) {
                      field.onChange(date);
                    } else {
                      field.onChange(undefined);
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                Please enter your birthdate in the format YYYY-MM-DD
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
              <FormLabel>Game Intensity</FormLabel>
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
                      Player
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="AMBOS" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Both
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
      </form>
    </Form>
  )
}

