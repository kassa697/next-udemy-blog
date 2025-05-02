import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { auth } from "@/auth";
import { getOwnPost } from "@/lib/ownPost";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function ShowPage({ params }: Params) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!session?.user?.email || !userId) {
    throw new Error("無効なセッションです");
  }

  const { id } = await params;
  const post = await getOwnPost(userId, id);

  if (!post) {
    notFound();
  }

  // topImageが存在しないか、空文字列の場合をチェック
  const hasNoImage = !post.topImage || post.topImage.includes("undefined");

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <div className="relative w-full h-64 lg:h-96 bg-gray-100 flex items-center justify-center rounded-t-md overflow-hidden">
          {hasNoImage ? (
            <div className="text-gray-400 text-lg">サムネなし</div>
          ) : (
            <Image
              src={post.topImage as string}
              alt={post.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          )}
        </div>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">投稿者：{post.author.name}</p>
            <time className="text-sm text-gray-500">
              {format(new Date(post.createdAt), "yyyy年MM月dd日", {
                locale: ja,
              })}
            </time>
          </div>
          <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              skipHtml={false}
              unwrapDisallowed={true}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
