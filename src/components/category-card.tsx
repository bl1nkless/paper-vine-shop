import type { ProductCategory } from "@/types/product";

const accentPalette = [
  "from-[#d8c9b8] to-[#b8a089]",
  "from-[#d6c0a7] to-[#c56744]/60",
  "from-[#c5d0b1] to-[#778a54]/60",
  "from-[#e0d7cb] to-[#cda07c]/60",
];

type Props = {
  category: ProductCategory;
  index: number;
};

export function CategoryCard({ category, index }: Props) {
  const accent = accentPalette[index % accentPalette.length];

  return (
    <div className="card-surface group relative overflow-hidden rounded-xl p-6 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-stone-900/8">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-50`}
      />
      <div className="relative space-y-4">
        <div className="inline-flex rounded-full border border-white/60 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-stone-700 shadow-sm">
          {category.slug}
        </div>
        <h3 className="text-xl font-semibold text-stone-900">{category.title}</h3>
        <p className="text-sm text-stone-600">
          Подборка изделий в этой категории. Открыть в каталоге и выбрать
          комбинацию цвета, ручек и размеров.
        </p>
      </div>
    </div>
  );
}
