"use client";

import { useState } from "react";

type VariantAvailability = "in_stock" | "made_to_order" | "out_of_stock";

export type ProductVariantFormValue = {
  id?: string;
  title: string;
  sku: string;
  size: string;
  color: string;
  priceOverride: string;
  availability: VariantAvailability;
  sortOrder: number;
};

type ProductVariantEditorProps = {
  initialVariants?: ProductVariantFormValue[];
};

function createEmptyVariant(sortOrder: number): ProductVariantFormValue {
  return {
    title: "",
    sku: "",
    size: "",
    color: "",
    priceOverride: "",
    availability: "made_to_order",
    sortOrder,
  };
}

export function ProductVariantEditor({
  initialVariants = [],
}: ProductVariantEditorProps) {
  const [variants, setVariants] = useState<ProductVariantFormValue[]>(
    initialVariants.length ? initialVariants : [createEmptyVariant(100)],
  );

  const serializedVariants = JSON.stringify(variants);

  return (
    <div className="space-y-4">
      <input type="hidden" name="variants" value={serializedVariants} />

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Варіанти товару
          </p>
          <p className="mt-1 text-sm text-stone-600">
            Розміри, кольори та цінові відмінності для одного товару.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setVariants((current) => [...current, createEmptyVariant((current.length + 1) * 100)])
          }
          className="rounded-full border border-stone-300 px-4 py-2 text-xs uppercase tracking-[0.16em] text-stone-700 transition hover:bg-stone-100"
        >
          Додати варіант
        </button>
      </div>

      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div
            key={variant.id || `variant-${index}`}
            className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-stone-900">
                Варіант {index + 1}
              </p>
              {variants.length > 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setVariants((current) => current.filter((_, currentIndex) => currentIndex !== index))
                  }
                  className="text-xs uppercase tracking-[0.16em] text-red-600 transition hover:text-red-700"
                >
                  Видалити
                </button>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-stone-500">
                  Назва варіанту
                </span>
                <input
                  value={variant.title}
                  onChange={(event) =>
                    setVariants((current) =>
                      current.map((item, currentIndex) =>
                        currentIndex === index
                          ? { ...item, title: event.target.value }
                          : item,
                      ),
                    )
                  }
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
                  placeholder="Наприклад, Large / Honey"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-stone-500">
                  SKU
                </span>
                <input
                  value={variant.sku}
                  onChange={(event) =>
                    setVariants((current) =>
                      current.map((item, currentIndex) =>
                        currentIndex === index
                          ? { ...item, sku: event.target.value }
                          : item,
                      ),
                    )
                  }
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
                  placeholder="PV-BSK-L-HNY"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-stone-500">
                  Розмір
                </span>
                <input
                  value={variant.size}
                  onChange={(event) =>
                    setVariants((current) =>
                      current.map((item, currentIndex) =>
                        currentIndex === index
                          ? { ...item, size: event.target.value }
                          : item,
                      ),
                    )
                  }
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
                  placeholder="Large"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-stone-500">
                  Колір
                </span>
                <input
                  value={variant.color}
                  onChange={(event) =>
                    setVariants((current) =>
                      current.map((item, currentIndex) =>
                        currentIndex === index
                          ? { ...item, color: event.target.value }
                          : item,
                      ),
                    )
                  }
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
                  placeholder="Honey"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-stone-500">
                  Ціна варіанту, UAH
                </span>
                <input
                  value={variant.priceOverride}
                  onChange={(event) =>
                    setVariants((current) =>
                      current.map((item, currentIndex) =>
                        currentIndex === index
                          ? { ...item, priceOverride: event.target.value }
                          : item,
                      ),
                    )
                  }
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
                  placeholder="1700"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-stone-500">
                  Наявність
                </span>
                <select
                  value={variant.availability}
                  onChange={(event) =>
                    setVariants((current) =>
                      current.map((item, currentIndex) =>
                        currentIndex === index
                          ? {
                              ...item,
                              availability: event.target.value as VariantAvailability,
                            }
                          : item,
                      ),
                    )
                  }
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
                >
                  <option value="in_stock">В наявності</option>
                  <option value="made_to_order">Під замовлення</option>
                  <option value="out_of_stock">Немає в наявності</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-stone-500">
                  Sort order
                </span>
                <input
                  type="number"
                  min="0"
                  value={variant.sortOrder}
                  onChange={(event) =>
                    setVariants((current) =>
                      current.map((item, currentIndex) =>
                        currentIndex === index
                          ? {
                              ...item,
                              sortOrder: Number.parseInt(event.target.value || "0", 10),
                            }
                          : item,
                      ),
                    )
                  }
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
