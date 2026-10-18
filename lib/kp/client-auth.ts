import crypto from 'crypto'
import { cookies } from 'next/headers'
import { db } from './db'

const COOKIE = 'kp_cliente'
const secret = () => process.env.APP_SECRET || 'kairos-client-secret'
const sign = (value: string) => crypto.createHmac('sha256', secret()).update(value).digest('base64url')
export const clientCookie = (id: string) => `${id}.${sign(id)}`
export const validClientCookie = (value?: string) => {
  if (!value) return null
  const [id, signature] = value.split('.')
  if (!id || !signature) return null
  const expected = sign(id)
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
  return id
}
export async function currentClient() {
  const id = validClientCookie((await cookies()).get(COOKIE)?.value)
  if (!id) return null
  const { data } = await db.from('kp_clientes').select('id,empresa,responsavel,email,ativo').eq('id', id).eq('ativo', true).maybeSingle()
  return data
}
export const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `scrypt:${salt}:${hash}`
}
export const verifyPassword = (password: string, stored: string) => {
  const [kind, salt, expected] = (stored || '').split(':')
  if (kind !== 'scrypt' || !salt || !expected) return false
  const actual = crypto.scryptSync(password, salt, 64).toString('hex')
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'))
}
export { COOKIE }
