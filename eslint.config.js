import globals from "globals";

import eslint from "@eslint/js";
import prettierPluginRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierPluginRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
);
