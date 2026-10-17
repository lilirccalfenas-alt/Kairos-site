-- Rode no SQL Editor do Supabase
create table sessoes (
  id uuid primary key default gen_random_uuid(),
  empresa text not null,
  grupo text,
  tipo text not null default 'palestra',      -- palestra | consultoria | grupo
  renovar_seg int not null default 0,         -- 0 = QR fixo; >0 = QR muda a cada N segundos
  limite int,                                 -- máximo de respostas (opcional)
  aberta boolean not null default true,
  criado_em timestamptz not null default now(),
  expira_em timestamptz
);
create table respostas (
  id uuid primary key default gen_random_uuid(),
  sessao_id uuid not null references sessoes(id) on delete cascade,
  respostas jsonb not null,                   -- {"0-0":3,"0-1":5,...}
  comentario text,
  criado_em timestamptz not null default now()
);
create index on respostas (sessao_id);
-- RLS ligado e SEM políticas: ninguém acessa pelo navegador; só o servidor (service role).
alter table sessoes enable row level security;
alter table respostas enable row level security;
