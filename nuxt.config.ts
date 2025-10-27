// https://nuxt.com/docs/api/configuration/nuxt-config
import VegaPreset from "./presets/VegaPreset";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/test-utils",
    "@nuxt/scripts",
    "@primevue/nuxt-module",
  ],

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

    eslint: {
      stylistic: {
        indent: 2,
        semi: true,
        quotes: "double",
      },
    },
    css: [ "@/assets/css/main.css"],

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
