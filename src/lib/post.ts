import { prisma } from "@/lib/prisma";

/**
 * 公開済みの投稿を新しい順に取得する
 * @returns 公開済みの投稿リスト（作成日時の降順）
 */
export async function getPosts() {
  return await prisma.post.findMany({
    // 公開済み（publishedがtrue）の投稿のみフィルタリング
    where: { published: true },
    // 関連するauthor情報（Userモデル）を含める
    include: {
      author: {
        // authorからはnameフィールドのみ取得
        select: {
          name: true,
        },
      },
    },
    // 作成日時（createdAt）の新しい順に並び替え
    orderBy: { createdAt: "desc" },
  });
}

/**
 * 指定したIDの投稿を取得する
 * @param id 取得したい投稿のID
 * @returns 指定したIDの投稿（存在しない場合はnull）
 */
export async function getPost(id: string) {
  return await prisma.post.findUnique({
    // 指定したIDで投稿を検索
    where: { id },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
}

/**
 * 検索ワードに基づいて投稿を検索する
 * @param search 検索文字列（複数ワード可、全角/半角スペース区切り）
 * @returns 検索条件に一致する投稿リスト（作成日時の降順）
 */
export async function searchPosts(search: string) {
  // URLエンコードされた検索文字列をデコード
  const decodedSearch = decodeURIComponent(search);

  // 文字列の正規化処理:
  // 1. 全角スペースと半角スペースを半角スペースに統一
  // 2. 連続するスペースを1つにまとめる
  // 3. 前後のスペースを削除
  const normalizedSearch = decodedSearch.replace(/[\s　]+/g, " ").trim();

  // 正規化された文字列をスペースで分割し、空文字を除外して検索ワード配列を作成
  // 例: "こんにちは　世界" → ["こんにちは", "世界"]
  // 例: "  hello   world " → ["hello", "world"]
  const searchWords = normalizedSearch.split(" ").filter(Boolean);

  // 各検索ワードに対するフィルタ条件を作成:
  // タイトルまたは本文に検索ワードを含む投稿を対象とする
  const filters = searchWords.map((word) => ({
    OR: [
      { title: { contains: word } }, // タイトルにワードを含む
      { content: { contains: word } }, // 本文にワードを含む
    ],
  }));

  return await prisma.post.findMany({
    // すべての検索ワード条件をANDで結合（全てのワードに一致する投稿を検索）
    where: {
      AND: filters,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    // 作成日時（createdAt）の新しい順に並び替え
    orderBy: { createdAt: "desc" },
  });
}
