"use client";

import { useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createUser } from "@/lib/actions/createUser";

export default function RegisterForm() {
  const [state, formAction] = useActionState(createUser, {
    success: false,
    errors: {},
  });
  console.log(state);

  return (
    <Card className="w-full max-w-md mx-auto pt-10">
      <CardHeader>
        <CardTitle>ユーザー登録</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input id="name" type="text" name="name" required />
            {state.errors.name && (
              <p className="text-red-500">
                <p className="text-sm text-red-500">
                  {state.errors.name.join(",")}
                </p>
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" type="email" name="email" required />
            {state.errors.email && (
              <p className="text-red-500">
                <p className="text-sm text-red-500">
                  {state.errors.email.join(",")}
                </p>
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input id="password" type="password" name="password" required />
            {state.errors.password && (
              <p className="text-red-500">
                <p className="text-sm text-red-500">
                  {state.errors.password.join(",")}
                </p>
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">確認用パスワード</Label>
            <Input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              required
            />
            {state.errors.confirmPassword && (
              <p className="text-red-500">
                <p className="text-sm text-red-500">
                  {state.errors.confirmPassword.join(",")}
                </p>
              </p>
            )}
          </div>
          <Button type="submit" className="w-full">
            ログイン
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
