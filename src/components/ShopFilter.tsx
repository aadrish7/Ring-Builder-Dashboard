"use client";

import { useRouter } from "next/navigation";

export default function ShopFilter({
  shops,
  currentShop,
  currentQ,
}: {
  shops: string[];
  currentShop: string;
  currentQ: string;
}) {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams();
    if (currentQ) params.set("q", currentQ);
    if (e.target.value) params.set("shop", e.target.value);
    const qs = params.toString();
    router.push(qs ? `/leads?${qs}` : "/leads");
  }

  return (
    <select
      value={currentShop}
      onChange={handleChange}
      className="input shopSelect"
    >
      <option value="">All Shops</option>
      {shops.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
