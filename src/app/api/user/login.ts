import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();

    const { email, password } = body;

    const backendResponse = await fetch('http://localhost:8080/api/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!backendResponse.ok) {
        return NextResponse.json(
            { error: 'Erro ao autenticar no backend.' },
            { status: backendResponse.status }
        );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
}
