import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 最初の処理でデータベースをリセット
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  // bcrypt.hash(プレーンテキストのパスワード, ハッシュ化の強度)
  // ハッシュ化の強度は、計算コストを決定します。12は一般的な値です
  const hashedPassword = await bcrypt.hash("password123", 12);

  const dummyImages = [
    "https://picsum.photos/seed/post1/600/400",
    "https://picsum.photos/seed/post2/600/400",
  ];
  // ユーザーを作成し、2つの投稿を関連付ける
  const user = await prisma.user.create({
    data: {
      email: "test@test.com",
      name: "Test User",
      password: hashedPassword,
      posts: {
        create: [
          {
            title: "初めての投稿",
            content: "こんにちは、これは最初の投稿です。",
            topImage: dummyImages[0],
            published: true,
          },
          {
            title: "2回目の投稿",
            content: "こんにちは、これは2回目の投稿です。",
            topImage: dummyImages[1],
            published: true,
          },
        ],
      },
    },
  });
  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
