
import { axiosAuth } from '@/plugins/axios'
const http = axiosAuth

export default {
    state: () => ({
        userDB: null,
    }),
    getters: {
        music(state) {
            if (state.userDB) {
                console.log(Object.keys(state.userDB.music))
                return Object.keys(state.userDB.music).map(key => {
                    const obj = state.userDB.music[key]
                    obj.id = key
                    if (obj.name === undefined) {
                        obj.name = obj.id
                    }
                    return obj
                })
            } else {
                return []
            }
        },
    },
    mutations: {
        set_userDB(state, userDB) {
            state.userDB = userDB
        },
    },
    actions: {
        setSaveUserDB({ commit, state }, userDB) {
            commit('set_userDB', userDB)
            localStorage.setItem('userDB', JSON.stringify(userDB))
        },
        check_stored_userDB({ commit, dispatch }) {
            const localDB = localStorage.getItem('userDB')
            if (localDB) {
                commit('set_userDB', JSON.parse(localDB))
            } else {
                http.get('/').then(response => dispatch('setSaveUserDB', response.data))
            }
        },
    },
}
