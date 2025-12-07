// https://nuxt.com/docs/api/configuration/nuxt-config
import VegaPreset from "./presets/VegaPreset";
import process from 'node:process';

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
    "@nuxtjs/i18n",
  ],

  css: [
    'primeicons/primeicons.css',
    '@/assets/css/main.css'
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
      ripple: true,
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
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      enableMockAuth: (process.env.NUXT_PUBLIC_MOCK_AUTH ?? '1') !== '0',
      mockLatencyMs: Number(process.env.NUXT_PUBLIC_MOCK_LATENCY_MS ?? 400),
      loginRedirect: process.env.NUXT_PUBLIC_LOGIN_REDIRECT ?? '/sandbox',
      autoLoginAfterRegister: (process.env.NUXT_PUBLIC_AUTO_LOGIN_AFTER_REGISTER ?? '1') !== '0',
    }
  }
});
