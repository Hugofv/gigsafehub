-- CreateTable
CREATE TABLE "article_articles" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "relatedArticleId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "article_articles_articleId_relatedArticleId_key" ON "article_articles"("articleId", "relatedArticleId");

-- CreateIndex
CREATE INDEX "article_articles_articleId_idx" ON "article_articles"("articleId");

-- CreateIndex
CREATE INDEX "article_articles_relatedArticleId_idx" ON "article_articles"("relatedArticleId");

-- AddForeignKey
ALTER TABLE "article_articles" ADD CONSTRAINT "article_articles_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_articles" ADD CONSTRAINT "article_articles_relatedArticleId_fkey" FOREIGN KEY ("relatedArticleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

