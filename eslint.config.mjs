import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    "vue/html-self-closing": "off",
  },
}).override("nuxt/stylistic", {
  rules: {
    "@stylistic/indent": ["error", 2],
    "@stylistic/semi": ["error", "always"],
    "@stylistic/quotes": ["error", "double"],
  },
});
