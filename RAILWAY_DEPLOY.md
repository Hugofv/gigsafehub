# Deploy na Railway

Este guia explica como fazer deploy do GigSafeHub na Railway.

## 📋 Pré-requisitos

1. Conta na [Railway](https://railway.app)
2. Git repository conectado
3. PostgreSQL database na Railway (ou externo)

## 🚀 Deploy

### Opção 1: Deploy via GitHub (Recomendado)

1. **Conecte seu repositório**:
   - Acesse [Railway Dashboard](https://railway.app/dashboard)
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha o repositório `gigsafehub`

2. **Configure os serviços**:
   
   **Serviço 1: API**
   - Root Directory: `apps/api` (⚠️ **IMPORTANTE**: Configure no Settings do serviço)
   - Build Command: `cd ../.. && pnpm install --frozen-lockfile && cd apps/api && pnpm build`
   - Start Command: `node dist/index.js` (ou deixe vazio para usar o `railway.json`)
   - Port: Railway detecta automaticamente via `PORT` env var
   - **Nota**: O arquivo `apps/api/railway.json` já está configurado, mas você pode sobrescrever no dashboard
   - **Importante**: Após o primeiro deploy, execute migrações:
     ```bash
     railway run --service api pnpm prisma migrate deploy
     ```

   **Serviço 2: Web**
   - Root Directory: `apps/web` (⚠️ **IMPORTANTE**: Configure no Settings do serviço)
   - Build Command: `cd ../.. && pnpm install --frozen-lockfile && cd apps/web && pnpm build`
   - Start Command: `pnpm start` (ou deixe vazio para usar o `railway.json`)
   - Port: Railway detecta automaticamente via `PORT` env var
   - **Nota**: O arquivo `apps/web/railway.json` já está configurado, mas você pode sobrescrever no dashboard

3. **Adicione PostgreSQL Database**:
   - No projeto Railway, clique em "+ New"
   - Selecione "Database" → "Add PostgreSQL"
   - Railway criará automaticamente a variável `DATABASE_URL`

### Opção 2: Deploy via Railway CLI

```bash
# Instale Railway CLI
npm i -g @railway/cli

# Login
railway login

# Inicialize projeto
railway init

# Link ao projeto existente (ou crie novo)
railway link

# Deploy
railway up
```

## 🔧 Variáveis de Ambiente

### API Service

Configure as seguintes variáveis de ambiente no serviço API:

```env
# Server
PORT=4000
NODE_ENV=production

# Database (Railway gera automaticamente se usar PostgreSQL deles)
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
SHADOW_DATABASE_URL=postgresql://user:password@host:port/database_shadow?schema=public

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS (use a URL do serviço Web na Railway)
CORS_ORIGINS=https://your-web-app.railway.app

# Base URL (use a URL do serviço API na Railway)
BASE_URL=https://your-api.railway.app

# Logging
LOG_LEVEL=info

# Git Commit (opcional, para health check)
GIT_COMMIT=${RAILWAY_GIT_COMMIT_SHA}
```

### Web Service

Configure as seguintes variáveis de ambiente no serviço Web:

```env
# API URL (use a URL do serviço API na Railway)
NEXT_PUBLIC_API_URL=https://your-api.railway.app

# Base URL (use a URL do serviço Web na Railway)
NEXT_PUBLIC_BASE_URL=https://your-web-app.railway.app

# Node Environment
NODE_ENV=production
```

## 📝 Passos de Deploy

### 1. Preparar Database

Após criar o PostgreSQL na Railway:

1. **Copie a `DATABASE_URL`** do serviço PostgreSQL
2. **Configure no serviço API** como variável de ambiente
3. **Execute migrações** (pode fazer via Railway CLI ou adicionar script):

```bash
# Via Railway CLI
railway run --service api pnpm prisma migrate deploy

# Ou adicione ao build command:
pnpm install && pnpm prisma:generate && pnpm prisma migrate deploy && pnpm build
```

4. **Seed inicial** (opcional):

```bash
railway run --service api pnpm prisma:seed
```

### 2. Configurar Domínios

1. **API Service**:
   - Vá em Settings → Generate Domain
   - Copie a URL gerada (ex: `api-production.up.railway.app`)
   - Use esta URL em `BASE_URL` e `CORS_ORIGINS`

2. **Web Service**:
   - Vá em Settings → Generate Domain
   - Copie a URL gerada (ex: `web-production.up.railway.app`)
   - Use esta URL em `NEXT_PUBLIC_BASE_URL`
   - Use a URL da API em `NEXT_PUBLIC_API_URL`

### 3. Build e Deploy

Railway detecta automaticamente:
- **Node.js version** (do `package.json` engines)
- **pnpm** (do `packageManager` no `package.json`)
- **Build commands** (dos arquivos `railway.json`)

## 🔍 Verificação

Após o deploy:

1. **Verifique API Health**:
   ```
   https://your-api.railway.app/health
   ```

2. **Verifique Web**:
   ```
   https://your-web.railway.app
   ```

3. **Verifique Database**:
   - Acesse Railway Dashboard
   - Vá no serviço PostgreSQL
   - Use "Query" para verificar tabelas

## 🐛 Troubleshooting

### Build Fails

**Erro: "Cannot find module"**
- Verifique se `pnpm install` está rodando no root
- Certifique-se que shared packages estão sendo buildados

**Solução:**
```bash
# Adicione ao build command:
cd ../.. && pnpm install && cd apps/api && pnpm build
```

### Database Connection Fails

**Erro: "Can't reach database server"**
- Verifique se `DATABASE_URL` está configurada corretamente
- Certifique-se que o PostgreSQL está rodando
- Verifique se as migrações foram executadas

### CORS Errors

**Erro: "CORS policy blocked"**
- Verifique `CORS_ORIGINS` no serviço API
- Certifique-se que inclui a URL do serviço Web
- Formato: `https://web-app.railway.app,https://www.yourdomain.com`

### Port Issues

Railway fornece a porta via variável `PORT`. O código já está configurado para usar:
- API: `process.env.PORT || '4000'`
- Web: Next.js detecta automaticamente `PORT`

## 📊 Monitoramento

Railway fornece:
- **Logs** em tempo real
- **Métricas** de CPU, memória, rede
- **Health checks** automáticos

## 🔄 Atualizações

Para atualizar o deploy:

1. **Push para GitHub**:
   ```bash
   git push origin main
   ```

2. **Railway detecta automaticamente** e faz rebuild

3. **Ou force rebuild manualmente**:
   - Railway Dashboard → Deploy → Redeploy

## 💰 Custos

Railway oferece:
- **Free tier**: $5 créditos/mês
- **Hobby**: $20/mês
- **Pro**: $100/mês

Para produção, considere:
- PostgreSQL: ~$5-10/mês
- 2 serviços (API + Web): ~$10-20/mês

## 🔐 Segurança

1. **Nunca commite** `.env` files
2. **Use Railway Secrets** para variáveis sensíveis
3. **Configure HTTPS** (Railway fornece automaticamente)
4. **Use variáveis de ambiente** para todos os secrets

## 📚 Recursos

- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

