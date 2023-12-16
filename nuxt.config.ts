// https://nuxt.com/docs/api/configuration/nuxt-config

// Date variables
const currentDate = new Date();
const currentYear = currentDate.getFullYear();

// TODO: Change meta data
const meta = {
  author: "Lucas Dietrich",
  title: "Vinylab",
  description: "Your vinyl collection in the cloud.",
  image: "/og-image/og-image-home.jpg",
  url: "https://vinylab.lucasdietrich.com",
  twitter: "@lucsy3012",
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: undefined,
  target: "static",
  ssr: true,
  pages: true,

  // Devtools
  devtools: true,

  // Webpack
  options: {
    webpack: {
      output: {
        globalObject: "this",
      },
    },
  },

  // Runtime config
  runtimeConfig: {
    public: {
      baseURL: process.env.HOSTNAME,
      contentful: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        environment: process.env.CONTENTFUL_ENVIRONMENT,
        host: process.env.CONTENTFUL_HOST,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      },
      freeconvert: {
        key: process.env.FREECONVERT_KEY,
      },
    },
  },

  // Modules
  modules: ["@nuxtjs/i18n", "@nuxtjs/supabase", "@pinia/nuxt"],

  imports: {
    dirs: ["./stores"],
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: "/de/login",
      callback: "/de/confirm",
      exclude: [],
    },
  },

  pinia: {
    autoImports: ["defineStore"],
  },

  // Global page headers: https://nuxt.com/docs/api/configuration/nuxt-config#head
  app: {
    head: {
      titleTemplate: "%s • " + meta.title,
      meta: [
        { charset: "utf-8" },
        { name: "author", content: meta.author },
        { name: "robots", content: "index, follow" },
        { name: "application-name", content: meta.description },
        { name: "theme-color", content: "#EBE7DD" },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover",
        },
        { itemprop: "copyrightHolder", content: meta.author },
        { itemprop: "copyrightYear", content: currentYear },
        { itemprop: "isFamilyFriendly", content: "true" },

        // Meta
        { name: "description", content: meta.description },
        { itemprop: "image", content: meta.image },

        // Open Graph
        { property: "og:site_name", content: meta.title },
        { property: "og:type", content: "website" },
        { property: "og:description", content: meta.description },
        { property: "og:image", content: meta.image },

        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: meta.twitter },
        { name: "twitter:description", content: meta.description },
        { name: "twitter:image", content: meta.image },

        // Apple
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-title", content: meta.title },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "#000000" },
      ],
      link: [
        // https://favicon.io/favicon-converter/
        {
          rel: "shortcut icon",
          type: "image/x-icon",
          href: "/favicon/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/favicon/apple-touch-icon.png",
        },
        { rel: "icon", sizes: "32x32", href: "/favicon/favicon-32x32.ico" },
        { rel: "icon", sizes: "16x16", href: "/favicon/favicon-16x16.ico" },
      ],
    },
  },

  // Global CSS:
  css: [
    {
      src: "@/assets/less/global.less",
      lang: "less",
    },
  ],

  // Language Settings: https://v8.i18n.nuxtjs.org/
  i18n: {
    locales: [
      {
        code: "de",
        iso: "de-DE",
        languageCode: "de",
        languageName: "Deutsch",
        countryCode: "DE",
        countryName: "Deutschland",
        regionCode: "EU",
        currency: "EUR",
        file: "de.js",
      },
      {
        code: "en",
        iso: "en-US",
        languageCode: "en",
        languageName: "English",
        countryCode: "US",
        countryName: "United States",
        regionCode: "NA",
        currency: "USD",
        file: "en.js",
      },
    ],
    baseUrl: process.env.HOSTNAME,
    defaultLocale: "de",
    detectBrowserLanguage: false,
    langDir: "locales",
    strategy: "prefix",
    customRoutes: "page",
  },
});
