# Configurando Playwright no Railway

O Playwright pode rodar no Railway, mas precisa de configurações específicas.

## Configuração Necessária

### 1. Variáveis de Ambiente no Railway

Adicione estas variáveis de ambiente no Railway:

```env
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=0
PLAYWRIGHT_BROWSERS_PATH=/app/.cache/ms-playwright
```

### 2. Script de Build

O `postinstall` já está configurado para instalar o Chromium:

```json
"postinstall": "prisma generate && playwright install chromium --with-deps || true"
```

O `|| true` garante que o build não falhe se houver problemas com o Playwright.

### 3. Configuração do Railway.json

O Railway precisa instalar dependências do sistema. Adicione ao `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npx playwright install chromium --with-deps"
  }
}
```

### 4. Alternativa: Usar Nixpacks com Dockerfile

Se o Nixpacks não instalar as dependências automaticamente, você pode criar um `Dockerfile`:

```dockerfile
FROM node:20-slim

# Instalar dependências do sistema para Playwright
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

# Instalar Playwright browsers
RUN npx playwright install chromium --with-deps

COPY . .

RUN npm run build

CMD ["npm", "start"]
```

### 5. Configuração de Memória

O Playwright precisa de memória suficiente. No Railway:
- Mínimo recomendado: 1GB RAM
- Para múltiplas instâncias: 2GB+ RAM

### 6. Fallback (Opcional)

Se o Playwright não funcionar no Railway, você pode usar uma variável de ambiente para desabilitar:

```env
USE_PLAYWRIGHT=false
```

E modificar o código para usar `fetch` como fallback.

## Verificação

Para verificar se está funcionando:

1. Deploy no Railway
2. Execute o scraper via API: `POST /api/jobs/simplyhired-scraper/run`
3. Verifique os logs no Railway

## Troubleshooting

### Erro: "Executable doesn't exist"

- Verifique se o Chromium foi instalado: `npx playwright install chromium`
- Verifique a variável `PLAYWRIGHT_BROWSERS_PATH`

### Erro: "Failed to launch browser"

- Adicione `--no-sandbox` (já está no código)
- Verifique se há memória suficiente
- Tente aumentar o timeout

### Erro: "Cannot find module 'playwright'"

- Execute `npm install` novamente
- Verifique se o Playwright está em `dependencies` (não `devDependencies`)
