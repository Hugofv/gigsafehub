# Estrutura de Hierarquia de Categorias (3 Níveis)

## Visão Geral

A estrutura atual já suporta hierarquia de múltiplos níveis através do modelo `Category` com os campos `level` e `parentId`. Aqui está como estruturar uma hierarquia de 3 níveis:

## Estrutura Proposta

```
Level 0 (Root)          Level 1 (Subcategoria)      Level 2 (Página/Artigo)
─────────────────────────────────────────────────────────────────────────────
Seguros                 Seguros para Motoristas     Seguro para Uber
                        Seguros para Entregadores   Seguro para iFood
                        Seguros para Freelancers     Seguro de Renda
                        
Guias                   Guias de Seguro             Como escolher um seguro
                        Guias Financeiros           Como economizar
                        
Blog                    Notícias                    Últimas notícias
                        Dicas                       Dicas de economia
```

## Modelo de Dados

### Category Model (já existe)

```prisma
model Category {
  id          String    @id @default(uuid())
  name        String
  slug        String    @unique
  level       Int       @default(0)  // 0 = root, 1 = subcategoria, 2 = página
  parentId    String?   // Referência à categoria pai
  parent      Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  
  // Relations
  products    FinancialProduct[]  // Produtos podem estar em qualquer nível
  articles    Article[]           // Artigos ficam em Level 1 (subcategorias)
}
```

### Article Model (já existe)

```prisma
model Article {
  id          String    @id @default(uuid())
  categoryId  String    // FK para Category (Level 1 - Subcategoria)
  category    Category  @relation(fields: [categoryId], references: [id])
  // ... outros campos
}
```

## Estrutura de URLs

### Padrão de URLs

```
/pt-BR/[root-slug]/[subcategory-slug]/[article-slug]
```

**Exemplos:**
- `/pt-BR/seguros/seguros-para-motoristas/seguro-para-uber`
- `/pt-BR/guias/guias-de-seguro/como-escolher-um-seguro`
- `/pt-BR/blog/noticias/ultimas-noticias`

### Navegação

- **Level 0 (Root)**: `/pt-BR/seguros` → Lista subcategorias (Level 1)
- **Level 1 (Subcategoria)**: `/pt-BR/seguros/seguros-para-motoristas` → Lista artigos (Level 2)
- **Level 2 (Artigo)**: `/pt-BR/seguros/seguros-para-motoristas/seguro-para-uber` → Exibe artigo

## Como Implementar

### 1. Estrutura de Dados no Seed

```typescript
// Level 0: Root Category
const segurosRoot = await prisma.category.upsert({
  where: { slug: 'seguros' },
  update: {},
  create: {
    name: 'Seguros',
    slug: 'seguros',
    slugPt: 'seguros',
    slugEn: 'insurance',
    level: 0,
    parentId: null,
    showInNavbar: true,
    showInFooter: true,
  },
});

// Level 1: Subcategoria
const segurosMotoristas = await prisma.category.upsert({
  where: { slug: 'seguros-para-motoristas' },
  update: {},
  create: {
    name: 'Seguros para Motoristas',
    slug: 'seguros-para-motoristas',
    slugPt: 'seguros-para-motoristas',
    slugEn: 'insurance-for-drivers',
    level: 1,
    parentId: segurosRoot.id, // Pai é a categoria root
    showInNavbar: true,
    showInFooter: true,
  },
});

// Level 2: Artigo (não é uma Category, é um Article)
const artigoUber = await prisma.article.upsert({
  where: { slug: 'seguro-para-uber' },
  update: {},
  create: {
    title: 'Seguro para Uber',
    slug: 'seguro-para-uber',
    slugPt: 'seguro-para-uber',
    slugEn: 'uber-insurance',
    categoryId: segurosMotoristas.id, // Artigo pertence à subcategoria (Level 1)
    // ... outros campos
  },
});
```

### 2. Lógica de Roteamento

A rota `[locale]/[...slug]/page.tsx` já suporta múltiplos níveis:

```typescript
// Exemplo: /pt-BR/seguros/seguros-para-motoristas/seguro-para-uber
// slug = ['seguros', 'seguros-para-motoristas', 'seguro-para-uber']

async function CategoryPage({ params }) {
  const { locale, slug } = await params;
  const slugPath = slug.join('/'); // 'seguros/seguros-para-motoristas/seguro-para-uber'
  
  // Tenta encontrar categoria pelo caminho completo
  const category = await getCategoryBySlugPath(slugPath, locale);
  
  if (!category && slug.length > 0) {
    // Se não encontrou categoria, tenta encontrar artigo pelo último segmento
    const lastSegment = slug[slug.length - 1]; // 'seguro-para-uber'
    const article = await getArticleBySlug(lastSegment, locale);
    
    if (article) {
      // Verifica se o caminho está correto
      // Se não, redireciona para o caminho correto
    }
  }
}
```

### 3. API Route para Buscar por Caminho Hierárquico

A rota `/api/categories/:slugPath(*)` já suporta caminhos hierárquicos:

```typescript
// GET /api/categories/seguros/seguros-para-motoristas?locale=pt-BR
// Retorna a categoria "Seguros para Motoristas" (Level 1)
```

## Regras de Negócio

### 1. Onde os Artigos Pertencem?

**Artigos sempre pertencem a categorias Level 1 (Subcategorias)**

- ✅ Artigo → Category (Level 1)
- ❌ Artigo → Category (Level 0) - Não permitido
- ❌ Artigo → Category (Level 2) - Não existe Level 2 como Category

### 2. Onde os Produtos Pertencem?

**Produtos podem pertencer a qualquer nível**, mas geralmente:
- Level 0 (Root): Produtos gerais
- Level 1 (Subcategoria): Produtos específicos

### 3. Navegação e Menus

- **Navbar**: Mostra apenas Level 0 (Root) e Level 1 (Subcategorias principais)
- **Footer**: Mostra Level 0 e Level 1 (configurado por `showInFooter`)
- **Breadcrumbs**: Mostra todos os níveis do caminho

## Exemplo Completo de Estrutura

```typescript
// SEED DATA EXAMPLE

// ===== LEVEL 0: ROOT =====
const segurosRoot = {
  name: 'Seguros',
  slug: 'seguros',
  level: 0,
  parentId: null,
};

const guiasRoot = {
  name: 'Guias',
  slug: 'guias',
  level: 0,
  parentId: null,
};

// ===== LEVEL 1: SUBCATEGORIAS =====
const segurosMotoristas = {
  name: 'Seguros para Motoristas',
  slug: 'seguros-para-motoristas',
  level: 1,
  parentId: segurosRoot.id, // Pai é "Seguros"
};

const guiasSeguro = {
  name: 'Guias de Seguro',
  slug: 'guias-de-seguro',
  level: 1,
  parentId: guiasRoot.id, // Pai é "Guias"
};

// ===== LEVEL 2: ARTIGOS (não são Categories) =====
const artigoUber = {
  title: 'Seguro para Uber',
  slug: 'seguro-para-uber',
  categoryId: segurosMotoristas.id, // Pertence à subcategoria
};

const artigoComoEscolher = {
  title: 'Como escolher um seguro',
  slug: 'como-escolher-um-seguro',
  categoryId: guiasSeguro.id, // Pertence à subcategoria
};
```

## URLs Resultantes

```
/pt-BR/seguros                                    → Lista subcategorias
/pt-BR/seguros/seguros-para-motoristas            → Lista artigos
/pt-BR/seguros/seguros-para-motoristas/seguro-para-uber → Exibe artigo

/pt-BR/guias                                      → Lista subcategorias
/pt-BR/guias/guias-de-seguro                      → Lista artigos
/pt-BR/guias/guias-de-seguro/como-escolher-um-seguro → Exibe artigo
```

## Resumo

1. **Level 0 (Root)**: Categorias principais (Seguros, Guias, Blog)
2. **Level 1 (Subcategoria)**: Subcategorias dentro de cada root (Seguros para Motoristas, Guias de Seguro)
3. **Level 2 (Página/Artigo)**: Artigos que pertencem às subcategorias (não são Categories, são Articles)

**Regra importante**: Artigos sempre pertencem a categorias Level 1, nunca Level 0.

