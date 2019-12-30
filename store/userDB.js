
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
                return liTags.reduce((flat, arr) => flat.concat(arr), []).sort().filter(onlyUnique)
            }
            return []
        },
        occurencesOfTags(state) {
            const occurences = {}
            if (state.userDB) {
                const liTags = []
                Object.values(state.userDB.music).forEach(music => { liTags.push(music.tags) })
                const onlyUnique = (value, index, self) => {
                    return self.indexOf(value) === index
                }
                const flatted = liTags.flat().sort()
                const uniqueTags = flatted.filter(onlyUnique)
                uniqueTags.forEach(tag => { occurences[tag] = flatted.lastIndexOf(tag) + 1 - flatted.indexOf(tag) })
            }
            return occurences
        },
    },
    mutations: {
        set_userDB(state, userDB) {
            Object.keys(userDB.music).forEach(key => {
                userDB.music[key].tags = userDB.music[key].tags || []
            })
            state.userDB = userDB
        },
        add_musics(state, musics) {
            console.log('add: ', musics)
            state.userDB.music = Object.assign({}, state.userDB.music, musics)
        },
        update_music(state, music) {
            console.log('updated: ', music)
            state.userDB.music = Object.assign({}, state.userDB.music, music)
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
        async getUserDB({ commit, dispatch }) {
            let userDB = (await http.get('/')).data
            if (userDB === null) {
                userDB = { music: {} }
                // await http.put('/', userDB)
            }
            await commit('set_userDB', userDB)
        },
    },
}
