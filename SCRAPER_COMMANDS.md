# Comandos para Executar o Scraper SimplyHired Manualmente

## Opção 1: Via API REST (Recomendado)

### Usando cURL:
```bash
# Executar o scraper
curl -X POST http://localhost:4000/api/jobs/simplyhired-scraper/run

# Ver status do job
curl http://localhost:4000/api/jobs/simplyhired-scraper

# Ver todos os jobs
curl http://localhost:4000/api/jobs
```

### Usando HTTPie:
```bash
# Executar o scraper
http POST http://localhost:4000/api/jobs/simplyhired-scraper/run

# Ver status
http GET http://localhost:4000/api/jobs/simplyhired-scraper
```

### Usando fetch no Node.js:
```javascript
const response = await fetch('http://localhost:4000/api/jobs/simplyhired-scraper/run', {
  method: 'POST'
});
const result = await response.json();
console.log(result);
```

## Opção 2: Via Script TypeScript

Crie um arquivo `scripts/run-scraper.ts`:

```typescript
import { simplyHiredScraperJob } from '../src/workers/jobs/simplyHiredScraper';

simplyHiredScraperJob()
  .then(() => {
    console.log('Scraper executado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erro ao executar scraper:', error);
    process.exit(1);
  });
```

Execute com:
```bash
cd apps/api
pnpm tsx scripts/run-scraper.ts
```

## Opção 3: Via Prisma Studio (Para ver os resultados)

```bash
cd apps/api
pnpm prisma studio
```

Depois acesse `http://localhost:5555` e navegue até a tabela `job_opportunities`.

## Verificar Porta da API

A porta padrão é `4000`, mas pode ser configurada via variável de ambiente `PORT`.

Para verificar qual porta está sendo usada, veja os logs ao iniciar a API ou verifique o arquivo `.env`.
