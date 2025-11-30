# Database Content Structure

## Overview

O conteúdo das páginas de categoria é armazenado em **múltiplas tabelas** relacionadas através da tabela `categories`. Cada tipo de conteúdo tem sua própria tabela.

## Tabelas Principais

### 1. **`categories`** (Category)
**Tabela principal para estrutura de categorias**

Armazena:
- Informações da categoria (nome, slug, descrição)
- Hierarquia (parentId, level)
- Metadados SEO (metaTitle, metaDescription, metaKeywords)
- Configurações (country, order, isActive, icon)

**Campos principais:**
- `id` - UUID único
- `name`, `nameEn`, `namePt` - Nomes localizados
- `slug`, `slugEn`, `slugPt` - Slugs localizados
- `description`, `descriptionEn`, `descriptionPt` - Descrições localizadas
- `level` - Nível hierárquico (0 = root, 1 = primeiro nível, etc.)
- `parentId` - Referência à categoria pai
- `categoryId` - Usado para relacionar com produtos/artigos

**Relações:**
- `products` → `FinancialProduct[]` (um para muitos)
- `articles` → `Article[]` (um para muitos)
- `guides` → `GuidePage[]` (um para muitos)
- `comparisons` → `ComparisonPage[]` (um para muitos)

---

### 2. **`financial_products`** (FinancialProduct)
**Armazena produtos financeiros/seguros**

**Campos principais:**
- `id` - UUID único
- `name` - Nome do produto
- `slug`, `slugEn`, `slugPt` - Slugs localizados
- `categoryId` - **FK para `categories.id`** ⭐
- `country` - País onde o produto opera
- `rating`, `reviewsCount` - Avaliações
- `description` - Descrição do produto
- `fees`, `affiliateLink` - Informações comerciais
- `safetyScore` - Score de segurança
- `logoUrl`, `logoAlt` - Logo do produto
- Campos SEO (metaTitle, metaDescription, ogImage, etc.)

**Tabelas relacionadas:**
- `product_pros` - Prós do produto
- `product_cons` - Contras do produto
- `product_features` - Características do produto

**Uso:** Exibidos nas páginas de categoria quando a categoria é do tipo "produto" ou "seguro".

---

### 3. **`articles`** (Article)
**Armazena artigos do blog**

**Campos principais:**
- `id` - UUID único
- `slug`, `slugEn`, `slugPt` - Slugs localizados
- `title` - Título do artigo
- `excerpt` - Resumo
- `content` - Conteúdo completo (HTML/Markdown)
- `partnerTag` - Tag do parceiro
- `imageUrl`, `imageAlt` - Imagem do artigo
- `date` - Data de publicação
- `locale` - Locale do conteúdo (en_US, pt_BR, Both)
- `articleType` - Tipo ("blog" ou "guide")
- `categoryId` - **FK para `categories.id`** ⭐ (opcional)
- Campos SEO (metaTitle, metaDescription, ogImage, etc.)

**Tabelas relacionadas:**
- `article_products` - Relação muitos-para-muitos com produtos mencionados no artigo

**Uso:** Exibidos nas páginas de categoria quando a categoria é do tipo "blog" ou tem mais artigos que produtos.

---

### 4. **`guide_pages`** (GuidePage)
**Armazena páginas de guias**

**Campos principais:**
- `id` - UUID único
- `slug`, `slugEn`, `slugPt` - Slugs localizados
- `title` - Título do guia
- `excerpt` - Resumo
- `content` - Conteúdo completo (HTML/Markdown)
- `categoryId` - **FK para `categories.id`** ⭐ (obrigatório)
- `locale` - Locale do conteúdo
- `imageUrl`, `imageAlt` - Imagem do guia
- Campos SEO completos

**Uso:** Exibidos nas páginas de categoria quando a categoria é do tipo "guide".

---

### 5. **`comparison_pages`** (ComparisonPage)
**Armazena páginas de comparação**

**Campos principais:**
- `id` - UUID único
- `slug`, `slugEn`, `slugPt` - Slugs localizados
- `title` - Título da comparação
- `description` - Descrição
- `categoryId` - **FK para `categories.id`** ⭐ (obrigatório)
- `locale` - Locale do conteúdo
- `productIds` - Array de IDs de produtos para comparar
- Campos SEO completos

**Uso:** Exibidos nas páginas de categoria quando a categoria é do tipo "comparison".

---

## Como o Conteúdo é Buscado

### Fluxo de Busca de Conteúdo:

1. **Usuário acessa:** `/pt-BR/seguros/seguros-para-motoristas/uber`

2. **Sistema busca a categoria:**
   ```typescript
   const category = await getCategoryBySlugPath('seguros/seguros-para-motoristas/uber', 'pt-BR');
   ```

3. **Sistema determina o tipo de conteúdo:**
   ```typescript
   // Baseado no nome da categoria ou contagem de conteúdo
   const isBlog = categoryName.includes('blog') || counts.articles > counts.products;
   const isGuide = categoryName.includes('guide') || counts.guides > 0;
   const isComparison = categoryName.includes('compar') || counts.comparisons > 0;
   ```

4. **Sistema busca o conteúdo apropriado:**
   ```typescript
   // Se for blog → busca artigos
   if (isBlog) {
     articles = await getArticlesByCategory(category.id, locale);
   }
   
   // Se for guia → busca guias
   if (isGuide) {
     guides = await getGuidesByCategory(category.id, locale);
   }
   
   // Se for comparação → busca comparações
   if (isComparison) {
     comparisons = await getComparisonsByCategory(category.id, locale);
   }
   
   // Padrão → busca produtos
   else {
     products = await getProductsByCategory(category.id, locale);
   }
   ```

---

## Relacionamentos no Banco de Dados

```
categories (1) ──< (N) financial_products
categories (1) ──< (N) articles
categories (1) ──< (N) guide_pages
categories (1) ──< (N) comparison_pages
categories (1) ──< (N) categories (self-referencing)
```

---

## Exemplos de Queries

### Buscar produtos de uma categoria:
```sql
SELECT * FROM financial_products 
WHERE categoryId = 'category-uuid-here';
```

### Buscar artigos de uma categoria:
```sql
SELECT * FROM articles 
WHERE categoryId = 'category-uuid-here' 
AND locale = 'pt_BR';
```

### Buscar subcategorias:
```sql
SELECT * FROM categories 
WHERE parentId = 'category-uuid-here' 
AND isActive = true 
ORDER BY "order" ASC;
```

---

## Resumo

| Tipo de Conteúdo | Tabela | Campo de Relação |
|------------------|--------|------------------|
| **Categorias** | `categories` | `id` (self-referencing via `parentId`) |
| **Produtos** | `financial_products` | `categoryId` → `categories.id` |
| **Artigos** | `articles` | `categoryId` → `categories.id` |
| **Guias** | `guide_pages` | `categoryId` → `categories.id` |
| **Comparações** | `comparison_pages` | `categoryId` → `categories.id` |

**Todas as páginas de categoria são dinâmicas** e buscam conteúdo de uma ou mais dessas tabelas baseado no tipo de categoria e no conteúdo disponível.

