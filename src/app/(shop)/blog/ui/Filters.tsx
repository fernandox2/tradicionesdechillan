"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export const Filters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [input, setInput] = useState(searchParams.get("query") || "");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (input) {
      params.set("query", input);
    } else {
      params.delete("query");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="absolute flex gap-1 justify-end items-end top-16 w-full max-w-6xl mx-auto"
    >
      <input
        type="text"
        placeholder="Buscar artículos..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="px-4 py-2 border rounded-md w-full max-w-md focus:outline-none focus:border-orange-650"
      />
      <button
        type="submit"
        className="ml-2 px-4 py-2 bg-orange-650 text-white rounded-md hover:bg-yellow-650 transition"
      >
        Buscar
      </button>
    </form>
  );
};
