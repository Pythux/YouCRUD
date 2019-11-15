
export function submitMusic(name, url, ytId, tags) {
    let updateId
    if (arguments.length === 1) {
        const obj = arguments[0]
        name = obj.name
        url = obj.url
        ytId = obj.ytId
        tags = obj.tags
        updateId = obj.id
    }

    if (url || ytId) {
        const toCreate = { name, tags }
        if (ytId) {
            toCreate.ytId = ytId
        } else {
            toCreate.url = url
        }

        let alreadyExist = null
        let check = music => music.ytId === toCreate.ytId
        if (toCreate.url) {
            check = music => music.url === toCreate.url
        }

        if (!updateId) {
            this.$store.getters['userDB/music'].forEach(music => {
                if (check(music)) {
                    alreadyExist = music
                }
            })
        }

        if (alreadyExist) {
            console.log('alreadyExist')
            console.log(alreadyExist)
        } else {
            this.$http.post('/music', toCreate)
                .then(response => {
                    const key = response.data.name
                    this.$store.commit('userDB/add_musics', { [key]: toCreate })
                    if (updateId) {
                        this.$http.delete('/music/' + updateId)
                    }
                })
        }
    } else {
        console.log("no url or ytId, can't create/update")
    }
}
