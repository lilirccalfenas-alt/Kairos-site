import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { db } from '@/lib/kp/db'; import { isAdmin } from '@/lib/kp/auth'
async function guard(){return isAdmin((await cookies()).get('kp_admin')?.value)}
export async function GET(){if(!await guard())return NextResponse.json({error:'Não autorizado'},{status:401});const {data,error}=await db.from('kp_vagas').select('id,titulo,empresa,cidade,contratacao,descricao,requisitos,status,publica,criado_em,contato').order('criado_em',{ascending:false});return NextResponse.json({data,error})}
export async function PATCH(req:Request){if(!await guard())return NextResponse.json({error:'Não autorizado'},{status:401});const b=await req.json();const {error}=await db.from('kp_vagas').update({status:b.status,publica:b.status==='publicada'}).eq('id',b.id);return NextResponse.json({ok:!error,error})}
