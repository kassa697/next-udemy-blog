// "use server";

// import { registerSchema } from "@/validations/user";
// import { ZodError } from "zod";

// type ActionState = {
//   success: boolean;
//   errors: Record<string, string[]>;
// };

// // バリデーションエラー処理
// function handleValidationError(error: ZodError): ActionState {
//   // zodのエラーをflattenして、フィールドエラーとフォームエラーを取得
//   const { fieldErrors, formErrors } = error.flatten();
//   // zodの仕様でパスワード一致確認のエラーは formErrorsで渡ってくる
//   // formErrorsがある場合は、confirmPasswordフィールドにエラーを追加
//   // ここではconfirmPasswordフィールドにエラーを関連付けています
//   if (formErrors.length > 0) {
//     return {
//       success: false,
//       errors: { ...fieldErrors, confirmPassword: formErrors },
//     };
//   }
//   return { success: false, errors: fieldErrors };
// }

// // カスタムエラー処理
// function handleError(customErrors: Record<string, string[]>): ActionState {
//   return { success: false, errors: customErrors };
// }
// export async function createUser(
//   prevState: ActionState,
//   formData: FormData
// ): Promise<ActionState> {
//   const rawFormData = Object.fromEntries(
//     ["name", "email", "password", "confirmPassword"].map((feild) => [
//       feild,
//       formData.get(feild) as string,
//     ])
//   ) as Record<string, string>;

//   const validationResult = registerSchema.safeParse(rawFormData);
//   if (!validationResult.success) {
//     return handleValidationError(validationResult.error);
//   }
// }
