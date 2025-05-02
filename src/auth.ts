import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "./lib/prisma";
import bcryptjs from "bcryptjs";

async function getUser(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}
export const { auth, signIn, signOut, handlers } = NextAuth({
  // authConfigの設定を使用
  // authConfigは、auth.config.tsからインポートされます
  ...authConfig,
  // プロバイダーの設定
  providers: [
    // 認証プロバイダーの設定
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          // ここでは、認証情報を検証するためにデータベースをクエリします
          // 例えば、ユーザーのメールアドレスとパスワードを確認します
          const { email, password } = parsedCredentials.data;
          // ユーザーが存在するか確認
          const user = await getUser(email);
          // ユーザーが存在しない場合はnullを返す
          if (!user) return null;
          // ユーザーが存在する場合は、パスワードを確認
          // bcryptjsを使用してパスワードを比較
          const passwordMatch = await bcryptjs.compare(password, user.password);
          // パスワードが一致する場合はユーザーを返す
          // 一致しない場合はnullを返す
          if (passwordMatch) return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id || token.sub || "") as string;
        session.user.name = token.name || "";
        session.user.email = token.email || "";
      }
      return session;
    },
  },
});
