// ファイルシステム操作（Promiseベース）とパス操作のモジュールをインポート
import { supabase } from "@/lib/supabase";
import { writeFile } from "fs/promises"; // Node.jsのファイル書き込み（非同期/Promise版）
import path from "path"; // クロスプラットフォームなパス操作

/**
 * 画像ファイルをサーバーに保存し、公開URLを返す
 * @param file - アップロードされたFileオブジェクト（ブラウザからの入力）
 * @returns 成功時: 公開URL（例: "/images/123456789-filename.jpg"）、失敗時: null
 */
export async function saveImage(file: File): Promise<string | null> {
  const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE_STORAGE === "true";
  if (useSupabase) {
    return await saveImageToSupabase(file);
  } else {
    return await saveImageToLocal(file);
  }
}

export async function saveImageToLocal(file: File): Promise<string | null> {
  // FileオブジェクトをArrayBufferに変換し、Bufferに変換（Node.jsで扱える形式）
  const buffer = Buffer.from(await file.arrayBuffer());

  // ファイル名を一意にするため、タイムスタンプを付与（例: "17123456789-cat.jpg"）
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`; // 空白はハイフンに置換

  // 画像保存ディレクトリの絶対パスを生成（プロジェクトルート/public/images）
  const uploadDir = path.join(process.cwd(), "public/images");

  try {
    // 保存先のフルパスを生成（例: "/project/public/images/17123456789-cat.jpg"）
    const filePath = path.join(uploadDir, fileName);

    // 実際にファイルを保存（非同期処理）
    await writeFile(filePath, buffer);

    // クライアントがアクセスできる公開URLパスを返す（例: "/images/17123456789-cat.jpg"）
    return `/images/${fileName}`;
  } catch (error) {
    // エラー処理（例: ディレクトリが存在しない、権限エラーなど）
    console.error("Error saving image:", error);
    return null; // 失敗時はnullを返す
  }
}
async function saveImageToSupabase(file: File): Promise<string | null> {
  const fileName = `${Date.now()}_${file.name}`;
  const { error } = await supabase.storage
    .from("udemy-next-blog-bkt")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (error) {
    console.error("Upload error:", error.message);
    return null;
  }
  const { data: publicUrlData } = supabase.storage
    .from("udemy-next-blog-bkt")
    .getPublicUrl(fileName);
  return publicUrlData.publicUrl;
}
