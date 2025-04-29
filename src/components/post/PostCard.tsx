import { PostCardProps } from "@/app/types/post";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale"; // 日本語ロケールをインポート
import Image from "next/image";
export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <Link href={`/posts/${post.id}`}>
        {post.topImage && (
          <div className="relative w-full h-48">
            <Image
              src={post.topImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-t-md"
              priority
            />
          </div>
        )}
        {/* line-clamp-2 -> はみ出したテキストを…と表示 */}
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
                addSuffix: true, // 例: "3 days ago"
                locale: ja, // 日本語にローカライズ
              })}
            </time>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
