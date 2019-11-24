<template lang="html">
  <v-card>
    <form @submit.prevent="submit">
      <v-card-title>
        Save multiple link:
        <v-spacer />
        <nuxt-link to="/create-multiple-link">
          <v-btn>add multiple links ?</v-btn>
        </nuxt-link>
      </v-card-title>
      <v-card-text>
        <p>Input data from copie/past or file:</p>
        <v-textarea v-model="musicsTxtArea" label="musics (JSON)" />
        <v-file-input label="musicsTxt (Text File)" :loading="inputLoading" @change="fileInput" />
        <br>
        <br>
        <br>
        <p>Transform input from eval or click on a predefined function button:</p>
        <v-textarea v-model="extractFunction" label="extractFunction (for musics/musicsTxt)" />
        <v-btn @click="fromHtmlFavToArr">
          From HTML exported favories
        </v-btn>
      </v-card-text>
      <v-card-actions>
        <v-btn type="submit">
          <save-icon />
        </v-btn>
      </v-card-actions>
    </form>
  </v-card>
</template>

<script>
import { submitMusic } from '@/sharedJS/submitMusic'

import { fromHtmlFav } from '@/sharedJS/mapDOM'

export default {
    data() {
        return {
            arrOfMusics: '',
            musicsTxtArea: '',
            musicsFile: '',
            inputLoading: false,
            extractFunction: '',
        }
    },
    computed: {
        musicsToTransform() {
            let musics
            if (this.musicsTxtArea !== '') {
                musics = JSON.parse(this.musicsTxtArea)
            } else if (this.musicsFile !== '') {
                musics = this.musicsFile
            } else {
                console.log('textarea and fileInput empty')
                return
            }
            return musics
        },
    },
    methods: {
        fileInput(file) {
            if (!file) {
                return
            }
            this.inputLoading = true
            const reader = new FileReader()
            reader.onload = event => {
                this.inputLoading = false
                this.musicsFile = event.target.result
            }
            reader.readAsText(file)
        },
        fromHtmlFavToArr() {
            this.arrOfMusics = fromHtmlFav(this.musicsToTransform)
            console.log(`found ${this.arrOfMusics.length} that could be added`)
        },
        submit() {
            let musics = this.arrOfMusics
            if (this.extractFunction !== '') {
                musics = eval(this.extractFunction) // eslint-disable-line no-eval
            }

            if (!Array.isArray(musics)) {
                console.log('eval extractFunction should return a list of urls')
            } else {
                console.log(`add ${musics.length} urls ...`)
                console.log(musics)
                musics.forEach(urlStr => {
                    console.log(urlStr)
                    const obj = {}
                    const url = new URL(urlStr)
                    if (urlStr.startsWith('https://www.youtube.com/watch')) {
                        obj.ytId = url.searchParams.get('v')
                    } else if (urlStr.startsWith('https://youtu.be/')) {
                        obj.ytId = url.pathname.split('/')[1]
                    } else {
                        obj.url = urlStr
                    }
                    submitMusic.call(this, obj)
                })
                console.log('urls added')
                this.$store.dispatch('userDB/saveUserDB')
                console.log('local storage updated')
            }
        },
    },
}
</script>
