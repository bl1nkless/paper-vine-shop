type CategoryOption = {
  id: string;
  title: string;
};

type ProductFormValues = {
  id?: string;
  title?: string;
  slug?: string;
  categoryId?: string;
  price?: string;
  shortDescription?: string;
  description?: string;
  dimensions?: string;
  materials?: string;
  care?: string;
  imageUrl?: string;
  availability?: "in_stock" | "made_to_order" | "out_of_stock";
  status?: "draft" | "published" | "archived";
  isFeatured?: boolean;
  isNew?: boolean;
};

type ProductFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  categories: CategoryOption[];
  submitLabel: string;
  initialValues?: ProductFormValues;
};

export function ProductForm({
  action,
  categories,
  submitLabel,
  initialValues,
}: ProductFormProps) {
  return (
    <form action={action} className="space-y-8">
      {initialValues?.id ? <input type="hidden" name="id" value={initialValues.id} /> : null}

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">
            Назва
          </span>
          <input
            name="title"
            defaultValue={initialValues?.title}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">
            Slug
          </span>
          <input
            name="slug"
            defaultValue={initialValues?.slug}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">
            Категорія
          </span>
          <select
            name="categoryId"
            defaultValue={initialValues?.categoryId}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
            required
          >
            <option value="">Оберіть категорію</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">
            Ціна, UAH
          </span>
          <input
            name="price"
            defaultValue={initialValues?.price}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
            placeholder="1500"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">
            Наявність
          </span>
          <select
            name="availability"
            defaultValue={initialValues?.availability || "made_to_order"}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
          >
            <option value="in_stock">В наявності</option>
            <option value="made_to_order">Під замовлення</option>
            <option value="out_of_stock">Немає в наявності</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">
            Статус
          </span>
          <select
            name="status"
            defaultValue={initialValues?.status || "draft"}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
          >
            <option value="draft">Чернетка</option>
            <option value="published">Опубліковано</option>
            <option value="archived">Архів</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">
          Короткий опис
        </span>
        <textarea
          name="shortDescription"
          defaultValue={initialValues?.shortDescription}
          rows={2}
          className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">
          Повний опис
        </span>
        <textarea
          name="description"
          defaultValue={initialValues?.description}
          rows={5}
          className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
        />
      </label>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">
            Розміри
          </span>
          <input
            name="dimensions"
            defaultValue={initialValues?.dimensions}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">
            Матеріали
          </span>
          <input
            name="materials"
            defaultValue={initialValues?.materials}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
            placeholder="paper vine, water-based stain"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">
            Догляд
          </span>
          <input
            name="care"
            defaultValue={initialValues?.care}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">
            URL головного зображення
          </span>
          <input
            name="imageUrl"
            defaultValue={initialValues?.imageUrl}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
            placeholder="/basket_provence.png"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-6 text-sm text-stone-700">
        <label className="inline-flex items-center gap-3">
          <input
            name="isFeatured"
            type="checkbox"
            defaultChecked={initialValues?.isFeatured}
            className="h-4 w-4 rounded border-stone-300"
          />
          Популярний
        </label>
        <label className="inline-flex items-center gap-3">
          <input
            name="isNew"
            type="checkbox"
            defaultChecked={initialValues?.isNew}
            className="h-4 w-4 rounded border-stone-300"
          />
          Новинка
        </label>
      </div>

      <button
        type="submit"
        className="rounded-full bg-stone-900 px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-stone-800"
      >
        {submitLabel}
      </button>
    </form>
  );
}
