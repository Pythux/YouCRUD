
export async function submitMusic(name, url, ytId, tags) {
    let haveAnId
    let obj
    if (arguments.length === 1) {
        obj = arguments[0]
        name = obj.name
        url = obj.url
        ytId = obj.ytId
        tags = obj.tags
        haveAnId = obj.id
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

        if (!haveAnId) {
            this.$store.getters['userDB/music'].forEach(music => {
                if (check(music)) {
                    alreadyExist = music
                }
            })
        }

        if (alreadyExist) {
            console.log('alreadyExist')
            console.log(alreadyExist)
            this.notification({
                title: 'Music already exist:',
                type: 'warn',
                message: alreadyExist.name,
            })
        } else if (haveAnId) {
            await this.$http.put(`/music/${haveAnId}`, toCreate)
            await this.$store.commit('userDB/update_music', { [haveAnId]: toCreate })
            this.notification({
                title: 'Music updated',
                type: 'success',
            })
        } else {
            const key = (await this.$http.post('/music', toCreate)).data.name
            await this.$store.commit('userDB/add_musics', { [key]: toCreate })
            this.notification({
                title: 'Music added:',
                type: 'success',
                message: toCreate.name,
            })
        }
    } else {
        console.error("no url or ytId, can't create/update")
    }
}
