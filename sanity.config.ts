import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

import { sanityConfig } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "pletenie-soul-studio",
  title: "Pletenie.Soul Studio",
  basePath: "/studio",
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  schema: { types: schemaTypes },
  plugins: [deskTool(), visionTool()],
});
