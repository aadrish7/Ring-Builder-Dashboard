import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    const adminUser = process.env.ADMIN_USERNAME
    const adminPass = process.env.ADMIN_PASSWORD

    console.log('--- Login Attempt ---')
    console.log('Received Username:', username)
    console.log('Received Password:', password)
    console.log('Env Username:', adminUser)
    console.log('Env Password:', adminPass)
    console.log('Match Result:', username === adminUser && password === adminPass)

    if (username === adminUser && password === adminPass) {
      const response = NextResponse.json({ success: true })
      
      // Set cookie
      response.cookies.set('admin_authenticated', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      })
      
      return response
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
