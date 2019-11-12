import Vue from 'vue'
import Axios from 'axios'

export const axiosAuth = Axios.create(
    {
        baseURL: process.env.baseUrl,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    }
)

export default ({ store }) => {
    axiosAuth.interceptors.request.use(
        config => {
            if (config.url.startsWith('/') && store.state.auth.idToken) {
                config.url = `${config.baseURL}/users/${store.getters['auth/jwtIdToken'].user_id}${config.url}.json`
                config.url += `?auth=${store.state.auth.idToken}`
            }
            return config
        }, error => {
            Promise.reject(error)
        }
    )
}

Vue.prototype.$http = axiosAuth

// store user stuff that only he can see and change:
// https://you-crud.firebaseio.com/users/<user_id>.json?auth=<idToken>

// let firebase gen the id key: POST
// set the ID key: PUT
