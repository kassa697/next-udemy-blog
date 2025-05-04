// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed bottom-4 right-4">
      <Link
        href="/"
        className="
          bg-white/10 hover:bg-white/20
          text-gray-500 hover:text-gray-700
          text-xs
          px-2 py-1 rounded
          backdrop-blur-sm
          transition-all
          border border-gray-200
          shadow-sm
        "
        aria-label="トップへ戻る"
      >
        ↑ Top
      </Link>
    </footer>
  );
}
