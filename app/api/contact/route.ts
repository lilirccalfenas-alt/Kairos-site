import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const attempts = new Map<string, number[]>()
const limits = { nome: 120, empresa: 160, email: 254, telefone: 40, numeroColaboradores: 40, servicoInteresse: 160, mensagem: 3000, website: 200 }

function text(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function clientIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

export async function POST(request: Request) {
  const ip = clientIp(request)
  const now = Date.now()
  const recent = (attempts.get(ip) || []).filter((time) => now - time < 60 * 60 * 1000)
  if (recent.length >= 5) return Response.json({ error: 'Limite de envios atingido. Tente novamente mais tarde.' }, { status: 429 })
  recent.push(now)
  attempts.set(ip, recent)

  let body: Record<string, unknown>
  try { body = await request.json() } catch { return Response.json({ error: 'Dados inválidos.' }, { status: 400 }) }

  const nome = text(body.nome, limits.nome)
  const empresa = text(body.empresa, limits.empresa)
  const email = text(body.email, limits.email)
  const telefone = text(body.telefone, limits.telefone)
  const numeroColaboradores = text(body.numeroColaboradores, limits.numeroColaboradores)
  const servicoInteresse = text(body.servicoInteresse, limits.servicoInteresse)
  const mensagem = text(body.mensagem, limits.mensagem)
  const website = text(body.website, limits.website)

  if (website) return Response.json({ error: 'Não foi possível enviar a mensagem.' }, { status: 400 })
  if (!nome || !email || !validEmail(email) || body.consentimento !== true) return Response.json({ error: 'Preencha nome, e-mail e aceite o consentimento.' }, { status: 400 })
  if (!resend || !process.env.CONTACT_EMAIL_TO) return Response.json({ error: 'Não foi possível enviar sua mensagem agora.' }, { status: 500 })

  const receivedAt = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(new Date())
  const content = [`Nome: ${nome}`, `Empresa: ${empresa || 'Não informada'}`, `E-mail: ${email}`, `Telefone: ${telefone || 'Não informado'}`, `Colaboradores: ${numeroColaboradores || 'Não informado'}`, `Serviço de interesse: ${servicoInteresse || 'Não informado'}`, `Mensagem: ${mensagem || 'Não informada'}`, `Recebido em: ${receivedAt}`].join('\n')
  const { error } = await resend.emails.send({ from: 'Kairós Site <onboarding@resend.dev>', to: [process.env.CONTACT_EMAIL_TO], replyTo: email, subject: `Novo contato pelo site: ${nome}`, text: content }, { idempotencyKey: `contact/${email}/${Date.now()}` })
  if (error) return Response.json({ error: 'Não foi possível enviar sua mensagem agora.' }, { status: 500 })
  return Response.json({ ok: true })
}
