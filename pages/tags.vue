<template>
  <v-row>
    <v-row justify="space-around">
      <v-btn style="margin: 5px;text-transform: none" @click="deleteTags('selected')">
        Delete selected tags
      </v-btn>
      <v-btn style="margin: 5px;text-transform: none" @click="deleteTags('unselected')">
        Delete unselected tags
      </v-btn>
      <v-btn style="margin: 5px;text-transform: none" @click="nameAndTagAll()">
        name and tag all unamed musics
      </v-btn>
      <v-btn style="margin: 5px;text-transform: none" @click="fusionTags()">
        Fusion/Rename selected tags
      </v-btn>
      <v-btn style="margin: 5px;text-transform: none" @click="noUndefinedTags()">
        noUndefinedTags
      </v-btn>
    </v-row>
    <v-row v-if="fusion">
      <v-text-field v-model="fusionInput" :loading="fusionLoading" label="Tag name for the fusion" />
      <v-btn @click="fusionTagsSubmit()">
        Fusion
      </v-btn>
    </v-row>

    <v-row class="mt-5">
      <template v-for="tag in $store.getters['userDB/tags']">
        <v-chip
          :key="tag"
          :outlined="!activTags[tag]"
          style="margin: 5px"
          @click="switchActiveTag(tag)"
        >
          {{ tag }} ({{ $store.getters['userDB/occurencesOfTags'][tag] }})
        </v-chip>
      </template>
    </v-row>
  </v-row>
</template>

<script>
import { submitMusic } from '@/sharedJS/submitMusic'

export default {
    data() {
        return {
            activTags: {},
            fusion: false,
            fusionInput: '',
            fusionLoading: false,
        }
    },
    computed: {
        activeTags() {
            const activeTags = []
            for (const key in this.activTags) {
                if (this.activTags[key]) {
                    activeTags.push(key)
                }
            }
            return activeTags
        },
    },
    methods: {
        switchActiveTag(tag) {
            this.activTags = Object.assign({}, this.activTags, { [tag]: !this.activTags[tag] })
        },
        async noUndefinedTags() {
            const toCompute = []
            console.log('start')
            Object.values(this.$store.getters['userDB/music']).forEach(music => {
                if (music.tags === undefined) {
                    toCompute.push(music)
                }
            })
            console.log('to compute')
            await Promise.all(toCompute.map(async music => {
                music.tags = []
                await submitMusic.call(this, music)
            }))
            console.log('done')
            this.$store.dispatch('userDB/saveUserDB')
        },
        async deleteTags(selection) {
            const toCompute = []
            let tagsToDelete = []
            tagsToDelete = [...this.activeTags]
            if (selection === 'selected') {
            } else if (selection === 'unselected') {
                // to delete unselected tags:
                tagsToDelete = [...this.$store.getters['userDB/tags']].filter(tag => !tagsToDelete.includes(tag))
            } else {
                console.warning('not a valide option: ' + selection)
                return
            }
            console.log(tagsToDelete)
            Object.values(this.$store.getters['userDB/music']).forEach(music => {
                const copieMusic = { ...music }
                copieMusic.tags = [...music.tags]
                tagsToDelete.forEach(tag => {
                    if (copieMusic.tags.includes(tag)) {
                        copieMusic.tags.splice(copieMusic.tags.indexOf(tag), 1)
                    }
                })
                if (copieMusic.tags.length !== music.tags.length) {
                    console.log(music.tags.length - copieMusic.tags.length)
                    toCompute.push(async () => { await submitMusic.call(this, copieMusic) })
                }
            })
            console.log('to compute: ' + toCompute.length)
            await Promise.all(toCompute.map(f => f()))
            console.log('done')
            this.$store.dispatch('userDB/saveUserDB')
        },
        async nameAndTagAll() {
            const toCompute = []
            Object.values(this.$store.getters['userDB/music']).forEach(music => {
                if (music.ytId && (music.id === music.name || music.name === '')) {
                    const url = 'https://www.googleapis.com/youtube/v3/videos' +
                        `?part=snippet&id=${music.ytId}&key=${process.env.API_KEY}`

                    toCompute.push(async () => {
                        try {
                            const ytInfo = (await this.$http.get(url)).data.items[0].snippet
                            const title = ytInfo.title
                            const tags = ytInfo.tags
                            const copieMusic = { ...music }
                            copieMusic.name = title
                            copieMusic.tags = [...music.tags].concat(tags)
                            await submitMusic.call(this, copieMusic)
                        } catch (e) {
                            console.log(await this.$http.get(url))
                            console.log('the yt video does not exist anymore')
                            await this.$store.dispatch('userDB/deleteMusic', music.id)
                        }
                    })
                }
            })
            console.log('launch comput on ' + toCompute.length)
            await Promise.all(toCompute.map(f => f()))
            console.log('end of updates')
            this.$store.dispatch('userDB/saveUserDB')
        },
        fusionTags() {
            this.fusion = !this.fusion
            this.fusionLoading = false
            this.fusionInput = this.activeTags.length > 0 ? this.activeTags.reduce((acc, tag) => acc + ' ' + tag) : ''
        },
        async fusionTagsSubmit() {
            const tagToDeletes = this.activeTags.filter(tag => tag !== this.fusionInput)
            this.fusionLoading = true
            const toCompute = []
            Object.values(this.$store.getters['userDB/music']).forEach(music => {
                const newTags = music.tags.filter(tag => !this.activeTags.includes(tag))
                if (newTags.length !== music.tags.length) {
                    newTags.push(this.fusionInput)
                    toCompute.push({ music, newTags })
                }
            })
            await Promise.all(toCompute.map(async ({ music, newTags }) => {
                // await new Promise(resolve => setTimeout(resolve, 10))
                // console.log({ ...music, tags: newTags })
                await submitMusic.call(this, { ...music, tags: newTags })
            }))
            console.log('end of fusionTags')
            this.$store.dispatch('userDB/saveUserDB')
            this.fusionLoading = false
            this.fusion = false
            tagToDeletes.forEach(tag => delete this.activTags[tag])
        },
    },
}
</script>
