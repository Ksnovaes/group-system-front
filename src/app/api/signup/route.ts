import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // Validate all necessary fields are present
  if (!body.nome || !body.sobrenome || !body.nickname || !body.apelido || !body.sexo || !body.intensidade || !body.dataNascimento || !body.telefone || !body.email || !body.password) {
    return NextResponse.json(
      { message: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    // Send data to backend service (Spring Boot, for example)
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
        { message: error.message || 'Failed to register user' },
        { status: res.status }
      );
    }

    const user = await res.json();

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
