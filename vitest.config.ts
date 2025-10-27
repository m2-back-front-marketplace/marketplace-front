import { defineVitestConfig } from "@nuxt/test-utils/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineVitestConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "nuxt",
    environmentOptions: {
      nuxt: {
        domEnvironment: "happy-dom",
      },
    },
  },
});
