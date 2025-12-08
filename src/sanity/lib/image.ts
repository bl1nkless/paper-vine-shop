import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";

import { client } from "./client";

const builder = imageUrlBuilder(client);

export const urlFor = (source: Image | undefined | null) => {
  if (!source) return "";
  return builder.image(source).auto("format").fit("max").url();
};
