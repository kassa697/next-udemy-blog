import { PostCardProps } from "@/types/post";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import Image from "next/image";

export default function PostCard({ post }: PostCardProps) {
  // topImageがundefinedを含むか、空/未定義の場合をチェック
  const hasNoImage = !post.topImage || post.topImage.includes("undefined");

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <Link href={`/posts/${post.id}`}>
        <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center rounded-t-md overflow-hidden">
          {hasNoImage ? (
            <div className="text-gray-400 text-sm">サムネなし</div>
          ) : (
            <Image
              src={post.topImage as string}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority
            />
          )}
        </div>
        <CardHeader className="line-clamp-2 py-3">
          <CardTitle>{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-shadow-gray-600 mb-2 line-clamp-2">
            {post.content}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{post.author.name}</span>
            <time>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: ja,
              })}
            </time>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
