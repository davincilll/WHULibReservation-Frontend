// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    build: {
        transpile: ['vuetify'],
    },
    runtimeConfig: {
        public: {
            baseURL:"http://myhk.fun:8999/api/v1"
        }
    },

    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                config.plugins?.push(vuetify({autoImport: true}))
            })
        },
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        '@nuxt/eslint'

    ],
    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },
    typescript: {
        typeCheck: true
      }
})

