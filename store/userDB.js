
import { axiosAuth } from '@/plugins/axios'
const http = axiosAuth

function sortSring(strA, strB) {
    if (strA < strB) {
        return -1
    } else if (strA > strB) {
        return 1
    }
    return 0
}

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
                    if (obj.name === undefined || obj.name === '') {
                        obj.name = obj.id
                    }
                    return obj
                }).sort((a, b) => {
                    return sortSring(a.name.toLowerCase(), b.name.toLowerCase())
                })
            } else {
                return []
            }
        },
        tags(state) {
            if (state.userDB) {
                const liTags = []
                Object.values(state.userDB.music).forEach(music => {
                    if ('tags' in music) {
                        liTags.push(music.tags)
                    }
                })
                const onlyUnique = (value, index, self) => {
                    return self.indexOf(value) === index
                }
                return liTags.reduce((flat, arr) => flat.concat(arr), []).filter(onlyUnique)
            }
            return []
        },
    },
    mutations: {
        set_userDB(state, userDB) {
            state.userDB = userDB
        },
        add_musics(state, musics) {
            console.log('add: ', musics)
            state.userDB.music = Object.assign({}, state.userDB.music, musics)
        },
        delete_music(state, key) {
            console.log('delete_music: ', key)
            delete state.userDB.music[key]
            state.userDB = { ...state.userDB }
        },
    },
    actions: {
        deleteMusic({ commit }, key) {
            http.delete(`/music/${key}`)
                .then(() => { commit('delete_music', key) })
        },
        setSaveUserDB({ dispatch, commit, state }, userDB) {
            commit('set_userDB', userDB)
            dispatch('saveUserDB')
        },
        saveUserDB({ state }) {
            localStorage.setItem('userDB', JSON.stringify(state.userDB))
        },
        async check_stored_userDB({ commit, dispatch }) {
            const localDB = localStorage.getItem('userDB')
            if (localDB) {
                await commit('set_userDB', JSON.parse(localDB))
                await dispatch('check_update_userDB')
            } else {
                http.get('/').then(response => dispatch('setSaveUserDB', response.data))
            }
        },
        async check_update_userDB({ dispatch, commit, state }) {
            let update = false
            const serverUserDB = (await http.get('/music?shallow=true')).data
            const musicToAdd = {}

            for (const key in serverUserDB) {
                if (!(key in state.userDB.music)) {
                    update = true
                    const music = (await http.get(`/music/${key}`)).data
                    musicToAdd[key] = music
                }
            }
            if (update) {
                await commit('add_musics', musicToAdd)
            }

            for (const key in state.userDB.music) {
                if (!(key in serverUserDB)) {
                    update = true
                    await commit('delete_music', key)
                }
            }
            if (update) {
                await dispatch('saveUserDB')
            }
        },
    },
}
