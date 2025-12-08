type CatalogItem = {
  title: string;
  price: string;
  image: string;
  alt: string;
  delay: string;
};

const catalogItems: CatalogItem[] = [
  {
    title: 'Сумка "Олівія"',
    price: "2 500 ₴",
    image: "/bag_tote.png",
    alt: "Сумка «Олівія» з паперової лози",
    delay: "0.2s",
  },
  {
    title: "Набір кошиків S",
    price: "1 200 ₴",
    image: "/basket_white.png",
    alt: "Набір плетених кошиків розміру S",
    delay: "0.3s",
  },
  {
    title: 'Шопер "Літо"',
    price: "2 100 ₴",
    image: "/bag_tote.png",
    alt: "Плетений шопер «Літо»",
    delay: "0.4s",
  },
  {
    title: "Серветниця",
    price: "600 ₴",
    image: "/decor_boxes.png",
    alt: "Плетена серветниця",
    delay: "0.5s",
  },
  {
    title: "Ваза для сухоцвітів",
    price: "1 000 ₴",
    image: "/basket_provence.png",
    alt: "Плетена ваза для сухоцвітів",
    delay: "0.6s",
  },
  {
    title: "Кошик для білизни",
    price: "2 900 ₴",
    image: "/basket_white.png",
    alt: "Великий кошик для білизни",
    delay: "0.7s",
  },
];

const filters = ["Всі роботи", "Кошики", "Сумки", "Декор"];

export function CatalogSection() {
  return (
    <section
      id="catalog"
      className="bg-[#edeae5] px-4 py-16 text-stone-900 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div
          className="fade-in-up mb-16 text-center"
          style={{ animationDelay: "0.1s" }}
        >
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-stone-500">
            Ручна робота
          </p>
          <h2 className="mb-6 font-serif text-4xl md:text-5xl">
            Каталог виробів
          </h2>

          <div className="flex justify-center space-x-6 text-sm md:text-base">
            {filters.map((filter, index) => {
              const isActive = index === 0;
              return (
                <button
                  key={filter}
                  type="button"
                  className={`pb-1 font-light transition ${
                    isActive
                      ? "border-b border-stone-900 text-stone-900"
                      : "border-b border-transparent text-stone-500 hover:border-stone-400 hover:text-stone-800"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {catalogItems.map((item) => (
            <div
              key={item.title}
              className="fade-in-up group cursor-pointer"
              style={{ animationDelay: item.delay }}
            >
              <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-xl bg-[#e3e0db]">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="h-full w-full object-cover transition duration-700 ease-in-out group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-x-0 bottom-4 flex justify-center translate-y-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <button className="rounded-full bg-white/90 px-6 py-2 text-sm text-stone-900 shadow-lg backdrop-blur hover:bg-white">
                    Детальніше
                  </button>
                </div>
              </div>

              <div className="text-center">
                <h3 className="mb-1 font-serif text-xl text-stone-900 transition group-hover:text-stone-600">
                  {item.title}
                </h3>
                <p className="font-light text-stone-500">{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="mb-4 text-sm text-stone-500">Показано 6 з 12 товарів</p>
          <button className="rounded-full border border-stone-900 px-8 py-3 text-xs uppercase tracking-[0.2em] text-stone-900 transition duration-300 hover:-translate-y-0.5 hover:bg-stone-900 hover:text-white">
            Показати все
          </button>
        </div>
      </div>
    </section>
  );
}
