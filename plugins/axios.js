import Vue from 'vue'
import Axios from 'axios'

const axiosAuth = Axios.create(
    {
        baseURL: 'http://localhost:8000/api',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    }
)

Vue.prototype.$http = axiosAuth
