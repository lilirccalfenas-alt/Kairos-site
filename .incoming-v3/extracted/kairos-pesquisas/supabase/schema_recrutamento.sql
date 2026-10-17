-- Rode no SQL Editor do Supabase (depois do schema.sql)
create table kp_vagas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  empresa text,
  pesos jsonb not null,                 -- {"com":3,"eq":2,...} peso de cada competência (0 = não avaliar)
  aberta boolean not null default true,
  criado_em timestamptz not null default now()
);
create table kp_candidatos (
  id uuid primary key default gen_random_uuid(),
  vaga_id uuid not null references kp_vagas(id) on delete cascade,
  nome text not null, email text, telefone text, cidade text,
  banco_talentos boolean not null default false,   -- consentimento separado para futuras vagas
  respostas jsonb not null,
  notas jsonb not null,                            -- % do teste por competência
  entrevista jsonb,                                -- notas 1 a 5 dadas pela consultora
  obs text, status text not null default 'novo',   -- novo | chamar | aguardar | descartado
  criado_em timestamptz not null default now(),
  unique (vaga_id, email)
);
create index on kp_candidatos (vaga_id);
alter table kp_vagas enable row level security;
alter table kp_candidatos enable row level security;  -- sem políticas: só o servidor acessa
