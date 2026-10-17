# Kairós | Pesquisas por QR code e Recrutamento (módulo "kp")

Tudo vive em um espaço separado, para não colidir com o site atual: páginas em /kp/..., APIs em /api/kp/..., código em lib/kp e components/kp, e tabelas do banco com prefixo kp_ (kp_sessoes, kp_respostas, kp_vagas, kp_candidatos). Nenhum arquivo do site existente é substituído.
Variáveis: o código aceita SUPABASE_URL (ou NEXT_PUBLIC_SUPABASE_URL) e SUPABASE_SERVICE_KEY (ou SUPABASE_SERVICE_ROLE_KEY). APP_SECRET e ADMIN_PASSWORD são novas.

Premissas: projeto Next.js (App Router, TypeScript, alias "@/") e Supabase. NÃO foi executado nem testado.

## Instalação
1. Copie `app/`, `components/` e `lib/` para a raiz do projeto do site (mescle as pastas).
2. `npm i @supabase/supabase-js qrcode.react jspdf`
3. Crie um projeto no Supabase e rode `supabase/schema.sql` no SQL Editor.
4. Na Vercel (Settings > Environment Variables), crie as 4 variáveis de `.env.example`.
5. Deploy. Acesse `/kp/painel`, entre com a senha, crie uma aplicação e abra "Exibir QR".

## Como funciona o QR
- QR fixo: um link por aplicação. QR renovável: o token muda a cada N segundos (vale também o anterior, por tolerância).
- Cada aparelho responde uma vez (cookie); aplicação fechada, limite atingido ou QR vencido bloqueiam a resposta.
- Nada identifica o respondente: sem nome, sem IP, sem login. Gravação só pelo servidor (RLS sem políticas).
- Limite: quem apaga o cookie ou usa outro celular consegue responder de novo.

## Falta construir (próxima etapa)
Banco de talentos, app de recrutamento e demais apps. (Resultados com regra de 5 respondentes e PDF já incluídos em /kp/painel/resultados/ID.)
Antes de usar com clientes: revisar perguntas e faixas de risco, e a Política de Privacidade com advogado.

## App 2: Recrutamento e entrevistas
1. No Supabase, rode também `supabase/schema_recrutamento.sql`.
2. Nada novo para instalar nem novas variáveis.
3. Em `/kp/painel/vagas` crie a vaga (pesos das competências) e envie aos candidatos o link `/kp/vaga/ID`.
4. Em "Ver candidatos" use a entrevista estruturada, salve, e baixe o relatório em PDF. "Banco de talentos" lista quem autorizou guardar os dados.
Relatório de competências, NÃO laudo psicológico. O teste de competências é referência Kairós (não é teste psicológico validado).

## Central de apps e como criar novos
- Página inicial: `/kp` (redireciona para `/kp/painel/apps`). O menu do painel é gerado de `lib/kp/apps.ts`.
- Novo app: páginas em `app/kp/painel/<app>`, APIs em `app/api/kp/<app>`, tabelas com prefixo `kp_`, e uma linha em `lib/kp/apps.ts`. Login, banco e cores são compartilhados.
- Para ligar ao site: adicione um link discreto (ex.: "Área da consultora") no rodapé apontando para `/kp`.
