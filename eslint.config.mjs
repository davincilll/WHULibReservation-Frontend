import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";


import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
    {files: ["**/*.{js,mjs,cjs,ts,vue}"]},
    {languageOptions: {globals: globals.browser}},
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs["flat/essential"],
    {files: ["**/*.vue"], languageOptions: {parserOptions: {parser: tseslint.parser}}},
    // 添加规则禁用
    {
        rules: {
            "vue/multi-word-component-names": "off", // 禁用多词组件名称规则
        },
    },
)
