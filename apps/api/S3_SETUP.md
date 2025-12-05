# AWS S3 Configuration Guide

Este guia explica como configurar o AWS S3 para armazenar imagens do GigSafeHub.

## Variáveis de Ambiente

Adicione as seguintes variáveis no arquivo `.env` da API:

```env
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_BUCKET=your-bucket-name
```

## Configuração do Bucket S3

### 1. Criar o Bucket

1. Acesse o [AWS Console](https://console.aws.amazon.com/s3/)
2. Clique em "Create bucket"
3. Escolha um nome único para o bucket (ex: `gigsafehub-images`)
4. Selecione a região (deve corresponder a `AWS_REGION`)
5. Configure as opções de acordo com suas necessidades

### 2. Configurar Permissões Públicas

Para que as imagens sejam acessíveis publicamente, você precisa configurar o bucket:

#### Opção A: Bucket Policy (Recomendado)

1. Vá em "Permissions" > "Bucket policy"
2. Adicione a seguinte política (substitua `your-bucket-name`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

3. Em "Block public access", desmarque "Block all public access" OU configure para permitir acesso público aos objetos

#### Opção B: ACL (Alternativa)

Se preferir usar ACL, você pode descomentar a linha no arquivo `apps/api/src/services/s3/upload.ts`:

```typescript
ACL: 'public-read',
```

**Nota:** Alguns buckets podem ter ACLs desabilitados por padrão.

### 3. Configurar CORS (se necessário)

Se você precisar acessar as imagens de diferentes domínios:

1. Vá em "Permissions" > "Cross-origin resource sharing (CORS)"
2. Adicione a seguinte configuração:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### 4. Criar IAM User e Credenciais

1. Acesse o [IAM Console](https://console.aws.amazon.com/iam/)
2. Crie um novo usuário (ex: `gigsafehub-s3-uploader`)
3. Anexe a política `AmazonS3FullAccess` OU crie uma política customizada mais restritiva:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

4. Crie Access Keys para o usuário
5. Use essas credenciais nas variáveis de ambiente

## Estrutura de Pastas

As imagens são organizadas em pastas no S3:

- `articles/` - Imagens de artigos
- `products/` - Logos de produtos
- `categories/` - Ícones de categorias

## Uso no Formulário

No formulário de artigos, você pode:

1. **Digitar uma URL manualmente** - Para usar imagens já hospedadas
2. **Fazer upload de uma imagem** - A imagem será enviada para o S3 automaticamente

### Compressão Automática

Todas as imagens são automaticamente comprimidas antes do upload para o S3:

- **Qualidade**: 85% (alta qualidade, baixa perda visual)
- **Redimensionamento**: Máximo 1920x1920px (mantém proporção)
- **Formato de saída**: 
  - JPEG/JPG → WebP (melhor compressão)
  - PNG pequeno → PNG otimizado
  - PNG grande → WebP
  - GIF → WebP (primeiro frame)
  - WebP → WebP otimizado

**Benefícios:**
- Redução de tamanho de arquivo (geralmente 40-70% menor)
- Carregamento mais rápido
- Menor custo de armazenamento e transferência
- Qualidade visual mantida

### Limitações

- Tamanho máximo antes da compressão: 10MB
- Formatos aceitos: JPG, PNG, WebP, GIF
- As imagens são renomeadas automaticamente para evitar conflitos
- GIFs animados são convertidos para WebP (apenas primeiro frame)

## Troubleshooting

### Erro: "Access Denied"

- Verifique se as credenciais AWS estão corretas
- Verifique se o usuário IAM tem permissões para o bucket
- Verifique se o bucket policy permite acesso público (se necessário)

### Erro: "Invalid file type"

- Verifique se o arquivo é uma imagem válida
- Formatos aceitos: JPG, PNG, WebP, GIF

### Erro: "File size exceeds maximum"

- O tamanho máximo é 10MB
- Reduza o tamanho da imagem antes de fazer upload

### Imagens não aparecem

- Verifique se o bucket está configurado para acesso público
- Verifique se a URL gerada está correta
- Verifique se o CORS está configurado (se necessário)

## Custos

O AWS S3 oferece um tier gratuito generoso:
- 5 GB de armazenamento
- 20.000 requisições GET
- 2.000 requisições PUT

Após o tier gratuito, os custos são muito baixos (geralmente menos de $1/mês para sites pequenos/médios).

## Segurança

- **Nunca** commite as credenciais AWS no código
- Use variáveis de ambiente sempre
- Considere usar AWS Secrets Manager para produção
- Revise as permissões IAM regularmente
- Configure versionamento do bucket se necessário

