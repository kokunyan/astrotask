import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import sveltePlugin from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx,svelte}"],
    ignores: ["node_modules/**", "dist/**", "build/**", "coverage/**", ".astro/**"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
        extraFileExtensions: [".svelte"],
      },
      globals: {
        console: "readonly",
        window: "readonly",
        document: "readonly",
        process: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      svelte: sveltePlugin,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-explicit-any": "warn",
      "svelte/valid-compile": "warn",
      "svelte/no-at-html-tags": "warn",
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
      },
    },
  },
  prettier,
];
