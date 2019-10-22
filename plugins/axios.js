import Vue from 'vue'
import Axios from 'axios'

const axiosAuth = Axios.create(
    {
        baseURL: process.env.baseUrl,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    }
)

Vue.prototype.$http = axiosAuth
