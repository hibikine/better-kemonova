import globals from "globals";
/** @type {import('eslint/lib/shared/types').ConfigData} */
export default {
  extends: ["airbnb-typescript"],
  plugins: ["@typescript-eslint"],
  languageOptions: {
    globals: {
      ...globals.browser,
    },
  },
};
