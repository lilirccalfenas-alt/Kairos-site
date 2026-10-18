import { NextResponse } from 'next/server'
import { COOKIE } from '@/lib/kp/client-auth'
export async function POST() { const response = NextResponse.json({ ok: true }); response.cookies.set(COOKIE, '', { httpOnly: true, expires: new Date(0), path: '/' }); return response }
