
export async function submitMusic(name, url, ytId, tags) {
    let updateId
    let obj
    if (arguments.length === 1) {
        obj = arguments[0]
        name = obj.name
        url = obj.url
        ytId = obj.ytId
        tags = obj.tags
        updateId = obj.id
    }

    if (url || ytId) {
        const toCreate = { name }
        toCreate.tags = tags || []
        toCreate.tags = toCreate.tags.filter(tag => ![null, undefined].includes(tag))

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
            const key = (await this.$http.post('/music', toCreate)).data.name
            await this.$store.commit('userDB/add_musics', { [key]: toCreate })
            if (updateId) {
                await this.$http.delete('/music/' + updateId)
                await this.$store.commit('userDB/delete_music', updateId)
                obj.id = key
            }
        }
    } else {
        console.error("no url or ytId, can't create/update")
    }
}
