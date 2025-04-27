"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

export default function SearchBox() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    // 検索ボックスの値が変わったときに、debouncedSearchを更新
    const timer = setTimeout(() => {
      // 検索ボックスの値が空でない場合、URLを更新
      setDebouncedSearch(search);
    }, 500); // 500ms後にdebouncedSearchを更新
    return () => clearTimeout(timer); // クリーンアップ関数でタイマーをクリア
  }, [search]);
  // debouncedSearchが変わったときに、URLを更新
  useEffect(() => {
    if (debouncedSearch.trim()) {
      router.push(`/?search=${debouncedSearch.trim()}`); // 検索ボックスの値が空でない場合、URLを更新
    } else {
      router.push("/"); // 検索ボックスの値が空の場合、URLを元に戻す
    }
  }, [debouncedSearch, router]);
  return (
    <>
      <Input
        placeholder="search..."
        className="w-[200px] lg:w-[300px] bg-white"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </>
  );
}
