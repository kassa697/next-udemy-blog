import { PrismaClient } from "@prisma/client";

/**
 * Next.jsのHot Reload（開発時の高速リロード）でPrismaClientのインスタンスが
 * 複数生成されるのを防ぐためのグローバル変数。
 *
 * 型定義:
 * - globalThis（ブラウザ/Node.jsのグローバルオブジェクト）を拡張
 * - prismaプロパティはPrismaClient型またはundefined
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * グローバルに保存されたPrismaインスタンスがあれば再利用、
 * なければ新規作成。
 *
 * これにより、開発中は同じ接続を維持し、
 * 本番環境では常に新しいインスタンスが作成される。
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// 開発時のみグローバル変数にPrismaインスタンスを保存
// （本番環境ではメモリリークを避けるため保存しない）
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
