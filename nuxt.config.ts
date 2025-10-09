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

    eslint: {
      stylistic: {
        indent: 2,
        semi: true,
        quotes: "double",
      },
    },
  },
});
