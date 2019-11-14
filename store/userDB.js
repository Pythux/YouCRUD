
import { axiosAuth } from '@/plugins/axios'
const http = axiosAuth

export default {
    state: () => ({
        userDB: null,
    }),
    getters: {
        music(state) {
            if (state.userDB) {
                return Object.keys(state.userDB.music).map(key => {
                    const obj = { ...state.userDB.music[key] }
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
        add_music(state, music) {
            state.userDB.music = Object.assign({}, state.userDB.music, music)
        },
        delete_music(state, key) {
            console.log('delete_music: ', key)
            delete state.userDB.music[key]
        },
    },
    actions: {
        setSaveUserDB({ dispatch, commit, state }, userDB) {
            commit('set_userDB', userDB)
            dispatch('saveUserDB')
        },
        saveUserDB({ state }) {
            localStorage.setItem('userDB', JSON.stringify(state.userDB))
        },
        check_stored_userDB({ commit, dispatch }) {
            const localDB = localStorage.getItem('userDB')
            if (localDB) {
                commit('set_userDB', JSON.parse(localDB))
                dispatch('check_update_userDB')
            } else {
                http.get('/').then(response => dispatch('setSaveUserDB', response.data))
            }
        },
        check_update_userDB({ dispatch, commit, state }) {
            http.get('/music?shallow=true')
                .then(response => {
                    let update = false
                    Object.keys(response.data).forEach(key => {
                        if (!(key in state.userDB.music)) {
                            update = true
                            http.get(`/music/${key}`).then(response => commit('add_music', { [key]: response.data }))
                        }
                    })
                    Object.keys(state.userDB.music).forEach(key => {
                        if (!(key in response.data)) {
                            update = true
                            commit('delete_music', key)
                        }
                    })
                    if (update) {
                        dispatch('saveUserDB')
                    }
                })
        },
    },
}
