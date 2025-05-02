"use server";

import { auth } from "@/auth";
import { saveImage } from "@/utils/image";
import { postSchema } from "@/validations/post";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

type ActionState = {
  success: boolean;
  errors: Record<string, string[] | undefined>;
};

export async function createPost(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // フォームのデータを取得
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const topImageInput = formData.get("topImage");
  const topImage = topImageInput instanceof File ? topImageInput : null;

  // バリデーション
  const validationResult = postSchema.safeParse({ title, content, topImage });
  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  // 画像保存
  const imageUrl = topImage ? await saveImage(topImage) : null;
  // 画像保存に失敗した場合
  // 画像があるのにURLがない場合はエラー
  if (topImage && !imageUrl) {
    return { success: false, errors: { image: ["画像の保存に失敗しました"] } };
  }
  // DBに保存
  const session = await auth();
  const userId = session?.user?.id;
  // セッションが存在しない場合はエラーをスロー
  if (!session?.user?.email || !userId) {
    throw new Error("無効なセッションです");
  }

  await prisma.post.create({
    data: {
      title,
      content,
      topImage: imageUrl,
      published: true,
      authorId: userId,
    },
  });
  redirect("/dashboard");
}
