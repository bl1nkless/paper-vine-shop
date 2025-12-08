const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity configuration. Add NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET to your environment.",
  );
}

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-11-26";

const token = process.env.SANITY_API_READ_TOKEN;

export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production" && !token,
  token,
};
