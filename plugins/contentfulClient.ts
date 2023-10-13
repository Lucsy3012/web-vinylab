import { ContentfulClientApi, createClient } from "contentful";
// import { createClient } from "contentful";
import contentful from "contentful";

declare module "#app" {
  interface NuxtApp {
    $contentfulClient: ContentfulClientApi<"WITH_ALL_LOCALES">;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  // Importing runtime config
  const runtimeConfig = useRuntimeConfig();

  // Creating client
  const createClientFunc =
    process.env.NODE_ENV === "development"
      ? createClient
      : contentful.createClient;

  const client = createClientFunc({
    accessToken: runtimeConfig.public.contentful.accessToken,
    space: runtimeConfig.public.contentful.spaceId,
    environment: runtimeConfig.public.contentful.environment,
    host: runtimeConfig.public.contentful.host,
  });

  nuxtApp.vueApp.provide("contentfulClient", client);

  return {
    provide: {
      contentfulClient: client,
    },
  };
});
