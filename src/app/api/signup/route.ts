import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.nome || !body.sobrenome || !body.nickname || !body.sexo || !body.intensidade || !body.dataNascimento || !body.telefone || !body.email || !body.password) {
    return NextResponse.json(
      { message: 'Faltando os seguintes campos' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch('http://localhost:8080/api/user/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: body.nome,
        sobrenome: body.sobrenome,
        nickname: body.nickname,
        apelido: body.apelido,
        sexo: body.sexo,
        intensidade: body.intensidade,
        dataNascimento: body.dataNascimento,
        telefone: body.telefone,
        email: body.email,
        password: body.password
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(
        { message: error.message || 'Falha ao registrar o usuário' },
        { status: res.status }
      );
    }

    const user = await res.json();

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Erro registrando o usuário:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
