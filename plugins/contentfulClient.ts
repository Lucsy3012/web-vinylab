import { ContentfulClientApi, createClient } from "contentful";

declare module "#app" {
  interface NuxtApp {
    $contentfulClient: ContentfulClientApi<"WITH_ALL_LOCALES">;
  }
}

type ContentfulConfig = {
  space: string;
  environment: string;
  accessToken: string;
  host: string;
};

export default defineNuxtPlugin((nuxtApp) => {
  // Importing runtime config
  const runtimeConfig = useRuntimeConfig();

  // Creating client
  const client = createClient({
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
