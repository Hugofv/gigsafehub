# Workers / Cron Jobs

Sistema de workers e cron jobs que roda em paralelo com a API, sem bloquear a API principal.

## Estrutura

```
workers/
├── types.ts          # Tipos TypeScript para jobs
├── JobManager.ts     # Gerenciador de jobs
├── index.ts          # Inicialização dos workers
└── jobs/
    └── example.ts    # Exemplo de job
```

## Como Adicionar um Novo Job

### 1. Criar o arquivo do job

Crie um novo arquivo em `workers/jobs/`:

```typescript
// workers/jobs/my-job.ts
import pino from 'pino';

const logger = pino().child({ module: 'MyJob' });

export async function myJob(): Promise<void> {
  logger.info('Starting my job');
  
  try {
    // Seu código aqui
    logger.info('Job completed successfully');
  } catch (error) {
    logger.error({ error }, 'Job failed');
    throw error;
  }
}
```

### 2. Registrar o job

Adicione o job em `workers/index.ts`:

```typescript
import { myJob } from './jobs/my-job';

jobManager.registerJob(
  {
    name: 'my-job',
    schedule: '0 */6 * * *', // A cada 6 horas
    enabled: true,
    runOnStartup: false,
    timeout: 300000, // 5 minutos
    retryOnFailure: true,
    maxRetries: 3,
  },
  myJob
);
```

## Configuração de Jobs

### Parâmetros

- `name`: Nome único do job
- `schedule`: Expressão cron (ex: `'0 2 * * *'` = diariamente às 2h)
- `enabled`: Se o job está habilitado
- `runOnStartup`: Executar imediatamente ao iniciar (opcional)
- `timeout`: Timeout em milissegundos (opcional)
- `retryOnFailure`: Tentar novamente em caso de falha (opcional)
- `maxRetries`: Número máximo de tentativas (opcional, padrão: 3)

### Expressões Cron

- `'0 2 * * *'` - Diariamente às 2h
- `'0 */6 * * *'` - A cada 6 horas
- `'0 0 * * 0'` - Semanalmente no domingo à meia-noite
- `'*/30 * * * *'` - A cada 30 minutos
- `'0 0 1 * *'` - Mensalmente no dia 1

## Habilitar/Desabilitar Jobs

Você pode controlar jobs via variáveis de ambiente:

```env
ENABLE_CLEANUP_JOB=true
ENABLE_SYNC_JOB=false
```

## Monitoramento

Os jobs são logados automaticamente com:
- Início e fim de execução
- Duração
- Erros (se houver)
- Contadores de execução e erros

## Segurança

- Jobs rodam em paralelo, não bloqueiam a API
- Timeouts previnem jobs infinitos
- Retry automático com limite de tentativas
- Graceful shutdown aguarda jobs em execução

## Exemplo Completo

```typescript
// workers/jobs/sync-data.ts
import { prisma } from '../../lib/prisma';
import pino from 'pino';

const logger = pino().child({ module: 'SyncDataJob' });

export async function syncDataJob(): Promise<void> {
  logger.info('Starting data sync');
  
  try {
    // Sincronizar dados externos
    const data = await fetchExternalData();
    
    // Atualizar banco de dados
    await prisma.someModel.updateMany({
      data: { synced: true },
    });
    
    logger.info({ recordCount: data.length }, 'Data sync completed');
  } catch (error) {
    logger.error({ error }, 'Data sync failed');
    throw error;
  }
}
```
