# Catalog Type Migration Map

## Old Sources

| Old File | Old Export | New Location | New Name | Action |
|---|---|---|---|---|
| `src/types/product.ts` | `ProductCategory` | `src/domain/catalog/types.ts` | `ProductCategory` | migrate |
| `src/types/product.ts` | `ProductCard` | `src/features/catalog/types.ts` or component props | `ProductCardProps` / `ProductListItem` | review |
| `src/types/product.ts` | `ProductDetail` | `src/domain/catalog/types.ts` | `Product` | merge |
| `src/data/catalog.ts` | `ProductCategorySlug` | remove or `src/domain/catalog/types.ts` | `string` / `CategorySlug` | review |
| `src/data/catalog.ts` | `catalogCategories` | `scripts/seed` or `tests/fixtures` | `categorySeed` | seed only |
| `src/data/catalog.ts` | `catalogProducts` | `scripts/seed` or `tests/fixtures` | `productSeed` | seed only |
| `src/data/catalog.ts` | `catalogPalette` | `scripts/seed` or `tests/fixtures` | `paletteSeed` | seed only |
| `src/data/catalog.ts` | `catalogPalette` item type | `src/domain/catalog/types.ts` | `PaletteColor` | migrate type only |
| `src/data/catalog.ts` | `getCategoryBySlug` | `src/application/catalog/*` | use case helper | move |
| `src/data/catalog.ts` | `getProductBySlug` | `src/application/catalog/*` | use case helper | move |
| `src/data/catalog.ts` | `formatCatalogPrice` | `src/lib/format.ts` | `formatPrice` | move |

## Notes

- `src/domain/catalog/types.ts` is the target canonical model.
- `src/domain/catalog/schemas.ts` validates the canonical model at runtime.
- `src/domain/catalog/constants.ts` holds enum-like values, labels, limits, and defaults.
- Real catalog data should live in Sanity or in seed/fixture files, not in domain constants.
