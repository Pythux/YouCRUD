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
        <p>input data from copie/past of file:</p>
        <v-textarea v-model="musics" label="musics (JSON)" />
        <v-file-input v-model="yo" label="musicsTxt (Text File)" />
        <v-textarea v-model="extractFunction" label="extractFunction (for musics/musicsTxt)" />
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

export default {
    data() {
        return {
            musics: '',
            extractFunction: '',
            yo: undefined,
        }
    },
    watch: {
        yo() {
            console.log(this.yo)
            const file = this.yo
            const reader = new FileReader()
            reader.readAsText(file)
            console.log(reader)
        },
    },
    methods: {
        submit() {
            let musics = JSON.parse(this.musics)
            musics = eval(this.extractFunction) // eslint-disable-line no-eval
            if (!Array.isArray(musics)) {
                console.log('eval extractFunction should return a list of urls')
            } else {
                musics.forEach(urlStr => {
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
                this.$store.dispatch('userDB/saveUserDB')
            }
        },
    },
}
</script>
