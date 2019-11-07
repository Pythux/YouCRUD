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

Vue.prototype.$http = axiosAuth

// store user stuff that only he can see and change:
// https://you-crud.firebaseio.com/users/<user_id>.json?auth=<idToken>

// let firebase gen the id key: POST
// set the ID key: PUT
