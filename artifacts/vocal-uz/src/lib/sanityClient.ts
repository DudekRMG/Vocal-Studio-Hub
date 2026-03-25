import { createClient } from "@sanity/client";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";

export const sanityClient = createClient({
  projectId: projectId || "n6dunjsx",
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
});

export const isConfigured = Boolean(projectId);
