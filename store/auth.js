
import { axiosAuth } from '@/plugins/axios'
const http = axiosAuth

export default {
    state: () => ({
        idToken: undefined,
        refreshToken: undefined,
    }),
    getters: {
        userName: state => {
            if (state.idToken) {
                const user = JSON.parse(atob(state.idToken.split('.')[1])).email.split('@')[0]
                return user[0].toUpperCase() + user.slice(1)
            }
            return undefined
        },
    },
    mutations: {
        set_idToken_and_refreshToken(state, idTokenAndRefreshToken) {
            state.idToken = idTokenAndRefreshToken.idToken
            state.refreshToken = idTokenAndRefreshToken.refreshToken
        },
    },
    actions: {
        login({ commit, dispatch, state }, idTokenAndRefreshToken) {
            localStorage.setItem('auth/refreshToken', idTokenAndRefreshToken.refreshToken)
            commit('set_idToken_and_refreshToken', idTokenAndRefreshToken)
            dispatch('refresh', idTokenAndRefreshToken.expiresIn)
        },
        logout({ commit }) {
            localStorage.removeItem('auth/refreshToken')
            commit('set_idToken_and_refreshToken', { idToken: null, refreshToken: null })
        },
        check_stored_login({ dispatch }) {
            const refreshToken = localStorage.getItem('auth/refreshToken')
            if (refreshToken) {
                console.log('try refreshToken from localStorage')
                return http.post(`${process.env.secureToken_URL}?key=${process.env.API_KEY}`, {
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                }).then(response => {
                    const refreshToken = response.data.refresh_token
                    const idToken = response.data.id_token
                    const expiresIn = response.data.expires_in
                    dispatch('login', { refreshToken, idToken, expiresIn })
                })
            } else {
                console.log('no localStorage.getItem(\'refreshToken\')')
            }
        },
        refresh({ commit, dispatch }, expiresIn) {
            setTimeout(() => dispatch('check_stored_login'), expiresIn * 1000 - 10000)
        },
    },
}
