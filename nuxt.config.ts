// https://nuxt.com/docs/api/configuration/nuxt-config
import VegaPreset from "./presets/VegaPreset";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["primeicons/primeicons.css"],

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/test-utils",
    "@nuxt/scripts",
    "@primevue/nuxt-module",
    "@nuxtjs/i18n",
  ],

  i18n: {
    strategy: "prefix_and_default",

    locales: [
      {
        code: "fr",
        file: "fr-FR.json",
        name: "Français",
      },
      {
        code: "en",
        file: "en-US.json",
        name: "English",
      },
    ],

    defaultLocale: "en",

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      fallbackLocale: "en",
    },

    langDir: "locales",
  },

  primevue: {
    autoImport: true,
    options: {
      theme: {
        preset: VegaPreset,
      },
    },
  },

  fonts: {
    families: [
      {
        name: "Inter",
        provider: "google",
        weights: [400, 500, 600, 700],
      },
    ],
  },

  app: {
    head: {
      title: "VEGARKETPLACE",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { charset: "utf-8" },
      ],
    },
  },
});
