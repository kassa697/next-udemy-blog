import "./globals.css";
import Footer from "@/components/Footer"; // Footerコンポーネントをインポート

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="flex flex-col min-h-screen">
        {" "}
        {/* 追加 */}
        {children}
        <Footer /> {/* 追加 */}
      </body>
    </html>
  );
}
