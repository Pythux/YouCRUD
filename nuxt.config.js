import fs from 'fs'
import colors from 'vuetify/es5/util/colors'

export default {
    mode: 'spa',
    env: { // environement variables
        baseUrl: process.env.baseUrl || 'https://my.firebaseio.com',
        API_KEY: 'AIzaSyDgqSTVHy0xyFmYDwA9eczZbu-Fw2u9KKc',
        identitytoolkit: 'https://identitytoolkit.googleapis.com/v1',
    },
    /*
    ** Headers of the page
    */
    head: {
        titleTemplate: '%s - ' + process.env.npm_package_name,
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/static/favicon.ico' },
        ],
    },
    /*
    ** Customize the progress-bar color
    */
    loading: { color: '#b81e1e' },
    /*
    ** Global CSS
    */
    css: [
    ],
    /*
    ** Plugins to load before mounting the App: all files in directorie "plugins"
    */
    plugins: fs.readdirSync('./plugins').map(plug => `~/plugins/${plug}`),
    /*
    ** Nuxt.js dev-modules
    */
    buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
        '@nuxtjs/eslint-module',
        '@nuxtjs/vuetify',
    ],
    /*
    ** Nuxt.js modules
    */
    modules: [
    ],
    /*
    ** vuetify module configuration
    ** https://github.com/nuxt-community/vuetify-module
    */
    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        theme: {
            dark: true,
            themes: {
                dark: {
                    primary: colors.blue.darken2,
                    accent: colors.grey.darken3,
                    secondary: colors.amber.darken3,
                    info: colors.teal.lighten1,
                    warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    success: colors.green.accent3,
                },
            },
        },
    },
    /*
    ** Build configuration
    */
    build: {
    /*
    ** You can extend webpack config here
    */
        extend(config, ctx) {
        },
    },
}
