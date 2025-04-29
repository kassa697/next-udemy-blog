"use server";

import { registerSchema } from "@/validations/user";
import { prisma } from "../prisma";
import bcryptjs from "bcryptjs";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

// ActionStateの型を定義
// ここでは、successがboolean型、errorsがRecord<string, string[]>型であることを示しています
// これは、エラーがフィールド名をキーに持ち、エラーメッセージの配列を値に持つオブジェクトであることを示しています
// 例えば、{ email: ["メールアドレスは必須です"] }のような形になります
type ActionState = {
  success: boolean;
  errors: Record<string, string[] | undefined>;
};

// バリデーションエラー処理
function handleValidationError(error: ZodError): ActionState {
  // zodのエラーをflattenして、フィールドエラーとフォームエラーを取得
  const { fieldErrors, formErrors } = error.flatten();
  // zodの仕様でパスワード一致確認のエラーは formErrorsで渡ってくる
  // formErrorsがある場合は、confirmPasswordフィールドにエラーを追加
  // ここではconfirmPasswordフィールドにエラーを関連付けています
  if (formErrors.length > 0) {
    // confirmPasswordフィールドにエラーを追加
    return {
      success: false,
      errors: { ...fieldErrors, confirmPassword: formErrors },
    };
  }
  return { success: false, errors: fieldErrors };
}

// カスタムエラー処理
function handleError(customErrors: Record<string, string[]>): ActionState {
  return { success: false, errors: customErrors };
}
export async function createUser(
  prevState: ActionState,
  formData: FormData
): // ここでの型はActionStateを使用
// Promise<ActionState>を返すことを示す
Promise<ActionState> {
  // ex input // { name: "test", email: "
  //   // { name: "test", email: "
  //
  const rawFormData = Object.fromEntries(
    ["name", "email", "password", "confirmPassword"].map((feild) => [
      feild,
      formData.get(feild) as string,
    ])
  ) as Record<string, string>;

  const validationResult = registerSchema.safeParse(rawFormData);
  if (!validationResult.success) {
    return handleValidationError(validationResult.error);
  }

  const exsistingUser = await prisma.user.findUnique({
    where: { email: rawFormData.email },
  });
  if (exsistingUser) {
    return handleError({
      email: ["このメールアドレスはすでに使用されています"],
    });
  }

  const hashedPassword = await bcryptjs.hash(rawFormData.password, 12);
  await prisma.user.create({
    data: {
      name: rawFormData.name,
      email: rawFormData.email,
      password: hashedPassword,
    },
  });

  await signIn("credentials", {
    ...Object.fromEntries(formData),
    redirect: false,
  });

  redirect("/dashboard");
}
